import {Link, useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate()
    return (
        <header className="bg-indigo-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Логотип или название */}
                <h1 className="text-2xl font-bold">
                    <Link to="/">Мой Сайт</Link>
                </h1>

                {/* Навигационные ссылки */}
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <Link
                                to="/"
                                className="hover:text-gray-300"
                            >
                                Главная
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/profile"
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