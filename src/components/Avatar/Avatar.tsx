import React, {useState} from 'react';
import axios from 'axios';

interface AvatarUploaderProps {
    initialAvatarUrl: string;
    onAvatarChange?: (newAvatarUrl: string) => void;
}

const Avatar: React.FC<AvatarUploaderProps> = ({ initialAvatarUrl, onAvatarChange }) => {
    const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl);
    const [loading, setLoading] = useState<boolean>(false);
    const [allAvatars, setAllAvatars] = useState<string[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [currentAvatarIndex, setCurrentAvatarIndex] = useState<number>(0);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const filename = file.name;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('filename', filename);


        setLoading(true);

        try {
            const response = await axios.post('/api/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newAvatarUrl = response.data.link;
            setAvatarUrl(newAvatarUrl);
            if (onAvatarChange) {
                console.log('Avatar change', newAvatarUrl);
                onAvatarChange(newAvatarUrl);
            }
        } catch (error) {
            console.error('Ошибка при загрузке аватарки', error);
        } finally {
            setLoading(false);
            console.log("finally", avatarUrl)
        }
    };

    const openPopup = async () => {
        setIsPopupOpen(true);
        try {
            const response = await axios.get('/api/avatar');
            console.log(response.data.avatar_list)
            setAllAvatars(response.data.avatar_list);
            setCurrentAvatarIndex(response.data.avatars.findIndex((url: string) => url === avatarUrl));
        } catch (error) {
            console.error('Ошибка при получении аватарок', error);
        }
    };

    // Закрытие popup
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // Переключение на следующую аватарку
    const nextAvatar = () => {
        setCurrentAvatarIndex((prevIndex) => (prevIndex + 1) % allAvatars.length);
    };

    // Переключение на предыдущую аватарку
    const prevAvatar = () => {
        setCurrentAvatarIndex((prevIndex) => (prevIndex - 1 + allAvatars.length) % allAvatars.length);
    };

    return (
        <div className="flex flex-col items-center">
            <img
                src={avatarUrl}
                alt="Avatar"
                onClick={openPopup}
                className="w-32 h-32 rounded-full mb-4 object-cover"
            />
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                {loading ? 'Загрузка...' : 'Загрузить фото'}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={loading}
                />
            </label>

            {/* Popup для просмотра и перелистывания аватарок */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-sm w-full relative flex items-center">
                        {/* Закрыть popup */}
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={closePopup}
                        >
                            ✖
                        </button>

                        {/* Отображение номера аватарки */}
                        <div className="absolute top-2 text-gray-700 font-bold mb-2">
                            {currentAvatarIndex + 1}/{allAvatars.length}
                        </div>

                        {/* Стрелка влево */}
                        <button
                            className="absolute left-2 text-gray-600 hover:text-gray-900 text-4xl"
                            onClick={prevAvatar}
                        >
                            &larr;
                        </button>

                        {/* Отображение текущей аватарки */}
                        <img
                            src={allAvatars[currentAvatarIndex]}
                            alt={`Avatar ${currentAvatarIndex}`}
                            className="w-48 h-48 object-cover mx-auto mb-4"
                        />

                        {/* Стрелка вправо */}
                        <button
                            className="absolute right-2 text-gray-600 hover:text-gray-900 text-4xl"
                            onClick={nextAvatar}
                        >
                            &rarr;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Avatar;
