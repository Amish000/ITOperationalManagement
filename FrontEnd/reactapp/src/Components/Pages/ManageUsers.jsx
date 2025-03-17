import React, { useEffect, useState } from 'react';
import { GetAllUsers, ChangeUserStatus, DeleteUserByID, ChangeUserPassword } from '../../services/manageUserService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import {
    Container,
    Typography,
    Paper,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    InputBase,
    Toolbar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    TextField,
    styled,
    Switch,
    InputAdornment,
    IconButton,
} from "@mui/material";
import UpdateUser from '../UserManage/updateUser';


const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme, checked }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(16px)', // When checked, move the thumb to the right
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: checked ? '#65C466' : '#E9E9EA', // Green when checked, gray when unchecked
                opacity: 1,
                border: 0,
                ...theme.applyStyles('dark', {
                    backgroundColor: checked ? '#2ECA45' : '#39393D',
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
            color: theme.palette.grey[100],
            ...theme.applyStyles('dark', {
                color: theme.palette.grey[600],
            }),
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.7,
            ...theme.applyStyles('dark', {
                opacity: 0.3,
            }),
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: checked ? '#65C466' : '#E9E9EA', // Track color change based on checked
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
            duration: 500,
        }),
        ...theme.applyStyles('dark', {
            backgroundColor: checked ? '#2ECA45' : '#39393D', // Track color for dark mode
        }),
    },
}));


