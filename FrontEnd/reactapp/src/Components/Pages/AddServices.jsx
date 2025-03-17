import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  TextField,
  IconButton,
} from '@mui/material';
import { PATHS } from '../../constants/paths';
import { toast } from 'react-toastify';
import { addService } from '../../services/itServiceService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const AddServices = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: '',
    buyFrom: '',
    paidAmount: null, // Initialize as a number
    serviceType: "",
    expiresOn: null, // Initialize as null or a valid Day.js object
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'paidAmount' ? Number(value) : value, // Convert paidAmount to a number
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      expiresOn: newValue, // Set the expiryDate to the selected Day.js object
    }));
  };

  const validateForm = () => {
    if (!formData.serviceName.trim()) {
      setError("Service Name is required.");
      return false;
    }
    if (!formData.serviceDescription.trim()) {
      setError("Service Description is required.");
      return false;
    }
    if (!formData.buyFrom.trim()) {
      setError("Service Bought from is required.");
      return false;
    }
    if (!formData.serviceType.trim()) {
      setError("Service Type is required.");
      return false;
    }
    if (isNaN(formData.paidAmount) || formData.paidAmount <= 0) { // Check if paidAmount is a valid positive number
      setError("Paid Amount is required and must be a valid positive number.");
      return false;
    }
    if (!formData.expiresOn || !formData.expiresOn.isValid()) {
      setError("Expiry Date is required and must be a valid date.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User  is not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      const formattedExpiryDate = formData.expiresOn.format(); // Format the date for submission

      const response = await addService({
        ...formData,
        expiresOn: formattedExpiryDate, // Use the formatted date
      }, token);

      if (response.success) {
        toast.success('Service Submitted');
        navigate(PATHS.IT_SERVICE_LIST);
      } else {
        throw new Error(response.data.message || 'Failed to submit ticket');
      }
    } catch (err) {
      console.error('Error submitting Service:', err);
      setError(err.response?.data?.message || 'Failed to submit Service. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to submit Service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        mt: '-6%'
      }}>
      <Container
        component="main"
        maxWidth="md"

        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          minHeight: '85vh',
          paddingTop: '2rem'
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            mt: 6,
            borderRadius: 4,
            boxShadow: '0px 6px 25px rgba(0, 0, 0, 0.15)',

            width: '100%',
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            Add New Service
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="serviceName"
              label="Service Name"
              value={formData.serviceName}
              onChange={handleChange}
              disabled={loading}
              sx={{
                '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00838f',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="serviceDescription"
              label="Description"
              multiline
              rows={2}
              value={formData.serviceDescription}
              onChange={handleChange}
              disabled={loading}
              sx={{
                '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00838f',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="serviceType"
              label="Service Type"
              value={formData.serviceType}
              onChange={handleChange}
              disabled={loading}
              sx={{
                '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00838f',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="buyFrom"
              label="Buy From"
              value={formData.buyFrom}
              onChange={handleChange}
              disabled={loading}
              sx={{
                '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00838f',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="paidAmount"
              label="Paid Amount"
              type="number"
              value={formData.paidAmount}
              onChange={handleChange}
              disabled={loading}
              sx={{
                '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#00838f',
                },
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiry Date"
                value={formData.expiresOn}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={params.InputProps?.onClick}>
                          <CalendarTodayIcon />
                        </IconButton>
                      ),
                    }}
                    margin="normal"
                    required
                    fullWidth
                    disabled={loading}
                    sx={{
                      '.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#00838f',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                py: 1.5,
                position: 'relative',
                backgroundColor: 'primary',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderRadius: 4,
                '&:hover': {
                  backgroundColor: '#005662',
                },
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Submit'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddServices;