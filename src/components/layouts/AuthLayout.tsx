import React, { useState } from "react";
import { 
  Box, 
  Grid, 
  Container, 
  Drawer, 
  IconButton, 
  useMediaQuery, 
  useTheme, 
  Fab 
} from "@mui/material";
import Header from "../Header/Header";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { Outlet } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const AuthLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      
      <Box sx={{ flex: 1, display: 'flex', mt: 0 }}>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={0} sx={{ minHeight: '85vh' }}>
            {/* Сайдбар с меню - для десктопа */}
            {!isMobile && (
              <Grid item xs={12} md={3} lg={2.5}>
                <Box sx={{ height: '100%', position: 'sticky', top: '1rem' }}>
                  <ProfileMenu />
                </Box>
              </Grid>
            )}
            
            {/* Кнопка меню для мобильных устройств */}
            {isMobile && (
              <Fab 
                color="primary" 
                size="medium" 
                aria-label="menu"
                onClick={toggleDrawer}
                sx={{ 
                  position: 'fixed', 
                  bottom: 16, 
                  left: 16, 
                  zIndex: 1050 
                }}
              >
                <MenuIcon />
              </Fab>
            )}

            {/* Выдвижное меню для мобильных устройств */}
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer}
              sx={{
                '& .MuiDrawer-paper': {
                  width: 280,
                  bgcolor: 'background.default',
                  p: 2
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <ProfileMenu />
            </Drawer>
            
            {/* Основное содержимое */}
            <Grid item xs={12} md={isMobile ? 12 : 9} lg={isMobile ? 12 : 9.5}>
              <Box
                component="main"
                sx={{
                  height: '100%',
                  width: '100%',
                  px: { xs: 1, md: 3 }
                }}
              >
                <Outlet />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout; 