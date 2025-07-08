import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiRoutes } from './const/apiRoutes';
import Loader from '../../components/Loader/Loader';
import { Box } from '@mui/material';
import api from "../api/api";
import axios from "axios";

interface AuthContextProps {
	isAuth: boolean | null;
	setAuth: (isAuth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuth, setIsAuth] = useState<boolean | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshToken = async () => {
		const response = await axios.post('/auth/refresh', null, {
			withCredentials: true
		});
		localStorage.setItem('access_token', response.data.access_token);

		const currentTime = Date.now();
		const expiryTime = currentTime + 15 * 60 * 1000;
		localStorage.setItem("token_expires_at", expiryTime.toString());
	};


	useEffect(() => {
		const token = localStorage.getItem('access_token');
		const expiresAt = localStorage.getItem('token_expires_at');

		// Устанавливаем true только если есть токен И время не истекло
		let isValidToken = token !== null &&
			expiresAt !== null &&
			Date.now() <= parseInt(expiresAt);

		if (!isValidToken) {
			refreshToken().then(() => setIsAuth(true));
			isValidToken = false;
		}

		console.log(isValidToken);
		setIsAuth(isValidToken);
		setLoading(false);
		// api
		// 	.get(ApiRoutes.checkAuth(), { withCredentials: true })
		// 	.then((data) => setIsAuth(data.data.isAuthenticated))
		// 	.catch((err) => {
		// 		if (err.response?.status === 401) {
		// 			setIsAuth(false);
		// 		}
		// 	})
		// 	.finally(() => setLoading(false));;
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
