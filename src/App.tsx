import { Route, Routes } from 'react-router-dom';
import MainPage from "./pages/Main";
import ProfilePage from "./pages/Profile";
import SocietyAddingPage from './pages/SocietyAddingPage';
import PeerPage from "./components/PeerPage/PeerPage";
import PeerSearch from './components/PeerSearch/PeerSearch';
import { AppRoutes, AuthProvider, PrivateRoute } from './lib/routes';
import { SocietySearch } from './components/SocietySearch/SocietySearch';
import { SocietyPage } from './components/SocietyPage/SocietyPage';
import { AdvertSearch } from './components/AdvertSearch/AdvertSearch';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AuthLayout from './components/layouts/AuthLayout';
import Header from './components/Header/Header';

// Создание темы Material-UI
const theme = createTheme({
  palette: {
    mode: 'dark', // Включаем темную тему
    primary: {
      main: '#000000', // черный цвет как основной
    },
    secondary: {
      main: '#4f46e5', // индиго как вторичный цвет
    },
    background: {
      default: '#121212', // стандартный цвет фона для темной темы
      paper: '#1e1e1e', // цвет фона для карточек и других компонентов
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none', // отключаем автоматический UPPERCASE для кнопок
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // убираем тень, чтобы заголовок был более плоским
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // убираем стандартный градиент в темной теме
        },
      },
    },
  },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline /> {/* Сбрасывает CSS стили браузера для консистентного отображения */}
            <AuthProvider>
                <NotificationProvider>
                    <Routes>
                        {/* Публичные маршруты */}
                        <Route 
                            path={AppRoutes.main()} 
                            element={
                                <>
                                    <Header />
                                    <MainPage />
                                </>
                            } 
                        />

                        {/* Маршруты, требующие авторизации */}
                        <Route element={<PrivateRoute />}>
                            <Route element={<AuthLayout />}>
                                <Route path={AppRoutes.profile()} element={<ProfilePage />} />
                                <Route path={AppRoutes.newSociety()} element={<SocietyAddingPage />} />
                                <Route path={AppRoutes.peerSearch()} element={<PeerSearch />} />
                                <Route path={AppRoutes.peer()} element={<PeerPage />} />
                                <Route path={AppRoutes.societySearch()} element={<SocietySearch />} />
                                <Route path={AppRoutes.society()} element={<SocietyPage />} />
                                <Route path={AppRoutes.advertSearch()} element={<AdvertSearch />} />
                            </Route>
                        </Route>

                        {/*/!* Fallback для всех несуществующих роутов *!/*/}
                        {/*<Route path="*" element={<div>Not Found Page</div>}/>*/}
                    </Routes>
                </NotificationProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
