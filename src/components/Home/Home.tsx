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
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-10">
                    Добро пожаловать в IT Сообщество
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Маппинг по пользователям для отображения карточек */}
                    {mockUsers.map((user) => (
                        <UserCard
                            key={user.id}
                            name={user.name}
                            jobTitle={user.jobTitle}
                            avatar={user.avatar}
                            description={user.description}
                            projects={user.projects}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;