import React from "react";
import { Box, Grid, Container } from "@mui/material";
import Header from "../Header/Header";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      
      <Box sx={{ flex: 1, display: 'flex', mt: 0 }}>
        <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
          <Grid container spacing={0} sx={{ minHeight: '85vh' }}>
            {/* Сайдбар с меню */}
            <Grid item xs={12} md={3} lg={2.5}>
              <Box sx={{ height: '100%', position: 'sticky', top: '1rem' }}>
                <ProfileMenu />
              </Box>
            </Grid>
            
            {/* Основное содержимое */}
            <Grid item xs={12} md={9} lg={9.5}>
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