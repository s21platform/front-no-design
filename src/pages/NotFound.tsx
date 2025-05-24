import React from 'react';
import { Box, Typography, Button, Container, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../lib/routes';
import Header from '../components/Header/Header';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Header />
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: 'calc(100vh - 64px)', // Вычитаем высоту шапки
          display: 'flex',
          flexDirection: 'column',
          bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#121212',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        <Container 
          maxWidth="lg" 
          sx={{ 
            flexGrow: 1,
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'stretch', 
            justifyContent: 'space-between',
            py: { xs: 4, md: 8 },
            height: '100%'
          }}
        >
          {/* Левый блок с текстом и фоновым 404 */}
          <Box 
            sx={{ 
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
              mb: { xs: 4, md: 0 },
              pr: { xs: 0, md: 4 },
              overflow: 'hidden'
            }}
          >
            {/* Фоновая цифра 404 */}
            <Typography 
              variant="h1" 
              sx={{ 
                position: 'absolute',
                fontSize: { xs: '150px', sm: '200px', md: '300px' },
                fontWeight: 900,
                opacity: 0.15,
                color: '#ffffff',
                zIndex: 0,
                userSelect: 'none',
                bottom: { xs: '-20%', md: 'auto' },
                top: { xs: 'auto', md: '50%' },
                left: '50%',
                transform: { xs: 'translateX(-50%)', md: 'translate(-50%, -50%)' },
                width: '100%',
                textAlign: 'center',
              }}
            >
              404
            </Typography>
            
            {/* Контент с текстами и кнопкой */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                textAlign: { xs: 'center', md: 'left' },
                px: { xs: 2, md: 0 }
              }}
            >
              <Typography 
                variant="h3" 
                color="white" 
                sx={{ 
                  mb: 2, 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Страница не работает
              </Typography>
              
              <Typography 
                variant="body1" 
                color="rgba(255,255,255,0.7)" 
                sx={{ 
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Пока мы заняты её поисками, но мы скоро это поправим!
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}
              >
                <Button 
                  variant="outlined" 
                  color="primary"
                  size="large"
                  onClick={() => navigate(AppRoutes.main())}
                  sx={{
                    borderRadius: '9999px',
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 'normal',
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Окак, на главную
                </Button>
              </Box>
            </Box>
          </Box>
          
          {/* Правый блок с изображением */}
          <Box 
            sx={{ 
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Box 
              component="img"
              src="https://storage.yandexcloud.net/space21/not_found.webp"
              alt="Страница не найдена"
              sx={{ 
                maxWidth: '100%',
                maxHeight: { xs: '300px', sm: '400px', md: '500px' },
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.5))'
              }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFound; 