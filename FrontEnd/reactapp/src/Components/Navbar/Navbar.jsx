import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  CardMedia,
  Popover,
  Typography,
  Button,
  ListItemText,
  ListItem,
  Badge,
} from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Card, CardContent, CardHeader } from "@mui/material";
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { GetUnreadNotifications, MarkAsReadNotifications } from '../../services/notificationService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/paths';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorE1, setAnchorE1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unReadNotifications, setUnreadNotifications] = useState([]);

  const handleNotification = (event) => {
    setAnchorE1(event.currentTarget);
  };

  const handlePopOverClose = () => {
    setAnchorE1(null);
  };

  const isPopoverOpen = Boolean(anchorE1);

  const TimeStamp = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  }));

  const SectionTitle = styled(Typography)(({ theme }) => ({
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  }));

  const fetchUnReadNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await GetUnreadNotifications();
      if (response.success) {
        setUnreadNotifications(response.data || []);
      } else {
        setUnreadNotifications([]);
        toast.error(response.message || 'Failed to fetch notifications');
      }
    } catch (error) {
      setUnreadNotifications([]);
      toast.error(error.message || 'An error occurred while fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnReadNotifications();
      const intervalId = setInterval(fetchUnReadNotifications, 60000);
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

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

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };

  const MarkAsRead = async (id) => {
    try {
      console.log("Marking notification as read:", id);
      const response = await MarkAsReadNotifications(id);
      if (response.success) {
        toast.success("Notification marked successfully");
        fetchUnReadNotifications();
      } else {
        toast.error(response.message || 'Failed to mark notification as read');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while marking notification');
    }
  };
  const POPOVER_WIDTH = 550;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          borderRadius: 0,
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#E3EDF9",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: "#121C3E",
            }}>
            IT Operation Management
          </Typography>
          <Box sx={{ flexGrow: 1 }} />{" "}
          {/* This will push the notification icon to the right */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <Badge color="secondary" variant="dot" invisible={invisible}> */}
            {isAuthenticated && (
              <Badge
                color="error"
                badgeContent={Array.isArray(unReadNotifications) ? unReadNotifications.length : 0}
                overlap='circular'
                invisible={!Array.isArray(unReadNotifications) || unReadNotifications.length === 0}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                sx={{
                  '& .MuiBadge-badge': {
                    transform: 'translate(45%, 5%)',
                  }
                }}
              >

                <CircleNotificationsIcon
                  sx={{
                    fontSize: "3rem",
                    color: "#253D90",
                    marginTop: "10px",
                    cursor: "pointer"
                  }}
                  onClick={handleNotification}
                />
              </Badge>
            )}
            <Popover
              open={isPopoverOpen}
              anchorEl={anchorE1}
              onClose={handlePopOverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              anchorReference="anchorEl"
              PaperProps={{
                sx: {
                  width: POPOVER_WIDTH,
                  maxWidth: POPOVER_WIDTH,
                  minWidth: POPOVER_WIDTH,
                  overflowX: 'hidden'
                }
              }}
            >
              <Box sx={{
                width: POPOVER_WIDTH,
                maxWidth: POPOVER_WIDTH,
                minWidth: POPOVER_WIDTH,
              }}>
                <Card sx={{ width: '100%' }}>
                  <CardHeader
                    title={
                      <Typography variant='h5'>Notifications</Typography>
                    }
                    subheader={
                      <Typography variant='body1' color='white'>
                        {`You have ${Array.isArray(unReadNotifications) ? unReadNotifications.length : 0} unread messages`}
                      </Typography>
                    }
                    titleTypographyProps={{ variant: 'h5' }}
                    subheaderTypographyProps={{ variant: 'body2' }}
                    sx={{ backgroundColor: "#121C3E", color: "white" }}
                  />
                  <CardContent>
                    <SectionTitle variant='Overline' sx={{ fontWeight: 'bold', fontSize: '1rem' }}>New</SectionTitle>
                    {loading ? (
                      <p>Loading unread notifications</p>
                    ) : unReadNotifications.length > 0 ? (
                      <div style={{
                        maxHeight: '300px',
                        overflowY: 'auto',
                        backgroundColor: '#f9f9f9',
                        width: '100%',
                      }}>
                        {Array.isArray(unReadNotifications) && unReadNotifications.map((notification) => (
                          <ListItem key={notification.id}
                            sx={{
                              backgroundColor: '#fff',
                              '&:hover': {
                                backgroundColor: '#f1f1f1',
                                cursor: 'pointer'
                              }
                            }}
                          >
                            <ListItemText
                              primary={
                                <Typography variant='body1'>
                                  {notification.message.split("'").map((part, index) => {
                                    // If index is odd, it means this part was inside quotes
                                    return index % 2 === 1 ? (
                                      <span key={index} style={{ fontWeight: 'bold' }}>
                                        '{part}'
                                      </span>
                                    ) : (
                                      <span key={index}>{part}</span>
                                    );
                                  })}
                                </Typography>
                              }
                              secondary={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccessTimeIcon sx={{ fontSize: '1rem', marginRight: '4px' }} />
                                    <TimeStamp>{timeAgo(notification.createdAt)}</TimeStamp>
                                  </Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                                  </Box>
                                </Box>
                              }
                            />
                          </ListItem>
                        ))}
                      </div>
                    ) : (
                      <p>No Unread notifications available</p>
                    )}
                    <Box mt={2} textAlign="center">
                      <Button color="primary" onClick={() => navigate(PATHS.ALLNOTIFICATIONS)}>View all</Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>

            </Popover>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;