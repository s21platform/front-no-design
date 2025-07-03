import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, useMediaQuery, useTheme, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import api from "../../lib/api/api";

const Header = () => {
    const { isAuth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        api.get(ApiRoutes.logout(), {
            withCredentials: true,
        }).then(data => {
            if (data.status === 200) {
                setAuth(false);
                navigate(AppRoutes.main());
            }
            if (isMobile) {
                handleClose();
            }
        })
            .catch(err => {
                console.warn(err)
            });
    }

    const navigateTo = (path: string) => {
        navigate(path);
        if (isMobile) {
            handleClose();
        }
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Логотип или название */}
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        <Link to={AppRoutes.main()} style={{ textDecoration: 'none', color: 'white' }}>
                            Space 21
                        </Link>
                    </Typography>

                    {/* Мобильное меню */}
                    {isMobile ? (
                        <Box>
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                {location.pathname !== AppRoutes.main() && (
                                    <MenuItem onClick={() => navigateTo(AppRoutes.main())}>Главная</MenuItem>
                                )}
                                <MenuItem onClick={() => navigateTo(AppRoutes.profile())}>Профиль</MenuItem>
                                {isAuth && (
                                    <MenuItem onClick={logout}>Выход</MenuItem>
                                )}
                            </Menu>
                        </Box>
                    ) : (
                        /* Десктопное меню */
                        <Box>
                            {location.pathname !== AppRoutes.main() && (
                                <Button
                                    color="inherit"
                                    component={Link}
                                    to={AppRoutes.main()}
                                >
                                    Главная
                                </Button>
                            )}
                            <Button
                                color="inherit"
                                component={Link}
                                to={AppRoutes.profile()}
                            >
                                Профиль
                            </Button>
                            {isAuth && (
                                <Button
                                    color="inherit"
                                    onClick={logout}
                                >
                                    Выход
                                </Button>
                            )}
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header;
