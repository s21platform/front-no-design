import {Route, Routes} from 'react-router-dom';
import MainPage from "./pages/Main";
import ProfilePage from "./pages/Profile";
import SocietyAddingPage from './pages/SocietyAddingPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<MainPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/new-society" element={<SocietyAddingPage />} />

            {/*/!* Fallback для всех несуществующих роутов *!/*/}
            {/*<Route path="*" element={<div>Not Found Page</div>}/>*/}
        </Routes>
    );
}

export default App;
