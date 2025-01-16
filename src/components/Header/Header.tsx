import { Link, useLocation, useNavigate } from "react-router-dom";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";
import axios from "axios";

const Header = () => {
    const { isAuth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        axios.get(ApiRoutes.logout(), {
            withCredentials: true,
        }).then(data => {
            if (data.status === 200) {
                setAuth(false);
                navigate(AppRoutes.main());
            }
        })
            .catch(err => {
                console.warn(err)
            });
    }
    return (
        <header className="bg-indigo-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Логотип или название */}
                <h1 className="text-2xl font-bold">
                    <Link to={AppRoutes.main()}>Space 21</Link>
                </h1>

                {/* Навигационные ссылки */}
                <nav>
                    <ul className="flex space-x-6">
                        {location.pathname !== AppRoutes.main() &&
                            <li>
                                <Link
                                    to={AppRoutes.main()}
                                    className="hover:text-gray-300"
                                >
                                    Главная
                                </Link>
                            </li>
                        }
                        <li>
                            <Link
                                to={AppRoutes.profile()}
                                className="hover:text-gray-300"
                            >
                                Профиль
                            </Link>
                        </li>
                        {isAuth &&
                            <li>
                                <a
                                    onClick={logout}
                                    className="hover:text-gray-300"
                                    style={{ cursor: 'pointer' }}
                                >
                                    Выход
                                </a>
                            </li>
                        }

                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;
