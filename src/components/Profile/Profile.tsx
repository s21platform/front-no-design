import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

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
    const [file, setFile] = useState<File | null>(null); // Состояние для файла
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Состояние для блокировки кнопки при отправке

    useEffect(() => {
        axios.get("/api/profile", {
            withCredentials: true,
        }).then(data => {
            setProfileData(data.data)
            console.log(data);
        }).catch(err => {
            if (err.status === 401) {
                console.log("remove expiry")
                localStorage.removeItem("expiry");
                navigate("/profile")
            }
            console.warn(err)
        })
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]); // Устанавливаем файл в состояние
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Предотвращаем стандартное поведение отправки формы

        if (!file) {
            alert("Please select a file");
            return;
        }

        setIsSubmitting(true); // Устанавливаем состояние отправки

        // Создаем объект FormData
        const formData = new FormData();
        formData.append('avatar', file); // Добавляем файл

        axios.post('/api/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(data => {
            setProfileData({...profileData, avatar: data.data.link})
        }).catch(e => {
            console.error('Error uploading file', e);
        }).finally(() => {
            setIsSubmitting(false);
        })
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
                {/* Левая колонка с фото и кнопками */}
                <div className="w-1/4 bg-gray-50 p-6 flex flex-col items-center">
                    <img
                        src={profileData.avatar}
                        alt={profileData.nickname}
                        className="w-32 h-32 rounded-full mb-4"
                    />
                    <h3 className="text-lg font-semibold">{profileData.name ?? profileData.nickname} {profileData.surname ?? null}</h3>
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
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg max-w-md mx-auto"
                    >
                        <h1 className="text-2xl font-bold mb-4 text-gray-700">Upload Avatar</h1>

                        <input
                            type="file"
                            name="avatar"
                            onChange={handleFileChange}
                            className="border border-gray-300 p-2 rounded-lg mb-4 w-full text-gray-700"
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Uploading...' : 'Submit'}
                        </button>
                    </form>
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
                        <p>
                            <strong>Имя:</strong> {profileData.name ?? profileData.nickname} {profileData.surname ?? null}
                        </p>
                        <p><strong>Дата рождения:</strong> {profileData.birthdate ? `${profileData.birthdate.day} ${profileData.birthdate.month} ${profileData.birthdate.year}` : "Отсутсвует"}</p>
                        <p><strong>Город:</strong> {profileData.city ?? "Отсутсвует"}</p>
                        <p><strong>Telegram:</strong> <a href={`https://t.me/${profileData.telegram?.substring(1)}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.telegram}</a></p>
                    </div>

                    {/* Второй блок информации */}
                    <div>
                        <h4 className="text-xl font-semibold mb-4">Дополнительная информация</h4>
                        <p><strong>GitHub:</strong> <a href={profileData.gitLink ?? "Отсутсвует"} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{profileData.gitLink}</a></p>
                        <p><strong>Операционная система:</strong> {profileData.os ?? "Отсутсвует"}</p>
                        <p><strong>Место работы:</strong> {profileData.work ?? "Отсутсвует"}</p>
                        <p><strong>Место учебы:</strong> {profileData.university ?? "Отсутсвует"}</p>
                        <p><strong>Навыки:</strong> {profileData.skills?.join(", ")}</p>
                        <p><strong>Хобби:</strong> {profileData.hobbies?.join(", ")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
