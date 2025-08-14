import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Skeleton,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    TextField,
    FormControlLabel,
    Switch,
    MenuItem,
    CircularProgress,
    Card,
    CardContent,
    Paper,
    Divider,
    Chip,
    Grid,
    useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import { ApiRoutes } from "../../lib/routes/const/apiRoutes";
import { POST_PERMISSIONS, SOCIETY_FORMATS } from "../../lib/consts/society";
import SocietyAvatar from "../SocietyAvatar/SocietyAvatar";
import api from "../../lib/api/api";

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
    uuid: string;
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
    const theme = useTheme();
    const [society, setSociety] = useState<SocietyDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingSubscription, setLoadingSubscription] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [editing, setEditing] = useState<SocietyDetails | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSocietyData = async () => {
            try {
                const response = await api.get(ApiRoutes.society(), {
                    params: { society_id: uuid },
                    withCredentials: true
                });

                const societyData = response.data;
                const avatarRes = await api.get(ApiRoutes.societyAvatar(), {
                    params: { societyUUID: uuid },
                    withCredentials: true
                });

                const avatars = avatarRes.data?.avatar_list;

                if (Array.isArray(avatars) && avatars.length > 0) {
                    societyData.photo_url = avatars[0].link;
                }

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

        api.put(ApiRoutes.society(), { ...editing, societyUUID: uuid }, {
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

    const handleJoinSociety = async () => {
        if (!uuid) {
            console.error('Society UUID is not available');
            return;
        }

        setLoadingSubscription(true);
        try {
            await api.post(ApiRoutes.societyJoin(uuid));
            // Обновляем данные сообщества после успешного присоединения
            const response = await api.get(ApiRoutes.society(), {
                params: { society_id: uuid },
                withCredentials: true
            });
            setSociety(response.data);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
            } else {
                console.error('An unknown error occurred');
            }
        } finally {
            setLoadingSubscription(false);
        }
    };

    if (loading) {
        return (
            <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 0 }}>
                    <Skeleton variant="rectangular" height={200} />
                    <Box sx={{ p: 3 }}>
                        <Skeleton variant="text" height={60} width="50%" />
                        <Skeleton variant="text" height={40} width="30%" />
                        <Skeleton variant="text" height={20} width="80%" sx={{ mt: 2 }} />
                        <Skeleton variant="text" height={20} width="70%" />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (!society) {
        return (
            <Card elevation={2} sx={{ borderRadius: 2, p: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.primary">Сообщество не найдено</Typography>
            </Card>
        );
    }

    const formatLabel = SOCIETY_FORMATS.find(f => f.value === society.format_id)?.label || "Неизвестный формат";
    const permissionLabel = POST_PERMISSIONS.find(p => p.value === society.post_permission_id)?.label || "Неизвестные разрешения";

    return (
        <Card elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            {/* Область аватара */}
            <Box
                sx={{
                    position: 'relative',
                    height: 200,
                    bgcolor: 'background.paper',
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1))',
                    p: 3
                }}
            >
                <SocietyAvatar
                    societyUUID={uuid!}
                    currentUrl={society.photo_url}
                    canEdit={society.can_edit_society}
                    onChange={(newUrl) => {
                        setSociety(prev => prev ? { ...prev, photo_url: newUrl } : prev);
                    }}
                />
            </Box>

            <CardContent sx={{ p: 4, position: 'relative' }}>
                {/* Кнопка редактирования */}
                {society.can_edit_society && (
                    <IconButton
                        onClick={handleEditOpen}
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                    >
                        <EditIcon />
                    </IconButton>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        {/* Название и информация */}
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {society.name}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                            <Chip
                                icon={<SettingsIcon fontSize="small" />}
                                label={formatLabel}
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                icon={<PeopleIcon fontSize="small" />}
                                label={`${society.count_subscribe} подписчиков`}
                                variant="outlined"
                                size="small"
                            />
                            {society.is_search && (
                                <Chip
                                    icon={<VisibilityIcon fontSize="small" />}
                                    label="Отображается в поиске"
                                    variant="outlined"
                                    size="small"
                                    color="info"
                                />
                            )}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Описание */}
                        <Typography variant="body1" paragraph>
                            {society.description}
                        </Typography>

                        {/* Теги */}
                        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {Tags.map((tag) => (
                                <Chip
                                    key={tag.value}
                                    icon={<LabelIcon fontSize="small" />}
                                    label={tag.label}
                                    size="small"
                                    color="default"
                                    sx={{ bgcolor: 'background.paper' }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        {/* Кнопка подписки */}
                        <Button
                            variant="contained"
                            color="secondary"
                            size="medium"
                            onClick={handleSubscribe}
                            disabled={loadingSubscription}
                            startIcon={!loadingSubscription && <PeopleIcon fontSize="small" />}
                            sx={{
                                minWidth: 'auto',
                                px: 2,
                                py: 1,
                                borderRadius: 1.5,
                                fontSize: '0.9rem',
                                textTransform: 'none',
                                alignSelf: { xs: 'flex-start', md: 'flex-end' }
                            }}
                        >
                            {loadingSubscription ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Подписаться"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>

            {/* Диалог редактирования сообщества */}
            <Dialog
                open={isDialogOpen}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }
                }}
            >
                <DialogTitle>
                    <Typography variant="h6">Редактирование информации</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {editing && (
                        <Box sx={{ py: 1 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <TextField
                                    onChange={(e) => handleInputChange(e, "name")}
                                    value={editing.name}
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
                                    value={editing.format_id}
                                    onChange={(e) => handleInputChange(e, "format_id")}
                                    margin="dense"
                                >
                                    {SOCIETY_FORMATS.map(format => (
                                        <MenuItem key={format.value} value={format.value}>
                                            {format.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    label="Разрешения на посты"
                                    value={editing.post_permission_id}
                                    onChange={(e) => handleInputChange(e, "post_permission_id")}
                                    margin="dense"
                                >
                                    {POST_PERMISSIONS.map(permission => (
                                        <MenuItem key={permission.value} value={permission.value}>
                                            {permission.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    label="Теги"
                                    value={editing.tags || []}
                                    onChange={(e) => handleInputChange(e, "tags")}
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
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <TextField
                                    label="Описание"
                                    value={editing.description}
                                    onChange={(e) => handleInputChange(e, "description")}
                                    margin="dense"
                                    rows={5}
                                    multiline
                                />
                            </FormControl>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={editing.is_search}
                                        onChange={(e) => setEditing(prev => prev ? { ...prev, is_search: e.target.checked } : prev)}
                                        color="secondary"
                                    />
                                }
                                label="Отображать в поиске"
                            />
                        </Box>
                    )}
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
                        variant="contained"
                        color="secondary"
                        disabled={saving}
                        startIcon={saving && <CircularProgress size={18} color="inherit" />}
                    >
                        {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};
