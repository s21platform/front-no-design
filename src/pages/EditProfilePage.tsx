import React, { useState } from "react";
import {useNavigate} from "react-router-dom";

type ProfileProps = {
    fullName: string;
    birthDate: string;
    city: string;
    telegram: string;
    gitLink: string;
    operatingSystem: string;
    workPlace: string;
    education: string;
    skills: string[];
    hobbies: string[];
    followersCount: number;
    followingCount: number;
};

const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    // Моковые данные профиля, которые можно редактировать
    const [profileData, setProfileData] = useState<ProfileProps>({
        fullName: "Иван Иванов",
        birthDate: "01.01.1990",
        city: "Москва",
        telegram: "@ivanivanov",
        gitLink: "https://github.com/ivanivanov",
        operatingSystem: "Linux",
        workPlace: "Google",
        education: "МГУ",
        skills: ["JavaScript", "Go", "React", "Docker"],
        hobbies: ["Чтение", "Программирование", "Футбол"],
        followersCount: 120,
        followingCount: 85,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setProfileData({
            ...profileData,
            [field]: e.target.value,
        });
    };

    const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
        setProfileData({
            ...profileData,
            [field]: e.target.value.split(","),
        });
    };

    const handleSaveProfile = () => {
        // Логика сохранения профиля
        alert("Сейчас данные не сохранятся. Будет совершен переход на страницу профиля")
        navigate("/profile")
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
                </div>

                {/* Центральная колонка с полями для редактирования */}
                <div className="w-3/4 p-6 relative">
                    {/* Кнопка сохранения */}
                    <button
                        onClick={handleSaveProfile}
                        className="absolute top-0 right-0 mt-2 mr-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    >
                        Сохранить профиль
                    </button>

                    {/* Первый блок редактируемой информации */}
                    <div className="mb-6">
                        <h4 className="text-xl font-semibold mb-4">Основная информация</h4>
                        <div className="mb-2">
                            <label className="block text-gray-600">Имя:</label>
                            <input
                                type="text"
                                value={profileData.fullName}
                                onChange={(e) => handleInputChange(e, "fullName")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Дата рождения:</label>
                            <input
                                type="date"
                                value={profileData.birthDate}
                                onChange={(e) => handleInputChange(e, "birthDate")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Город:</label>
                            <input
                                type="text"
                                value={profileData.city}
                                onChange={(e) => handleInputChange(e, "city")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Telegram:</label>
                            <input
                                type="text"
                                value={profileData.telegram}
                                onChange={(e) => handleInputChange(e, "telegram")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>

                    {/* Второй блок редактируемой информации */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Дополнительная информация</h4>
                        <div className="mb-2">
                            <label className="block text-gray-600">GitHub:</label>
                            <input
                                type="text"
                                value={profileData.gitLink}
                                onChange={(e) => handleInputChange(e, "gitLink")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Операционная система:</label>
                            <input
                                type="text"
                                value={profileData.operatingSystem}
                                onChange={(e) => handleInputChange(e, "operatingSystem")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Место работы:</label>
                            <input
                                type="text"
                                value={profileData.workPlace}
                                onChange={(e) => handleInputChange(e, "workPlace")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Место учебы:</label>
                            <input
                                type="text"
                                value={profileData.education}
                                onChange={(e) => handleInputChange(e, "education")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Навыки (через запятую):</label>
                            <textarea
                                value={profileData.skills.join(", ")}
                                onChange={(e) => handleArrayInputChange(e, "skills")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-600">Хобби (через запятую):</label>
                            <textarea
                                value={profileData.hobbies.join(", ")}
                                onChange={(e) => handleArrayInputChange(e, "hobbies")}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfilePage;