const ManageUsers = () => {
    const [idTochangePassword, setIdToChangePassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const handleCloseChangePassword = () => {
        setOpenChangePasswordDialog(!openChangePasswordDialog); // Close the dialog
    };
    const handleClickOpenChangePassword = (id) => {
        handleCloseChangePassword();
        setIdToChangePassword(id);
    };
    const openDeleteDialog = (user) => {
        setSelectedValue(user.id);
        setOpenDialog(true);
    }
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleTogglePassword = (field) => {
        if (field === 'new') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };
    const [editOpen, setEditOpen] = useState(false);
    const [updateUserDetails, setUpdateUserDetails] = useState({ id: "", userName: "", email: "", phoneNumber: "" });
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10,
        totalItems: 0,
    });
    const [search, setSearch] = useState("");

    const fetchAllUsers = async () => {
        try {
            const response = await GetAllUsers(pagination, search);
            if (response.success) {
                setAllUsers(response.data.users);
                setPagination((prevData) => {
                    return {
                        ...prevData,
                        page: response.data.pagination.currentPage,
                        pageSize: response.data.pagination.pageSize,
                        totalItems: response.data.pagination.totalItems
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeleteUser = async () => {
        await DeleteUserByID(selectedValue);
        fetchAllUsers();
        setOpenDialog(false);
    }
    const handleUserActiveStatus = async (user, status) => {
        // console.log(status);
        await ChangeUserStatus(user, status);
        fetchAllUsers();
    }

    const handleEditClick = ({ user }) => {

        const filteredUserData = Object.keys(updateUserDetails).reduce((acc, key) => {
            if (user[key] !== undefined) {
                acc[key] = user[key];
            }
            return acc;
        }, {});

        setUpdateUserDetails(filteredUserData);
        setEditOpen(!editOpen);
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPagination(prev => ({ ...prev, page: 0 }));
    }

    const handlePaginationData = (event, newPage) => {
        setPagination((prevData) => ({
            ...prevData,
            page: newPage
        }))
    }
    //   validation for user password change
    const ValidateUserPasswordChange = () => {

        // checks for length>=10, contains [A-Z, a-z], contains [specialCharacter > 0 ] , contains [numbericCharacter > 0]
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

        if (passwordRegex.test(formData.newPassword)) {
            toast.success("Password Upated succesfully!");
            return true;
        }

        if (!formData.newPassword || !formData.confirmPassword) {
            toast.error('All fields a required');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New Password and Confirmation do not match');
            return false;
        }


    }
    const handlePasswordChange = async () => {

        if (!ValidateUserPasswordChange()) {
            toast.error("Validation Error");
        } else {
            try {
                console.log(idTochangePassword, formData.newPassword)
                const response = await ChangeUserPassword(idTochangePassword, formData.newPassword)
                if (response.success) {
                    toast.success('Password changed successfully');
                    handleCloseChangePassword();
                }
                else {
                    toast.error('Failed to change password');
                }
            } catch (error) {
                toast.error(error.response.data.message);
                console.error(error.response.data.message);
            }
        }

    }
    const handleChangeRowsPerPage = (event) => {
        const newPageSize = parseInt(event.target.value, 10);
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize,
            page: 0 // Reset to first page when changing page size
        }));
    };


    useEffect(() => {
        fetchAllUsers();
    }, [])

    useEffect(() => {
        fetchAllUsers();
    }, [editOpen, pagination.page, pagination.pageSize, search])

    return (
        <Container maxWidth="70vw" sx={{ ml: 3, pt: 0 }}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap", // Allows items to wrap in smaller screens
                    gap: 0, // Adds space between the items
                    maxWidth: "75vw",
                    marginLeft: 8,
                }}
            >
                {/* First Row  for search bar*/}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "15px",

                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-start ",
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Manage Users
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-center ",
                        }}
                    >
                        <Toolbar
                            sx={{
                                width: "20%",
                                bgcolor: "#121C3E",
                                height: "5%",
                                borderRadius: " 15px 0px 0px 15px",
                                ml: 25,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "white",
                                }}
                            >
                                User
                            </Typography>
                        </Toolbar>
                        <InputBase
                            sx={{
                                pl: 1,
                                flex: 1,
                                backgroundColor: "white",
                                borderRadius: " 0px 15px 15px 0px",
                            }}
                            placeholder="Search for Users"
                            inputProps={{ "aria-label": "search google maps" }}
                            value={search}
                            onChange={handleSearchChange}
                        />

                    </Box>

                </Box>
                {/* Second Row: Table */}
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        mt: 0,
                    }}
                >
                    <Box sx={{ p: 1, width: '100%', height: "600px" }}>
                        {allUsers.length > 0 ? (
                            <>
                                <TableContainer
                                    component={Paper}
                                    sx={{ mb: 2, borderRadius: 2, maxHeight: 760 }}
                                >
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead sx={{ backgroundColor: "#E3EDF9", }}>
                                            <TableRow>
                                                <TableCell sx={{ color: "Black", fontWeight: "500", fontSize: "1.085rem" }}>
                                                    Username
                                                </TableCell>
                                                <TableCell sx={{ color: "Black", fontWeight: "500", fontSize: "1.085rem" }}>
                                                    Email
                                                </TableCell>
                                                <TableCell sx={{ color: "Black", fontWeight: "500", fontSize: "1.085rem" }}>
                                                    Phone
                                                </TableCell>
                                                {/* <TableCell sx={{ color: "Black", fontWeight: "bold" }}>
                          Status
                        </TableCell> */}
                                                <TableCell align='right' sx={{ color: "Black", fontWeight: "500", fontSize: "1.085rem" }}>
                                                    Actions
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {allUsers.map((user) => (
                                                <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>

                                                    <TableCell
                                                        sx={{
                                                            fontSize: "1.05em",
                                                            fontWeight: "500"
                                                        }}
                                                    >
                                                        {user.userName}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: "1.05em" }}>
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell sx={{ fontSize: "1.05em" }}>
                                                        {user.phoneNumber}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{ display: "flex", justifyContent: 'end', gap: "0.8rem", }}
                                                    >
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: "success.main", // Red border for Delete button
                                                                color: "success.main", // Match the text color to red
                                                                "&:hover": {
                                                                    // Red hover effect
                                                                    borderColor: "success.dark",
                                                                    backgroundColor: "success.light",
                                                                    color: "white",
                                                                },
                                                            }}
                                                            onClick={() => handleEditClick({ user })}
                                                        >
                                                            Update
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: "error.main", // Red border for Delete button
                                                                color: "error.main", // Match the text color to red
                                                                "&:hover": {
                                                                    // Red hover effect
                                                                    borderColor: "error.dark",
                                                                    backgroundColor: "error.light",
                                                                    color: "white",
                                                                },
                                                            }}

                                                            onClick={() => openDeleteDialog(user)}
                                                        >
                                                            Delete
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: "error.main", // Red border for Delete button
                                                                color: "error.main", // Match the text color to red
                                                                "&:hover": {
                                                                    // Red hover effect
                                                                    borderColor: "error.dark",
                                                                    backgroundColor: "error.light",
                                                                    color: "white",
                                                                },
                                                            }}
                                                            onClick={() => (handleClickOpenChangePassword(user.id))}
                                                        >
                                                            Reset Password
                                                        </Button>
                                                        <IOSSwitch user={user.id} checked={!user.lockoutEnabled} sx={{ margin: "5px" }} onClick={() => handleUserActiveStatus(user.id, user.lockoutEnabled)} />

                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>
                                </TableContainer>
                                {/* A small bug is still present where pagination only works after 2 clicks */}
                                <TablePagination
                                    component="div"
                                    count={pagination.totalItems}
                                    page={pagination.page}
                                    onPageChange={handlePaginationData}
                                    rowsPerPage={pagination.pageSize}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    rowsPerPageOptions={[5, 10, 25, 50]} // Add row options
                                    sx={{
                                        '.MuiTablePagination-select': { borderRadius: 1 },
                                        '.MuiTablePagination-displayedRows': { margin: 0 }
                                    }}
                                />
                            </>
                        ) : (<h1>NO USERS</h1>)}
                        {editOpen && (<UpdateUser user={updateUserDetails} editOpen={editOpen} SetEditOpen={setEditOpen} />)}
                    </Box>
                </Box>
                {/* Confirmation Dialog */}
                < Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>
                        <Typography fontSize="1.2rem">Confirm Delete</Typography>
                    </DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure you want to delete?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)} color="primary">
                            <Typography sx={{ color: "#3F861E" }}>
                                Cancel
                            </Typography>
                        </Button>
                        <Button onClick={() => handleDeleteUser()} color="secondary">
                            <Typography sx={{ color: "#FF0000" }}>
                                Delete
                            </Typography>
                        </Button>
                    </DialogActions>
                </Dialog >
                {/* changePasswordDialog */}
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
                            name="New Password"
                            label="New Password"
                            type={showNewPassword ? 'text' : 'password'}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            sx={{
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
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                            onClick={() => handleTogglePassword('confirm')}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <ul style={{ paddingLeft: "20px", marginTop: 0 }}>
                            <li style={{ fontSize: "0.85rem" }}>The password must be 10 character</li>
                            <li style={{ fontSize: "0.85rem" }}>Password Must Contain A-Z and a-z</li>
                            <li style={{ fontSize: "0.85rem" }}>Password must contain atleast 1 special character and 1 number</li>
                        </ul>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={handleCloseChangePassword} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    )
};

export default ManageUsers;