import React from "react";
import {useNavigate} from "react-router-dom";

type ProfileProps = {
    fullName: string;
    birthDate: string;
    city: string;
    gitLink: string;
    operatingSystem: string;
    workPlace: string;
    education: string;
    skills: string[];
    hobbies: string[];
    avatarUrl: string;
    followersCount: number;
    followingCount: number;
    phone: string;
    telegram: string;
    email: string;
};

const Profile: React.FC = () => {
    const navigate = useNavigate();

    const profileData: ProfileProps = {
        fullName: "Иван Иванов",
        birthDate: "01.01.1990",
        city: "Москва",
        telegram: "@Dreamc0il",
        gitLink: "https://github.com/ivanivanov",
        operatingSystem: "Linux",
        workPlace: "Google",
        education: "МГУ",
        skills: ["JavaScript", "Go", "React", "Docker"],
        hobbies: ["Чтение", "Программирование", "Футбол"],
        followersCount: 120,
        followingCount: 85,
        avatarUrl: "https://i.pravatar.cc/150?img=3",
        phone: "+7 (916) 420 11 11",
        email: "garroshm@space-21.ru"
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
                {/* Левая колонка с фото и кнопками */}
                <div className="w-1/4 bg-gray-50 p-6 flex flex-col items-center">
                    <img
                        src="https://i.pravatar.cc/150?img=3"
                        alt={profileData.fullName}
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    <h3 className="text-lg font-semibold">{profileData.fullName}</h3>
                    <div className="flex space-x-4 mt-4">
                        <div className="text-center">
                            <span className="font-bold">{profileData.followersCount}</span>
                            <p className="text-sm text-gray-600">Подписчиков</p>
                        </div>
                        <div className="text-center">
                            <span className="font-bold">{profileData.followingCount}</span>
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
                        <p><strong>Имя:</strong> {profileData.fullName}</p>
                        <p><strong>Дата рождения:</strong> {profileData.birthDate}</p>
                        <p><strong>Город:</strong> {profileData.city}</p>
                        <p><strong>Telegram:</strong> <a href={`https://t.me/${profileData.telegram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.telegram}</a></p>
                    </div>

                    {/* Второй блок информации */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Дополнительная информация</h4>
                        <p><strong>GitHub:</strong> <a href={profileData.gitLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.gitLink}</a></p>
                        <p><strong>Операционная система:</strong> {profileData.operatingSystem}</p>
                        <p><strong>Место работы:</strong> {profileData.workPlace}</p>
                        <p><strong>Место учебы:</strong> {profileData.education}</p>
                        <p><strong>Навыки:</strong> {profileData.skills.join(", ")}</p>
                        <p><strong>Хобби:</strong> {profileData.hobbies.join(", ")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
