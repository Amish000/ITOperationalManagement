import React, { useState, useEffect } from 'react';
import { getActiveServices, deleteServices, getServicebyId } from '../../services/itServiceService';
import { toast } from 'react-toastify';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    InputBase,
    Toolbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Paper,
    Tooltip,
    Chip,
    Grid,
    Divider,
    Alert,
} from '@mui/material';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business'; // replaces Building
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // replaces Clock
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // replaces DollarSign
import LanguageIcon from '@mui/icons-material/Language';

const ActiveServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10,
        totalItems: 0,
        sortColumn: 'ExpiredOn',
        sortOrder: 'DESC'
    });
    const [hasInitialData, setHasInitialData] = useState(false);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [ticketIdToDelete, setTicketIdToDelete] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [serviceToGetByIdId, setServiceToGetByIdId] = useState(null);
    const [detailService, setDetailService] = useState({});
    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await getActiveServices({
                search,
                sortColumn: pagination.sortColumn,
                sortOrder: pagination.sortOrder,
                page: pagination.page + 1,
                pageSize: pagination.pageSize
            });

            if (response.success) {
                setServices(response.data.services);
                setPagination(prev => ({
                    ...prev,
                    totalItems: response.data.pagination.totalItems
                }));

                if (!search) {
                    setHasInitialData(response.data.pagination.totalItems > 0);
                }
            } else {
                toast.error(response.message || 'Failed to fetch services');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while fetching services');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, [pagination.page, pagination.pageSize, search]);

    const openDetail = (ticketId) => {
        console.log("ticketId to to get by id", ticketId);
        setServiceToGetByIdId(ticketId);
        setOpenDetailDialog(true);
    }
    const fetchServiceDetails = async () => {
        try {
            const response = await getServicebyId(serviceToGetByIdId);
            setDetailService(response.data);
        }
        catch (error) {
            console.log('Failed to fetch service detail, ', error);
        }
    }

    useEffect(() => {
        fetchServiceDetails();
    }, [serviceToGetByIdId])

    const handleChangePage = (event, newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleChangeRowsPerPage = (event) => {
        const newPageSize = parseInt(event.target.value, 10);
        setPagination(prev => ({
            ...prev,
            pageSize: newPageSize,
            page: 0 // Reset to first page when changing page size
        }));
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
        setPagination(prev => ({ ...prev, page: 0 }));
    };

    const handleDelete = async () => {
        try {
            await deleteServices(ticketIdToDelete);
            setServices(prevServices => prevServices.filter(service => service.serviceID !== ticketIdToDelete));
            fetchServices();
            toast.success('Ticket deleted successfully');
        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast.error(error.message || 'Failed to delete ticket');
        } finally {
            setOpenDialog(false);
            setTicketIdToDelete(null);
        }
    };

    const openDeleteDialog = (ticketId) => {
        console.log("ticketId to delete: ", ticketId);
        setTicketIdToDelete(ticketId);
        setOpenDialog(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/\//g, '-'); // Replaces slashes with hyphens
    };

    const InfoItem = ({ icon: Icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Icon sx={{ color: 'text.secondary', mt: 0.5 }} size={20} />
            <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5 }}>
                    {label}
                </Typography>
                <Typography variant="body2" color="text.primary" fontWeight={500}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
    return (
        <Container maxWidth="70vw" sx={{ ml: 3, pt: 0 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0, maxWidth: "75vw", marginLeft: 8 }}>
                {/* First Row for search bar */}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-center', mt: 0, ml: 0, pb: 2, pr: 2 }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                        <DesktopWindowsIcon sx={{ marginRight: 2, marginLeft: 2, color: 'black', fontSize: '3rem' }} />
                        <Typography variant="h4" gutterBottom>Active Services</Typography>
                    </Box>

                    {(hasInitialData || search) && (
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-center" }}>
                            <Toolbar sx={{ width: "23%", bgcolor: "#121C3E", height: "5%", borderRadius: "15px 0px 0px  15px", ml: 25 }}>
                                <Typography sx={{ color: "white" }}>Service Name</Typography>
                            </Toolbar>
                            <InputBase
                                sx={{ pl: 1, flex: 1, backgroundColor: "white", borderRadius: "0px 15px 15px 0px" }}
                                placeholder="Search for Tickets"
                                inputProps={{ "aria-label": "search google maps" }}
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </Box>
                    )}
                </Box>

                {/* Second Row: Table */}
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 0 }}>
                    <Box sx={{ p: 1, width: '100%', height: "600px" }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : services.length > 0 ? (
                            <>
                                <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2, maxHeight: 760 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#E3EDF9' }}>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Service Name</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Type</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Buy From</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Buy Date</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Expiry Date</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Last Paid Date</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Paid Amount</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service.serviceID} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => openDetail(service.serviceID)}>
                                                        <Tooltip disableFocusListener title="Detail">
                                                            <span
                                                                style={{
                                                                    fontSize: "1.1em",
                                                                    fontWeight: "bold",
                                                                }}
                                                            >{service.serviceName}</span>
                                                        </Tooltip>
                                                    </TableCell >
                                                    <TableCell>{service.serviceType}</TableCell>
                                                    <TableCell>{service.buyFrom}</TableCell>
                                                    <TableCell>{formatDate(service.buyDate)}</TableCell>
                                                    <TableCell>{formatDate(service.expiredOn)}</TableCell>
                                                    <TableCell>{formatDate(service.lastPaidDate)}</TableCell>
                                                    <TableCell>Rs. {service.paidAmount}</TableCell>
                                                    <TableCell sx={{ display: 'flex', flexDirection: 'row' }}>
                                                        <Button
                                                            variant="outlined"
                                                            sx={{
                                                                borderColor: "success.main", // Green border for Detail button
                                                                color: "success.main", // Match the text color to green
                                                                "&:hover": {
                                                                    // Green hover effect
                                                                    borderColor: "success.dark",
                                                                    backgroundColor: "success.light",
                                                                    color: "white",
                                                                },
                                                            }}
                                                            startIcon={<VisibilityIcon />}
                                                            onClick={() => openDetail(service.serviceID)}
                                                        >
                                                            <Typography variant="button">Detail</Typography>
                                                        </Button>
                                                        <Box sx={{ width: 8 }}></Box>
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
                                                            startIcon={<DeleteIcon />}
                                                            onClick={() => openDeleteDialog(service.serviceID)}
                                                        >
                                                            <Typography variant="button">Delete</Typography>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow >
                                            ))}
                                        </TableBody >
                                    </Table >
                                </TableContainer >

                                <TablePagination
                                    component="div"
                                    count={pagination.totalItems}
                                    page={pagination.page}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={pagination.pageSize}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{ '.MuiTablePagination-select': { borderRadius: 1 } }}
                                />
                            </>
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
                                {hasInitialData ? 'No matching results found.' : 'You don\'t have any active services.'}
                            </Typography>
                        )}
                    </Box >
                </Box >
            </Box >
            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>
                    <Typography fontSize="1.2rem">Confirm Deletion</Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this Service?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        <Typography sx={{ color: "#3F861E" }}>Cancel</Typography>
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        <Typography sx={{ color: "#FF0000" }}>Delete</Typography>
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Detail Dialog */}
            <Dialog
                open={openDetailDialog}
                onClose={() => setOpenDetailDialog(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" fontWeight={600}>
                                Service Details
                            </Typography>
                            <Chip
                                label={detailService.serviceType}
                                color="primary"
                                size="small"
                                sx={{
                                    bgcolor: 'primary.light',
                                    color: 'primary.main',
                                    fontWeight: 500
                                }}
                            />
                        </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                        Name
                                    </Typography>
                                    <Typography variant="body2" color="text.primary" fontWeight={500}>
                                        {detailService.serviceName}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mb: 0.5, display: 'block' }}>
                                        Description
                                    </Typography>
                                    <Typography variant="body2" color="text.primary" fontWeight={500}>
                                        {detailService.serviceDescription}
                                    </Typography>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    icon={BusinessIcon}
                                    label="Provider"
                                    value={detailService.buyFrom}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    icon={AttachMoneyIcon}
                                    label="Amount Paid"
                                    value={`Rs.${detailService.paidAmount}`}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    icon={AccessTimeIcon}
                                    label="Purchase Date"
                                    value={formatDate(detailService.buyDate)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <InfoItem
                                    icon={AccessTimeIcon}
                                    label="Last Paid Date"
                                    value={formatDate(detailService.lastPaidDate)}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, pt: 3 }}>
                            <Divider />
                            <Box sx={{ mt: 3 }}>
                                <InfoItem
                                    icon={LanguageIcon}
                                    label="Domain Usage"
                                    value={detailService.usedInDomains}
                                />
                            </Box>
                        </Box>

                        <Box sx={{ mt: 4, pt: 3 }}>
                            <Divider />
                            <Box sx={{ mt: 3 }}>
                                <Alert
                                    severity="warning"
                                    icon={false}
                                    sx={{
                                        bgcolor: 'warning.light',
                                        color: 'warning.dark',
                                        '& .MuiAlert-message': {
                                            width: '100%'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Typography variant="body2" component="span" fontWeight={600}>
                                            Expiration Notice:
                                        </Typography>
                                        <Typography variant="body2" component="span">
                                            This service will expire on {formatDate(detailService.expiredOn)}
                                        </Typography>
                                    </Box>
                                </Alert>
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container >
    )
}
export default ActiveServices;