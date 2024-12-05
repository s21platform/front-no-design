import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import NotificationWidget from "../Widgets/NotificationWidget/NotificationWidget";
import Chat from "../Chat/Chat";
import {ProfileProps} from "./types";
import ProfileSkeleton from "../Skeletons/ProfileSkeleton/ProfileSkeleton";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    IconButton, Input, InputAdornment, InputLabel,
    Paper,
    Skeleton, TextField
} from "@mui/material";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AvatarBlock from "../Avatar/AvatarBlock";
import {AlternateEmail, Edit} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { SelectorOption, SelectorWithSearch } from "../SelectorWithSearch/SelectorWithSearch";


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileProps>({
        avatar: "",
    })
    const [editProfile, setEditProfile] = useState<ProfileProps>({
        avatar: "",
    })
    const [loading, setLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    // FIXME официальный кринж
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {
        axios.get("/api/profile", {
            withCredentials: true,
        }).then(data => {
            setEditProfile(data.data)
            if (data.data.birthdate) {
                const birthdayFull = new Date(data.data.birthdate)
                const day = String(birthdayFull.getDate()).padStart(2, "0");
                const month = String(birthdayFull.getMonth() + 1).padStart(2, "0");
                const year = birthdayFull.getFullYear();
                const birthday = `${day}.${month}.${year}`;
                data.data = {...data.data, birthdate: birthday};
            }
            setProfileData(data.data)
            setLoading(false);
        }).catch(err => {
            if (err.status === 401) {
                console.log("remove expiry")
                localStorage.removeItem("expiry");
                navigate("/profile")
            }
            console.warn(err)
        })
    }, [update]);



    const avatarChange = (newUrl: string) => {
        setProfileData({...profileData, avatar: newUrl});
    }

    const handleOptionChange = (selectedOption: SelectorOption | null) => {
        setEditProfile({
            ...editProfile,
            "os": selectedOption
        })
        console.log("Выбранное значение:", selectedOption);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        let value = e.target.value;
        setEditProfile({
            ...editProfile,
            [field]: value,
        });
        console.log(value, typeof value);
    };

    const handleSaveProfile = () => {
        const sendData = {...editProfile}
        if (sendData.birthdate) {
            sendData.birthdate = new Date(sendData.birthdate ?? "").toISOString()
        }
        axios.put("/api/profile", sendData, {
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
                        <div>
                            <NotificationWidget/>
                        </div>
                    </div>
                    {/* Первый блок информации */}
                    {loading ? <ProfileSkeleton/>
                        : <div className="mb-6 flex flex-row items-center justify-start">
                            <AvatarBlock initialAvatarUrl={profileData.avatar}/>
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
                    {loading ? <ProfileSkeleton/>
                        : <div>
                            {Object.keys(profileData).length > 0 &&
                                <>
                                    <h4 className="text-xl font-semibold mb-4">Дополнительная информация</h4>
                                    {loading ? <Loader/> :
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
                            <Chat/>
                        </div>
                    }

                </div>
            </div>
            <Dialog open={isOpen} maxWidth={"sm"}>
                <DialogTitle>Редактирование</DialogTitle>
                <DialogContent>
                    <Box>
                        <FormControl style={{gap: "10px"}}>
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
                                onChange={(e) => handleInputChange(e, "birthdate")}/>
                            <TextField
                                type="text"
                                label={"Telegram"}
                                value={editProfile.telegram}
                                onChange={(e) => handleInputChange(e, "telegram")}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AlternateEmail/>
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
                                url="api/option/os"
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
        </div>
    );
};

export default Profile;
