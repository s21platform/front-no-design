import React, {useState} from "react";
import axios from "axios";
import {ProfileProps} from "../types";
import {useNavigate} from "react-router-dom";
import {FormControl, Grid2, Input, InputAdornment, TextField} from "@mui/material";
import {AlternateEmail, Pets, PetsTwoTone} from "@mui/icons-material";
import ProfileSkeleton from "../../Skeletons/ProfileSkeleton/ProfileSkeleton";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {ru} from "date-fns/locale";

interface ProfileDataI {
    profileData: ProfileProps;
}

const EditProfile = ({profileData}: ProfileDataI) => {
    const navigate = useNavigate();
    const [data, setData] = useState<ProfileProps>(profileData)
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        let value = e.target.value;
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
            .catch(err => console.log(err))
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
                <Grid2 container spacing={2}>
                    <Grid2 size={12}>
                        <TextField type="text" label={"Имя"} value={data.name}
                                   onChange={(e) => handleInputChange(e, "name")}/>
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField type={"date"} label={"Дата рождения"} value={data.birthdate}
                                   onChange={(e) => handleInputChange(e, "birthdate")} placeholder={""}/>
                    </Grid2>
                    <Grid2 size={12}>
                        <TextField
                            type="text"
                            label={"Telegram"}
                            value={data.telegram}
                            onChange={(e) => handleInputChange(e, "telegram")}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AlternateEmail/>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />
                    </Grid2>
                </Grid2>
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
            </div>


        </div>
    )
}

export default EditProfile;