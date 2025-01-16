import Header from "../components/Header/Header";
import FormLogin from "../components/FormLogin/FormLogin";
import Profile from "../components/Profile/Profile";
import { useAuth } from "../lib/routes";
import Loader from "../components/Loader/Loader";

const ProfilePage = () => {
    const { isAuth, setAuth } = useAuth();
    return (
        <>
            <Header />

            {isAuth === null ? <Loader /> : (
                isAuth
                    ? <Profile />
                    : <FormLogin setIsLoggedIn={setAuth} />
            )}
        </>

    )
}

export default ProfilePage;
