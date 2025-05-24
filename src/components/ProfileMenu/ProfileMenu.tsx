import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Typography, useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PeopleIcon from '@mui/icons-material/People';
import CampaignIcon from '@mui/icons-material/Campaign';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';

export const ProfileMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const menuItems = [
        { 
            title: "Мой профиль", 
            path: "/profile", 
            icon: <PersonIcon /> 
        },
        { 
            title: "Поиск пиров", 
            path: "/peer-search", 
            icon: <PersonSearchIcon /> 
        },
        { 
            title: "Сообщества", 
            path: "/society-search", 
            icon: <PeopleIcon /> 
        },
        { 
            title: "Чаты", 
            path: "/chat", 
            icon: <ChatIcon /> 
        },
        { 
            title: "Реклама", 
            path: "/adverts", 
            icon: <CampaignIcon /> 
        }
    ];

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <Paper 
            sx={{ 
                height: '100%', 
                bgcolor: 'background.paper',
                borderRadius: 0,
                boxShadow: 'none',
                borderRight: `1px solid ${theme.palette.divider}`
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        mb: 2, 
                        fontWeight: 'bold',
                        px: 1
                    }}
                >
                    Навигация
                </Typography>
                <List sx={{ p: 0 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{ 
                                    mb: 1,
                                    bgcolor: isActive(item.path) ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: isActive(item.path) 
                                            ? 'rgba(79, 70, 229, 0.2)' 
                                            : 'rgba(255, 255, 255, 0.05)'
                                    }
                                }}
                            >
                                <ListItemIcon 
                                    sx={{ 
                                        minWidth: '40px',
                                        color: isActive(item.path) ? 'secondary.main' : 'text.secondary'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.title} 
                                    primaryTypographyProps={{
                                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                        color: isActive(item.path) ? 'secondary.main' : 'text.primary'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Paper>
    );
};

export default ProfileMenu;
