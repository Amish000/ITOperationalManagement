import React, { useEffect, useState } from 'react';
import { GetUnreadNotifications, GetReadNotifications, MarkAsReadNotifications } from '../../services/notificationService';
import { toast } from 'react-toastify';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Divider,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const timeAgo = (date) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diff = Math.abs(now - notificationDate);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year ${years > 1 ? 's' : ''} ago`
  if (months > 0) return `${months} month ${months > 1 ? 's' : ''} ago`
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second ${seconds > 1 ? 's' : ''}`;
};


const ITEMS_PER_PAGE = 5;

const AllNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationType, setNotificationType] = useState('unread');
  const [page, setPage] = useState(1);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await GetUnreadNotifications();
      if (response.success) {
        setUnreadNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch all notifications');
      setUnreadNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReadNotifications = async () => {
    try {
      const response = await GetReadNotifications();
      if (response.success) {
        setReadNotifications(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch all notifications');
      setReadNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const MarkAsRead = async (id) => {
    try {
      console.log("Marking notification as read:", id);
      const response = await MarkAsReadNotifications(id);

      if (response.success) {
        toast.success("Notification marked successfully");
        fetchUnreadNotifications();
        fetchReadNotifications();
      }
      else {
        toast.error(response.message || 'Failed to mark notification as read')
      }
    } catch (error) {
      toast.error(error.message || 'An error occured while marking notification');
    }
  }

  useEffect(() => {
    fetchUnreadNotifications();
    fetchReadNotifications();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [notificationType]);

  const handleTypeChange = (event) => {
    setNotificationType(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Get current notifications based on type and pagination
  const getCurrentNotifications = () => {
    const notifications = notificationType === 'unread' ? unreadNotifications : readNotifications;
    if (!Array.isArray(notifications)) {
      return [];
    }
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return notifications.slice(startIndex, endIndex);
  };

  // Calculate total pages
  const totalPages = Math.ceil(
    (notificationType === 'unread' ? unreadNotifications.length : readNotifications.length) / ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">All Notifications</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Notification Type</InputLabel>
          <Select
            value={notificationType}
            label="Notification Type"
            onChange={handleTypeChange}
          >
            <MenuItem value="unread">Unread Notifications</MenuItem>
            <MenuItem value="read">Read Notifications</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            {notificationType === 'unread' ?
              `Unread Notifications (${unreadNotifications.length})` :
              `Read Notifications (${readNotifications.length})`
            }
          </Typography>

          <List>
            {getCurrentNotifications().map((notification) => (
              <div key={notification.id}>
                <ListItem
                  sx={{
                    padding: 2,
                    borderRadius: 1,
                    backgroundColor: notificationType === 'unread' ? '#f9f9f9' : 'inherit',
                    '&:hover': { backgroundColor: notificationType === 'unread' ? '#e0e0e0' : '#f5f5f5' },
                  }}
                >
                  <Avatar sx={{ marginRight: 2 }}>
                    <NotificationsIcon />
                  </Avatar>
                  <ListItemText
                    primary={
                      notificationType === 'unread' ? (
                        <Typography variant='body1'>
                          {notification.message.split("'").map((part, index) => (
                            index % 2 === 1 ? (
                              <span key={index} style={{ fontWeight: 'bold' }}>
                                '{part}'
                              </span>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          ))}
                        </Typography>
                      ) : (
                        <Typography variant="body1">
                          {notification.message}
                        </Typography>
                      )
                    }
                    secondary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                          {timeAgo(notification.createdAt)}
                        </Typography>
                        {notificationType === 'unread' && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'blue',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                            onClick={() => MarkAsRead(notification.id)}
                          >
                            Mark as Read
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AllNotifications;