import { Box, Grid2, TextField, Typography, Pagination } from "@mui/material";
import Header from "../Header/Header";
import PeerCard from "../PeerCard/PeerCard";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ApiRoutes } from "../../lib/routes";

export interface PeerData {
    uuid: string,
    nickname: string,
    name: string,
    surname: string,
    avatar_link: string,
    is_friend: boolean,
}

export const PeerSearch = () => {
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [debouncedText, setDebouncedText] = useState<string>("");
    const [isEmpty, setIsEmpty] = useState(false);
    
    // Добавляем состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
        setCurrentPage(1); // Сбрасываем страницу при новом поиске
    };

    // Обработчик изменения страницы
    const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // Дебаунс на ввод
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedText(searchText);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchText]);

    // Функция для получения данных пиров
    const fetchPeers = useCallback(
        async (nickname = "") => {
            try {
                const response = await axios.get(ApiRoutes.search(), {
                    params: {
                        type: "peer",
                        offset: (currentPage - 1) * itemsPerPage, // Вычисляем смещение
                        limit: itemsPerPage,
                        nickname,
                    },
                    withCredentials: true,
                });

                if (response.data.users?.length) {
                    setPeers(response.data.users);
                    setIsEmpty(false);
                    // Вычисляем общее количество страниц
                    const total = Math.ceil(response.data.total / itemsPerPage);
                    setTotalPages(total || 1);
                } else {
                    setIsEmpty(true);
                    setTotalPages(1);
                }
            } catch (error) {
                console.warn("Ошибка при загрузке данных: ", error);
                setIsEmpty(true);
                setTotalPages(1);
            }
        },
        [currentPage] // Добавляем зависимость от currentPage
    );

    // Удаляем второй эффект и модифицируем первый
    useEffect(() => {
        // Функция для выполнения запроса
        const executeFetch = async () => {
            if (debouncedText.trim() !== "") {
                await fetchPeers(debouncedText);
            } else {
                await fetchPeers();
            }
        };

        executeFetch();
    }, [debouncedText, fetchPeers]);

    return (
        <div>
            <Header />

            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <Box maxWidth={900} width={"100%"}>
                    <TextField 
                        fullWidth 
                        label="Поиск пиров" 
                        id="fullWidth" 
                        placeholder="Введите текст" 
                        margin="normal" 
                        onInput={handleSearchChange} 
                    />

                    {isEmpty ? (
                        <Typography mt={2} mb={2}>
                            Никто не нашёлся по указанному запросу :(
                        </Typography>
                    ) : (
                        <>
                            <Grid2 container spacing={3} mt={3}>
                                {peers.map(peer => (
                                    <Grid2 key={peer.uuid} size={6} display={"flex"}>
                                        <PeerCard {...peer} />
                                    </Grid2>
                                ))}
                            </Grid2>
                            
                            {/* Добавляем компонент пагинации */}
                            <Box display="flex" justifyContent="center" mt={4} mb={4}>
                                <Pagination 
                                    count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </div>
        </div>
    );
};

export default PeerSearch;
