import React, { useState } from "react";
import axios from "axios";
import Notification from "../Notification/Notification";
import { ApiRoutes } from "../../lib";

interface ILoginForm {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const FormLogin = ({ setIsLoggedIn }: ILoginForm) => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

    const handleLogin = () => {
        axios.post(ApiRoutes.login(), {
            username: username,
            password: password,
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 200) {
                const currentTime = Date.now();
                const expiryTime = currentTime + 10 * 60 * 60 * 1000;

                localStorage.setItem("expiry", expiryTime.toString());
                setIsLoggedIn(true);
                setNotification({
                    message: "Успех",
                    type: "success"
                })
            }
        }).catch(err => {
            let mess = err.message
            if (err.response?.data) {
                mess = err.response.data
            }
            setNotification({
                message: mess,
                type: "error"
            })
            console.log(err);
        })
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold text-center mb-6">Войти</h2>
                    <div className="space-y-6">
                        {/* Поле для username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Поле для password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Кнопка Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={handleLogin}
                            >
                                Войти
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {notification &&
                <Notification
                    message={notification?.message}
                    type={notification?.type}
                    onClose={() => setNotification(null)}
                />
            }
        </>

    )
}

export default FormLogin
