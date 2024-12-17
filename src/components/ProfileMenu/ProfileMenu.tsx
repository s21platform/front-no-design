import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

export const ProfileMenu = () => {
    const navigate = useNavigate();
    return (
        <div className={"w-1/4 bg-gray-50 p-6 flex flex-col items-stretch gap-2"}>
            <Button variant="contained" onClick={() => window.alert("В разработке!")}>Друзья</Button>
            <Button variant="contained" onClick={() => window.alert("В разработке!")}>Сообщества</Button>
        </div>
    )
}

export default ProfileMenu