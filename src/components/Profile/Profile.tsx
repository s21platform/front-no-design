import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import Avatar from "../Avatar/Avatar";
import Loader from "../Loader/Loader";

type ProfileProps = {
    nickname: string;
    name?: string;
    surname?: string;
    birthdate?: {
        day: string;
        month: string;
        year: string;
    };
    city?: string;
    gitLink?: string;
    os?: string;
    work?: string;
    university?: string;
    skills?: string[];
    hobbies?: string[];
    avatar: string;
    followersCount?: number;
    followingCount?: number;
    phone?: string;
    telegram?: string;
    email?: string;
};

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileProps>({
        nickname: "",
        avatar: "https://i.pravatar.cc/150?img=3",
    })
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        axios.get("/api/profile", {
            withCredentials: true,
        }).then(data => {
            setProfileData(data.data)
            console.log(data);
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
                <div className="w-1/4 bg-gray-50 p-6 flex flex-col items-center">
                    {loading ? <Loader/> : <Avatar initialAvatarUrl={profileData.avatar} onAvatarChange={avatarChange}/>}
                    <div className="flex space-x-4 mt-4">
                        <div className="text-center">
                            <span className="font-bold">{profileData.followersCount ?? "Отсутсвует"}</span>
                            <p className="text-sm text-gray-600">Подписчиков</p>
                        </div>
                        <div className="text-center">
                            <span className="font-bold">{profileData.followingCount ?? "Отсутсвует"}</span>
                            <p className="text-sm text-gray-600">Подписок</p>
                        </div>
                    </div>
                    <button
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        onClick={() => alert("В разработке")}
                    >
                        Поиск людей
                    </button>
                </div>

                {/* Центральная колонка с информацией */}
                <div className="w-3/4 p-6 relative">
                    {/* Кнопка редактирования профиля */}
                    <button
                        onClick={() => navigate("/edit")}
                        className="absolute top-0 right-0 mt-2 mr-2 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                    >
                        Редактировать профиль
                    </button>
                    {/* Первый блок информации */}

                    <div className="mb-6">
                        <h4 className="text-xl font-semibold mb-4">Основная информация</h4>
                        {loading ? <Loader/> :
                            <div>
                                <p>
                                    <strong>Имя:</strong> {profileData.name ?? profileData.nickname} {profileData.surname ?? null}
                                </p>
                                <p><strong>Дата рождения:</strong> {profileData.birthdate ? `${profileData.birthdate.day} ${profileData.birthdate.month} ${profileData.birthdate.year}` : "Отсутсвует"}
                                </p>
                                <p><strong>Город:</strong> {profileData.city ?? "Отсутсвует"}</p>
                                <p><strong>Telegram:</strong> <a
                                    href={`https://t.me/${profileData.telegram?.substring(1)}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline">{profileData.telegram}</a>
                                </p>
                            </div>
                        }
                    </div>

                    {/* Второй блок информации */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Дополнительная информация</h4>
                        {loading ? <Loader/> :
                            <div>
                                <p><strong>GitHub:</strong>
                                    {profileData.gitLink ??
                                        <a href={profileData.gitLink}
                                           target="_blank"
                                           rel="noopener noreferrer"
                                           className="text-blue-500 hover:underline">{profileData.gitLink}</a>
                                    }
                                </p>
                                <p><strong>Операционная система:</strong> {profileData.os ?? "Отсутсвует"}</p>
                                <p><strong>Место работы:</strong> {profileData.work ?? "Отсутсвует"}</p>
                                <p><strong>Место учебы:</strong> {profileData.university ?? "Отсутсвует"}</p>
                                <p><strong>Навыки:</strong> {profileData.skills?.join(", ")}</p>
                                <p><strong>Хобби:</strong> {profileData.hobbies?.join(", ")}</p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
