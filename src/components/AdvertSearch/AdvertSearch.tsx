import React, { useState } from "react";
import { Box, TextField, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Checkbox, ListItemText } from "@mui/material";
import axios from "axios";
import Header from "../Header/Header";
import { ApiRoutes } from "../../lib/routes";
import { OS_TYPES } from "../../lib/consts/advert";
import Notification from "../Notification/Notification";

interface NewAdvert {
    uuid: string;
    text: string;
    user: {
        os: number[];
    };
    expires_at: string;
}

export const AdvertSearch = () => {
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
        
        axios.post(ApiRoutes.advert(), submitData, {
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
        <div>
            <Header />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <Box maxWidth={900} width="100%">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h4" sx={{ mb: 3 }}>Рекламные кампании</Typography>
                        <Button 
                            variant="contained" 
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Создать кампанию
                        </Button>
                    </div>

                    <TextField 
                        fullWidth 
                        label="Поиск кампаний" 
                        placeholder="Введите текст для поиска" 
                        margin="normal"
                    />

                    <Typography mt={2} color="text.secondary">
                        Функция поиска находится в разработке
                    </Typography>
                </Box>

                <Dialog 
                    open={isDialogOpen} 
                    maxWidth="sm" 
                    fullWidth
                    onClose={handleClose}
                >
                    <DialogTitle>Создание рекламной кампании</DialogTitle>
                    <DialogContent>
                        <Box sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ gap: 2 }}>
                                <TextField
                                    multiline
                                    rows={4}
                                    value={newAdvert.text}
                                    onChange={(e) => handleInputChange('text', e.target.value)}
                                    label="Текст рекламы"
                                    required
                                />

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
                                >
                                    {OS_TYPES.map((os) => (
                                        <MenuItem key={os.value} value={os.value}>
                                            <Checkbox checked={newAdvert.user.os.includes(os.value)} />
                                            <ListItemText primary={os.label} />
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    type="datetime-local"
                                    label="Дата окончания"
                                    value={newAdvert.expires_at}
                                    onChange={(e) => handleInputChange('expires_at', e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Отмена
                        </Button>
                        <Button 
                            onClick={handleSaveAdvert} 
                            variant="contained"
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
            </div>
        </div>
    );
}; 