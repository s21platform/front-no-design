import React, {useEffect, useState} from "react";
import Avatar from "../../Avatar/Avatar";
import axios from "axios";
import {SubscriptionCount} from "../types";

interface Props {
    avatarUrl: string;
    avatarChange: (newUrl: string) => void
}

export const SideProfile = ({avatarUrl, avatarChange}: Props) => {
    const [avatar, setAvatar] = useState(avatarUrl);
    const [friendsCount, setFriendsCount] = useState<SubscriptionCount>({
        followersCount: 0,
        followingCount: 0
    });

    useEffect(() => {
        console.log(avatarUrl)
        setAvatar(avatarUrl);
    }, [avatarUrl]);

    useEffect(() => {
        axios.get("/api/friends/counts", {
            withCredentials: true
        }).then(data => {
            setFriendsCount({
                followersCount: data.data.subscribers ?? 0,
                followingCount: data.data.subscription ?? 0,
            })
        }).catch(err => {
            console.warn(err)
        })
    }, [])

    return (
        <div className="w-1/4 bg-gray-50 p-6 flex flex-col items-center">
            <Avatar initialAvatarUrl={avatar} onAvatarChange={avatarChange}/>
            <div className="flex space-x-4 mt-4">
                <div className="text-center">
                    <span className="font-bold">{friendsCount.followersCount ?? "Отсутсвует"}</span>
                    <p className="text-sm text-gray-600">Подписчиков</p>
                </div>
                <div className="text-center">
                    <span className="font-bold">{friendsCount.followingCount ?? "Отсутсвует"}</span>
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
    )
}

export default SideProfile