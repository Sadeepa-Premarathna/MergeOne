import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  Fade,
  Slide,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Email, VpnKey, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface LoginState {
  step: 'email' | 'otp' | 'success';
  email: string;
  otp: string;
  loading: boolean;
  error: string;
  success: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<LoginState>({
    step: 'email',
    email: '',
    otp: '',
    loading: false,
    error: '',
    success: '',
  });

  const updateState = (updates: Partial<LoginState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOTP = (otp: string): boolean => {
    return /^\d{6}$/.test(otp);
  };

  const sendOTP = async () => {
    if (!validateEmail(state.email)) {
      updateState({ error: 'Please enter a valid email address' });
      return;
    }

    updateState({ loading: true, error: '', success: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email }),
      });

      const data = await response.json();

      if (response.ok) {
        let successMessage = data.message;
        
        // If demo OTP is provided, show it prominently
        if (data.data?.demoOTP) {
          successMessage = `Demo Mode: Your OTP is ${data.data.demoOTP}`;
        }

        updateState({
          step: 'otp',
          loading: false,
          success: successMessage,
        });
      } else {
        updateState({ loading: false, error: data.message || 'Failed to send OTP' });
      }
    } catch (error) {
      updateState({ loading: false, error: 'Network error. Please try again.' });
    }
  };

  const verifyOTP = async () => {
    if (!validateOTP(state.otp)) {
      updateState({ error: 'Please enter a valid 6-digit OTP' });
      return;
    }

    updateState({ loading: true, error: '', success: '' });

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.email, otp: state.otp }),
      });

      const data = await response.json();

      if (response.ok) {
        updateState({ step: 'success', loading: false, success: 'Login successful!' });
        
        // Store user data
        localStorage.setItem('dairyLiciousUser', JSON.stringify({
          email: state.email,
          token: data.token,
          loginTime: new Date().toISOString(),
        }));

        // Redirect to home after success animation
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        updateState({ loading: false, error: data.message || 'Invalid OTP' });
      }
    } catch (error) {
      updateState({ loading: false, error: 'Network error. Please try again.' });
    }
  };

  const handleResendOTP = () => {
    updateState({ step: 'email', otp: '', error: '', success: '' });
  };

  const backgroundVariants = {
    animate: {
      background: [
        'linear-gradient(45deg, #E8F5E8 0%, #C8E6C9 50%, #A5D6A7 100%)',
        'linear-gradient(45deg, #C8E6C9 0%, #A5D6A7 50%, #81C784 100%)',
        'linear-gradient(45deg, #A5D6A7 0%, #81C784 50%, #66BB6A 100%)',
        'linear-gradient(45deg, #81C784 0%, #66BB6A 50%, #4CAF50 100%)',
        'linear-gradient(45deg, #E8F5E8 0%, #C8E6C9 50%, #A5D6A7 100%)',
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const FloatingElement = ({ delay, size, top, left, color }: any) => (
    <motion.div
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: 0.1,
      }}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );

  return (
    <motion.div
      variants={backgroundVariants}
      animate="animate"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Floating Background Elements */}
      <FloatingElement delay={0} size={80} top="10%" left="10%" color="#4CAF50" />
      <FloatingElement delay={1} size={60} top="70%" left="85%" color="#66BB6A" />
      <FloatingElement delay={2} size={100} top="20%" left="80%" color="#81C784" />
      <FloatingElement delay={1.5} size={40} top="80%" left="15%" color="#A5D6A7" />
      <FloatingElement delay={0.5} size={120} top="50%" left="5%" color="#C8E6C9" />

      <Container maxWidth="sm">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Paper
            elevation={20}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Header */}
            <motion.div variants={itemVariants}>
              <Box textAlign="center" mb={4}>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Dairy Licious
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {state.step === 'email' && 'Welcome Back!'}
                  {state.step === 'otp' && 'Verify Your Email'}
                  {state.step === 'success' && 'Login Successful!'}
                </Typography>
              </Box>
            </motion.div>

            {/* Alerts */}
            <AnimatePresence>
              {state.error && (
                <Fade in={!!state.error}>
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {state.error}
                  </Alert>
                </Fade>
              )}
              {state.success && (
                <Fade in={!!state.success}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {state.success}
                  </Alert>
                </Fade>
              )}
            </AnimatePresence>

            {/* Email Step */}
            <AnimatePresence mode="wait">
              {state.step === 'email' && (
                <Slide direction="left" in={state.step === 'email'}>
                  <Box>
                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={state.email}
                        onChange={(e) => updateState({ email: e.target.value, error: '' })}
                        onKeyPress={(e) => e.key === 'Enter' && sendOTP()}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                        disabled={state.loading}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={sendOTP}
                        disabled={state.loading || !state.email}
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                          },
                        }}
                      >
                        {state.loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Send OTP'
                        )}
                      </Button>
                    </motion.div>
                  </Box>
                </Slide>
              )}

              {/* OTP Step */}
              {state.step === 'otp' && (
                <Slide direction="left" in={state.step === 'otp'}>
                  <Box>
                    <motion.div variants={itemVariants}>
                      <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
                        Enter the 6-digit code sent to <strong>{state.email}</strong>
                      </Typography>
                      {state.success && state.success.includes('Demo Mode') && (
                        <Typography 
                          variant="body1" 
                          textAlign="center" 
                          mb={2}
                          sx={{ 
                            p: 2, 
                            backgroundColor: 'success.light', 
                            color: 'success.contrastText',
                            borderRadius: 2,
                            fontWeight: 'bold'
                          }}
                        >
                          {state.success}
                        </Typography>
                      )}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <TextField
                        fullWidth
                        label="6-Digit OTP"
                        value={state.otp}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                          updateState({ otp: value, error: '' });
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && verifyOTP()}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <VpnKey color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mb: 3 }}
                        disabled={state.loading}
                        inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.2rem' } }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={verifyOTP}
                        disabled={state.loading || state.otp.length !== 6}
                        sx={{
                          py: 1.5,
                          fontSize: '1.1rem',
                          borderRadius: 3,
                          mb: 2,
                          background: 'linear-gradient(45deg, #4CAF50, #66BB6A)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                          },
                        }}
                      >
                        {state.loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleResendOTP}
                        disabled={state.loading}
                        sx={{ borderRadius: 3 }}
                      >
                        Change Email
                      </Button>
                    </motion.div>
                  </Box>
                </Slide>
              )}

              {/* Success Step */}
              {state.step === 'success' && (
                <Slide direction="left" in={state.step === 'success'}>
                  <Box textAlign="center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.8 }}
                    >
                      <CheckCircle
                        sx={{
                          fontSize: 80,
                          color: 'success.main',
                          mb: 2,
                        }}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Typography variant="h5" gutterBottom color="success.main">
                        Welcome to Dairy Licious!
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={3}>
                        You'll be redirected to the homepage shortly...
                      </Typography>
                    </motion.div>
                  </Box>
                </Slide>
              )}
            </AnimatePresence>
          </Paper>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default Login;
