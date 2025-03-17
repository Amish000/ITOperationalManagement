import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from '../constants/paths';
import { ROLES } from '../constants/roles';
import Login from '../Components/Auth/Login';
import Register from '../Components/Auth/Register';
import Unauthorized from '../Components/Auth/Unauthorized';
import AddUser from '../Components/Users/AddUser';
import PrivateRoute from '../Components/Auth/PrivateRoute';
import ServiceTicket from '../Components/ServiceTicket';
import AddTicket from '../Components/Pages/AddTicket';
import Profile from '../Components/Pages/Profile';
import ITServiceList from '../Components/Pages/ITServiceList';
import DashBoard from '../Components/Pages/DashBoard';
import ServiceTicketListActive from '../Components/Pages/ServiceTicketActive';
import ServiceTicketList from '../Components/Pages/ServiceTicketList';
import ServiceTicketSettled from '../Components/Pages/ServiceTicketSettled';
import AllNotifications from '../Components/Pages/AllNotifications';
import AddServices from '../Components/Pages/AddServices';
import ActiveServices from '../Components/Pages/ITActiveServices';
import ExpiredServices from '../Components/Pages/ITExpiredServices';
import PageNotFound from '../Components/Pages/404PageNotFound';
import ManageUsers from '../Components/Pages/ManageUsers';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path={PATHS.LOGIN} element={<Login />} />
            <Route path={PATHS.UNAUTHORIZED} element={<Unauthorized />} />
            <Route path={PATHS.SERVICE_TICKET} elements={<ServiceTicket />} />

            {/* Protected Routes */}
            <Route path={PATHS.REGISTER} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <Register />
                </PrivateRoute>
            } />

            <Route path={PATHS.ADD_USER} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <AddUser />
                </PrivateRoute>
            } />

            <Route path={PATHS.HOME} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.USER]}>
                    <DashBoard />
                </PrivateRoute>
            } />

            <Route path={PATHS.ADD_TICKET} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.USER]}>
                    <AddTicket />
                </PrivateRoute>
            } />

            <Route path={PATHS.PROFILE} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]}>
                    <Profile />
                </PrivateRoute>
            } />

            <Route path={PATHS.SERVICE_TICKET_LIST} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.USER]}>
                    <ServiceTicketList />
                </PrivateRoute>
            } />

            <Route path={PATHS.IT_SERVICE_LIST} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <ITServiceList />
                </PrivateRoute>
            } />

            <Route path={PATHS.DASHBOARD} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]}>
                    <DashBoard />
                </PrivateRoute>
            } />

            <Route path={PATHS.SERVICE_TICKET_LIST_ACTIVE} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]}>
                    <ServiceTicketListActive />
                </PrivateRoute>
            } />

            <Route path={PATHS.SERVICE_TICKET_LIST_SETTLED} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]}>
                    <ServiceTicketSettled />
                </PrivateRoute>
            } />

            <Route path={PATHS.ALLNOTIFICATIONS} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.USER]}>
                    <AllNotifications />
                </PrivateRoute>
            } />


            <Route path={PATHS.ADD_SERVICES} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <AddServices />
                </PrivateRoute>
            } />

            <Route path={PATHS.ACTIVE_SERVICES} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <ActiveServices />
                </PrivateRoute>
            } />

            <Route path={PATHS.EXPIRED_SERVICES} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <ExpiredServices />
                </PrivateRoute>
            } />

            <Route path={PATHS.MANAGE_USERS} element={
                <PrivateRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                    <ManageUsers />
                </PrivateRoute>
            } />

            {/* Catch-all route - redirect to home if authenticated, login if not */}
            <Route path="*" element={
                <PrivateRoute>
                    <PageNotFound />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
