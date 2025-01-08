import { Link } from "react-router-dom";
import { AppRoutes } from "../../lib/routes";

const Header = () => {
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
                        <li>
                            <Link
                                to={AppRoutes.main()}
                                className="hover:text-gray-300"
                            >
                                Главная
                            </Link>
                        </li>
                        <li>
                            <Link
                                to={AppRoutes.profile()}
                                className="hover:text-gray-300"
                            >
                                Профиль
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;
