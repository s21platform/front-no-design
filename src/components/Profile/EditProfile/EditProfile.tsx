import React, {useState} from "react";
import axios from "axios";
import {ProfileProps} from "../types";
import {useNavigate} from "react-router-dom";

interface ProfileDataI {
    profileData: ProfileProps;
}

const EditProfile = ({profileData}: ProfileDataI) => {
    const navigate = useNavigate();
    const[data, setData] = useState<ProfileProps>(profileData)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        let value = e.target.value;
        // if (field === "birthdate") {
        //     value = new Date(e.target.value).toISOString()
        // }
        console.log(data)
        setData({
            ...data,
            [field]: value,
        });
        console.log(value, typeof value);
    };

    const handleArrayInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: string) => {
        setData({
            ...data,
            [field]: e.target.value.split(","),
        });
    };

    const handleSaveProfile = () => {
        const sendData = data
        if (data.birthdate) {
            sendData.birthdate = new Date(data.birthdate ?? "").toISOString()
        }
        axios.put("/api/profile", sendData, {
            headers: {
                "Content-Type": "application/json",
            }
        }).then(data => {
            if (data.status === 200 && data.data.status) {
                navigate("/profile");
            }
        })
            .catch(err => console.log(err));
    };



    return (
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
                        value={data.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-600">Дата рождения:</label>
                    <input
                        type="date"
                        value={data.birthdate}
                        onChange={(e) => handleInputChange(e, "birthdate")}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-gray-600">Telegram:</label>
                    <input
                        type="text"
                        value={data.telegram}
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
                        value={data.git}
                        onChange={(e) => handleInputChange(e, "git")}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                {/*<div className="mb-2">*/}
                {/*    <label className="block text-gray-600">Операционная система:</label>*/}
                {/*    <input*/}
                {/*        type="text"*/}
                {/*        value={"Mac OS"}*/}
                {/*        onChange={(e) => handleInputChange(e, "operatingSystem")}*/}
                {/*        className="w-full p-2 border border-gray-300 rounded"*/}
                {/*    />*/}
                {/*</div>*/}
            </div>
        </div>
    )
}

export default EditProfile;