import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNotifications } from '../../../contexts/NotificationContext';
import type { Notification } from '../../../contexts/NotificationContext';
import {
    Badge,
    IconButton,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Popper,
    Fade,
    ClickAwayListener,
    styled,
    Divider,
    Tooltip,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { ApiRoutes } from '../../../lib/routes';

const StyledPopper = styled(Popper)(({ theme }) => ({
    zIndex: 1000,
    width: 360,
    '&[data-popper-placement*="bottom"] .arrow': {
        top: 0,
        left: 0,
        marginTop: '-0.9em',
        width: '3em',
        height: '1em',
        '&::before': {
            borderWidth: '0 1em 1em 1em',
            borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
        },
    },
}));

const NotificationItem = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: 'background-color 0.2s ease',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child': {
        borderBottom: 'none',
    },
}));

const EmptyState = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.text.secondary,
    '& svg': {
        fontSize: 48,
        marginBottom: theme.spacing(2),
        color: theme.palette.action.disabled,
    },
}));

const LoadingState = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const NotificationDivider = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.9)' 
        : 'rgba(255, 255, 255, 0.9)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    borderTop: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: '56px', // Высота заголовка
    zIndex: 1,
    backdropFilter: 'blur(8px)',
}));

const formatNotificationDate = (date: string) => {
    return format(new Date(date), 'dd MMM, HH:mm', { locale: ru });
};

// Компонент для отдельного уведомления с отслеживанием видимости
const NotificationListItem: React.FC<{
    notification: Notification;
    onVisible?: () => void;
    isDropdownOpen: boolean;
}> = ({ notification, onVisible, isDropdownOpen }) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const visibilityStartTime = useRef<number | null>(null);
    const [isFullyVisible, setIsFullyVisible] = useState(false);

    useEffect(() => {
        if (!isDropdownOpen) {
            setIsFullyVisible(false);
            visibilityStartTime.current = null;
        }
    }, [isDropdownOpen]);

    useEffect(() => {
        if (!notification.isRead && isDropdownOpen) {
            observerRef.current = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    const isVisible = entry.isIntersecting;
                    
                    if (isVisible && !visibilityStartTime.current) {
                        visibilityStartTime.current = Date.now();
                        setIsFullyVisible(true);
                    } else if (!isVisible) {
                        visibilityStartTime.current = null;
                        setIsFullyVisible(false);
                    }

                    // Если элемент видим более 2 секунд и не был прочитан
                    if (isVisible && 
                        visibilityStartTime.current && 
                        Date.now() - visibilityStartTime.current >= 2000 && 
                        !notification.isRead) {
                        onVisible?.();
                    }
                },
                { 
                    threshold: 0.9, // Увеличиваем порог видимости до 90%
                    rootMargin: '-10px' // Уменьшаем отступ для более точного определения
                }
            );

            if (elementRef.current) {
                observerRef.current.observe(elementRef.current);
            }
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [notification.isRead, onVisible, isDropdownOpen]);

    return (
        <NotificationItem
            ref={elementRef}
            sx={{
                backgroundColor: notification.isRead ? 'background.default' : 'action.hover',
                transition: 'all 0.3s ease-in-out',
                transform: isFullyVisible ? 'scale(1.01)' : 'scale(1)',
                position: 'relative',
                '&::before': !notification.isRead ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: 'primary.main',
                    borderRadius: '4px 0 0 4px'
                } : {}
            }}
        >
            <Typography variant="body1" gutterBottom>
                {notification.text}
            </Typography>
            {notification.created_at && (
                <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ 
                        display: 'block', 
                        mt: 1,
                        opacity: notification.isRead ? 0.7 : 1,
                        transition: 'opacity 0.3s ease-in-out'
                    }}
                >
                    {formatNotificationDate(notification.created_at)}
                </Typography>
            )}
        </NotificationItem>
    );
};

