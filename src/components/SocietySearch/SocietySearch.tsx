import React, { useState, useEffect, useCallback } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Switch,
    MenuItem,
    Card,
    CardContent,
    InputAdornment,
    useTheme
} from "@mui/material";
import { Grid } from "@mui/material";
import { ApiRoutes } from "../../lib/routes";
import { useNavigate } from "react-router-dom";
import { SocietyCard } from "../SocietyCard/SocietyCard";
import Notification from "../Notification/Notification";
import { AppRoutes } from "../../lib/routes/const/appRoutes";
import { POST_PERMISSIONS, SOCIETY_FORMATS } from "../../lib/consts/society";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import api from "../../lib/api/api";

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

export const SocietySearch = () => {
    const navigate = useNavigate();
    const theme = useTheme();
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
                const response = await api.get(ApiRoutes.search(), {
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
        api.post(ApiRoutes.society(), newSociety, {
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
                    navigate(AppRoutes.society(response.data.societyUUID));
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
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Поиск сообществ
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                        color="secondary"
                        startIcon={<AddIcon />}
                    >
                        Создать сообщество
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Найти сообщество"
                    placeholder="Введите название сообщества"
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
                            Сообщества не найдены :(
                        </Typography>
                    </Box>
                ) : (
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        {societies.map(society => (
                            <Grid item xs={12} sm={6} key={society.uuid}>
                                <SocietyCard {...society} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </CardContent>

            <Dialog
                open={isDialogOpen}
                maxWidth="sm"
                fullWidth
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6">Создание сообщества</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ py: 1 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                onChange={(e) => handleInputChange(e, "name")}
                                value={newSociety.name}
                                variant="outlined"
                                label="Название сообщества"
                                margin="dense"
                                fullWidth
                                required
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                select
                                label="Формат сообщества"
                                value={newSociety.format_id}
                                onChange={(e) => handleInputChange(e, "format_id")}
                                margin="dense"
                            >
                                {SOCIETY_FORMATS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                select
                                label="Права на публикацию"
                                value={newSociety.post_permission_id}
                                onChange={(e) => handleInputChange(e, "post_permission_id")}
                                margin="dense"
                            >
                                {POST_PERMISSIONS.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={newSociety.is_search}
                                    onChange={(e) => setNewSociety({ ...newSociety, is_search: e.target.checked })}
                                    color="secondary"
                                />
                            }
                            label="Отображать в поиске"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={handleClose}
                        color="inherit"
                        variant="outlined"
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSaveSociety}
                        color="secondary"
                        variant="contained"
                        disabled={!newSociety.name}
                    >
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
        </Card>
    );
};

export default SocietySearch;
