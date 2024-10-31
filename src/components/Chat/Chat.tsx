import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type Message = {
    sender: string;
    content: string;
};

const ChatWidget: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const socket = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const clientId = localStorage.getItem("clientId") || uuidv4();
    if (!localStorage.getItem("clientId")) {
        localStorage.setItem("clientId", clientId);  // Сохраняем в localStorage
    }

    useEffect(() => {
        // Подключаем WebSocket при монтировании компонента
        socket.current = new WebSocket("/ws");

        socket.current.onopen = () => {
            const initMessage = JSON.stringify({
                clientId: clientId,  // Уникальный идентификатор клиента
                content: "initial connection"  // Например, уведомление о первичном подключении
            });
            socket.current?.send(initMessage);
            addMessage({ sender: "Система", content: "Соединение установлено" });
        };

        socket.current.onmessage = (event) => {
            const message = { sender: "Сервер", content: event.data };
            addMessage(message);
        };

        socket.current.onclose = () => {
            addMessage({ sender: "Система", content: "Соединение закрыто" });
        };

        socket.current.onerror = (error) => {
            console.error("Ошибка WebSocket:", error);
            addMessage({ sender: "Система", content: "Ошибка подключения" });
        };

        return () => {
            socket.current?.close();
        };
    }, []);

    const addMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = () => {
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                clientId: clientId,
                content: input
            }));
            addMessage({ sender: "Вы", content: input });
            setInput("");
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 h-96 border border-gray-300 rounded-lg shadow-lg flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-4 space-y-2" id="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="text-sm">
                        <strong className="text-blue-500">{msg.sender}:</strong>{" "}
                        <span>{msg.content}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center border-t p-2">
                <input
                    type="text"
                    placeholder="Введите сообщение..."
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default ChatWidget;
