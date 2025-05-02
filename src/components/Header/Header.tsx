import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";
import axios from "axios";
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

const Header = () => {
    const { isAuth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        axios.get(ApiRoutes.logout(), {
            withCredentials: true,
        }).then(data => {
            if (data.status === 200) {
                setAuth(false);
                navigate(AppRoutes.main());
            }
        })
            .catch(err => {
                console.warn(err)
            });
    }
    return (
        <AppBar position="static">
            <Container>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Логотип или название */}
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        <Link to={AppRoutes.main()} style={{ textDecoration: 'none', color: 'white' }}>
                            Space 21
                        </Link>
                    </Typography>

                    {/* Навигационные ссылки */}
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
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Header;
