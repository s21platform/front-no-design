import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Loader from "../Loader/Loader";
import NotificationWidget from "../Widgets/NotificationWidget/NotificationWidget";
import Chat from "../Chat/Chat";
import {ProfileProps} from "./types";
import SideProfile from "./SideProfile/SideProfile";


const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileProps>({
        avatar: "",
    })
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get("/api/profile", {
            withCredentials: true,
        }).then(data => {
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
    }, []);



    const avatarChange = (newUrl: string) => {
        setProfileData({...profileData, avatar: newUrl});
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
                {/* Левая колонка с фото и кнопками */}
                <SideProfile avatarUrl={profileData.avatar} avatarChange={avatarChange}/>
                {/* Центральная колонка с информацией */}
                <div className="w-3/4 p-6 relative">
                    {/* Кнопка редактирования профиля */}
                    <div className="absolute top-0 right-0 mt-2 mr-4 flex flex-row items-center">
                        <button
                            onClick={() => navigate("/edit")}
                            className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                        >
                            Редактировать профиль
                        </button>
                        <div>
                            <NotificationWidget/>
                        </div>
                    </div>

                    {/* Первый блок информации */}

                    <div className="mb-6">
                        <h4 className="text-xl font-semibold mb-4">Основная информация</h4>
                        {loading ? <Loader/> :
                            <div>
                                {!!profileData.name && <p><strong>Имя:</strong> {profileData.name}</p>}
                                {!!profileData.birthdate && <p><strong>Дата рождения:</strong> {profileData.birthdate}</p>}
                                {!!profileData.telegram && <p><strong>Telegram:</strong> <a
                                    href={`https://t.me/${profileData.telegram?.substring(1)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline">{profileData.telegram}</a>
                                </p>}
                            </div>
                        }
                    </div>

                    {/* Второй блок информации */}
                    <div>
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
                                        <p><strong>Операционная система:</strong> {profileData.os.name ?? "Отсутсвует"}
                                        </p>
                                    }
                                </div>
                            }
                        </>
                        }
                        <Chat/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
