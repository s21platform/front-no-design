import {useState} from "react";
import Header from "../components/Header/Header";
import axios from "axios";
import FormLogin from "../components/FormLogin/FormLogin";

const ProfilePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    return (
        <>
            <Header />
            {!isLoggedIn
                ? <FormLogin setIsLoggedIn={setIsLoggedIn} />
                : <>Auth</>
            }
        </>

    )
}

export default ProfilePage;