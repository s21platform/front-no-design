import React, { useState } from "react";
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
    MenuItem,
    Checkbox,
    ListItemText,
    Card,
    CardContent,
    useTheme,
    InputAdornment
} from "@mui/material";
import { ApiRoutes } from "../../lib/routes";
import { OS_TYPES } from "../../lib/consts/advert";
import Notification from "../Notification/Notification";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import api from "../../lib/api/api";

interface NewAdvert {
    uuid: string;
    text: string;
    user: {
        os: number[];
    };
    expires_at: string;
}

export const AdvertSearch = () => {
    const theme = useTheme();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [newAdvert, setNewAdvert] = useState<NewAdvert>({
        uuid: "",
        text: "",
        user: {
            os: []
        },
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
    });
    const [notification, setNotification] = useState<{ message: string; type: "error" | "success" } | null>(null);

    const handleInputChange = (field: string, value: any) => {
        if (field === 'user.os') {
            setNewAdvert(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    os: value
                }
            }));
        } else {
            setNewAdvert(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSaveAdvert = () => {
        const submitData = {
            ...newAdvert,
            expires_at: new Date(newAdvert.expires_at).toISOString()
        };

        api.post(ApiRoutes.advert(), submitData, {
            withCredentials: true
        })
        .then(response => {
            if (response.status === 200) {
                setNotification({
                    message: "Рекламная кампания успешно создана",
                    type: "success"
                });
                handleClose();
            }
        })
        .catch((error: unknown) => {
            if (error instanceof Error) {
                console.error('Error:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
            setNotification({
                message: "Ошибка при создании рекламной кампании",
                type: "error"
            });
        });
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setNewAdvert({
            uuid: "",
            text: "",
            user: {
                os: []
            },
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
        });
    };

    return (
        <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold">
                        Рекламные кампании
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setIsDialogOpen(true)}
                        color="secondary"
                        startIcon={<AddIcon />}
                    >
                        Создать кампанию
                    </Button>
                </Box>

                <TextField
                    fullWidth
                    variant="outlined"
                    label="Поиск кампаний"
                    placeholder="Введите текст для поиска"
                    margin="normal"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />

                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                        Функция поиска находится в разработке
                    </Typography>
                </Box>
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
                    <Typography variant="h6">Создание рекламной кампании</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ py: 1 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                multiline
                                rows={4}
                                value={newAdvert.text}
                                onChange={(e) => handleInputChange('text', e.target.value)}
                                label="Текст рекламы"
                                required
                                variant="outlined"
                                margin="dense"
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                select
                                label="Целевые ОС"
                                value={newAdvert.user.os}
                                onChange={(e) => handleInputChange('user.os', typeof e.target.value === 'string' ? e.target.value.split(',').map(Number) : e.target.value)}
                                SelectProps={{
                                    multiple: true,
                                    renderValue: (selected: unknown) =>
                                        ((selected as number[])
                                            .map(value => OS_TYPES.find(os => os.value === value)?.label)
                                            .join(', '))
                                }}
                                variant="outlined"
                                margin="dense"
                            >
                                {OS_TYPES.map((os) => (
                                    <MenuItem key={os.value} value={os.value}>
                                        <Checkbox checked={newAdvert.user.os.includes(os.value)} color="secondary" />
                                        <ListItemText primary={os.label} />
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 1 }}>
                            <TextField
                                type="datetime-local"
                                label="Дата окончания"
                                value={newAdvert.expires_at}
                                onChange={(e) => handleInputChange('expires_at', e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="outlined"
                                margin="dense"
                            />
                        </FormControl>
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
                        onClick={handleSaveAdvert}
                        variant="contained"
                        color="secondary"
                        disabled={!newAdvert.text || newAdvert.user.os.length === 0}
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

export default AdvertSearch;
