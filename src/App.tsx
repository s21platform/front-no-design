import { Route, Routes } from 'react-router-dom';
import MainPage from "./pages/Main";
import ProfilePage from "./pages/Profile";
import SocietyAddingPage from './pages/SocietyAddingPage';
import PeerPage from "./components/PeerPage/PeerPage";
import PeerSearch from './components/PeerSearch/PeerSearch';
import { AppRoutes } from './lib';

function App() {
    return (
        <Routes>
            <Route path={AppRoutes.main()} element={<MainPage />} />
            <Route path={AppRoutes.profile()} element={<ProfilePage />} />
            <Route path={AppRoutes.newSociety()} element={<SocietyAddingPage />} />
            <Route path={AppRoutes.peerSearch()} element={<PeerSearch />} />
            <Route path={AppRoutes.peer()} element={<PeerPage />} />

            {/*/!* Fallback для всех несуществующих роутов *!/*/}
            {/*<Route path="*" element={<div>Not Found Page</div>}/>*/}
        </Routes>
    );
}

export default App;
