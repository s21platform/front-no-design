import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {ProfileProps} from "../components/Profile/types";
import SideProfile from "../components/Profile/SideProfile/SideProfile";
import EditProfile from "../components/Profile/EditProfile/EditProfile";
import Loader from "../components/Loader/Loader";
import ProfileSkeleton from "../components/Skeletons/ProfileSkeleton/ProfileSkeleton";


const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [profileLoading, setProfileLoading] = useState(true);
    const [profileData, setProfileData] = useState<ProfileProps>({
        avatar: "https://i.pravatar.cc/150?img=3",
    });

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
        }).finally(() => {
            setProfileLoading(false);
        })
    }, []);

    const avatarChangeHandler = (newUrl: string) => {
        setProfileData({...profileData, avatar: newUrl});
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl flex">
                {/* Левая колонка с фото и кнопками */}
                <SideProfile avatarUrl={profileData.avatar} avatarChange={avatarChangeHandler}/>

                {/* Центральная колонка с полями для редактирования */}
                {profileLoading ? <div className="w-3/4 p-6 relative"><ProfileSkeleton/></div>
                : <EditProfile profileData={profileData}/>
                }


            </div>
        </div>
    );
};

export default EditProfilePage;
