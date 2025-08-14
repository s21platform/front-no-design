import { Box, TextField, Typography, Pagination, Card, Grid, Container, useTheme } from "@mui/material";
import PeerCard from "../PeerCard/PeerCard";
import { useCallback, useEffect, useState } from "react";
import { ApiRoutes } from "../../lib/routes";
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from "@mui/material";
import api from "../../lib/api/api";

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
    const theme = useTheme();

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
                const response = await api.get(ApiRoutes.search(), {
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
        <Card elevation={2} sx={{ borderRadius: 2, p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
                Поиск пиров
            </Typography>

            <TextField
                fullWidth
                variant="outlined"
                label="Найти пира"
                placeholder="Введите имя пользователя"
                margin="normal"
                value={searchText}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
            />

            {isEmpty ? (
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Никто не нашёлся по указанному запросу :(
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {peers.map(peer => (
                            <Grid item xs={12} sm={6} key={peer.uuid}>
                                <PeerCard {...peer} />
                            </Grid>
                        ))}
                    </Grid>

                    <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="secondary"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: theme.palette.text.primary,
                                }
                            }}
                        />
                    </Box>
                </>
            )}
        </Card>
    );
};

export default PeerSearch;
