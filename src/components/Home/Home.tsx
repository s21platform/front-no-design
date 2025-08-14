import React, {useState} from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  Button,
  Grid,
  Avatar,
  Stack,
  Paper,
  useTheme
} from "@mui/material";
import { styled } from "@mui/material/styles";



// Моковые данные пользователей и проектов
const mockUsers = [
    {
        id: 1,
        name: "Алексей Петров",
        jobTitle: "Frontend Developer",
        avatar: "https://i.pravatar.cc/150?img=1",
        description: "Опытный разработчик с фокусом на React и Vue.",
        projects: ["Project Tracker", "UI Kit Library"],
    },
    {
        id: 2,
        name: "Мария Иванова",
        jobTitle: "Backend Developer",
        avatar: "https://i.pravatar.cc/150?img=2",
        description: "Специалист по Python и Go, облачные решения.",
        projects: ["API Gateway", "Serverless Functions"],
    },
    {
        id: 3,
        name: "Иван Сидоров",
        jobTitle: "DevOps Engineer",
        avatar: "https://i.pravatar.cc/150?img=3",
        description: "DevOps энтузиаст, Kubernetes и Docker.",
        projects: ["CI/CD Pipeline", "Infrastructure as Code"],
    },
];

// Компонент для отображения пользователя
const UserCard: React.FC<{
    name: string;
    jobTitle: string;
    avatar: string;
    description: string;
    projects: string[];
}> = ({ name, jobTitle, avatar, description, projects }) => {
    return (
        <Card sx={{ display: 'flex', p: 2, height: '100%', bgcolor: 'background.paper' }}>
            <Avatar
                src={avatar}
                alt={name}
                sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
                <Typography variant="h6" component="div">{name}</Typography>
                <Typography variant="body2" color="text.secondary">{jobTitle}</Typography>
                <Typography variant="body2" mt={1}>{description}</Typography>
                <Box mt={1}>
                    <Typography variant="body2" fontWeight="bold">Проекты:</Typography>
                    <ul style={{ marginLeft: '16px', paddingLeft: 0 }}>
                        {projects.map((project, index) => (
                            <li key={index}>
                                <Typography variant="body2" color="text.secondary">
                                    {project}
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </Box>
            </Box>
        </Card>
    );
};

// Оригинальный функционал платформы (закомментирован на время разработки)
/*
const features = [
    {
        title: "Нетворкинг",
        icon: "👥",
        description: "Общайтесь с ИТ-профессионалами, присоединяйтесь к сообществам и расширяйте свою профессиональную сеть."
    },
    {
        title: "Обучение",
        icon: "📚",
        description: "Получите доступ к курсам, руководствам и ресурсам для улучшения навыков и актуальным технологиям."
    },
    {
        title: "Отдых",
        icon: "🎮",
        description: "Наслаждайтесь тематическими развлечениями, играми и активностями, созданными специально для ИТ-специалистов."
    },
    {
        title: "Дискуссии",
        icon: "💬",
        description: "Участвуйте в форумах и обсуждениях о новейших технологиях, вызовах и решениях в ИТ-сфере."
    },
    {
        title: "Мероприятия",
        icon: "🌎",
        description: "Узнавайте и участвуйте в технологических конференциях, вебинарах и встречах по всему миру."
    },
    {
        title: "Вакансии",
        icon: "💼",
        description: "Находите новые возможности и связывайтесь с компаниями, ищущими специалистов с вашими навыками."
    }
];
*/

// Моковые данные для блоков функционала (на время разработки)
const features = [
    {
        title: "Функционал 1",
        icon: "🔧",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris."
    },
    {
        title: "Функционал 2",
        icon: "⚙️",
        description: "Fusce auctor, mi et pulvinar tristique, nulla massa dignissim turpis, vel egestas sem nunc eget ex."
    },
    {
        title: "Функционал 3",
        icon: "🛠️",
        description: "Sed tempor quam in nulla scelerisque, in bibendum eros pellentesque. Vivamus sagittis."
    },
    {
        title: "Функционал 4",
        icon: "📊",
        description: "Etiam vitae justo et enim fringilla convallis. Maecenas efficitur purus non faucibus gravida."
    },
    {
        title: "Функционал 5",
        icon: "📱",
        description: "Proin sed dui in lorem lobortis pharetra. Vestibulum ante ipsum primis in faucibus."
    },
    {
        title: "Функционал 6",
        icon: "💻",
        description: "Curabitur consequat mollis dolor, a lobortis arcu viverra in. Donec a magna fermentum."
    }
];

// Стилизованный компонент для предоставления демо-изображения
const StyledBox = styled(Box)(({ theme }) => ({
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    border: `1px solid ${theme.palette.divider}`,
}));

const Home: React.FC = () => {
    const theme = useTheme();

    return (
        <Box>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(180deg, #000000 0%, rgba(79, 70, 229, 0.3) 50%, #1e1e1e 100%)',
                    color: 'white',
                    pt: 8,
                    pb: 12,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="overline"
                            component="div"
                            sx={{
                                display: 'inline-block',
                                bgcolor: 'rgba(255,255,255,0.1)',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '16px',
                                mb: 2
                            }}
                        >
                            Для ИТ-специалистов
                        </Typography>
                    </Box>

                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                        Общение. Обучение. Отдых.
                    </Typography>

                    <Typography variant="h6" color="rgba(255,255,255,0.7)" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
                        Тестовая площадка для общения и обмена опытом между разработчиками
                    </Typography>

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: 'white',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.9)'
                                }
                            }}
                        >
                            Начать
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: 'white',
                                color: 'white',
                                '&:hover': {
                                    borderColor: 'rgba(255,255,255,0.9)',
                                    bgcolor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            Узнать больше
                        </Button>
                    </Stack>
                </Container>
            </Box>

            {/* Platform Features Section */}
            <Box sx={{ py: 8, bgcolor: 'background.default' }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        textAlign="center"
                        fontWeight="bold"
                        gutterBottom
                    >
                        Ключевые возможности
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        textAlign="center"
                        sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}
                    >
                        Набор инструментов, необходимых для комфортной работы на платформе
                    </Typography>

                    <Grid container spacing={3}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 3,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        bgcolor: theme.palette.background.paper,
                                        border: `1px solid ${theme.palette.divider}`
                                    }}
                                >
                                    <Typography
                                        variant="h3"
                                        component="div"
                                        sx={{ mb: 1 }}
                                    >
                                        {feature.icon}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Image Placeholder */}
                    <StyledBox>
                        <Typography variant="body1" color="text.secondary">
                            Место для изображения
                        </Typography>
                    </StyledBox>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;
