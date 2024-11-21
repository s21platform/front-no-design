import {Route, Routes} from 'react-router-dom';
import MainPage from "./pages/Main";
import ProfilePage from "./pages/Profile";
import EditProfilePage from "./pages/EditProfilePage";
import SearchPage from "./pages/Search";

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/edit" element={<EditProfilePage/>}/>
            <Route path="/search/:type" element={<SearchPage/>}/>

            {/*/!* Fallback для всех несуществующих роутов *!/*/}
            {/*<Route path="*" element={<div>Not Found Page</div>}/>*/}
        </Routes>
    );
}

export default App;
