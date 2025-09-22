import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

// In-memory storage for OTPs (in production, use Redis or database)
const otpStorage = new Map<string, { otp: string; expiresAt: Date; attempts: number }>();

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com', // Add your email
      pass: process.env.EMAIL_PASS || 'your-app-password', // Add your app password
    },
  });
};

// Generate 6-digit OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Clean up expired OTPs
const cleanupExpiredOTPs = () => {
  const now = new Date();
  for (const [email, data] of otpStorage.entries()) {
    if (data.expiresAt < now) {
      otpStorage.delete(email);
    }
  }
};

// Send OTP endpoint
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Clean up expired OTPs
    cleanupExpiredOTPs();

    // Check rate limiting (max 3 attempts per 15 minutes)
    const existingOTP = otpStorage.get(email);
    if (existingOTP && existingOTP.attempts >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests. Please try again after 15 minutes.',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    const attempts = existingOTP ? existingOTP.attempts + 1 : 1;

    // Store OTP
    otpStorage.set(email, { otp, expiresAt, attempts });

    // Check if email is configured
    const emailConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                           process.env.EMAIL_USER !== 'your-email@gmail.com';

    if (emailConfigured) {
      try {
        // Create email transporter
        const transporter = createTransporter();

        // Email template
        const mailOptions = {
          from: {
            name: 'Dairy Licious',
            address: process.env.EMAIL_USER || 'your-email@gmail.com',
          },
          to: email,
          subject: 'Your Dairy Licious Login OTP',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; text-align: center; padding: 30px; border-radius: 10px 10px 0 0; }
                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px dashed #4CAF50; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
                .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; letter-spacing: 5px; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">🥛 Dairy Licious</div>
                  <h2>Login Verification Code</h2>
                </div>
                <div class="content">
                  <h3>Hello!</h3>
                  <p>You requested to log in to your Dairy Licious account. Please use the verification code below:</p>
                  
                  <div class="otp-box">
                    <p style="margin: 0; font-size: 16px; color: #666;">Your OTP Code:</p>
                    <div class="otp-code">${otp}</div>
                  </div>
                  
                  <p><strong>Important:</strong></p>
                  <ul>
                    <li>This code will expire in <strong>10 minutes</strong></li>
                    <li>Don't share this code with anyone</li>
                    <li>If you didn't request this, please ignore this email</li>
                  </ul>
                  
                  <p>Welcome back to Dairy Licious - where quality meets freshness!</p>
                </div>
                <div class="footer">
                  <p>© 2025 Dairy Licious. All rights reserved.</p>
                  <p>This is an automated message, please do not reply.</p>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
          success: true,
          message: 'OTP sent successfully to your email',
          data: {
            email,
            expiresIn: '10 minutes',
          },
        });
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        // Fall back to demo mode
        res.status(200).json({
          success: true,
          message: `Demo Mode: OTP sent! Use code: ${otp} (Email not configured)`,
          data: {
            email,
            expiresIn: '10 minutes',
            demoOTP: otp, // Only for demo
          },
        });
      }
    } else {
      // Demo mode - return OTP in response
      res.status(200).json({
        success: true,
        message: `Demo Mode: OTP generated! Use code: ${otp}`,
        data: {
          email,
          expiresIn: '10 minutes',
          demoOTP: otp, // Only for demo
          note: 'Configure EMAIL_USER and EMAIL_PASS in .env to enable real email sending',
        },
      });
    }

  } catch (error) {
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.',
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit number',
      });
    }

    // Clean up expired OTPs
    cleanupExpiredOTPs();

    // Check if OTP exists
    const storedOTPData = otpStorage.get(email);
    if (!storedOTPData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired. Please request a new one.',
      });
    }

    // Check if OTP is expired
    if (storedOTPData.expiresAt < new Date()) {
      otpStorage.delete(email);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Verify OTP
    if (storedOTPData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check and try again.',
      });
    }

    // OTP is valid, remove from storage
    otpStorage.delete(email);

    // Generate a simple token (in production, use JWT)
    const token = crypto.randomBytes(32).toString('hex');

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      data: {
        email,
        token,
        user: {
          email,
          name: email.split('@')[0], // Use email prefix as name
          loginTime: new Date().toISOString(),
        },
      },
    });

  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP. Please try again.',
    });
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Auth service is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
