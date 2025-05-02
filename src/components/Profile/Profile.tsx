import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import NotificationWidget from "../Widgets/NotificationWidget/NotificationWidget";
import Chat from "../Chat/Chat";
import { ProfileProps, SubscriptionCount } from "./types";
import ProfileSkeleton from "../Skeletons/ProfileSkeleton/ProfileSkeleton";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, 
    FormControl,
    IconButton, 
    InputAdornment,
    Skeleton, 
    TextField,
    Typography,
    Grid,
    Paper,
    Divider,
    Container,
    Card,
    CardContent,
    Link,
    Chip,
    useTheme
} from "@mui/material";
import AvatarBlock from "../Avatar/AvatarBlock";
import { AlternateEmail } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import ComputerIcon from "@mui/icons-material/Computer";
import { SelectorOption, SelectorWithSearch } from "../SelectorWithSearch/SelectorWithSearch";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const theme = useTheme();

    const [profileData, setProfileData] = useState<ProfileProps>({
        avatar: "",
    })
    const [editProfile, setEditProfile] = useState<ProfileProps>({
        avatar: "",
    })
    const [friendsCount, setFriendsCount] = useState<SubscriptionCount>({
        followersCount: 0,
        followingCount: 0
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSubscribe, setLoadingSubscribe] = useState<boolean>(true);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);


    useEffect(() => {
        axios.get(ApiRoutes.profile(), {
            withCredentials: true,
        }).then(data => {
            setEditProfile(data.data)
            if (data.data.birthdate) {
                const birthdayFull = new Date(data.data.birthdate)
                const day = String(birthdayFull.getDate()).padStart(2, "0");
                const month = String(birthdayFull.getMonth() + 1).padStart(2, "0");
                const year = birthdayFull.getFullYear();
                const birthday = `${day}.${month}.${year}`;
                data.data = { ...data.data, birthdate: birthday };
            }
            setProfileData(data.data)
            setLoading(false);
        }).catch(err => {
            if (err.status === 401) {
                setAuth(false);
                navigate(AppRoutes.profile())
            }
            console.warn(err)
        })
    }, [update]);

    useEffect(() => {
        axios.get(ApiRoutes.friendsCount(), {
            withCredentials: true
        }).then(data => {
            setFriendsCount({
                followersCount: data.data.subscribers ?? 0,
                followingCount: data.data.subscription ?? 0,
            })
        }).catch(err => {
            console.warn(err)
        }).finally(() => {
            setLoadingSubscribe(false);
        })
    }, [])

    const handleOptionChange = (selectedOption: SelectorOption | null) => {
        setEditProfile({
            ...editProfile,
            "os": selectedOption
        })
        console.log("Выбранное значение:", selectedOption);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const value = e.target.value;
        setEditProfile({
            ...editProfile,
            [field]: value,
        });
        console.log(value, typeof value);
    };

    const handleSaveProfile = () => {
        const sendData = { ...editProfile }
        if (sendData.birthdate) {
            sendData.birthdate = new Date(sendData.birthdate ?? "").toISOString()
        }
        axios.put(ApiRoutes.profile(), sendData, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(data => {
            if (data.status === 200 && data.data.status) {
                setUpdate(!update)
                setIsOpen(false);
                console.log(editProfile)
            }
        })
            .catch(err => console.log(err))
    };

    return (
        <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardContent sx={{ p: 3, position: 'relative' }}>
                {/* Кнопки редактирования и уведомлений */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', alignItems: 'center' }}>
                    <IconButton 
                        onClick={() => setIsOpen(true)}
                        sx={{ mr: 1 }}
                    >
                        <EditIcon />
                    </IconButton>
                    <NotificationWidget />
                </Box>

                {/* Профиль пользователя */}
                {loading ? (
                    <ProfileSkeleton />
                ) : (
                    <Box sx={{ mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm="auto">
                                <AvatarBlock initialAvatarUrl={profileData.avatar} />
                            </Grid>
                            <Grid item xs={12} sm>
                                <Box>
                                    {profileData.name && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Имя:</strong> {profileData.name}
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {profileData.birthdate && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <CakeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Дата рождения:</strong> {profileData.birthdate}
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {profileData.telegram && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <TelegramIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Telegram:</strong>{' '}
                                                <Link 
                                                    href={`https://t.me/${profileData.telegram?.substring(1)}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    color="secondary"
                                                >
                                                    {profileData.telegram}
                                                </Link>
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Дополнительная информация */}
                {loading ? (
                    <ProfileSkeleton />
                ) : (
                    <Box sx={{ mb: 4 }}>
                        {Object.keys(profileData).length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom>
                                    Дополнительная информация
                                </Typography>
                                
                                <Box sx={{ mb: 3 }}>
                                    {profileData.git && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>GitHub:</strong>{' '}
                                                <Link 
                                                    href={`https://github.com/${profileData.git}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    color="secondary"
                                                >
                                                    {profileData.git}
                                                </Link>
                                            </Typography>
                                        </Box>
                                    )}
                                    
                                    {profileData.os && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                            <ComputerIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body1">
                                                <strong>Операционная система:</strong> {profileData.os.label ?? "Отсутсвует"}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </>
                        )}
                        
                        <Box sx={{ mt: 3 }}>
                            <Chat />
                        </Box>
                    </Box>
                )}

                {/* Счетчики подписок */}
                {loadingSubscribe ? (
                    <Skeleton width={200} height={60} />
                ) : (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item>
                            <Chip 
                                label={
                                    <Box sx={{ p: 0.5 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Подписчиков
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            {friendsCount.followersCount}
                                        </Typography>
                                    </Box>
                                }
                                variant="outlined"
                                sx={{ 
                                    height: 'auto', 
                                    borderRadius: 2,
                                    p: 1
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Chip 
                                label={
                                    <Box sx={{ p: 0.5 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Подписок
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            {friendsCount.followingCount}
                                        </Typography>
                                    </Box>
                                }
                                variant="outlined"
                                sx={{ 
                                    height: 'auto', 
                                    borderRadius: 2,
                                    p: 1
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </CardContent>
            
            {/* Диалог редактирования профиля */}
            <Dialog 
                open={isOpen} 
                onClose={() => setIsOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6">Редактирование профиля</Typography>
                </DialogTitle>
                
                <DialogContent dividers>
                    <Box sx={{ py: 1 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                onChange={(e) => handleInputChange(e, "name")}
                                value={editProfile.name || ''}
                                variant="outlined"
                                label="Имя и Фамилия"
                                margin="dense"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                type="date"
                                label="Дата рождения"
                                value={editProfile.birthdate || ''}
                                onChange={(e) => handleInputChange(e, "birthdate")}
                                fullWidth
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CakeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                type="text"
                                label="Telegram"
                                value={editProfile.telegram || ''}
                                onChange={(e) => handleInputChange(e, "telegram")}
                                fullWidth
                                margin="dense"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TelegramIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                onChange={(e) => handleInputChange(e, "git")}
                                value={editProfile.git || ''}
                                variant="outlined"
                                label="GitHub"
                                margin="dense"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <GitHubIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <SelectorWithSearch
                                url={ApiRoutes.optionOs()}
                                onChange={handleOptionChange}
                                value={editProfile.os}
                            />
                            <Typography variant="caption" sx={{ mt: 0.5, ml: 2 }}>
                                Операционная система
                            </Typography>
                        </FormControl>
                    </Box>
                </DialogContent>
                
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button 
                        onClick={() => setIsOpen(false)} 
                        color="inherit"
                        variant="outlined"
                    >
                        Отмена
                    </Button>
                    <Button 
                        onClick={handleSaveProfile} 
                        color="primary"
                        variant="contained"
                    >
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};

export default Profile;
