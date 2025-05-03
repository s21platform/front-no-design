import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../Notification/Notification";
import { ApiRoutes } from "../../lib/routes";
import { 
  Box, 
  CircularProgress, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  InputAdornment, 
  IconButton,
  Divider,
  Collapse
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle, Cancel } from '@mui/icons-material';

interface IRegisterForm {
    onSuccess: () => void;
    onSwitchToLogin: () => void;
}

const RegisterForm = ({ onSuccess, onSwitchToLogin }: IRegisterForm) => {
    // Состояния для полей формы
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    
    // Состояния для UI
    const [codeStepVisible, setCodeStepVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
    const [emailCheckLoading, setEmailCheckLoading] = useState<boolean>(false);
    const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
    
    const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

    // Проверка совпадения паролей
    useEffect(() => {
        if (confirmPassword) {
            setPasswordsMatch(password === confirmPassword);
        } else {
            setPasswordsMatch(null);
        }
    }, [password, confirmPassword]);

    // Проверка доступности email при потере фокуса
    const checkEmail = async () => {
        if (!email) return;
        
        // Базовая валидация структуры email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidFormat = emailRegex.test(email);
        
        if (!isValidFormat) {
            setEmailChecked(false);
            return;
        }
        
        setEmailCheckLoading(true);
        
        try {
            // Мок запроса на сервер с задержкой
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // Имитация запроса к API с мок-ответом
            // Для демонстрации всегда возвращаем успех, если формат email корректный
            console.log(`Mocked API call to ${ApiRoutes.checkEmail()} with email: ${email}`);
            
            // Реальный запрос будет выглядеть примерно так:
            /*
            const response = await axios.post(ApiRoutes.checkEmail(), { email });
            const isAvailable = response.data.available;
            setEmailChecked(isAvailable);
            */
            
            // Для мока просто подтверждаем, что email доступен
            setEmailChecked(true);
            
        } catch (error) {
            console.error("Error checking email:", error);
            setNotification({
                message: "Ошибка при проверке email",
                type: "error"
            });
            setEmailChecked(false);
        } finally {
            setEmailCheckLoading(false);
        }
    };

    // Отправка данных для регистрации
    const handleRegister = async () => {
        if (!email || !password || password !== confirmPassword) {
            setNotification({
                message: "Пожалуйста, заполните все поля и убедитесь, что пароли совпадают",
                type: "error"
            });
            return;
        }
        
        setLoading(true);
        
        try {
            // Мок отправки данных для регистрации
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Показываем поле для ввода кода
            setCodeStepVisible(true);
            setNotification({
                message: "Код подтверждения отправлен на указанный email",
                type: "success"
            });
            
            // Реальный запрос будет выглядеть примерно так:
            /*
            await axios.post(ApiRoutes.signup(), { 
                email, 
                password 
            });
            */
        } catch (error) {
            setNotification({
                message: "Ошибка при регистрации",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    // Подтверждение кода верификации
    const handleVerify = async () => {
        if (!verificationCode || verificationCode.length < 4) {
            setNotification({
                message: "Введите корректный код подтверждения",
                type: "error"
            });
            return;
        }
        
        setLoading(true);
        
        try {
            // Мок отправки кода верификации
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setNotification({
                message: "Регистрация успешно завершена",
                type: "success"
            });
            
            // После успешной регистрации вызываем колбэк
            setTimeout(() => onSuccess(), 1500);
            
            // Реальный запрос будет выглядеть примерно так:
            /*
            await axios.post(ApiRoutes.confirmVerification(), { 
                email, 
                password,
                verificationCode 
            });
            */
        } catch (error) {
            setNotification({
                message: "Ошибка при подтверждении кода",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <>
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    width: '100%'
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    align="center" 
                    fontWeight="bold" 
                    gutterBottom
                >
                    Регистрация
                </Typography>
                
                {/* Поля для ввода почты и пароля */}
                <Box sx={{ mt: 3 }}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={checkEmail}
                        margin="normal"
                        required
                        placeholder="example@mail.com"
                        disabled={codeStepVisible}
                        error={emailChecked === false}
                        helperText={emailChecked === false ? (email.includes('@') ? "Email уже занят" : "Некорректный формат email") : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {emailCheckLoading && <CircularProgress size={20} />}
                                    {!emailCheckLoading && emailChecked === true && (
                                        <CheckCircle color="success" />
                                    )}
                                    {!emailCheckLoading && emailChecked === false && (
                                        <Cancel color="error" />
                                    )}
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        id="password"
                        label="Пароль"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        required
                        placeholder="Минимум 6 символов"
                        disabled={codeStepVisible}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        disabled={codeStepVisible}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <TextField
                        id="confirm-password"
                        label="Подтвердите пароль"
                        type={showPassword ? 'text' : 'password'}
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                        placeholder="Повторите пароль"
                        disabled={codeStepVisible}
                        error={passwordsMatch === false}
                        helperText={passwordsMatch === false ? "Пароли не совпадают" : ""}
                    />

                    {!codeStepVisible && (
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading || emailChecked === false || passwordsMatch === false}
                            onClick={handleRegister}
                            sx={{ mt: 3 }}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Загрузка
                                    <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
                                </Box>
                            ) : (
                                'Продолжить'
                            )}
                        </Button>
                    )}
                </Box>
                
                {/* Разделитель между шагами */}
                {codeStepVisible && (
                    <Divider sx={{ my: 3 }} />
                )}
                
                {/* Поле для ввода кода верификации */}
                <Collapse in={codeStepVisible}>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1" gutterBottom>
                            Мы отправили код подтверждения на <strong>{email}</strong>
                        </Typography>
                        
                        <TextField
                            id="verification-code"
                            label="Код подтверждения"
                            variant="outlined"
                            fullWidth
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            margin="normal"
                            required
                            placeholder="Введите код из письма"
                            InputProps={{
                                inputProps: { maxLength: 6 }
                            }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={loading || !verificationCode}
                            onClick={handleVerify}
                            sx={{ mt: 3 }}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Загрузка
                                    <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
                                </Box>
                            ) : (
                                'Зарегистрироваться'
                            )}
                        </Button>
                    </Box>
                </Collapse>
                
                {!codeStepVisible && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Button 
                            variant="text" 
                            onClick={onSwitchToLogin}
                            sx={{ 
                                textTransform: 'none',
                                color: 'secondary.main',
                                fontWeight: 'medium',
                                '&:hover': {
                                    backgroundColor: 'rgba(79, 70, 229, 0.08)'
                                }
                            }}
                        >
                            Уже есть аккаунт? Войти
                        </Button>
                    </Box>
                )}
            </Paper>
            
            {notification &&
                <Notification
                    message={notification?.message}
                    type={notification?.type}
                    onClose={() => setNotification(null)}
                />
            }
        </>
    );
};

export default RegisterForm; 