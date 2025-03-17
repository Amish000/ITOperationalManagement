import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Dashboard } from '@mui/icons-material';
import { PowerSettingsNew } from '@mui/icons-material';
//import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import DoneIcon from '@mui/icons-material/Done';
import DescriptionIcon from '@mui/icons-material/Description';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import LoopIcon from '@mui/icons-material/Loop';
import ListIcon from '@mui/icons-material/List';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../constants/paths';
import { useAuth } from '../../contexts/AuthContext'
import { GetUserName } from '../../services/dashBoardService';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import ManageAccounts from '@mui/icons-material/ManageAccounts';

function Sidebar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const toggleDrawer = () => setOpen(!open);
  const roleString = localStorage.getItem('user'); // Retrieve the string from localStorage
  const role = roleString ? JSON.parse(roleString) : null; // Parse the string into an object
  const userRoles = role && role.roles ? role.roles : []; // Get the roles array from the user object

  const openLogoutDialog = () => {
    setOpenDialog(true);
  }

  const handleLogout = async () => {
    try {
      const result = await logout();
      console.log("Result of logout", result)
      if (result.success) {
        setOpenDialog(false);
        const redirectpath = PATHS.LOGIN;
        navigate(redirectpath);
      } else {
        console.log(result.error);
      }
    } catch (err) {
      console.error('Logout Error', err);
    }
  }

  const handleUserName = async () => {
    try {
      const result = await GetUserName();
      setUserName(result.data);
    }
    catch (err) {
      console.error('Error', err);
    }
  }

  useEffect(() => {
    handleUserName();
  }, []);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
    navigate(buttonName);
  }

  return (
    <Box>
      {/* Menu Button for Mobile */}
      {isMobile && (
        <IconButton
          sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
          onClick={toggleDrawer}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Drawer */}
      <Drawer
        anchor='left'
        sx={{
          '& .MuiDrawer-paper': {
            width: isMobile ? '100%' : '15%',
            flexShrink: 0,
            backgroundColor: '#88b840',
            color: 'white',
            paddingTop: '64px',
            marginTop: '95px',
            // zIndex: 1201,
            borderRadius: '0%',
          },
        }}
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={toggleDrawer}
      >
        {/* Profile Section */}
        <Box
          sx={{ padding: 2, display: 'flex', alignItems: 'center' }}
          onClick={() => navigate(PATHS.PROFILE)}
        >
          <AccountCircleIcon
            sx={{
              fontSize: "4rem",
              color: userRoles.includes("SuperAdmin") ? "white" : "white",
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>{userName}</Typography>
            <Typography variant="body2" sx={{ color: 'white' }}>{userRoles}</Typography>
          </Box>
        </Box>

        {/* Navigation Items */}
        <List>
          <ListItem> {/* Menu */}
            <Typography variant="body2" sx={{ color: 'white', fontSize: '1.5rem' }}>Menu</Typography>
          </ListItem>

          {/* Dashboard */}

          <ListItem
            button
            sx={{
              '&:hover': { backgroundColor: 'white', color: 'black' },
              backgroundColor: selectedButton === PATHS.HOME ? "white" : 'transparent',
              color: selectedButton === PATHS.HOME ? 'black' : 'white',
              // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
              border: selectedButton === PATHS.HOME ? '2px solid white' : 'none'
            }}
            onClick={() => handleButtonClick(PATHS.HOME)}
          >
            <Dashboard sx={{ marginRight: 2, marginLeft: 2, }} />
            <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>DashBoard</Typography>
          </ListItem>

          {/* Add User */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.ADD_USER ? "white" : 'transparent',
                color: selectedButton === PATHS.ADD_USER ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.ADD_USER ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.ADD_USER)}
            >
              <PersonAddIcon sx={{ marginRight: 2, marginLeft: 2, }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Add User</Typography>
            </ListItem>
          )}
          {/* Manage Users */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.MANAGE_USERS ? "white" : 'transparent',
                color: selectedButton === PATHS.MANAGE_USERS ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.MANAGE_USERS ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.MANAGE_USERS)}
            >
              <ManageAccounts sx={{ marginRight: 2, marginLeft: 2, }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Manage Users</Typography>
            </ListItem>
          )}
          {/* Important
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{ '&:hover': { backgroundColor: 'primary.dark' } }}
              onClick={() => navigate(PATHS.PROFILE)}
            >
              <NotificationImportantIcon sx={{ marginRight: 2, marginLeft: 2, }} />
              <Typography variant="body2" sx={{  fontSize: '1.2rem' }}>Important</Typography>
            </ListItem>
          )} */}

          {/* ServiceTicket */}
          <ListItem>
            <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Service Tickets</Typography>
          </ListItem>

          {/* Add Ticket */}
          {userRoles.includes("User") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.ADD_TICKET ? "white" : 'transparent',
                color: selectedButton === PATHS.ADD_TICKET ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.ADD_TICKET ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.ADD_TICKET)}
            >
              <AddIcon sx={{ marginRight: 2, marginLeft: 2, }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Add Ticket</Typography>
            </ListItem>
          )}

          {/* Active Tickets */}
          <ListItem
            button
            sx={{
              '&:hover': { backgroundColor: 'white', color: 'black' },
              backgroundColor: selectedButton === PATHS.SERVICE_TICKET_LIST_ACTIVE ? "white" : 'transparent',
              color: selectedButton === PATHS.SERVICE_TICKET_LIST_ACTIVE ? 'black' : 'white',
              // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
              border: selectedButton === PATHS.SERVICE_TICKET_LIST_ACTIVE ? '2px solid white' : 'none'
            }}
            onClick={() => handleButtonClick(PATHS.SERVICE_TICKET_LIST_ACTIVE)}
          >
            <ConfirmationNumberIcon sx={{ marginRight: 2, marginLeft: 2, }} />
            <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Active Tickets</Typography>
          </ListItem>

          {/* Settled Tickets */}
          <ListItem
            button
            sx={{
              '&:hover': { backgroundColor: 'white', color: 'black' },
              backgroundColor: selectedButton === PATHS.SERVICE_TICKET_LIST_SETTLED ? "white" : 'transparent',
              color: selectedButton === PATHS.SERVICE_TICKET_LIST_SETTLED ? 'black' : 'white',
              // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
              border: selectedButton === PATHS.SERVICE_TICKET_LIST_SETTLED ? '2px solid white' : 'none'
            }}
            onClick={() => handleButtonClick(PATHS.SERVICE_TICKET_LIST_SETTLED)}
          >
            <DoneIcon sx={{ marginRight: 2, marginLeft: 2, }} />
            <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Settled Tickets</Typography>
          </ListItem>
          {/* All Tickets */}
          <ListItem
            button
            sx={{
              '&:hover': { backgroundColor: 'white', color: 'black' },
              backgroundColor: selectedButton === PATHS.SERVICE_TICKET_LIST ? "white" : 'transparent',
              color: selectedButton === PATHS.SERVICE_TICKET_LIST ? 'black' : 'white',
              // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
              border: selectedButton === PATHS.SERVICE_TICKET_LIST ? '2px solid white' : 'none'
            }}
            onClick={() => handleButtonClick(PATHS.SERVICE_TICKET_LIST)}
          >
            <DescriptionIcon sx={{ marginRight: 2, marginLeft: 2 }} />
            <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>All Tickets</Typography>
          </ListItem>

          {/* IT services */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem>
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>IT services</Typography>
            </ListItem>
          )}

          {/*Add Service */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.ADD_SERVICES ? "white" : 'transparent',
                color: selectedButton === PATHS.ADD_SERVICES ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.ADD_SERVICES ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.ADD_SERVICES)}
            >
              <AddIcon sx={{ marginRight: 2, marginLeft: 2 }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Add Service</Typography>
            </ListItem>
          )}
          {/* Active Services */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.ACTIVE_SERVICES ? "white" : 'transparent',
                color: selectedButton === PATHS.ACTIVE_SERVICES ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.ACTIVE_SERVICES ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.ACTIVE_SERVICES)}
            >
              <DesktopWindowsIcon sx={{ marginRight: 2, marginLeft: 2 }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Active Services</Typography>
            </ListItem>
          )}

          {/* Expired Services */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.EXPIRED_SERVICES ? "white" : 'transparent',
                color: selectedButton === PATHS.EXPIRED_SERVICES ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.EXPIRED_SERVICES ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.EXPIRED_SERVICES)}
            >
              <LoopIcon sx={{ marginRight: 2, marginLeft: 2 }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>Expired Services</Typography>

            </ListItem>
          )}

          {/* All Services */}
          {userRoles.includes("SuperAdmin") && (
            <ListItem
              button
              sx={{
                '&:hover': { backgroundColor: 'white', color: 'black' },
                backgroundColor: selectedButton === PATHS.IT_SERVICE_LIST ? "white" : 'transparent',
                color: selectedButton === PATHS.IT_SERVICE_LIST ? 'black' : 'white',
                // backgroundColor: selectedButton === PATHS.HOME ? 'white' : 'transparent',
                border: selectedButton === PATHS.IT_SERVICE_LIST ? '2px solid white' : 'none'
              }}
              onClick={() => handleButtonClick(PATHS.IT_SERVICE_LIST)}
            >
              <ListIcon sx={{ marginRight: 2, marginLeft: 2 }} />
              <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>All Services</Typography>
            </ListItem>
          )}
        </List>

        {/*Logout*/}
        <Box sx={{ padding: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => openLogoutDialog()} // Replace with your logout logic
            sx={{ backgroundColor: "white", color: "black", fontWeight: "500" }}
          >
            <PowerSettingsNew sx={{ marginRight: 1, color: 'black' }} />
            Logout
          </Button>
        </Box>
      </Drawer>
      {/* Confirmation Dialog */}
      < Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          <Typography fontSize="1.2rem">Confirm Logout</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to Logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            <Typography sx={{ color: "#3F861E" }}>
              Cancel
            </Typography>
          </Button>
          <Button onClick={handleLogout} color="secondary">
            <Typography sx={{ color: "#FF0000" }}>
              Logout
            </Typography>
          </Button>
        </DialogActions>
      </Dialog >
    </Box>
  );
}

export default Sidebar;