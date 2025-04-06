import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box, Typography, Button, Skeleton, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, TextField, FormControlLabel, Switch, MenuItem,
    CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { ApiRoutes } from "../../lib/routes/const/apiRoutes";
import Header from "../Header/Header";
import { POST_PERMISSIONS, SOCIETY_FORMATS } from "../../lib/consts/society";
import SocietyAvatar from "../SocietyAvatar/SocietyAvatar";

const Tags = [{
    value: 1,
    label: 'программирование',
},
{
    value: 2,
    label: 'мафия',
}, {
    value: 3,
    label: 'кибербезопасноcть',
}];

export interface SocietyDetails {
    name: string;
    photo_url: string;
    format_id: number;
    post_permission_id: number;
    is_search: boolean;
    count_subscribe: number;
    description: string;
    tags: number[];
    can_edit_society: boolean;
}

export const SocietyPage = () => {
    const { uuid } = useParams();
    const [society, setSociety] = useState<SocietyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [editing, setEditing] = useState<SocietyDetails | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSocietyData = async () => {
            try {
                const response = await axios.get(ApiRoutes.society(), {
                    params: { society_id: uuid },
                    withCredentials: true
                });
                setSociety(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке данных сообщества:", error);
            } finally {
                setLoading(false);
            }
        };

        if (uuid) {
            fetchSocietyData();
        }
    }, [uuid]);

    const handleSubscribe = () => {
        setLoadingSubscription(true);
        alert('Функция подписки находится в разработке');
        setLoadingSubscription(false);
    };

    const handleEditOpen = () => {
        if (society) {
            setEditing({ ...society });
            setIsDialogOpen(true);
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setEditing(null);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof SocietyDetails
    ) => {
        const value = e.target.value;
        setEditing((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                [field]: field === "format_id" || field === "post_permission_id" || field === "count_subscribe"
                    ? Number(value)
                    : value,
            };
        });
    };

    const handleSaveSociety = () => {
        if (!editing) return;

        setSaving(true);

        axios.put(ApiRoutes.society(), { ...editing, societyUUID: uuid }, {
            withCredentials: true
        })
            .then(response => {
                if (response.status === 200) {
                    setIsDialogOpen(false);
                    setSociety({ ...editing });
                }
            })
            .catch(error => {
                console.warn("Ошибка при создании сообщества:", error);
            })
            .finally(() => {
                setSaving(false);
            });
    };


    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                    <Box maxWidth={900} width="100%" className="bg-white rounded-lg shadow-lg p-6">
                        <Skeleton variant="rectangular" height={200} />
                        <Skeleton variant="text" height={60} width="50%" />
                        <Skeleton variant="text" height={40} width="30%" />
                    </Box>
                </div>
            </>
        );
    }

    if (!society) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                    <Typography variant="h5">Сообщество не найдено</Typography>
                </div>
            </>
        );
    }

    const formatLabel = SOCIETY_FORMATS.find(f => f.value === society.format_id)?.label || "Неизвестный формат";
    const permissionLabel = POST_PERMISSIONS.find(p => p.value === society.post_permission_id)?.label || "Неизвестные разрешения";

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <Box maxWidth={900} width="100%" className="bg-white rounded-lg shadow-lg">
                    <Box className="relative h-48 bg-gray-200" p={3}>
                        <SocietyAvatar
                            societyUUID={uuid!}
                            currentUrl={society.photo_url}
                            canEdit={society.can_edit_society}
                            onChange={(newUrl) => {
                                setSociety(prev => prev ? { ...prev, photo_url: newUrl } : prev);
                            }}
                        />
                    </Box>

                    <Box className="p-6 pt-12 relative">
                        {society.can_edit_society &&
                            <div className="absolute top-0 right-0 mt-2 mr-4 flex flex-row items-center">
                                <IconButton onClick={handleEditOpen}>
                                    <EditIcon />
                                </IconButton>
                            </div>
                        }
                        <div className="flex justify-between items-start">
                            <div>
                                <Typography variant="h4" className="font-bold">
                                    {society.name}
                                </Typography>
                                <Typography variant="body1" color="textSecondary" className="mt-2">
                                    {formatLabel} • {permissionLabel}
                                </Typography>
                                <Typography variant="body2" style={{ marginTop: "10px" }}>
                                    {society.count_subscribe} подписчиков
                                </Typography>
                                <Typography variant="body2" style={{ marginTop: "20px" }}>
                                    {society.description}
                                </Typography>
                                <Typography
                                    variant="body2"

                                    sx={{ fontStyle: "italic", color: "gray", marginTop: "20px" }}
                                >
                                    {Tags.map((tag) => (
                                        <span key={tag.value}>#{tag.label} </span>
                                    ))}
                                </Typography>

                            </div>
                            <Button
                                variant="contained"
                                onClick={handleSubscribe}
                                disabled={loadingSubscription}
                                style={{ alignSelf: 'end' }}
                            >
                                Подписаться
                            </Button>
                        </div>

                        {society.is_search && (
                            <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <Typography variant="body2" color="primary">
                                    Это сообщество можно найти в поиске
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            </div>

            <Dialog open={isDialogOpen} maxWidth="sm" fullWidth transitionDuration={0}>
                <DialogTitle>Редактирование информации</DialogTitle>
                <DialogContent>
                    {editing && (
                        <Box>
                            <FormControl style={{ gap: "10px", width: "100%", marginTop: "10px" }}>
                                <TextField
                                    onChange={(e) => handleInputChange(e, "name")}
                                    value={editing.name}
                                    variant="outlined"
                                    label="Название сообщества"
                                    margin="dense"
                                    fullWidth
                                    required
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={editing.is_search}
                                            onChange={(e) => setEditing(prev => prev ? { ...prev, isSearch: e.target.checked } : prev)}
                                        />
                                    }
                                    label="Поисковое сообщество"
                                />
                                <TextField
                                    select
                                    label="Формат сообщества"
                                    value={editing.format_id}
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
                                    value={editing.post_permission_id}
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
                                <TextField
                                    select
                                    multiline
                                    label="Теги"
                                    value={editing.tags || []}
                                    onChange={(e) => handleInputChange(e, "tags")}
                                    fullWidth
                                    margin="dense"
                                    SelectProps={{
                                        multiple: true,
                                    }}
                                >
                                    {Tags.map(tag => (
                                        <MenuItem key={tag.value} value={tag.value}>
                                            {tag.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <TextField
                                    label="Описание"
                                    value={editing.description}
                                    onChange={(e) => handleInputChange(e, "description")}
                                    fullWidth
                                    margin="dense"
                                    rows={5}
                                    multiline
                                >
                                </TextField>
                            </FormControl>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Отмена</Button>
                    <Button
                        onClick={handleSaveSociety}
                        variant="contained"
                        disabled={saving}
                        startIcon={saving && <CircularProgress size={18} color="inherit" />}
                    >
                        {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
