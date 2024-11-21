import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Header from "../components/Header/Header";
import {FilterParams} from "../components/Search/types";
import Filters from "../components/Search/Filters";
import ResultsList from "../components/Search/Result";



const SearchPage: React.FC = () => {
    const { pathname } = useLocation();
    // const history = useHistory();
    const { type } = useParams<{ type?: string }>(); // path param для типа поиска
    const [filters, setFilters] = useState<FilterParams>({});
    const [results, setResults] = useState<any[]>([]);

    // Функция для обновления фильтров в URL и состоянии
    const updateFilters = (newFilters: Partial<FilterParams>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    // Функция для отправки запроса на API
    const fetchData = async () => {
        const queryParams = new URLSearchParams(filters as any).toString();
        const apiUrl = `/api/search?type=${type || filters.type?.join(',')}&${queryParams}`;

        try {
            const { data } = await axios.get(apiUrl);
            setResults(data.results); // Предполагаем, что API возвращает массив результатов
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Обновляем URL при изменении фильтров
    // useEffect(() => {
    //     const searchParams = new URLSearchParams(filters as any).toString();
    //     // history.replace({ search: searchParams });
    // }, [filters]);

    // Запрашиваем данные при изменении типа или фильтров
    useEffect(() => {
        fetchData();
    }, [type, filters]);

    return (
        <>
            <Header/>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Search</h1>
                <Filters type={type} onFilterChange={updateFilters} /> {/* Компонент фильтров */}
                <ResultsList results={results} /> {/* Компонент для вывода результатов */}
            </div>
        </>
    );
};

export default SearchPage;
