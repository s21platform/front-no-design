import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationWidget from "../Widgets/NotificationWidget/NotificationWidget";
import {ProfileProps, SubscriptionCount, MyPersonality, ProfileBlock, ProfileItem} from "./types";
import ProfileSkeleton from "../Skeletons/ProfileSkeleton/ProfileSkeleton";
import ProfileBlockRenderer from "./ProfileBlockRenderer";
import { mockContactsBlock, mockAboutBlock } from "./mockData";
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
    Divider,
    Card,
    CardContent,
    Link,
    Chip,
    useTheme,
    FormControlLabel,
    Switch
} from "@mui/material";
import AvatarBlock from "../Avatar/AvatarBlock";
import EditIcon from "@mui/icons-material/Edit";
import GitHubIcon from "@mui/icons-material/GitHub";
import TelegramIcon from "@mui/icons-material/Telegram";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import ComputerIcon from "@mui/icons-material/Computer";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { SelectorOption, SelectorWithSearch } from "../SelectorWithSearch/SelectorWithSearch";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";
import { useThemeMode } from "../../App";
import api from "../../lib/api/api";


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const theme = useTheme();
    const { darkMode, toggleTheme } = useThemeMode();

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

    // Новые состояния для блоков профиля
    const [personalityBlock, setPersonalityBlock] = useState<ProfileBlock | null>(null);
    const [contactsBlock] = useState<ProfileBlock>(mockContactsBlock);
    const [aboutBlock] = useState<ProfileBlock>(mockAboutBlock);

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSubscribe, setLoadingSubscribe] = useState<boolean>(true);
    const [loadingPersonality, setLoadingPersonality] = useState<boolean>(true);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [update, setUpdate] = useState<boolean>(false);


    useEffect(() => {
        api.get(ApiRoutes.profile(), {
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
        api.get(ApiRoutes.friendsCount(), {
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

    // Загрузка данных personality блока
    useEffect(() => {
        api.get(ApiRoutes.personality(), {
            withCredentials: true,
        }).then((response) => {
            const personalityData: ProfileItem[] = response.data;
            console.log("data", response.data)
            setPersonalityBlock({
                title: 'Личность',
                items: personalityData
            });
        }).catch(err => {
            console.warn('Ошибка загрузки personality данных:', err);
            // В случае ошибки оставляем блок пустым
            setPersonalityBlock({
                title: 'Личность',
                items: []
            });
        }).finally(() => {
            setLoadingPersonality(false);
        })
    }, [update])

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
        api.put(ApiRoutes.profile(), sendData, {
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
        <>
            {/* Шапка профиля с аватаром и кнопками */}
            <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
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

                    {/* Аватар и базовая информация */}
                    {loading ? (
                        <ProfileSkeleton />
                    ) : (
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm="auto">
                                <AvatarBlock initialAvatarUrl={profileData.avatar} />
                            </Grid>
                            <Grid item xs={12} sm>
                                <Box>
                                    {(profileData.name && profileData.name.trim() !== "") && (
                                        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                                            {profileData.name}
                                        </Typography>
                                    )}
                                    {(profileData.nickname && profileData.nickname.trim() !== "") && (
                                        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                            @{profileData.nickname}
                                        </Typography>
                                    )}

                                    {/* Счетчики подписок */}
                                    {loadingSubscribe ? (
                                        <Skeleton width={200} height={60} />
                                    ) : (
                                        <Grid container spacing={2} sx={{ mt: 1 }}>
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
                                </Box>
                            </Grid>
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Блоки профиля */}
            <Grid container spacing={3}>
                {/* Personality блок */}
                <Grid item xs={12} md={6} lg={4}>
                    {loadingPersonality ? (
                        <ProfileSkeleton />
                    ) : personalityBlock && (
                        <ProfileBlockRenderer block={personalityBlock} />
                    )}
                </Grid>

                {/* Contacts блок */}
                <Grid item xs={12} md={6} lg={4}>
                    <ProfileBlockRenderer block={contactsBlock} />
                </Grid>

                {/* About блок */}
                <Grid item xs={12} md={6} lg={4}>
                    <ProfileBlockRenderer block={aboutBlock} />
                </Grid>
            </Grid>

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

                        {/* Переключатель темы */}
                        <Divider sx={{ my: 2 }} />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={darkMode}
                                    onChange={toggleTheme}
                                    color="secondary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {darkMode ? <DarkModeIcon sx={{ mr: 1 }} /> : <LightModeIcon sx={{ mr: 1 }} />}
                                    <Typography>
                                        {darkMode ? "Темная тема" : "Светлая тема"}
                                    </Typography>
                                </Box>
                            }
                            sx={{ ml: 0 }}
                        />
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
        </>
    );
};

export default Profile;
