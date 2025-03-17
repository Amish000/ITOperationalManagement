import { useEffect, useState } from "react";

import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper,
    Tooltip,
    Card,
    Alert,
    TextField,
    IconButton,
    Chip,
    Grid,
    Divider,
} from '@mui/material';
import { UpdateUserData } from "../../services/manageUserService";
import { toast } from "react-toastify";

export default function UpdateUser({ user, editOpen, SetEditOpen }) {

    const [userData, setUserData] = useState({})
    const [formError, setFormError] = useState('');

    const validateFormData = () => {
        if (userData.phoneNumber.length !== 10) {
            setFormError("Phone number should be exactly 10 digits!");

            // return this to check if the validation passed
            return false;
        }
        // if no error then validation passes
        return true;
    }

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => {
            return {
                ...prevData,
                [name]: value
            }
        })
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!validateFormData()) {
            toast.error(formError);
            return;
        }
        try {
            var response = await UpdateUserData(userData);
            if (response.success) {
                toast.success("User Updated successfully");
                SetEditOpen(false);
            } else {
                toast.error("Failed to Update User!");
                SetEditOpen(false);
            }
            // bad error handling :-)
        } catch (error) {
            console.log(error);
            setFormError("Failed to Update User!");
        }
    }

    useEffect(() => (
        setUserData(user)
    ), [])

    return (
        <>
            <Dialog
                open={editOpen}
                onClose={() => SetEditOpen()}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            backgroundColor: "#E3EDF9",
                        }}
                    >
                        <Card
                            role="img"
                            sx={{ p: 5, width: "100%", borderRadius: 0, boxShadow: 0 }}
                        >
                            <Typography component="h1" variant="h5" align="center" gutterBottom>
                                Edit User Details
                            </Typography>
                            {/* 
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )} */}

                            <Box component="form" onSubmit={handleFormSubmit}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="userName"
                                    label="Username"
                                    value={userData.userName}
                                    onChange={handleFormDataChange}
                                // disabled={loading}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="phoneNumber"
                                    label="Phone Number"
                                    value={userData.phoneNumber}
                                    onChange={handleFormDataChange}
                                // disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, position: 'relative' }}
                                // disabled={loading}
                                >
                                    {/* {loading ? (
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
                                    )} */}
                                    Submit
                                </Button>
                            </Box>
                        </Card>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}