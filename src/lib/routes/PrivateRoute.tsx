import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../../components/Loader/Loader';
import { AppRoutes } from './const/appRoutes';

const PrivateRoute = () => {
	const { isAuth } = useAuth();

	if (isAuth === null) {
		return <Loader />;
	}

	return isAuth ? <Outlet /> : <Navigate to={AppRoutes.login()} />;
};

export default PrivateRoute;
