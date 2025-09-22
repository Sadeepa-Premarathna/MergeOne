import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('dairyLiciousUser');
      const isLoggedIn = !!userData;
      
      setIsAuthenticated(isLoggedIn);
      setLoading(false);

      // If route requires auth but user is not logged in
      if (requireAuth && !isLoggedIn) {
        navigate('/login', { 
          state: { from: location.pathname },
          replace: true 
        });
        return;
      }

      // If user is logged in and tries to access login page, redirect to home
      if (isLoggedIn && location.pathname === '/login') {
        navigate('/', { replace: true });
        return;
      }

      // If user is not logged in and visits root path, redirect to login
      if (!isLoggedIn && location.pathname === '/') {
        navigate('/login', { replace: true });
        return;
      }
    };

    checkAuth();
  }, [navigate, location.pathname, requireAuth]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="50vh"
        gap={2}
      >
        <CircularProgress size={40} />
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // If auth is required but user is not authenticated, don't render
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
