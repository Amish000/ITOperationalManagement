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
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import { PATHS } from '../../constants/paths';
import { toast } from 'react-toastify';
import { addTicketService } from '../../services/ticketServiceClient';

const AddTicket = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError("Title is required.");
            return false;
        }
        if (!formData.description.trim()) {
            setError("Description is required.");
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
                setError('User is not authenticated. Please log in.');
                setLoading(false);
                return;
            }

            const response = await addTicketService.addTicket(formData, token);

            if (response.success) {
                toast.success('Ticket Submitted');
                navigate(PATHS.TICKET);
            } else {
                throw new Error(response.data.message || 'Failed to submit ticket');
            }
        } catch (err) {
            console.error('Error submitting ticket:', err);
            setError(err.response?.data?.message || 'Failed to submit ticket. Please try again.');
            toast.error(err.response?.data?.message || 'Failed to submit ticket');
        } finally {
            setLoading(false);
            setFormData({
                title: '',
                description: '',
                priority: '',
            })
        }
    };

    return (
        <Container component="main" maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', marginTop: '-10%' }}>
            <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Ticket Posting
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="title"
                        label="Title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="description"
                        label="Description"
                        multiline
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            labelId="priority-label"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            disabled={loading}
                            label="Priority"
                        >
                            <MenuItem value="0">Low</MenuItem>
                            <MenuItem value="1">Medium</MenuItem>
                            <MenuItem value="2">High</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, position: 'relative' }}
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
    );
};

export default AddTicket;
