import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import isLoggedIn from '../utils/isLoggedIn';


export default function ProtectedRoutes() {
    return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
}