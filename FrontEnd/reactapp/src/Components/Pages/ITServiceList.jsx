import React, { useState, useEffect } from 'react';
import { getServices, deleteServices, editService, getServicebyId } from '../../services/itServiceService';
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
    Card,
    Alert,
    TextField,
    IconButton,
    Chip,
    Grid,
    Divider,
} from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import BusinessIcon from '@mui/icons-material/Business'; // replaces Building
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // replaces Clock
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // replaces DollarSign
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';

const ITServiceList = () => {
    const [hasInitialData, setHasInitialData] = useState(false);

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        page: 0,
        pageSize: 10,
        totalItems: 0,
        sortColumn: 'ExpiredOn',
        sortOrder: 'DESC'
    });


    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [ticketIdToDelete, setTicketIdToDelete] = useState(null);
    const [openBox, setOpenBox] = useState(false);
    const [serviceIdToEdit, setServiceIdToEdit] = useState(null);
    const [error, setError] = useState('');
    const [serviceToGetByIdId, setServiceToGetByIdId] = useState(null);
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [detailService, setDetailService] = useState({});
    // const [activeStep, setActiveStep] = useState(0);



    const [formData, setFormData] = useState({
        serviceName: '',
        serviceDescription: '',
        buyFrom: '',
        paidAmount: 0, // Initialize as a number
        serviceType: "",
        expiresOn: null, // Initialize as null or a valid Day.js object
    });

    const openDetail = (ticketId) => {
        console.log("ticketId to to get by id", ticketId);
        setServiceToGetByIdId(ticketId);
        setOpenDetailDialog(true);
    }

    const fetchServiceDetails = async () => {
        if (!serviceToGetByIdId) {
            return; // Exit if no valid ID
        }
        try {
            const response = await getServicebyId(serviceToGetByIdId);
            if (response.success) {
                setDetailService(response.data);
            } else {
                console.error('Error fetching service details:', response.error);
                toast.error(response.message || 'Error fetching service details');
            }
        }
        catch (error) {
            console.log('Failed to fetch service detail, ', error);
            toast.error('Failed to fetch service detail');
        }
    }

    useEffect(() => {
        fetchServiceDetails();
    }, [serviceToGetByIdId])

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
                setError('User is not authenticated. Please log in.');
                setLoading(false);
                return;
            }

            const formattedExpiryDate = formData.expiresOn.format(); // Format the date for submission

            const response = await editService(serviceIdToEdit, {
                ...formData,
                expiresOn: formattedExpiryDate, // Use the formatted date
            }, token);

            if (response.success) {
                toast.success('Service Submitted');
                setServices(prevServices =>
                    prevServices.map(service =>
                        service.serviceID === serviceIdToEdit ?
                            { ...service, ...formData, expiresOn: formattedExpiryDate } :
                            service))
                setDetailService(prevDetailService => ({
                    ...prevDetailService,
                    ...formData,
                    expiresOn: formattedExpiryDate,
                }))

                setOpenBox(false);
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

    const openEditBox = async (ticketId) => {
        setServiceIdToEdit(ticketId);
        setOpenBox(true);

        try {
            const response = await getServicebyId(ticketId);
            if (response.success) {
                setFormData({
                    serviceName: response.data.serviceName,
                    serviceDescription: response.data.serviceDescription,
                    buyFrom: response.data.buyFrom,
                    paidAmount: response.data.paidAmount,
                    serviceType: response.data.serviceType,
                    expiresOn: response.data.expiredOn ? dayjs(response.data.expiredOn) : null,
                })
            }
            else {
                toast.error(response.message || "Failed to fetch service details")
            }
        }
        catch (error) {
            console.error('Error fetching service details:', error);
            toast.error(error.message || "Failed to fetch service details");
        }
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await getServices({
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

    // newPage is built-in in MaterialUI
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
                        <ListIcon sx={{ marginRight: 2, marginLeft: 2, color: 'black', fontSize: '3rem' }} />
                        <Typography variant="h4" gutterBottom>All Services</Typography>
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
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Status</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Paid Amount</TableCell>
                                                <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {services.map((service) => (
                                                <TableRow key={service.serviceID} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                                                    <TableCell sx={{ cursor: 'pointer' }} onClick={() => openDetail(service.serviceID)
                                                    }>
                                                        <Tooltip disableFocusListener title="Detail">
                                                            <span>{service.serviceName}</span>
                                                        </Tooltip>
                                                    </TableCell >
                                                    <TableCell>{service.serviceType}</TableCell>
                                                    <TableCell>{service.buyFrom}</TableCell>
                                                    <TableCell>{formatDate(service.buyDate)}</TableCell>
                                                    <TableCell>{formatDate(service.expiredOn)}</TableCell>
                                                    <TableCell>{formatDate(service.lastPaidDate)}</TableCell>
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                backgroundColor: new Date(service.expiredOn) > new Date() ? 'success.light' : 'error.light',
                                                                color: 'white',
                                                                py: 0.5,
                                                                px: 1.5,
                                                                borderRadius: 1,
                                                                display: 'inline-block',
                                                                fontSize: '0.875rem',
                                                            }}

                                                        >
                                                            {new Date(service.expiredOn) > new Date() ? 'Active' : 'Inactive'}
                                                        </Box>
                                                    </TableCell>
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
                                                                borderColor: "warning.main", // Green border for Detail button
                                                                color: "warning.main", // Match the text color to green
                                                                "&:hover": {
                                                                    // Green hover effect
                                                                    borderColor: "warning.dark",
                                                                    backgroundColor: "warning.light",
                                                                    color: "white",
                                                                },
                                                            }}
                                                            startIcon={<EditIcon />}
                                                            onClick={() => openEditBox(service.serviceID)}
                                                        >
                                                            <Typography variant="button">Edit</Typography>
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
                                    rowsPerPageOptions={[5, 10, 25, 50]} // Add row options
                                    sx={{
                                        '.MuiTablePagination-select': { borderRadius: 1 },
                                        '.MuiTablePagination-displayedRows': { margin: 0 }
                                    }}
                                />
                            </>
                        ) : (
                            <Typography variant="h6" sx={{ textAlign: 'center', mt: 5 }}>
                                {hasInitialData ? 'No matching results found.' : 'You don\'t have any services yet.'}
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
                                    color: 'white',
                                    fontWeight: 500,
                                    paddingY: '15px'
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
                                    <Box sx={{ display: 'flex', gap: 1, color: "white" }}>
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
            {/*Edit Dialog*/}
            <Dialog
                open={openBox}
                onClose={() => setOpenBox(false)}
                fullWidth
                maxWidth="md"
            >
                {/* <DialogTitle onClose={() => setOpenBox(false)}>
                    Ticket Details
                </DialogTitle> */}
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
                                Edit Service
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
                                    name="serviceName"
                                    label="Service Name"
                                    value={formData.serviceName}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="serviceDescription"
                                    label="Description"
                                    multiline
                                    rows={5}
                                    value={formData.serviceDescription}
                                    onChange={handleChange}
                                    disabled={loading}
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
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="paidAmount"
                                    label="Paid Amount"
                                    type="number" // Set input type to number
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                <Box sx={{ width: '100%', marginTop: 2 }}>
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
                                                            <IconButton onClick={() => params.onClick()}>
                                                                <CalendarTodayIcon />
                                                            </IconButton>
                                                        ),
                                                    }}
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    disabled={loading}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Box>
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
                        </Card>
                    </Box>
                </DialogContent>
            </Dialog>
        </Container >
    );
}
export default ITServiceList;