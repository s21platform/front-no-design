import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ApiRoutes } from './const/apiRoutes';
import Loader from '../../components/Loader/Loader';
import { Box } from '@mui/material';

interface AuthContextProps {
	isAuth: boolean | null;
	setAuth: (isAuth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		axios
			.get(ApiRoutes.checkAuth(), { withCredentials: true })
			.then((data) => setIsAuth(data.data.isAuthenticated))
			.catch((err) => {
				if (err.response?.status === 401) {
					setIsAuth(false);
				}
			})
			.finally(() => setLoading(false));;
	}, []);

	if (loading) {
		return (
			<Box display={"flex"} height={"100vh"} justifyContent={"center"}>
				<Loader />
			</Box>
		);
	}

	return (
		<AuthContext.Provider value={{ isAuth, setAuth: setIsAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextProps => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
