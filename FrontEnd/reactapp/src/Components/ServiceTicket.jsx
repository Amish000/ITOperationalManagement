
// import Body from "./Body";
import React, { useState, useEffect } from 'react';
import { getServices } from '../services/itServiceService';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Card,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const ServiceTicket = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10,
    totalItems: 0,
    sortColumn: 'ServiceID',
    sortOrder: 'ASC'
  });
  const [search, setSearch] = useState('');

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

  const handleChangePage = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      page: 0
    }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleRefresh = () => {
    fetchServices();
  };

  return (
    <>
      <Card sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary">
            Service Tickets
          </Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>

        <TextField
          label="Search Services"
          variant="outlined"
          fullWidth
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* <Sidebar/> */}
            <TableContainer component={Paper} sx={{ mb: 2, borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.main' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Buy From</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Buy Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expiry Date</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
                    <TableRow
                      key={service.serviceID}
                      sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                    >
                      <TableCell>{service.serviceName}</TableCell>
                      <TableCell>{service.serviceDescription}</TableCell>
                      <TableCell>{service.serviceType}</TableCell>
                      <TableCell>{service.buyFrom}</TableCell>
                      <TableCell>
                        {new Date(service.buyDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {service.expiredOn ? new Date(service.expiredOn).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor: service.isActive ? 'success.light' : 'error.light',
                            color: 'white',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: 1,
                            display: 'inline-block',
                            fontSize: '0.875rem',
                          }}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Box>
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
        )}
      </Card>
    </>
  );
};

export default ServiceTicket;
