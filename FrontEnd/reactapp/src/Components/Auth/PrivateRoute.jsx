import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PATHS } from '../../constants/paths';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();
    const { user, hasRole, refreshUserToken, isAuthenticated } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuthAndRefresh = async () => {
            if (!isAuthenticated && localStorage.getItem('refreshToken')) {
                try {
                    await refreshUserToken();
                } catch (error) {
                    console.error('Token refresh failed:', error);
                }
            }
            setIsChecking(false);
        };

        checkAuthAndRefresh();
    }, [isAuthenticated, refreshUserToken]);

    if (isChecking) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        // Redirect to login page with return URL
        return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
    }

    // If roles are specified but user doesn't have any of the required roles
    if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
        // Redirect to unauthorized page or home page
        return <Navigate to={PATHS.UNAUTHORIZED} replace />;
    }

    return children;
};

export default PrivateRoute;
