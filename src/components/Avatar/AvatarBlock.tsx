import React, { useEffect, useState } from 'react';
import Loader from "../Loader/Loader";
import AvatarSkeleton from "../Skeletons/AvatarSkeleton/AvatarSkeleton";
import Avatar from "@mui/material/Avatar"
import LoadingButton from "@mui/lab/LoadingButton";
import { ApiRoutes } from '../../lib/routes';
import api from "../../lib/api/api";

interface AvatarUploaderProps {
    initialAvatarUrl: string;
    onAvatarChange?: (newAvatarUrl: string) => void;
}

interface AvatarUploaderState {
    id: number;
    link: string;
}

const AvatarBlock: React.FC<AvatarUploaderProps> = ({ initialAvatarUrl, onAvatarChange }) => {
    const [avatarUrl, setAvatarUrl] = useState<string>(initialAvatarUrl);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingAll, setLoadingAll] = useState<boolean>(false);
    const [allAvatars, setAllAvatars] = useState<AvatarUploaderState[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [currentAvatarIndex, setCurrentAvatarIndex] = useState<number>(0);

    useEffect(() => {
        setAvatarUrl(initialAvatarUrl);
    }, [initialAvatarUrl]);

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const filename = file.name;

        const formData = new FormData();
        formData.append('avatar', file);
        formData.append('filename', filename);


        setLoading(true);

        try {
            const response = await api.post(ApiRoutes.avatar(), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const newAvatarUrl = response.data.link;
            setAvatarUrl(newAvatarUrl);
            if (onAvatarChange) {
                onAvatarChange(newAvatarUrl);
            }
        } catch (error) {
            console.error('Ошибка при загрузке аватарки', error);
        } finally {
            setLoading(false);
        }
    };

    const openPopup = async () => {
        setIsPopupOpen(true);
        setLoadingAll(true)
        try {
            const response = await api.get(ApiRoutes.avatar());
            setAllAvatars(response.data.avatar_list);
            setCurrentAvatarIndex(response.data.avatars.findIndex((url: string) => url === avatarUrl));
        } catch (error) {
            console.error('Ошибка при получении аватарок', error);
        } finally {
            setLoadingAll(false)
        }
    };

    // Закрытие popup
    const closePopup = () => {
        setCurrentAvatarIndex(0)
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

    const deleteAvatar = () => {
        if (window.confirm("Удалить аватар?")) {
            api.delete(ApiRoutes.avatar(), {
                data: {
                    id: allAvatars[currentAvatarIndex].id,
                },
                withCredentials: true,
            }).then(data => {
                setAllAvatars(allAvatars.filter(ava => ava.id !== data.data.id))
                setCurrentAvatarIndex((prevIndex) => (prevIndex + 1) % allAvatars.length - 1);
            }).catch(err => {
                alert("Не удалось")
                console.error(err)
            })
        }
    }

    return (
        <div className="flex flex-col items-center p-2">
            {avatarUrl === "" ? <AvatarSkeleton /> :
                <Avatar src={avatarUrl} sx={{ width: 120, height: 120 }} onClick={openPopup} className={"mb-2"} />
                // <img
                //     src={avatarUrl}
                //     alt="Avatar"
                //     onClick={openPopup}
                //     className="w-32 h-32 rounded-full object-cover"
                // />
            }
            <LoadingButton loading={loading} onClick={closePopup} className="mt-4" component="label" variant="contained">
                Загрузить
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={loading}
                />
            </LoadingButton>
            {/*<label className="cursor-pointer bg-blue-500 text-white mt-4 px-4 py-2 rounded">*/}
            {/*    {loading ? 'Загрузка...' : 'Загрузить фото'}*/}
            {/*    <input*/}
            {/*        type="file"*/}
            {/*        accept="image/*"*/}
            {/*        className="hidden"*/}
            {/*        onChange={handleAvatarChange}*/}
            {/*        disabled={loading}*/}
            {/*    />*/}
            {/*</label>*/}

            {/* Popup для просмотра и перелистывания аватарок */}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    {loadingAll ? <Loader />
                        : <div className="bg-white p-4 rounded-lg max-w-sm w-full relative flex items-center">
                            {/* Закрыть popup */}
                            <button
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                onClick={closePopup}
                            >
                                ✖
                            </button>

                            <button
                                className="absolute bottom-2 right-2 text-gray-600 hover:text-gray-900"
                                onClick={deleteAvatar}
                            >
                                Удалить
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
                                src={allAvatars[currentAvatarIndex].link}
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
                    }
                </div>
            )}
        </div>
    );
};

export default AvatarBlock;
