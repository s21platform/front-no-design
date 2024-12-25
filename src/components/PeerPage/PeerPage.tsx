import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ProfileProps} from "../Profile/types";
import axios from "axios";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import ProfileSkeleton from "../Skeletons/ProfileSkeleton/ProfileSkeleton";
import Loader from "../Loader/Loader";
import Chat from "../Chat/Chat";
import AvatarPeerBlock from "../Avatar/AvatarPeerBlock";
import {Button} from "@mui/material";
import ButtonSkeleton from "../Skeletons/ButtonSkeleton/ButtonSkeleton";
import Header from "../Header/Header";

export const PeerPage = () => {
    const navigate = useNavigate();
    const pathParams = useParams()
    const [profileData, setProfileData] = useState<ProfileProps>({
        avatar: "",
    })
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingSubscription, setLoadingSubscription] = useState<boolean>(true);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`/api/peer/${pathParams.uuid}`, {
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
        axios.get(`/api/friends/check?peer=${pathParams.uuid}`, {
            withCredentials: true,
        }).then(data => {
            setIsSubscribed(data.data.exist)
            console.log("api friends check", data.data)
        }).finally(() => {
            setLoadingSubscription(false)
        })
    }, []);

    const subscribe = () => {
        setLoadingSubscription(true)
        axios.post(`/api/friends`, {
            peer: pathParams.uuid,
        }, {
            withCredentials: true
        })
            .then(data => {
                if (data.data.success) {
                    setIsSubscribed(true)
                }
            })
            .finally(() => {
                setLoadingSubscription(false)
            })
    }

    const unsubscribe = () => {
        setLoadingSubscription(true)
        axios.delete(`/api/friends?peer=${pathParams.uuid}`, {
            withCredentials: true
        })
            .then(data => {
                if (data.data.success) {
                    setIsSubscribed(false)
                }
            })
            .finally(() => {
                setLoadingSubscription(false)
            })
    }


    return (
        <>
            <Header/>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
                    {/* Левая колонка с фото и кнопками */}
                    {/*<SideProfile avatarUrl={profileData.avatar} avatarChange={avatarChange}/>*/}
                    <ProfileMenu/>
                    {/* Центральная колонка с информацией */}
                    <div className="w-3/4 p-6 relative">
                        {/* Первый блок информации */}
                        {loading ? <ProfileSkeleton/>
                            : <div className="mb-6 flex flex-row items-center justify-start">
                                <AvatarPeerBlock initialAvatarUrl={profileData.avatar}/>
                                {/*<h4 className="text-xl font-semibold mb-4">Основная информация</h4>*/}
                                <div className="ml-2">
                                    {!!profileData.name && <p><strong>Имя:</strong> {profileData.name}</p>}
                                    {!!profileData.birthdate &&
                                        <p><strong>Дата рождения:</strong> {profileData.birthdate}</p>}
                                    {!!profileData.telegram && <p><strong>Telegram:</strong> <a
                                        href={`https://t.me/${profileData.telegram?.substring(1)}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline">{profileData.telegram}</a>
                                    </p>}
                                    {loadingSubscription ? <ButtonSkeleton/>
                                        : <div className="flex flex-row mt-4">
                                            {isSubscribed
                                                ? <Button
                                                    variant="outlined"
                                                    className="mt-4 flex flex-row items-center"
                                                    onClick={() => unsubscribe()}
                                                >
                                                    Отписаться
                                                </Button>
                                                : <Button
                                                    variant="contained"
                                                    className="mt-4 flex flex-row items-center"
                                                    onClick={() => subscribe()}
                                                >
                                                    Подписаться
                                                </Button>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        }


                        {/* Второй блок информации */}
                        {loading ? <ProfileSkeleton/>
                            : <div>
                                {Object.keys(profileData).length > 0 &&
                                    <>
                                        <h4 className="text-xl font-semibold mb-4">Дополнительная
                                            информация</h4>
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
                                                    <p><strong>Операционная
                                                        система:</strong> {profileData.os.label ?? "Отсутсвует"}
                                                    </p>
                                                }
                                            </div>
                                        }
                                    </>
                                }
                                <Chat/>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );
}

export default PeerPage;