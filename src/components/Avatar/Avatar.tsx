import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface AvatarUploaderProps {
    initialAvatarUrl: string;
    onAvatarChange?: (newAvatarUrl: string) => void;
}

const Avatar: React.FC<AvatarUploaderProps> = ({ initialAvatarUrl, onAvatarChange }) => {
    const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setAvatarUrl(initialAvatarUrl);
    }, [initialAvatarUrl]);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

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

    return (
        <div className="flex flex-col items-center">
            <img
                src={avatarUrl}
                alt="Avatar"
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
        </div>
    );
};

export default Avatar;
