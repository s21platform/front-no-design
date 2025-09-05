import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationWidget from "../Widgets/NotificationWidget/NotificationWidget";
import {ProfileProps, SubscriptionCount, MyPersonality, ProfileBlock, ProfileItem, AttributeItem, UserAttributesResponse, PROFILE_ATTRIBUTE_IDS} from "./types";
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
import DynamicFormField from "./DynamicFormField";


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

    // Состояния для динамических атрибутов формы
    const [formAttributes, setFormAttributes] = useState<AttributeItem[]>([]);
    const [formValues, setFormValues] = useState<Record<number, any>>({});
    const [loadingFormAttributes, setLoadingFormAttributes] = useState<boolean>(true);

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

    // Загрузка атрибутов для формы редактирования
    useEffect(() => {
        const attributeIds = PROFILE_ATTRIBUTE_IDS.join(',');
        api.get(`${ApiRoutes.userAttributes()}?attribute_ids=${attributeIds}`, {
            withCredentials: true,
        }).then((response: { data: UserAttributesResponse }) => {
            const attributes = response.data.data;
            setFormAttributes(attributes);
            
            // Инициализируем значения формы
            const initialValues: Record<number, any> = {};
            attributes.forEach(attr => {
                switch (attr.type) {
                    case 'INTEGER':
                        initialValues[attr.attribute_id] = attr.value_int;
                        break;
                    case 'DATE':
                        initialValues[attr.attribute_id] = attr.value_date;
                        break;
                    case 'BOOLEAN':
                        initialValues[attr.attribute_id] = attr.value_string === 'true';
                        break;
                    default:
                        initialValues[attr.attribute_id] = attr.value_string;
                        break;
                }
            });
            setFormValues(initialValues);
        }).catch(err => {
            console.warn('Ошибка загрузки атрибутов формы:', err);
        }).finally(() => {
            setLoadingFormAttributes(false);
        });
    }, [update]);

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

    const handleAttributeChange = (attributeId: number, value: any) => {
        setFormValues(prev => ({
            ...prev,
            [attributeId]: value
        }));
    };

    const handleSaveProfile = () => {
        const sendData = { ...editProfile }
        if (sendData.birthdate) {
            sendData.birthdate = new Date(sendData.birthdate ?? "").toISOString()
        }
        
        // Добавляем данные динамических атрибутов
        const attributesData = formAttributes.map(attr => {
            const value = formValues[attr.attribute_id];
            return {
                attribute_id: attr.attribute_id,
                value: value
            };
        });

        // Отправляем данные профиля
        api.put(ApiRoutes.profile(), sendData, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(data => {
            if (data.status === 200 && data.data.status) {
                // Здесь можно добавить отправку атрибутов, если есть соответствующий API
                console.log('Атрибуты для отправки:', attributesData);
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
                        {/* Динамические поля из API */}
                        {loadingFormAttributes ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <TextField
                                        key={i}
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        disabled
                                        placeholder="Загрузка..."
                                    />
                                ))}
                            </Box>
                        ) : (
                            formAttributes.map((attribute) => (
                                <DynamicFormField
                                    key={attribute.attribute_id}
                                    attribute={attribute}
                                    value={formValues[attribute.attribute_id]}
                                    onChange={handleAttributeChange}
                                />
                            ))
                        )}

                        {/* Поле выбора ОС (оставляем как было) */}
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
