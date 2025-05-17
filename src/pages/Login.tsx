import React, { useState } from 'react';
import { Box, Container, Tabs, Tab, styled } from '@mui/material';
import FormLogin from '../components/FormLogin/FormLogin';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import { useAuth } from '../lib/routes';
import { Navigate } from 'react-router-dom';
import { AppRoutes } from '../lib/routes/const/appRoutes';
import Header from '../components/Header/Header';

// Стилизованный компонент для вкладок
const StyledTabs = styled(Tabs)(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    '& .MuiTabs-indicator': {
        backgroundColor: theme.palette.secondary.main,
        height: 3
    }
}));

// Стилизованный компонент для вкладки
const StyledTab = styled(Tab)(({ theme }) => ({
    textTransform: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginRight: theme.spacing(4),
    minWidth: 0,
    padding: theme.spacing(2, 0),
    '&.Mui-selected': {
        color: theme.palette.secondary.main,
        fontWeight: 700,
    },
    '&:hover': {
        color: theme.palette.secondary.light,
        opacity: 1,
    }
}));

const LoginPage = () => {
    const { isAuth, setAuth } = useAuth();
    const [activeTab, setActiveTab] = useState<number>(0);
    
    // Если пользователь уже авторизован, перенаправляем на профиль
    if (isAuth) {
        return <Navigate to={AppRoutes.profile()} />;
    }
    
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };
    
    const handleSwitchToLogin = () => {
        setActiveTab(0);
    };
    
    const handleRegistrationSuccess = () => {
        // После успешной регистрации показываем форму входа
        setActiveTab(0);
    };
    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Container maxWidth="sm" sx={{ py: 4 }}>
                    <Box sx={{ width: '100%', mb: 3 }}>
                        <StyledTabs 
                            value={activeTab} 
                            onChange={handleTabChange} 
                            variant="fullWidth"
                            sx={{ mb: 2 }}
                        >
                            <StyledTab label="Вход" />
                            <StyledTab label="Регистрация" />
                        </StyledTabs>
                    </Box>
                    
                    {activeTab === 0 && (
                        <FormLogin 
                            setIsLoggedIn={setAuth} 
                            onSwitchToRegister={() => setActiveTab(1)}
                        />
                    )}
                    
                    {activeTab === 1 && (
                        <RegisterForm 
                            onSuccess={handleRegistrationSuccess}
                            onSwitchToLogin={handleSwitchToLogin}
                        />
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default LoginPage; 