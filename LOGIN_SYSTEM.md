# 🔐 Dairy Licious Login System with OTP

## ✨ Features

Your Dairy Licious application now has a complete **OTP-based email authentication system** with:

- 📧 **Email-only login** (no passwords required)
- 🔢 **6-digit OTP verification** 
- ⏰ **10-minute OTP expiry**
- 🎨 **Beautiful animated login page**
- 📱 **Responsive design**
- 🔒 **Rate limiting** (max 3 attempts per 15 minutes)
- ✅ **Complete validation**

## 🚀 How It Works

1. **User enters email** on `/login` page
2. **System sends OTP** via email 
3. **User enters 6-digit code**
4. **Access granted** to the application

## 📧 Email Setup Instructions

To enable email functionality, you need to configure Gmail:

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable **2-Step Verification**

### Step 2: Create App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **App**: Mail
3. Select **Device**: Custom name (e.g., "Dairy Licious")
4. Copy the **16-character password**

### Step 3: Update Environment Variables
Edit `backend/.env`:
```env
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
```

## 🎨 UI Components

### Login Page (`/login`)
- **Floating background animations**
- **Gradient color schemes**
- **Step-by-step wizard**
- **Real-time validation**
- **Success animations**

### Navigation Bar
- **Conditional rendering** (Login button or Welcome message)
- **User menu** with logout
- **Authentication state management**

## 🔧 Technical Implementation

### Frontend (`frontend/src/pages/Login/Login.tsx`)
- React hooks for state management
- Material-UI components
- Framer Motion animations
- Form validation
- API integration

### Backend (`backend/src/routes/authRoutes.ts`)
- Express routes
- Nodemailer email service
- OTP generation and storage
- Rate limiting
- Input validation

### Routes Added
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/health` - Service health check

## 🔐 Security Features

1. **OTP Expiry**: Codes expire after 10 minutes
2. **Rate Limiting**: Max 3 attempts per email per 15 minutes
3. **Input Validation**: Email format and OTP format validation
4. **Secure Storage**: OTPs stored in memory (cleared after use)
5. **HTTPS Ready**: Production-ready configuration

## 📱 Usage Examples

### Test the Login Flow
1. Navigate to `http://localhost:3000/login`
2. Enter a valid email address
3. Check your email for the OTP
4. Enter the 6-digit code
5. You'll be redirected to the homepage

### API Testing (after email setup)
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify OTP
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

## 🎯 Next Steps

1. **Configure email credentials** in `.env`
2. **Test the login flow**
3. **Customize email templates** if needed
4. **Add user profile features**
5. **Implement role-based access**

## 🐛 Troubleshooting

### Email Not Sending
- Check Gmail app password
- Verify internet connection
- Check spam folder
- Enable "Less secure app access" if needed

### OTP Not Working
- Check 10-minute expiry
- Verify 6-digit format
- Check rate limiting (max 3 attempts)

### Login Page Not Loading
- Ensure frontend is running on port 3000
- Check browser console for errors
- Verify route is added to App.tsx

## 🎨 Customization

### Email Template
Edit the HTML template in `authRoutes.ts` to match your branding.

### Login Page Design
Modify `Login.tsx` to customize:
- Colors and animations
- Form layout
- Success messages
- Background effects

### Authentication Logic
Extend `authRoutes.ts` to add:
- User profiles
- Role management
- Password reset
- Social login

---

🎉 **Your Dairy Licious application now has a complete, secure, and beautiful authentication system!**
