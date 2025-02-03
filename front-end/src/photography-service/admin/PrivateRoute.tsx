import React from 'react';
import { Navigate } from 'react-router-dom';

// Utility function to check if user is authenticated (e.g., checking for a JWT or token)
function isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return Boolean(token);
}

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    return children;
};

export default PrivateRoute;
