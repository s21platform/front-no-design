import Header from "../components/Header/Header";
import FormLogin from "../components/FormLogin/FormLogin";
import Profile from "../components/Profile/Profile";
import { useAuth } from "../lib/routes";

const ProfilePage = () => {
    const { isAuth, setAuth } = useAuth();
    return (
        <>
            <Header />
            {!isAuth
                ? <FormLogin setIsLoggedIn={setAuth} />
                : <Profile />
            }
        </>

    )
}

export default ProfilePage;
