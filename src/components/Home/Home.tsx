import React from "react";

// Моковые данные пользователей и проектов
const mockUsers = [
    {
        id: 1,
        name: "Алексей Петров",
        jobTitle: "Frontend Developer",
        avatar: "https://i.pravatar.cc/150?img=1",
        description: "Опытный разработчик с фокусом на React и Vue.",
        projects: ["Project Tracker", "UI Kit Library"],
    },
    {
        id: 2,
        name: "Мария Иванова",
        jobTitle: "Backend Developer",
        avatar: "https://i.pravatar.cc/150?img=2",
        description: "Специалист по Python и Go, облачные решения.",
        projects: ["API Gateway", "Serverless Functions"],
    },
    {
        id: 3,
        name: "Иван Сидоров",
        jobTitle: "DevOps Engineer",
        avatar: "https://i.pravatar.cc/150?img=3",
        description: "DevOps энтузиаст, Kubernetes и Docker.",
        projects: ["CI/CD Pipeline", "Infrastructure as Code"],
    },
];

// Компонент для отображения пользователя
const UserCard: React.FC<{
    name: string;
    jobTitle: string;
    avatar: string;
    description: string;
    projects: string[];
}> = ({ name, jobTitle, avatar, description, projects }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
            <img className="w-16 h-16 rounded-full" src={avatar} alt={name} />
            <div>
                <h2 className="text-lg font-semibold">{name}</h2>
                <p className="text-sm text-gray-500">{jobTitle}</p>
                <p className="mt-2 text-sm">{description}</p>
                <div className="mt-3">
                    <h3 className="text-sm font-bold">Проекты:</h3>
                    <ul className="list-disc list-inside">
                        {projects.map((project, index) => (
                            <li key={index} className="text-sm text-gray-600">
                                {project}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Home: React.FC = () => {
    return (
        // <div className="bg-gray-100 min-h-screen py-10">
        //     <div className="container mx-auto px-4">
        //         <h1 className="text-3xl font-bold text-center mb-10">
        //             Добро пожаловать в IT Сообщество
        //         </h1>
        //
        //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        //             {/* Маппинг по пользователям для отображения карточек */}
        //             {mockUsers.map((user) => (
        //                 <UserCard
        //                     key={user.id}
        //                     name={user.name}
        //                     jobTitle={user.jobTitle}
        //                     avatar={user.avatar}
        //                     description={user.description}
        //                     projects={user.projects}
        //                 />
        //             ))}
        //         </div>
        //     </div>
        // </div>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto text-center px-6">
                {/* Заголовок */}
                <h1 className="text-4xl font-bold mb-4">
                    Join the Leading Community for IT Professionals
                </h1>

                {/* Подзаголовок */}
                <p className="text-lg text-gray-600 mb-8">
                    Welcome to our vibrant community where IT specialists connect,
                    collaborate, and grow. Discover opportunities, share knowledge, and
                    elevate your career in the world of technology.
                </p>

                {/* Кнопки */}
                <div className="space-x-4 mb-12">
                    <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
                        Button
                    </button>
                    <button className="border border-black text-black px-6 py-3 rounded-md hover:bg-gray-100">
                        Button
                    </button>
                </div>

                {/* Блок с изображением */}
                <div className="bg-gray-200 h-80 w-full rounded-md">
                    <div className="flex items-center justify-center h-full">
                        <img
                            src="https://media.istockphoto.com/id/1480574526/ru/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D1%87%D0%B0%D1%81%D1%82%D0%BB%D0%B8%D0%B2%D1%8B%D0%B5-%D0%BB%D1%8E%D0%B4%D0%B8-%D0%B8%D0%B7-%D1%80%D0%B0%D0%B7%D0%BD%D1%8B%D1%85-%D0%BF%D0%BE%D0%BA%D0%BE%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B2%D0%B5%D1%81%D0%B5%D0%BB%D0%BE-%D1%81%D0%B8%D0%B4%D1%8F%D1%82-%D0%BD%D0%B0-%D1%82%D1%80%D0%B0%D0%B2%D0%B5-%D0%B2-%D0%BE%D0%B1%D1%89%D0%B5%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%BC-%D0%BF%D0%B0%D1%80%D0%BA%D0%B5.jpg?s=612x612&w=0&k=20&c=m0Q4E6DBS0e9uuJ1tDrChb8Sg96LiiuItJUAJfxohGA="
                            alt="Community"
                            className="object-cover h-full w-full rounded-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;