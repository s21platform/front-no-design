import {ResultsListProps} from "./types";
import {useEffect} from "react";


const ResultsList: React.FC<ResultsListProps> = ({  }) => {
    let results: any[] = [{
        name: "Test",
        description: "Тестовое сообщество",
        avatarLink: "https://storage.yandexcloud.net/space21staging/ed09884f-fc9c-4530-9a6c-3aefba5692a6/logo-discord.jpeg"
    },{
        name: "Test 2",
        description: "Тестовое сообщество second",
        avatarLink: "https://storage.yandexcloud.net/space21staging/ed09884f-fc9c-4530-9a6c-3aefba5692a6/logo-discord.jpeg"
    }]


    if (results.length === 0) return <div>No results found.</div>;

    return (
        <ul className="space-y-4">
            {results.map((result, index) => (
                <li key={index} className="p-4 border rounded-lg shadow">
                    <h2 className="text-xl font-semibold">{result.name}</h2>
                    <p>{result.description}</p>
                    <img src={result.avatarLink} alt="avatar" className="w-12 h-12 rounded-full" />
                </li>
            ))}
        </ul>
    );
};

export default ResultsList;