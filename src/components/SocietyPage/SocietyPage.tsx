import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, Button, Skeleton } from "@mui/material";
import axios from "axios";
import { ApiRoutes } from "../../lib/routes/const/apiRoutes";
import Header from "../Header/Header";
import { POST_PERMISSIONS, SOCIETY_FORMATS } from "../../lib/consts/society";

export interface SocietyDetails {
    name: string;
    ownerUUID: string;
    photoURL: string;
    formatID: number;
    postPermission: number;
    isSearch: boolean;
    countSubscribe: number;
}

export const SocietyPage = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [society, setSociety] = useState<SocietyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loadingSubscription, setLoadingSubscription] = useState(false);

    useEffect(() => {
        const fetchSocietyData = async () => {
            try {
                const response = await axios.get(ApiRoutes.society(), {
                    params: {
                        society_id: uuid
                    },
                    withCredentials: true
                });
                setSociety(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных сообщества:", error);
            } finally {
                setLoading(false);
            }
        };

        if (uuid) {
            fetchSocietyData();
        }
    }, [uuid]);

    const handleSubscribe = () => {
        setLoadingSubscription(true);
        console.log('Функция подписки находится в разработке');
        alert('Функция подписки находится в разработке');
        setLoadingSubscription(false);
    };

    // Рабочий код для будущей реализации:
    // const handleSubscribe = async () => {
    //     setLoadingSubscription(true);
    //     try {
    //         await axios.post(ApiRoutes.societySubscribe(uuid), {}, {
    //             withCredentials: true
    //         });
    //         setIsSubscribed(true);
    //         if (society) {
    //             setSociety({
    //                 ...society,
    //                 countSubscribe: society.countSubscribe + 1
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Ошибка при подписке:", error);
    //     } finally {
    //         setLoadingSubscription(false);
    //     }
    // };

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                    <Box maxWidth={900} width="100%" className="bg-white rounded-lg shadow-lg p-6">
                        <Skeleton variant="rectangular" height={200} />
                        <Skeleton variant="text" height={60} width="50%" />
                        <Skeleton variant="text" height={40} width="30%" />
                    </Box>
                </div>
            </>
        );
    }

    if (!society) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                    <Typography variant="h5">Сообщество не найдено</Typography>
                </div>
            </>
        );
    }

    const formatLabel = SOCIETY_FORMATS.find((f: { value: number }) => f.value === society.formatID)?.label || "Неизвестный формат";
    const permissionLabel = POST_PERMISSIONS.find((p: { value: number }) => p.value === society.postPermission)?.label || "Неизвестные разрешения";

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <Box maxWidth={900} width="100%" className="bg-white rounded-lg shadow-lg">
                    {/* Шапка сообщества */}
                    <Box className="relative h-48 bg-gray-200">
                        <Avatar
                            src={society.photoURL}
                            className="absolute -bottom-8 left-6 border-4 border-white"
                            sx={{ width: 120, height: 120 }}
                        />
                    </Box>

                    {/* Информация о сообществе */}
                    <Box className="p-6 pt-12">
                        <div className="flex justify-between items-start">
                            <div>
                                <Typography variant="h4" className="font-bold">
                                    {society.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" className="mt-2">
                                    {formatLabel} • {permissionLabel}
                                </Typography>
                                <Typography variant="body2" className="mt-1">
                                    {society.countSubscribe} подписчиков
                                </Typography>
                            </div>
                            <Button
                                variant={isSubscribed ? "outlined" : "contained"}
                                onClick={handleSubscribe}
                                disabled={loadingSubscription}
                            >
                                {isSubscribed ? "Отписаться" : "Подписаться"}
                            </Button>
                        </div>

                        {society.isSearch && (
                            <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <Typography variant="body2" color="primary">
                                    Это сообщество можно найти в поиске
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </div>
        </>
    );
}; 