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
    const [registrationUuid, setRegistrationUuid] = useState<string>('');

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
            // Выполняем GET запрос на проверку email с query параметром
            const response = await axios.get(ApiRoutes.checkEmail(), {
                params: {
                    email: email
                }
            });
            const isAvailable = response.data.is_available;
            setEmailChecked(isAvailable);
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
            // Отправляем запрос на отправку кода подтверждения
            const response = await axios.post(ApiRoutes.sendCode(), {
                email
            });

            // Сохраняем uuid из ответа для последующего использования при подтверждении кода
            const uuid = response.data.uuid;
            setRegistrationUuid(uuid);

            // Показываем поле для ввода кода
            setCodeStepVisible(true);
            setNotification({
                message: "Код подтверждения отправлен на указанный email",
                type: "success"
            });
        } catch (error) {
            console.error("Error sending verification code:", error);
            setNotification({
                message: "Ошибка при отправке кода подтверждения",
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
            // Отправляем запрос на регистрацию
            const registerResponse = await axios.post(ApiRoutes.registerUser(), {
                email,
                password,
                confirm_password: confirmPassword,
                code: verificationCode,
                code_lookup_uuid: registrationUuid
            });

            if (registerResponse.status === 200) {
                // После успешной регистрации выполняем автоматический вход
                try {
                    const loginResponse = await axios.post(ApiRoutes.login(), {
                        login: email,
                        password: password,
                    });

                    if (loginResponse.status === 200) {
                        const currentTime = Date.now();
                        const expiryTime = currentTime + 10 * 60 * 60 * 1000;
                        localStorage.setItem("expiry", expiryTime.toString());
                        localStorage.setItem("access_token", loginResponse.data.access_token);

                        setNotification({
                            message: "Регистрация успешна! Выполняется вход...",
                            type: "success"
                        });

                        // После успешного входа вызываем колбэк
                        setTimeout(() => onSuccess(), 1500);
                    }
                } catch (loginError) {
                    console.error("Error during auto-login:", loginError);
                    setNotification({
                        message: "Регистрация успешна, но не удалось выполнить автоматический вход. Пожалуйста, войдите вручную.",
                        type: "error"
                    });
                    setTimeout(() => onSuccess(), 1500);
                }
            }
        } catch (error: any) {
            console.error("Error during registration:", error);
            let errorMessage = "Ошибка при регистрации";
            if (error.response?.data) {
                errorMessage = error.response.data;
            }
            setNotification({
                message: errorMessage,
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