const NotificationWidget: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [newNotificationsCount, setNewNotificationsCount] = useState<number>(0);
    const anchorRef = useRef<HTMLButtonElement>(null);
    const offsetAdjustmentRef = useRef<number>(0);
    
    const {
        notifications,
        unreadCount,
        loadMoreNotifications,
        refreshNotifications,
        markSingleNotificationAsRead,
        hasMore,
        isInitialLoad,
    } = useNotifications();

    // Группируем уведомления на новые и прочитанные
    const { unreadNotifications, readNotifications } = useMemo(() => ({
        unreadNotifications: notifications.filter(n => !n.isRead),
        readNotifications: notifications.filter(n => n.isRead)
    }), [notifications]);

    // Отслеживаем новые уведомления только когда дропдаун закрыт
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (!isDropdownOpen) {
            // Сразу проверяем наличие новых уведомлений
            const checkNewNotifications = async () => {
                try {
                    const response = await axios.get(ApiRoutes.notificationCount());
                    const newCount = Math.min(response.data.count || 0, 9);
                    
                    if (newCount > unreadCount) {
                        const difference = newCount - unreadCount;
                        offsetAdjustmentRef.current += difference;
                        setNewNotificationsCount(prev => prev + difference);
                    }
                } catch (error) {
                    console.error('Error fetching new notifications count:', error);
                }
            };

            // Проверяем сразу при закрытии дропдауна
            checkNewNotifications();
            
            // Устанавливаем интервал для периодической проверки
            interval = setInterval(checkNewNotifications, 20000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isDropdownOpen, unreadCount]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshNotifications();
            setNewNotificationsCount(0);
            offsetAdjustmentRef.current = 0;
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleToggle = async () => {
        if (!isDropdownOpen) {
            setIsLoading(true);
            try {
                if (isInitialLoad || notifications.length === 0) {
                    await refreshNotifications();
                }
                setNewNotificationsCount(0);
                offsetAdjustmentRef.current = 0;
            } finally {
                setIsLoading(false);
            }
        }
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleClose = () => {
        setIsDropdownOpen(false);
    };

    const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50 && hasMore && !isLoading && !isInitialLoad) {
            setIsLoading(true);
            try {
                // Учитываем смещение при пагинации
                await loadMoreNotifications(offsetAdjustmentRef.current);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderHeader = () => (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.default',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Typography variant="h6" component="div">
                Уведомления
            </Typography>
            <Tooltip title="Обновить">
                <IconButton 
                    size="small" 
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                >
                    <RefreshIcon 
                        sx={{ 
                            animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                            }
                        }} 
                    />
                </IconButton>
            </Tooltip>
        </Box>
    );

    const renderNotifications = () => {
        if (isLoading && notifications.length === 0) {
            return (
                <LoadingState>
                    <CircularProgress size={40} />
                </LoadingState>
            );
        }

        if (notifications.length === 0) {
            return (
                <EmptyState>
                    <DoneAllIcon />
                    <Typography variant="body1" color="textSecondary">
                        У вас пока нет уведомлений
                    </Typography>
                </EmptyState>
            );
        }

        return (
            <>
                {newNotificationsCount > 0 && !isRefreshing && (
                    <Box
                        sx={{
                            p: 1,
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            }
                        }}
                        onClick={handleRefresh}
                    >
                        Доступно новых уведомлений: {newNotificationsCount}
                    </Box>
                )}

                {unreadNotifications.length > 0 && (
                    <>
                        {unreadNotifications.map((notification) => (
                            <NotificationListItem
                                key={notification.id}
                                notification={notification}
                                onVisible={() => markSingleNotificationAsRead(notification.id)}
                                isDropdownOpen={isDropdownOpen}
                            />
                        ))}
                    </>
                )}

                {readNotifications.length > 0 && unreadNotifications.length > 0 && (
                    <NotificationDivider>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                            sx={{ fontWeight: 500 }}
                        >
                            Ранее просмотренные
                        </Typography>
                    </NotificationDivider>
                )}

                {readNotifications.map((notification) => (
                    <NotificationListItem
                        key={notification.id}
                        notification={notification}
                        isDropdownOpen={isDropdownOpen}
                    />
                ))}

                {isLoading && (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
                {!hasMore && notifications.length > 0 && (
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ p: 2, textAlign: 'center' }}
                    >
                        Больше уведомлений нет
                    </Typography>
                )}
            </>
        );
    };

    return (
        <Box>
            <IconButton
                ref={anchorRef}
                onClick={handleToggle}
                color={isDropdownOpen ? 'primary' : 'default'}
                sx={{ position: 'relative' }}
            >
                <Badge badgeContent={unreadCount} color="error" max={9}>
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <StyledPopper
                open={isDropdownOpen}
                anchorEl={anchorRef.current}
                placement="bottom-end"
                transition
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 10],
                        },
                    },
                ]}
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper
                            elevation={3}
                            sx={{
                                maxHeight: 400,
                                overflow: 'auto',
                                width: '100%',
                            }}
                            onScroll={handleScroll}
                            onWheel={(e) => {
                                const element = e.currentTarget;
                                const { scrollTop, scrollHeight, clientHeight } = element;
                                
                                // Предотвращаем прокрутку страницы только если:
                                // 1. Скроллим вверх и мы не в самом верху списка
                                // 2. Скроллим вниз и мы не в самом низу списка
                                if (
                                    (e.deltaY < 0 && scrollTop > 0) || // скролл вверх
                                    (e.deltaY > 0 && scrollTop < scrollHeight - clientHeight) // скролл вниз
                                ) {
                                    e.stopPropagation();
                                }
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <Box>
                                    {renderHeader()}
                                    {renderNotifications()}
                                </Box>
                            </ClickAwayListener>
                        </Paper>
                    </Fade>
                )}
            </StyledPopper>
        </Box>
    );
};

export default NotificationWidget;
