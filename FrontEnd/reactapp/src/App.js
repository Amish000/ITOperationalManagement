import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./Components/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Components/Navbar/Sidebar";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
    },
    background: {
      default: "#E3EDF9",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Poppins","Segoe UI", "Roboto", "Arial", "sans-serif"',
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
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

// Custom layout component to conditionally render Sidebar
const Layout = () => {
  const { isAuthenticated } = useAuth(); // Use the authentication context

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      {/* Conditionally render Sidebar if authenticated */}
      {isAuthenticated && (
        <Box
          sx={{
            flexGrow: 1,
            mt: "64px", // Adjust for Navbar height
            ml: "auto",
            mr: "0",
            maxWidth: "15vw",
            width: "15vw",
          }}
        >
          <Sidebar />
        </Box>
      )}
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 7,
          ml: "auto",
          mr: "0",
          maxWidth: isAuthenticated ? "85vw" : "100vw", // Adjust width if sidebar exists
          width: isAuthenticated ? "85vw" : "100vw",
        }}
      >
        <AppRoutes />
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout />
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
            style={{ fontSize: "14px" }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
