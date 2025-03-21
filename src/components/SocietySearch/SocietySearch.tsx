import React, { useState, useEffect, useCallback } from "react";
import { Box, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Switch, MenuItem } from "@mui/material";
import { Grid } from "@mui/material";
import axios from "axios";
import Header from "../Header/Header";
import { ApiRoutes } from "../../lib/routes";
import { useNavigate } from "react-router-dom";
import { SocietyCard } from "../SocietyCard/SocietyCard";
import Notification from "../Notification/Notification";

interface SocietyData {
    uuid: string;
    name: string;
    description: string;
    is_private: boolean;
}

interface NewSociety {
    name: string;
    format_id: number;
    post_permission_id: number;
    is_search: boolean;
}

const POST_PERMISSIONS = [
    {
        value: 1,
        label: "Модераторы • комментарии выкл."
    },
    {
        value: 2,
        label: "Все • комментарии выкл."
    },
    {
        value: 3,
        label: "Модераторы • комментарии вкл."
    },
    {
        value: 4,
        label: "Все • комментарии вкл."
    }
];

const SOCIETY_FORMATS = [
    {
        value: 1,
        label: "Открытое"
    },
    {
        value: 2,
        label: "Закрытое"
    },
    {
        value: 3,
        label: "Платное"
    }
];

export const SocietySearch = () => {
    const navigate = useNavigate();
    const [societies, setSocieties] = useState<SocietyData[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [debouncedText, setDebouncedText] = useState<string>("");
    const [isEmpty, setIsEmpty] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newSociety, setNewSociety] = useState<NewSociety>({
        name: "",
        format_id: 1,
        post_permission_id: 1,
        is_search: false
    });
    const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

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

    // Функция для получения данных сообществ
    const fetchSocieties = useCallback(
        async (name = "") => {
            try {
                const response = await axios.get(ApiRoutes.search(), {
                    params: {
                        type: "society",
                        offset: 0,
                        limit: 10,
                        name,
                    },
                    withCredentials: true,
                });

                if (response.data.societies?.length) {
                    setSocieties(response.data.societies);
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
            fetchSocieties(debouncedText);
        } else {
            fetchSocieties();
        }
    }, [debouncedText, fetchSocieties]);

    // Дефолтный запрос при загрузке страницы
    useEffect(() => {
        fetchSocieties();
    }, [fetchSocieties]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setNewSociety({
            ...newSociety,
            [field]: e.target.value
        });
    };

    const handleSaveSociety = () => {
        axios.post(ApiRoutes.society(), newSociety, {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 201) {
                    setIsDialogOpen(false);
                    fetchSocieties(); // Обновляем список сообществ
                    setNotification({
                        message: "Сообщество успешно создано",
                        type: "success"
                    });
                }
            })
            .catch(error => {
                let message = "Ошибка при создании сообщества";
                if (error.response?.data) {
                    message = error.response.data;
                }
                setNotification({
                    message: message,
                    type: "error"
                });
                console.warn("Ошибка при создании сообщества:", error);
            });
    };

    // Добавим функцию для обработки закрытия
    const handleClose = () => {
        setIsDialogOpen(false);
        setNewSociety({
            name: "",
            format_id: 1,
            post_permission_id: 1,
            is_search: false
        });
    };

    return (
        <div>
            <Header />

            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <Box maxWidth={900} width={"100%"}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Поиск сообществ</h1>
                        <Button 
                            variant="contained" 
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Создать сообщество
                        </Button>
                    </div>

                    <TextField 
                        fullWidth 
                        label="Поиск сообществ" 
                        id="fullWidth" 
                        placeholder="Введите название сообщества" 
                        margin="normal" 
                        onInput={handleSearchChange} 
                    />

                    {isEmpty ? (
                        <Typography mt={2} mb={2}>
                            Сообщества не найдены :(
                        </Typography>
                    ) : (
                        <Grid container spacing={3} mt={3}>
                            {societies.map(society => (
                                <Grid key={society.uuid} xs={6} display={"flex"}>
                                    <SocietyCard {...society} />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </div>

            <Dialog 
                open={isDialogOpen} 
                maxWidth="sm" 
                fullWidth
                onClose={handleClose}
            >
                <DialogTitle>Создание сообщества</DialogTitle>
                <DialogContent>
                    <Box>
                        <FormControl style={{ gap: "10px", width: "100%", marginTop: "10px" }}>
                            <TextField
                                onChange={(e) => handleInputChange(e, "name")}
                                value={newSociety.name}
                                variant="outlined"
                                label="Название сообщества"
                                margin="dense"
                                fullWidth
                                required
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={newSociety.is_search}
                                        onChange={(e) => setNewSociety({
                                            ...newSociety,
                                            is_search: e.target.checked
                                        })}
                                    />
                                }
                                label="Поисковое сообщество"
                            />
                            <TextField
                                select
                                label="Формат сообщества"
                                value={newSociety.format_id}
                                onChange={(e) => handleInputChange(e, "format_id")}
                                fullWidth
                                margin="dense"
                            >
                                {SOCIETY_FORMATS.map(format => (
                                    <MenuItem key={format.value} value={format.value}>
                                        {format.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label="Разрешения на посты"
                                value={newSociety.post_permission_id}
                                onChange={(e) => handleInputChange(e, "post_permission_id")}
                                fullWidth
                                margin="dense"
                            >
                                {POST_PERMISSIONS.map(permission => (
                                    <MenuItem key={permission.value} value={permission.value}>
                                        {permission.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button onClick={handleSaveSociety} variant="contained">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}; 