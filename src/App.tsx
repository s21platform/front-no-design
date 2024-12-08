import {Route, Routes} from 'react-router-dom';
import MainPage from "./pages/Main";
import ProfilePage from "./pages/Profile";
import EditProfilePage from "./pages/EditProfilePage";
import SocietyAddingPage from './pages/SocietyAddingPage';
import PeerPage from "./components/PeerPage/PeerPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/edit" element={<EditProfilePage/>}/>
            <Route path="/new-society" element={<SocietyAddingPage />} />
            <Route path="/peer/:uuid" element={<PeerPage/>} />

            {/*/!* Fallback для всех несуществующих роутов *!/*/}
            {/*<Route path="*" element={<div>Not Found Page</div>}/>*/}
        </Routes>
    );
}

export default App;
