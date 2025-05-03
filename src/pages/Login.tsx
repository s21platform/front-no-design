import React from 'react';
import { Box, Container } from '@mui/material';
import FormLogin from '../components/FormLogin/FormLogin';
import { useAuth } from '../lib/routes';
import { Navigate } from 'react-router-dom';
import { AppRoutes } from '../lib/routes/const/appRoutes';
import Header from '../components/Header/Header';

const LoginPage = () => {
    const { isAuth, setAuth } = useAuth();
    
    // Если пользователь уже авторизован, перенаправляем на профиль
    if (isAuth) {
        return <Navigate to={AppRoutes.profile()} />;
    }
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container maxWidth="sm" sx={{ py: 4 }}>
                    <FormLogin setIsLoggedIn={setAuth} />
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage; 