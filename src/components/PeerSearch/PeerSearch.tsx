
import { Box, Grid2, TextField, Typography } from "@mui/material";
import Header from "../Header/Header";
import PeerCard from "../PeerCard/PeerCard";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ApiRoutes } from "../../lib";

export interface PeerData {
    uuid: string,
    nickname: string,
    name: string,
    surname: string,
    avatar_link: string,
    is_friend: boolean,
}

export const PeerSearch = () => {
    // TODO: доделать подгрузку данных (пагинация / бесконечный скролл)
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [debouncedText, setDebouncedText] = useState<string>("");
    const [isEmpty, setIsEmpty] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
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
        async (nickname: string = "") => {
            try {
                const response = await axios.get(ApiRoutes.search(), {
                    params: {
                        type: "peer",
                        offset: 0,
                        limit: 10,
                        nickname,
                    },
                    withCredentials: true,
                });

                if (response.data.users.length) {
                    setPeers(response.data.users);
                    setIsEmpty(false);
                } else {
                    setIsEmpty(true);
                }
            } catch (error) {
                console.warn("Ошибка при загрузке данных: ", error);
            }
        },
        []
    );

    // Запрос на сервер после дебаунса
    useEffect(() => {
        if (debouncedText.trim() !== "") {
            fetchPeers(debouncedText);
        } else {
            fetchPeers();
        }
    }, [debouncedText, fetchPeers]);

    // Дефолтный запрос при загрузке страницы
    useEffect(() => {
        fetchPeers();
    }, [fetchPeers]);

    return (
        <div>
            <Header />

            <div className="min-h-screen bg-gray-100 flex flex-col items-center  p-6">
                <Box maxWidth={900} width={"100%"} >
                    <TextField fullWidth label="Поиск пиров" id="fullWidth" placeholder="Введите текст" margin="normal" onInput={handleSearchChange} />

                    {isEmpty ? <Typography mt={2} mb={2}>Никто не нашёлся по указанному запросу :(</Typography> :
                        <Grid2 container spacing={3} mt={3}>
                            {peers.map(peer => (
                                <Grid2 key={peer.uuid} size={6} display={"flex"}>
                                    <PeerCard {...peer} />
                                </Grid2>
                            ))}
                        </Grid2>
                    }
                </Box>
            </div>
        </div>
    );
}

export default PeerSearch;
