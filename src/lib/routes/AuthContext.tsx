import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ApiRoutes } from './const/apiRoutes';

interface AuthContextProps {
	isAuth: boolean | null;
	setAuth: (isAuth: boolean) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isAuth, setIsAuth] = useState<boolean | null>(null);

	useEffect(() => {
		axios
			.get(ApiRoutes.checkAuth(), { withCredentials: true })
			.then((data) => setIsAuth(data.data.isAuthenticated))
			.catch((err) => {
				if (err.response?.status === 401) {
					setIsAuth(false);
				}
			});
	}, []);

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
