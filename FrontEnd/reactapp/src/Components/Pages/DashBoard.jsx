import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

//import DashBoardBanner from '../../Static/Image/DashBoardBanner.svg'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { GetUserCount, GetTicketCount, GetExpiredServices } from '../../services/dashBoardService';
import { toast } from 'react-toastify';
import DashBoardBanner from '../../Static/Image/DashBoardBanner0.svg'
import { GetClientTotalTicketCount, GetClientActiveTicketCount, GetClientSettledTicketCount } from '../../services/DashboarClientTicket';
import DoneIcon from '@mui/icons-material/Done';
import DescriptionIcon from '@mui/icons-material/Description';
// import { Link, Navigate } from 'react-router-dom';
import { PATHS } from '../../constants/paths';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userCount, setUserCount] = useState(null);
    const [ticketCount, setTicketCount] = useState(null);
    const [clientTicketCount, setClientTicketCount] = useState(null);
    const [clientSettledTicketCount, setClientSettledTicketCount] = useState(null);
    const [clientActiveTicketCount, setClientActiveTicketCount] = useState(null);
    const [expiredServicesCount, setExpiredServicesCount] = useState(null);
    const roleString = localStorage.getItem('user');
    const role = roleString ? JSON.parse(roleString) : null;
    const userRoles = role && role.roles ? role.roles : [];

    const fetchUserCount = async () => {
        try {
            const response = await GetUserCount();
            setUserCount(response.data)
        }
        catch {
            toast.error("failed to fetch services");
        }
    };

    useEffect(() => {
        fetchUserCount();
    }, []);

    const fetchTicketCount = async () => {
        try {
            const response = await GetTicketCount();
            setTicketCount(response.data)
        }
        catch {
            toast.error("failed to fetch services");
        }
    };
    useEffect(() => {
        fetchTicketCount();
    }, []);

    const fetchClientTicketCount = async () => {
        try {
            const response = await GetClientTotalTicketCount();
            setClientTicketCount(response.data)
        }
        catch {
            toast.error("Failed to fetch total client ticket");
        }
    };

    useEffect(() => {
        fetchClientTicketCount();
    }, []);

    const fetchClientActiveTicketCount = async () => {
        try {
            const response = await GetClientActiveTicketCount();
            setClientActiveTicketCount(response.data)
        }
        catch {
            toast.error("Failed to fetch total client ticket");
        }
    };

    useEffect(() => {
        fetchClientActiveTicketCount();
    }, []);

    const fetchClientSettledTicketCount = async () => {
        try {
            const response = await GetClientSettledTicketCount();
            setClientSettledTicketCount(response.data)
            console.log("Settled ticket", response.data)
        }
        catch {
            toast.error("Failed to fetch total client ticket");
        }
    };

    useEffect(() => {
        fetchClientSettledTicketCount();
    }, []);
    const fetchExpiredServices = async () => {
        try {
            const response = await GetExpiredServices();
            setExpiredServicesCount(response.data);
        }
        catch {
            toast.error("failed to fetch services");
        }
    };
    useEffect(() => {
        fetchExpiredServices();
    }, []);
    const isAdmin = userRoles.includes("SuperAdmin");

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap', // Allows items to wrap in smaller screens
                    gap: 3, // Adds space between the items
                }}
            >
                {/* First Row */}
                <>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'flex-start ',
                            mt: 3,
                        }}
                    >
                        <MenuBookIcon sx={{ marginRight: 2, marginLeft: 2, color: 'black', fontSize: '3rem' }} />
                        <Typography variant="h4" gutterBottom>
                            Dashboard
                        </Typography>
                    </Box>
                    {/* second Row */}
                    <Box
                        sx={{
                            flex: '1 1 30%', // Flex-grow, flex-shrink, flex-basis
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', // Center items horizontally
                        }}
                    >
                        <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', width: '100%', height: "200px", backgroundColor: '#E1AC0F' }}>
                            {isAdmin ? (
                                <>
                                    <Button onClick={() => navigate(PATHS.MANAGE_USERS)} sx={{ color: "white" }}>
                                        <AccountCircleIcon sx={{ marginRight: 2, marginLeft: 5, color: 'white', fontSize: '8rem' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 3 }} >
                                            <Box>
                                                <Typography variant="h3">{userCount}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold">Users</Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => navigate(PATHS.SERVICE_TICKET_LIST_ACTIVE)} sx={{ color: "white" }}>
                                        <ConfirmationNumberIcon sx={{ marginRight: 2, marginLeft: 2, color: 'white', fontSize: '8rem' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 3 }} >
                                            <Box>
                                                <Typography variant="h3">{clientActiveTicketCount}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold">Active Tickets</Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </>
                            )}
                        </Paper>
                    </Box>
                    <Box
                        sx={{
                            flex: '1 1 30%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', width: '100%', height: "200px", backgroundColor: '#253D90' }}>
                            {isAdmin ? (
                                <>
                                    <Button onClick={() => navigate(PATHS.SERVICE_TICKET_LIST)} sx={{ color: "white" }}>
                                        <ConfirmationNumberIcon sx={{ marginRight: 2, marginLeft: 4, color: 'white', fontSize: '8rem' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 3 }} >
                                            <Box>
                                                <Typography variant="h3" color='white'>{ticketCount}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" color='white' fontWeight="bold">Tickets</Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => navigate(PATHS.SERVICE_TICKET_LIST_SETTLED)} sx={{ color: "white" }}>
                                        <DoneIcon sx={{ marginRight: 2, marginLeft: 4, color: 'white', fontSize: '8rem' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 3 }} >
                                            <Box>
                                                <Typography variant="h3">{clientSettledTicketCount}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold">Settled Tickets</Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </>
                            )}

                        </Paper>
                    </Box>
                    <Box
                        sx={{
                            flex: '1 1 30%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >

                        <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', width: '100%', height: "200px", backgroundColor: '#3F861E' }}>
                            {isAdmin ? (
                                <>
                                    <Button onClick={() => navigate(PATHS.IT_SERVICE_LIST)} sx={{ color: "white" }}>
                                        <CalendarMonthIcon sx={{ marginRight: 2, marginLeft: 0, color: 'white', fontSize: '8rem' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 2 }}>
                                            <Box>
                                                <Typography variant="h3" color='white'>{expiredServicesCount}</Typography>
                                            </Box>
                                            <Box sx={{ textAlign: "center" }}>
                                                <Typography variant='h5' color='white' fontWeight="bold">Service payments</Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => navigate(PATHS.SERVICE_TICKET_LIST)} sx={{ color: "white" }}>
                                        <DescriptionIcon sx={{ marginRight: 2, marginLeft: 1, color: 'white', fontSize: '8rem' }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', ml: 3 }} >
                                            <Box>
                                                <Typography variant="h3">{clientTicketCount}</Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" fontWeight="bold">All Tickets</Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </>)
                            }
                        </Paper>
                    </Box>

                    {/* Third Row: All of your Services in ONE Place */}
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            mt: 3,
                        }}
                    >
                        <Box
                            component="img"
                            src={DashBoardBanner}
                            alt="Illustration"
                            sx={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
                        />
                    </Box >
                </>
            </Box>
        </Container >
    );
};

export default Dashboard;
