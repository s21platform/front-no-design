import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../Notification/Notification";
import { useNavigate } from "react-router-dom";
import { ApiRoutes, AppRoutes, useAuth } from "../../lib/routes";


const FormSociety = () => {
    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isPrivate, setIsPrivate] = useState<boolean>(false);

    const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

    useEffect(() => {
        axios.get(ApiRoutes.profile(), {
            withCredentials: true,
        }).catch(err => {
            if (err.status === 401) {
                setAuth(false);
                navigate(AppRoutes.profile());
            }
            console.warn(err)
        });
    }, []);

    const handleSubmit = () => {
        axios.post(ApiRoutes.society(), {
            name: name,
            description: description,
            is_private: isPrivate,
            direction_id: 1, // TODO
            access_level_id: 1, // TODO
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.status === 201) {
                navigate(AppRoutes.profile()); // TODO: перенаправление на страницу сообщества по society_id
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
                    <h2 className="text-2xl font-bold text-center mb-6">Создать сообщество</h2>
                    <div className="space-y-6">
                        {/* Поле для name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Наименование
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Поле для description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Описание
                            </label>
                            <input
                                type="text"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Чекбокс is_private */}
                        <div className="flex w-full">
                            <input
                                type="checkbox"
                                id="is_private"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                                required
                                className="bg-white border border-gray-300 mr-2"
                            />
                            <label htmlFor="is_private" className="block text-sm font-medium text-gray-700">
                                Приватное
                            </label>

                        </div>

                        {/* Кнопка Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                onClick={handleSubmit}
                            >
                                Создать
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

export default FormSociety
