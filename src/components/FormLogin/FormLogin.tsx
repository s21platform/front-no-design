import React, { useState } from "react";
import Notification from "../Notification/Notification";
import { ApiRoutes } from "../../lib/routes";
import {
  Box,
  CircularProgress,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from "../../lib/api/api";

interface ILoginForm {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    onSwitchToRegister?: () => void;
}

const FormLogin = ({ setIsLoggedIn, onSwitchToRegister }: ILoginForm) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

    const handleLogin = (event?: React.FormEvent) => {
        if (event) {
            event.preventDefault();
        }

        if (!username || !password) {
            setNotification({
                message: "Введите имя пользователя и пароль",
                type: "error"
            });
            return;
        }

        setLoading(true);
        api.post(ApiRoutes.login(), {
            login: username,
            password: password,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200) {
                const currentTime = Date.now();
                const expiryTime = currentTime + 10 * 60 * 60 * 1000;

                localStorage.setItem("expiry", expiryTime.toString());
                setIsLoggedIn(true);
                setNotification({
                    message: "Успешная авторизация",
                    type: "success"
                })
            }
        }).catch(err => {
            let mess = err.message
            if (err.response?.data) {
                mess = err.response.data
            }
            setNotification({
                message: mess,
                type: "error"
            })
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            bgcolor: 'background.paper'
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Войти
                        </Typography>
                        <form onSubmit={handleLogin}>
                            <Box sx={{ mt: 3 }}>
                                {/* Поле для username */}
                                <TextField
                                    id="username"
                                    label="Имя пользователя"
                                    variant="outlined"
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    margin="normal"
                                    required
                                    placeholder="Введите имя пользователя"
                                    onKeyDown={handleKeyDown}
                                />

                                {/* Поле для password */}
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
                                    placeholder="Введите пароль"
                                    onKeyDown={handleKeyDown}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                {/* Кнопка Submit */}
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={loading}
                                    onClick={handleLogin}
                                    type="submit"
                                    sx={{ mt: 3 }}
                                >
                                    {loading ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            Загрузка
                                            <CircularProgress size={20} color="inherit" sx={{ ml: 1 }} />
                                        </Box>
                                    ) : (
                                        'Войти'
                                    )}
                                </Button>

                                {onSwitchToRegister && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Button
                                            variant="text"
                                            onClick={onSwitchToRegister}
                                            sx={{
                                                textTransform: 'none',
                                                color: 'secondary.main',
                                                fontWeight: 'medium',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(79, 70, 229, 0.08)'
                                                }
                                            }}
                                        >
                                            Нет аккаунта? Зарегистрироваться
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </form>
                    </Paper>
                </Container>
            </Box>
            {notification &&
                <Notification
                    message={notification?.message}
                    type={notification?.type}
                    onClose={() => setNotification(null)}
                />
            }
        </>
    )
}

export default FormLogin
