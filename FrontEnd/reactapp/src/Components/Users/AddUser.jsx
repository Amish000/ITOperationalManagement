import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { PATHS } from '../../constants/paths';
import axios from 'axios';
import { API_URL } from '../../config';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'User'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    } else if (formData.password.length > 100) {
      toast.error('Password must be less than 100 characters long');
      return;
    }

    if (formData?.phoneNumber.length !== 10) {
      toast.error("Phone number should be exactly 10 digits!")
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/Admin/Account/Register`, {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('User created successfully');
        navigate(PATHS.HOME);
      } else {
        toast.error(response.data.errors[0]);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.errors[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        marginTop: '-10%'
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          mx: 'auto',
          p: 4,
          boxShadow: 4,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
        }}
      >
        <Box
          sx={{
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <PersonAdd color="121C3E" sx={{ fontSize: 36 }} />
          <Typography
            variant="h4"
            color="121C3E"
            sx={{
              fontWeight: 'bold',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Add New User
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              mb: 2,
              '.MuiInputBase-root': {
                borderRadius: 3,
              },
              '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }}
          />

          <TextField
            fullWidth
            label="phone Number"
            name="phoneNumber"
            type="text"
            value={formData.phoneNumber}
            onChange={handleChange}
            margin="normal"
            sx={{
              mb: 2,
              '.MuiInputBase-root': {
                borderRadius: 3,
              },
              '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              mb: 2,
              '.MuiInputBase-root': {
                borderRadius: 3,
              },
              '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword('password')}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              mb: 3,
              '.MuiInputBase-root': {
                borderRadius: 3,
              },
              '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleTogglePassword('confirm')}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            size="large"
            sx={{
              py: 1.5,
              position: 'relative',
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#155fa0',
              },
              boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
            }}
          >
            {loading ? (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            ) : (
              'Create User'
            )}
          </Button>
        </form>
      </Card>
    </Box>
  );
};


export default AddUser;
