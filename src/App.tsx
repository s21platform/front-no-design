import { Route, Routes } from 'react-router-dom';
import MainPage from "./pages/Main";
import ProfilePage from "./pages/Profile";
import SocietyAddingPage from './pages/SocietyAddingPage';
import PeerPage from "./components/PeerPage/PeerPage";
import PeerSearch from './components/PeerSearch/PeerSearch';
import { AppRoutes, AuthProvider, PrivateRoute } from './lib/routes';
import { SocietySearch } from './components/SocietySearch/SocietySearch';
import { SocietyPage } from './components/SocietyPage/SocietyPage';
import { AdvertSearch } from './components/AdvertSearch/AdvertSearch';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path={AppRoutes.main()} element={<MainPage />} />
                <Route path={AppRoutes.profile()} element={<ProfilePage />} />

                <Route element={<PrivateRoute />}>
                    <Route path={AppRoutes.newSociety()} element={<SocietyAddingPage />} />
                    <Route path={AppRoutes.peerSearch()} element={<PeerSearch />} />
                    <Route path={AppRoutes.peer()} element={<PeerPage />} />
                    <Route path={AppRoutes.societySearch()} element={<SocietySearch />} />
                    <Route path={AppRoutes.society()} element={<SocietyPage />} />
                    <Route path={AppRoutes.advertSearch()} element={<AdvertSearch />} />
                </Route>


                {/*/!* Fallback для всех несуществующих роутов *!/*/}
                {/*<Route path="*" element={<div>Not Found Page</div>}/>*/}
            </Routes>
        </AuthProvider>
    );
}

export default App;
