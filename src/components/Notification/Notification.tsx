import React, { useState, useEffect } from "react";

type NotificationProps = {
    message?: string;
    type?: "success" | "error";
    onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        // Уведомление исчезает через 5 секунд
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // Очистка таймера при размонтировании компонента
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg text-white transition-transform transform ${
                type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
        >
            <p>{message}</p>
        </div>
    );
};

export default Notification;