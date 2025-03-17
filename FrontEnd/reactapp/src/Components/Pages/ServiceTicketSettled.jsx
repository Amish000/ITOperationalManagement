import React, { useState, useEffect } from 'react';
import { TicketServicesSettled, DeleteTicket, GetTicketDetails } from '../../services/ticketServiceAdmin';
import { getLogTickets } from '../../services/logTicketService';
import { toast } from 'react-toastify';
import Timeline from '@mui/lab/Timeline';
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import {
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
} from '@mui/lab';
import {
  Container,
  Typography,
  Paper,
  Box,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Toolbar,
  InputBase,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  Stepper,
  Step,
  StepLabel,
  Stack,
  CardContent,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';
import { DoneAll, Add, AccessAlarm } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getClientTicketServiceSettled } from '../../services/ticketServiceClient';
import DataArrayIcon from '@mui/icons-material/DataArray';

const ServiceTicketSettled = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalItems: 0,
    sortColumn: 'LastUpdatedOn',
    sortOrder: 'DESC'
  });
  const [search, setSearch] = useState('')
  const [hasInitialData, setHasInitialData] = useState(false);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog
  const [ticketIdToDelete, setTicketIdToDelete] = useState(null); // State to hold the ID of the ticket to delete
  const [openBox, setOpenBox] = useState(false);
  const [ticketIdToDetail, setTicketIdToDetail] = useState(null);
  const [ticketIdToLog, setTicketIdToLog] = useState(null);
  const [openLog, setOpenLog] = useState(false);
  const [ticketLog, setTicketLog] = useState([]);
  const [ticket, setTicket] = useState({});
  const roleString = localStorage.getItem('user');
  const role = roleString ? JSON.parse(roleString) : null;
  const userRoles = role && role.roles ? role.roles : [];
  const activeStep = 0; // Initialize activeStep to 0
  const steps = ["Created", "In Progress", "Accepted", "Rejected"];
  const stepIcons = [
    <Add />,
    <AccessAlarm />,
    <DoneAll />
  ];
  const fetchTicketLog = async () => {
    if (!ticketIdToLog) {
      console.log('No ticket ID provided for log fetch');
      setTicketLog([]);
      return;
    }

    try {
      const response = await getLogTickets(ticketIdToLog, {
        search,
        sortColumn: pagination.log,
        sortOrder: pagination.sortOrder,
        page: pagination.page + 1,
        pageSize: pagination.pageSize
      });

      console.log("Raw API Response:", response);

      if (response.success) {
        setTicketLog(response.data.services);
      } else {
        setTicketLog([]);
        toast.error(response.message || 'Failed to fetch ticket logs');
      }
    } catch (error) {
      console.error('Error fetching ticket logs:', error);
      setTicketLog([]);
      toast.error(error.message || 'An error occurred while fetching ticket logs');
    }
  };
  // Update the useEffect to only fetch when ticketIdToLog changes
  useEffect(() => {
    if (ticketIdToLog) {
      fetchTicketLog();
    }
  }, [ticketIdToLog]);
  const fetchTicketDetails = async () => {
    try {
      const response = await GetTicketDetails(ticketIdToDetail);
      setTicket(response.data);
    } catch (error) {
      console.log('failed to fetch ticket details');
    }
  };

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketIdToDetail]);


  const fetchServices = async () => {
    try {
      setLoading(true);
      if (userRoles.includes("SuperAdmin")) {
        const response = await TicketServicesSettled({
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
          toast.error(response.message || 'failed to fetch services');
        }
      } else {
        const response = await getClientTicketServiceSettled({
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
          toast.error(response.message || 'failed to fetch services');
        }
      }
    } catch (error) {
      toast.error(error.message || 'An error occured while fetching services');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await DeleteTicket(ticketIdToDelete);
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
    console.log("Ticket id:", ticketId);
    setTicketIdToDelete(ticketId);
    setOpenDialog(true);
  }
  const openLogBox = (ticketId) => {
    console.log("ticketId to open: ", ticketId);
    setTicketIdToLog(ticketId);
    setOpenLog(true);
  }
  const openDetailBox = (ticketId) => {
    console.log("ticketId to open: ", ticketId);
    setTicketIdToDetail(ticketId);
    setOpenBox(true);
  };

  useEffect(() => {
    fetchServices();
  }, [pagination.page, pagination.pageSize, search]);

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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/\//g, '-'); // Replaces slashes with hyphens
  };

  const StyledTimeline = styled(Timeline)({
    padding: 0,
    '& .MuiTimelineItem-root': {
      minHeight: 150,
      '&:before': {
        flex: 0,
        padding: 0
      }
    }
  });

  const TimelineCard = styled(Card)({
    maxWidth: 400,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }
  });

  const CategoryChip = styled(Chip)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: (props) => {
      switch (props.category) {
        case 'STATUS_UPDATE': return '#1DA1F2';
        default: return '#666666';
      }
    },
    color: '#FFFFFF',
    fontWeight: 'bold'
  }));

  const events = ticketLog.map(log => ({
    id: log.logID,
    category: log.actionType,
    date: formatDate(log.actionOn),
    title: log.serviceTicketTitle,
    link: `${log.prevTicketStatusID} → ${log.currentTicketStatusID}`,
    description: log.remarks
  }));

  const StyledTimelineItem = styled(TimelineItem)(({ isAdmin }) => ({
    minHeight: 150,
    '&:before': {
      flex: 0,
      padding: 0
    },
    '.MuiTimelineContent-root': {
      textAlign: isAdmin ? 'left' : 'right'
    }
  }));

  return (
    <Container maxWidth="70vw" sx={{ ml: 3, pt: 0, }} >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap', // Allows items to wrap in smaller screens
          gap: 0,// Adds space between the items
          maxWidth: "75vw",
          marginLeft: 8
        }}
      >

        {/* First Row  for search bar*/}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-center ',
            mt: 0,
            ml: 0,
            pb: 2,
            pr: 2,
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start ',
            }}
          >
            <DoneIcon
              sx={{
                marginRight: 2,
                marginLeft: 2,
                color: 'black',
                fontSize: '3rem'
              }}
            />
            <Typography variant="h4" gutterBottom>
              Settled Tickets
            </Typography>
          </Box>
          {(hasInitialData || search) && (
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
                  Ticket Title
                </Typography>
              </Toolbar>
              <InputBase
                sx={{
                  pl: 1,
                  flex: 1,
                  backgroundColor: "white",
                  borderRadius: " 0px 15px 15px 0px",
                }}
                placeholder="Search for Tickets"
                inputProps={{ "aria-label": "search google maps" }}
                value={search}
                onChange={handleSearchChange}
              />

            </Box>
          )}
        </Box>

        {/* Second Row: Table */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            mt: 0,
          }}
        >
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
                        <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Title</TableCell>
                        <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Priority</TableCell>
                        <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Requested On</TableCell>
                        <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Requested By</TableCell>
                        <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ color: 'Black', fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow
                          key={service.serviceID}
                          sx={{
                            '&:hover': { backgroundColor: 'action.hover' }
                          }}>
                          <TableCell
                            sx={{ cursor: "pointer" }}
                            onClick={() => openDetailBox(service.id)}
                          >
                            <Tooltip disableFocusListener title="Detail">
                              <span
                                style={{
                                  fontSize: "1.1em",
                                  fontWeight: "bold",
                                }}
                              >
                                {service.title}
                              </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography
                              color={
                                service.priority === "Low"
                                  ? "warning.main"
                                  : service.priority === "Normal"
                                    ? "success.main"
                                    : "error.main"
                              }
                              fontWeight="bold"
                            >
                              {service.priority}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {formatDate(service.requestedOn)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {service.requestedBy}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                backgroundColor:
                                  service.ticketStatusId === "Pending"
                                    ? "#fefcd3"
                                    : service.ticketStatusId === "InProgress"
                                      ? " #d9d248"
                                      : service.ticketStatusId === "Accepted"
                                        ? "#34ac7b"
                                        : "#d32f2f",
                                color: "white",
                                py: 0.5,
                                px: 1.5,
                                borderRadius: "2em",
                                display: "inline-block",
                                fontSize: "0.875rem",
                              }}
                            >
                              {service.ticketStatusId}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{ display: "flex", flexDirection: "row" }}
                          >
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
                              onClick={() => openDetailBox(service.id)}
                            >
                              Detail
                            </Button>

                            <Box sx={{ width: 8 }}></Box>

                            {userRoles.includes("SuperAdmin") && (
                              <>
                                <Button
                                  variant="outlined"
                                  sx={{
                                    borderColor: "info.main", // Green border for Detail button
                                    color: "info.main", // Match the text color to green
                                    "&:hover": {
                                      // Green hover effect
                                      borderColor: "info.dark",
                                      backgroundColor: "info.light",
                                      color: "white",
                                    },
                                  }}
                                  startIcon={<DataArrayIcon />}
                                  onClick={() => openLogBox(service.id)}
                                >
                                  Log
                                </Button>
                                <Box sx={{ width: 8 }}></Box>
                              </>
                            )}

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
                              onClick={() => openDeleteDialog(service.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  component="div"
                  count={pagination.totalItems}
                  page={pagination.page}
                  onPageChange={handleChangePage}
                  rowsPerPage={pagination.pageSize}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    '.MuiTablePagination-select': {
                      borderRadius: 1,
                    }
                  }}
                />
              </>
            ) : (<>
              <Typography variant="h4" sx={{ textAlign: 'center', mt: 5 }}>
                {hasInitialData ? 'No matching results found.' : 'No Settled Tickets'}
              </Typography>

            </>)}
          </Box>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          <Typography fontSize="1.2rem">Confirm Deletion</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ticket?
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
      {/* Activity Log Dialog */}
      <Dialog
        open={openLog}
        onClose={() => setOpenLog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Activity Log</Typography>
            <Button onClick={() => setOpenLog(false)} color="inherit">Close</Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {Array.isArray(ticketLog) && ticketLog.length > 0 ? (
            <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
              <StyledTimeline position="alternate">
                {events.map((event, index) => {
                  const isAdmin = event.actionBy === 'superadmin';
                  return (
                    <StyledTimelineItem key={event.id} isAdmin={isAdmin}>
                      <TimelineSeparator>
                        <TimelineDot sx={{ bgcolor: isAdmin ? '#1976d2' : '#4caf50' }} />
                        {index !== events.length - 1 && (
                          <TimelineConnector sx={{ bgcolor: isAdmin ? '#1976d2' : '#4caf50' }} />
                        )}
                      </TimelineSeparator>
                      <TimelineContent sx={{ px: 2 }}>
                        <TimelineCard>
                          <CardContent>
                            <CategoryChip
                              label={event.category}
                              size="small"
                              sx={{
                                bgcolor: isAdmin ? '#1976d2' : '#4caf50',
                                color: 'white'
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {event.date} by {event.actionBy}
                            </Typography>
                            <Typography variant="h6" sx={{ my: 1 }}>
                              {event.description}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}>
                              {event.title}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              Status Change: {event.link}
                            </Typography>
                          </CardContent>
                        </TimelineCard>
                      </TimelineContent>
                    </StyledTimelineItem>
                  );
                })}
              </StyledTimeline>
            </Box>

          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                p: 3
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Activity Logs Found
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                There are no activity logs recorded for this ticket yet. Logs will appear here when the ticket status is updated or when other actions are performed.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
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
              <Stack sx={{ gap: { xs: 2, sm: 5 }, paddingBottom: "8px" }}>
                <Typography
                  variant="h3"
                  // fontWeight="light"
                  textAlign="center"
                >
                  {ticket.title}
                </Typography>
              </Stack>

              {/* <Typography
                  variant="h4"
                  color="black"
                  gutterBottom
                  sx={{ mt: -2, textAlign: "center" }}
                >
                  {ticket.title}
                </Typography> */}
              <Stepper
                activeStep={activeStep} // Use activeStep state
                alternative
                label
                sx={{
                  // border: "2px solid green",
                  // borderRadius: 1,
                  p: 3,
                }}
              >
                {steps.map((label, index) => {
                  let backgroundColor;
                  if (ticket.ticketStatusId === "Declined") {
                    backgroundColor = "red"; // Red for all steps if rejected
                  } else if (
                    ticket.ticketStatusId === "Accepted" &&
                    index !== 3
                  ) {
                    backgroundColor = "green";
                  } else if (
                    ticket.ticketStatusId === "InProgress" &&
                    index < 2
                  ) {
                    backgroundColor = "green"; // Green for the second step if in progress
                  } else if (
                    ticket.ticketStatusId === "Pending" &&
                    index < 1
                  ) {
                    backgroundColor = "green"; // Green for the first step if pending
                  } else {
                    backgroundColor = "lightgrey"; // Default color for uncompleted steps
                  }

                  if (index === 3) {
                    return null; // Skip rendering the last step
                  }

                  return (
                    <Step key={index}>
                      <StepLabel
                        icon={
                          <Box
                            sx={{
                              backgroundColor: backgroundColor,
                              width: "45px",
                              height: "45px",
                              borderRadius: "50%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingTop: "5px",
                            }}
                          >
                            <Box
                              sx={{
                                color:
                                  backgroundColor === "green"
                                    ? "white"
                                    : "black",
                                fontSize: "1.5rem",
                              }}
                            >
                              {stepIcons[index]}
                            </Box>
                          </Box>
                        }
                        sx={{
                          fontWeight: "bold",
                          color: activeStep === index ? "green" : "black", // Highlight active step label
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <Box sx={{ mt: 3 }}>
                <Stack sx={{ gap: { xs: 2, sm: 5 }, paddingBottom: "8px" }}>
                  <Typography variant="h5" color="#212121">
                    <strong style={{ marginRight: "5px" }}>Priority: </strong>{" "}
                    <Typography
                      component="span"
                      sx={{
                        backgroundColor:
                          ticket.priority === "Low"
                            ? "warning.main"
                            : ticket.priority === "Normal"
                              ? "success.main"
                              : "error.main",
                        color: "white",
                        borderRadius: 14,
                        padding: 1,
                      }}
                    // variant="h6"
                    >
                      {ticket.priority}
                    </Typography>
                  </Typography>
                </Stack>
                <Stack sx={{ gap: { xs: 2, sm: 5 }, paddingBottom: "8px" }}>
                  <Typography variant="h5" color="#212121">
                    <strong style={{ marginRight: "5px" }}>Requested on: </strong>{" "}
                    <Typography
                      component="span"
                      color='textSecondary'
                      variant='h6'
                    >{formatDate(ticket.requestedOn)}</Typography>
                  </Typography>
                </Stack>

                <Stack sx={{ gap: { xs: 2, sm: 5 }, paddingBottom: "8px" }}>
                  <Typography variant="h5" color="#212121">
                    <strong style={{ marginRight: '5px' }}>Assigned to: </strong>
                    <Typography
                      component='span'
                      color='textSecondary'
                      variant='h6'
                    >{ticket.assignedTo}</Typography>
                  </Typography>
                </Stack>
                {/* <Stack sx={{ gap: { xs: 2, sm: 5 }, paddingBottom: "8px" }}>
                    <Typography variant="h5" color="#212121">
                      <strong>Status: </strong> 
                      <Typography
                        component="span"
                        sx={{
                          backgroundColor:
                            ticket.ticketStatusId === "InProgress"
                              ? "info.main"
                              : ticket.ticketStatusId === "Accepted"
                              ? "success.main"
                              : "error.main",
                          color: "white",
                          borderRadius: 14,
                          padding: 1,
                        }}
                        // variant="h6"
                      >
                        {ticket.ticketStatusId}
                      </Typography>
                    </Typography>
                  </Stack> */}
              </Box>
              <Stack sx={{ gap: { xs: 2, sm: 5 }, paddingBottom: "8px" }}>
                <Typography variant="h4" color="#212121" sx={{ mt: 3 }}>
                  Description
                </Typography>
              </Stack>
              <Typography variant="h6" fontWeight='light' color="#212121">
                {ticket.description}
              </Typography>
            </Card>
          </Box>
        </DialogContent>
      </Dialog>
    </Container >
  );
}

export default ServiceTicketSettled;