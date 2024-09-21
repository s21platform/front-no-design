import React from "react";

type ProfileProps = {
    fullName: string;
    avatarUrl: string;
    phone: string;
    telegram: string;
    email: string;
};

const Profile: React.FC = () => {
    // Моковые данные профиля
    const profileData: ProfileProps = {
        fullName: "Иван Иванов",
        avatarUrl: "https://i.pravatar.cc/150?img=4", // Используем placeholder для аватара
        phone: "+7 (999) 123-45-67",
        telegram: "@Dreamc0il",
        email: "ivan.ivanov@example.com",
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-md w-full">
                <div className="bg-indigo-600 p-4 flex justify-center">
                    {/* Аватарка */}
                    <img
                        src={profileData.avatarUrl}
                        alt={profileData.fullName}
                        className="w-32 h-32 rounded-full border-4 border-white"
                    />
                </div>
                <div className="p-6 text-center">
                    {/* ФИО */}
                    <h2 className="text-2xl font-semibold mb-2">{profileData.fullName}</h2>
                    {/* Телефон */}
                    <p className="text-gray-600 mb-1">
                        <strong>Телефон: </strong>
                        {profileData.phone}
                    </p>
                    {/* Telegram */}
                    <p className="text-gray-600 mb-1">
                        <strong>Telegram: </strong>
                        <a
                            href={`https://t.me/${profileData.telegram.substring(1)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                        >
                            {profileData.telegram}
                        </a>
                    </p>
                    {/* Email */}
                    <p className="text-gray-600 mb-1">
                        <strong>Email: </strong>
                        <a
                            href={`mailto:${profileData.email}`}
                            className="text-indigo-600 hover:underline"
                        >
                            {profileData.email}
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
