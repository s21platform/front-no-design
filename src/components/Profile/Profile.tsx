import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import NotificationWidget from "../Widgets/NotificationWidget/NotificationWidget";
import Chat from "../Chat/Chat";
import { ChatIntegrationType, ProfileProps, SubscriptionCount } from "./types";
import ProfileSkeleton from "../Skeletons/ProfileSkeleton/ProfileSkeleton";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    IconButton, InputAdornment, List, ListItem, ListItemText,
    Skeleton, TextField, Tooltip, Typography
} from "@mui/material";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AvatarBlock from "../Avatar/AvatarBlock";
import { AlternateEmail } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import ChatIcon from "@mui/icons-material/Chat";
import { SelectorOption, SelectorWithSearch } from "../SelectorWithSearch/SelectorWithSearch";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

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
    const [isChatIntegrationOpen, setIsChatIntegrationOpen] = useState<boolean>(false);
    // FIXME официальный кринж
    const [update, setUpdate] = useState<boolean>(false);
    
    const [chatIntegrationType, setChatIntegrationType] = useState<ChatIntegrationType>('rocket');
    const [rocketChatCredentials, setRocketChatCredentials] = useState({
        username: '',
        password: ''
    });
    
    const [rocketChatAuthData, setRocketChatAuthData] = useState<{
        userId: string;
        authToken: string;
    } | null>(null);
    const [rocketChatRooms, setRocketChatRooms] = useState<any[]>([]);
    const [rocketChatLoading, setRocketChatLoading] = useState<boolean>(false);
    const [rocketChatError, setRocketChatError] = useState<string | null>(null);


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

    const handleIntegrationDialogOpen = () => {
        setIsChatIntegrationOpen(true);
        setRocketChatRooms([]);
        setRocketChatError(null);
    };

    const handleRocketChatInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setRocketChatCredentials({
            ...rocketChatCredentials,
            [field]: e.target.value
        });
    };

    const handleConnectToRocketChat = async () => {
        try {
            setRocketChatLoading(true);
            setRocketChatError(null);
            
            // 1. Авторизация через REST API
            const response = await axios.post(
                'https://rocketchat-student.21-school.ru/api/v1/login', 
                {
                    user: rocketChatCredentials.username,
                    password: rocketChatCredentials.password
                }
            );
            
            if (response.data.status === 'success') {
                const { userId, authToken } = response.data.data;
                setRocketChatAuthData({ userId, authToken });
                
                // 2. Получение списка комнат
                const roomsResponse = await axios.get(
                    'https://rocketchat-student.21-school.ru/api/v1/rooms.get',
                    {
                        headers: {
                            'X-Auth-Token': authToken,
                            'X-User-Id': userId
                        }
                    }
                );
                
                setRocketChatRooms(roomsResponse.data.update || []);
            } else {
                setRocketChatError('Ошибка авторизации');
            }
        } catch (error: any) {
            console.error('Ошибка при подключении к RocketChat:', error);
            setRocketChatError(error.response?.data?.message || 'Ошибка подключения к серверу');
        } finally {
            setRocketChatLoading(false);
        }
    };

    const handleSaveChatIntegration = async () => {
        try {
            await axios.post(ApiRoutes.chatIntegration(chatIntegrationType), {
                ...rocketChatCredentials,
                serverUrl: 'rocketchat-student.21-school.ru'
            }, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            
            setIsChatIntegrationOpen(false);
            setUpdate(!update);
        } catch (error) {
            console.error('Ошибка при настройке интеграции:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
                {/* Левая колонка с фото и кнопками */}
                {/*<SideProfile avatarUrl={profileData.avatar} avatarChange={avatarChange}/>*/}
                <ProfileMenu />
                {/* Центральная колонка с информацией */}
                <div className="w-3/4 p-6 relative">
                    {/* Кнопка редактирования профиля */}
                    <div className="absolute top-0 right-0 mt-2 mr-4 flex flex-row items-center">
                        <IconButton
                            onClick={() => setIsOpen(true)}
                        >
                            <EditIcon />
                        </IconButton>
                        <Tooltip title="Интеграция с чатами">
                            <IconButton
                                onClick={handleIntegrationDialogOpen}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Tooltip>
                        <div>
                            <NotificationWidget />
                        </div>
                    </div>
                    {/* Первый блок информации */}
                    {loading ? <ProfileSkeleton />
                        : <div className="mb-6 flex flex-row items-center justify-start">
                            <AvatarBlock initialAvatarUrl={profileData.avatar} />
                            {/*<h4 className="text-xl font-semibold mb-4">Основная информация</h4>*/}
                            <div className="ml-2">
                                {!!profileData.name && <p><strong>Имя:</strong> {profileData.name}</p>}
                                {!!profileData.birthdate &&
                                    <p><strong>Дата рождения:</strong> {profileData.birthdate}</p>}
                                {!!profileData.telegram && <p><strong>Telegram:</strong> <a
                                    href={`https://t.me/${profileData.telegram?.substring(1)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline">{profileData.telegram}</a>
                                </p>}
                            </div>
                        </div>
                    }


                    {/* Второй блок информации */}
                    {loading ? <ProfileSkeleton />
                        : <div>
                            {Object.keys(profileData).length > 0 &&
                                <>
                                    <h4 className="text-xl font-semibold mb-4">Дополнительная информация</h4>
                                    {loading ? <Loader /> :
                                        <div>
                                            {!!profileData.git &&
                                                <p><strong>GitHub: </strong>
                                                    <a href={`https://github.com/${profileData.git}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline">{profileData.git}</a>
                                                </p>
                                            }
                                            {!!profileData.os &&
                                                <p><strong>Операционная
                                                    система:</strong> {profileData.os.label ?? "Отсутсвует"}
                                                </p>
                                            }
                                        </div>
                                    }
                                </>
                            }
                            <Chat />
                        </div>
                    }
                    {loadingSubscribe ? <Skeleton />
                        : <div className="flex space-x-4 mt-4">
                            <div className="text-center">
                                <span className="font-bold">{friendsCount.followersCount ?? "Отсутсвует"}</span>
                                <p className="text-sm text-gray-600">Подписчиков</p>
                            </div>
                            <div className="text-center">
                                <span className="font-bold">{friendsCount.followingCount ?? "Отсутсвует"}</span>
                                <p className="text-sm text-gray-600">Подписок</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <Dialog open={isOpen} maxWidth={"sm"}>
                <DialogTitle>Редактирование</DialogTitle>
                <DialogContent>
                    <Box>
                        <FormControl style={{ gap: "10px" }}>
                            {/*<InputLabel>Имя и Фамилия</InputLabel>*/}
                            <TextField
                                onChange={(e) => handleInputChange(e, "name")}
                                value={editProfile.name}
                                variant="outlined"
                                label={"Имя и Фамилия"}
                                margin="dense"
                                fullWidth
                            />
                            <TextField
                                type={"date"}
                                label={"Дата рождения"}
                                value={editProfile.birthdate}
                                // value={"2022-09-16"}
                                onChange={(e) => handleInputChange(e, "birthdate")} />
                            <TextField
                                type="text"
                                label={"Telegram"}
                                value={editProfile.telegram}
                                onChange={(e) => handleInputChange(e, "telegram")}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AlternateEmail />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                            <TextField
                                onChange={(e) => handleInputChange(e, "git")}
                                value={editProfile.git}
                                variant="outlined"
                                label={"Github"}
                                margin="dense"
                                fullWidth
                            />
                            <SelectorWithSearch
                                url={ApiRoutes.optionOs()}
                                onChange={handleOptionChange}
                                // TODO: подставлять value с сервера
                                value={profileData.os ?? {
                                    id: 0,
                                    label: ""
                                }}
                            />
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>
                        Выйти
                    </Button>
                    <Button onClick={() => handleSaveProfile()}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог интеграции с чатами */}
            <Dialog open={isChatIntegrationOpen} maxWidth={"sm"} fullWidth>
                <DialogTitle>Интеграция с RocketChat</DialogTitle>
                <DialogContent>
                    <Box>
                        <p className="mb-4">Настройка подключения к серверу: rocketchat-student.21-school.ru</p>
                        <FormControl style={{ gap: "10px" }} fullWidth>
                            <TextField
                                onChange={(e) => handleRocketChatInputChange(e, "username")}
                                value={rocketChatCredentials.username}
                                variant="outlined"
                                label={"Имя пользователя"}
                                margin="dense"
                                fullWidth
                            />
                            <TextField
                                type="password"
                                onChange={(e) => handleRocketChatInputChange(e, "password")}
                                value={rocketChatCredentials.password}
                                variant="outlined"
                                label={"Пароль"}
                                margin="dense"
                                fullWidth
                            />
                            
                            {rocketChatError && (
                                <Typography color="error" variant="body2" className="mt-2">
                                    {rocketChatError}
                                </Typography>
                            )}
                            
                            {rocketChatLoading && <Loader />}
                            
                            {rocketChatRooms.length > 0 && (
                                <Box className="mt-4">
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Ваши чаты:
                                    </Typography>
                                    <List>
                                        {rocketChatRooms.map((room) => (
                                            <ListItem key={room._id}>
                                                <ListItemText 
                                                    primary={room.name || room.fname || 'Без названия'} 
                                                    secondary={room.t === 'd' ? 'Личное сообщение' : 'Канал'} 
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsChatIntegrationOpen(false)}>
                        Отмена
                    </Button>
                    {rocketChatRooms.length === 0 ? (
                        <Button onClick={handleConnectToRocketChat} disabled={rocketChatLoading}>
                            Подключиться
                        </Button>
                    ) : (
                        <Button onClick={handleSaveChatIntegration}>
                            Сохранить
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Profile;
