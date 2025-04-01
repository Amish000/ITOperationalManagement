import React, { useEffect, useState } from 'react';
import { Box, InputAdornment, IconButton, Card, CardContent, CardHeader, Avatar, TextField, Typography, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { UserCircle, Mail, Phone, Pencil } from 'lucide-react';
import { toast } from 'react-toastify';
import { GetProfileDetail, UpdatePhoneNumber, UpdateUserName, ChangePassword } from '../../services/profiledetails';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Profile = () => {
    const [profileDetail, setProfileDetail] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isEditMode, setIsEditMode] = useState({
        userName: false,
        email: false,
        phoneNumber: false,
    });

    const [editableValues, setEditableValues] = useState({
        userName: '',
        email: '',
        phoneNumber: '',
    });

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleTogglePassword = (field) => {
        if (field === 'current') {
            setShowCurrentPassword(!showCurrentPassword);
        } else if (field === 'new') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fetchProfileDetails = async () => {
        try {
            const response = await GetProfileDetail();
            if (response.success) {
                setProfileDetail(response.data.userDetail);
                setEditableValues({
                    userName: response.data.userDetail.userName,
                    email: response.data.userDetail.email,
                    phoneNumber: response.data.userDetail.phoneNumber,
                });
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to fetch profile details');
        }
    };

    useEffect(() => {
        fetchProfileDetails();
    }, []);

    const handleEditClick = (field) => {
        setIsEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error('All fields are required');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New Password and Confirmation do not match');
            return;
        }

        try {
            const response = await ChangePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            })
            if (response.success) {
                toast.success('Password changed successfully');
                handleCloseChangePassword();
            }
            else {
                toast.error('Failed to change password');
            }
        } catch (error) {
            if (error.errors) {
                const response = error.errors;
                console.log(response)
                toast.error(response[0])
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
            console.error(error);
        }

    }

    const handleSaveUserName = async () => {
        try {
            const response = await UpdateUserName({ userName: editableValues.userName });
            if (response.success) {
                setProfileDetail((prev) => ({ ...prev, userName: editableValues.userName }));
                toast.success('User Name updated successfully');
            } else {
                toast.error('Failed to update User Name');
            }
        } catch (error) {
            toast.error(error);
        }
        setIsEditMode((prev) => ({ ...prev, userName: false }));
    };
    const handleSavePhoneNumber = async () => {
        if (editableValues.phoneNumber.length !== 10) {
            toast.error("Phone number should be exactly 10 digits!")

            // return this to check if the validation passed
            return;
        }
        try {
            const response = await UpdatePhoneNumber({ phoneNumber: editableValues.phoneNumber });
            if (response.success) {
                setProfileDetail((prev) => ({ ...prev, phoneNumber: editableValues.phoneNumber }));
                toast.success('Phone number updated successfully');
            } else {
                toast.error('Failed to update phone number');
            }
        } catch (error) {
            toast.error('Failed to update phone number');
        }
        setIsEditMode((prev) => ({ ...prev, phoneNumber: false }));
    };

    const cancelEdit = (field) => {
        setEditableValues((prev) => ({
            ...prev,
            [field]: profileDetail[field], // Revert to original value
        }));
        setIsEditMode((prev) => ({
            ...prev,
            [field]: false, // Exit edit mode
        }));
    };

    const handleClickOpenChangePassword = () => {
        setOpenChangePasswordDialog(true); // Open the dialog
    };

    const handleCloseChangePassword = () => {
        setOpenChangePasswordDialog(false); // Close the dialog
    };
    const ViewOnlyRow = ({ Icon, label, value, placeholder, fieldName, onSave }) => (
        <Grid container alignItems="center" spacing={2} sx={{ py: 2 }} justifyContent="space-between">
            <Grid item>
                <Avatar sx={{ backgroundColor: 'white', width: 36, height: 36 }}>
                    <Icon size={20} style={{ color: '#121C3E' }} />
                </Avatar>
            </Grid>
            <Grid item xs>
                <Typography variant="body2" color="textSecondary">
                    {label}
                </Typography>
                {isEditMode[fieldName] ? (
                    <TextField
                        fullWidth
                        name={fieldName}
                        value={editableValues[fieldName]}
                        onChange={handleChange}
                        variant="outlined"
                        autoFocus
                    />
                ) : (
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {value || placeholder}
                    </Typography>
                )}
            </Grid>
            {fieldName && !isEditMode[fieldName] && fieldName !== 'email' && (
                <Grid item>
                    <Button
                        variant="text"
                        color="#121C3E"
                        startIcon={<Pencil />}
                        onClick={() => handleEditClick(fieldName)}
                        sx={{ marginLeft: 'auto' }}
                    >
                    </Button>
                </Grid>
            )}
            {isEditMode[fieldName] && (
                <Grid item>
                    <Button
                        variant="contained"
                        color='primary'
                        onClick={onSave}
                        sx={{ marginLeft: 'auto' }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => cancelEdit(fieldName)}
                        sx={{ marginLeft: 2 }}
                    >
                        Cancel
                    </Button>
                </Grid>
            )}
        </Grid>
    );
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
            <Card>
                <CardHeader
                    sx={{
                        background: '#121C3E',
                        color: 'white',
                        textAlign: 'center',
                        padding: 3,
                    }}
                    avatar={
                        <Avatar sx={{ width: 96, height: 96, border: 3, borderColor: 'white' }}>
                            <UserCircle size={48} style={{ color: '#121C3E' }} />
                        </Avatar>
                    }
                    title={
                        <Typography variant="h4" component="div">
                            {profileDetail?.userName || 'Your Profile'}
                        </Typography>
                    }
                    subheader={
                        <Typography variant="h8" component="div">
                            Active Account
                        </Typography>
                    }
                />

                <CardContent sx={{ padding: 3 }}>
                    <Divider sx={{ marginBottom: 2 }} />
                    <ViewOnlyRow
                        Icon={UserCircle}
                        label="Username"
                        value={profileDetail.userName}
                        placeholder="Not Available"
                        fieldName="userName"
                        onSave={handleSaveUserName}
                    />
                    <Divider sx={{ marginBottom: 2 }} />
                    <ViewOnlyRow
                        Icon={Mail}
                        label="Email Address"
                        value={profileDetail.email}
                        placeholder="Not Available"
                        fieldName="email"
                    />
                    <Divider sx={{ marginBottom: 2 }} />
                    <ViewOnlyRow
                        Icon={Phone}
                        label="Phone Number"
                        value={profileDetail.phoneNumber}
                        placeholder="Add Phone Number"
                        fieldName="phoneNumber"
                        onSave={handleSavePhoneNumber}
                    />
                    <Divider sx={{ marginBottom: 2 }} />
                    <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
                        <Button
                            onClick={handleClickOpenChangePassword}
                            sx={{
                                '&:hover': {
                                    color: '#253D90',  // Red color on hover
                                },
                            }}
                        >
                            <Typography sx={{ display: 'flex', justifyContent: 'center', width: '100%', fontWeight: 'bold', fontSize: '1rem' }}>
                                Change Password
                            </Typography>
                        </Button>
                    </Box>

                </CardContent>
            </Card>
            <Dialog
                open={openChangePasswordDialog}
                onClose={handleCloseChangePassword}
                maxWidth="xs"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        transform: 'translatex(32%)'
                    },
                }}
            >
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <TextField
                        name="Current Password"
                        label="Current Password"
                        type={showCurrentPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete='off'
                        onChange={(e) => setFormData({ currentPassword: e.target.value })}
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
                                        onClick={() => handleTogglePassword('current')}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        name="New Password"
                        label="New Password"
                        type={showNewPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete='off'
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
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
                                        onClick={() => handleTogglePassword('new')}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        name="Confirm New Password"
                        label="Confirm New Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        autoComplete='off'
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseChangePassword} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Profile;
