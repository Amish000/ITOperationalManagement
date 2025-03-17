import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './Components/Navbar/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Components/Navbar/Sidebar';
// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Adds consistent baseline styles */}
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                marginLeft: { sm: '240px', xs: 0 }, // Reserve space for Sidebar on larger screens
                width: '100%',
              }}
            >
              {/* Navbar */}
              <Navbar />

              {/* Main content area */}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: { xs: 2, sm: 3 },
                  mt: '64px', // Height of the Navbar
                  maxWidth: '1440px',
                  mx: 'auto',
                }}
              >
                {/* <AppRoutes /> */}
              </Box>

              {/* Toast notifications */}
              <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                style={{ fontSize: '14px' }}
              />
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
