import {useEffect, useState} from "react";
import Header from "../components/Header/Header";
import axios from "axios";
import FormLogin from "../components/FormLogin/FormLogin";

const ProfilePage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        const expiry = localStorage.getItem("expiry");

        if (!expiry) {
            setIsLoggedIn(false)
            return
        }

        const expiryTime = parseInt(expiry, 10);

        const currentTime = Date.now();
        setIsLoggedIn(currentTime <= expiryTime)
    }, []);

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