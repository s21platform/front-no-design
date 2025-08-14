import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiRoutes } from '../lib/routes';
import api from "../lib/api/api";

export interface Notification {
    id: number;
    text: string;
    isRead: boolean;
    created_at: string;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    loadMoreNotifications: (offsetAdjustment?: number) => Promise<void>;
    refreshNotifications: () => Promise<void>;
    markAsRead: (ids: number[]) => Promise<void>;
    markSingleNotificationAsRead: (id: number) => Promise<void>;
    hasMore: boolean;
    isInitialLoad: boolean;
    lastCheckedCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [lastCheckedCount, setLastCheckedCount] = useState(0);
    const limit = 10;

    const fetchUnreadCount = useCallback(async () => {
        try {
            const response = await api.get(ApiRoutes.notificationCount());
            const newCount = Math.min(response.data.count || 0, 9);
            setUnreadCount(newCount);
        } catch (error) {
            console.error('Error fetching unread count', error);
            setUnreadCount(0);
        }
    }, []);

    const refreshNotifications = async () => {
        try {
            const response = await api.get(ApiRoutes.notification(), {
                params: { limit, offset: 0 },
            });
            const newNotifications: Notification[] = response.data.notifications || [];

            setNotifications(newNotifications);
            setOffset(limit);
            setHasMore(newNotifications.length === limit);
            setIsInitialLoad(false);
            setLastCheckedCount(unreadCount);
        } catch (error) {
            console.error('Error refreshing notifications', error);
            setIsInitialLoad(false);
        }
    };

    const loadMoreNotifications = async (offsetAdjustment = 0) => {
        if (!hasMore || isInitialLoad) return;

        try {
            const response = await api.get(ApiRoutes.notification(), {
                params: { limit, offset: offset + offsetAdjustment },
            });
            const newNotifications: Notification[] = response.data.notifications || [];

            if (newNotifications.length === 0) {
                setHasMore(false);
                return;
            }

            setNotifications(prev => [...prev, ...newNotifications]);
            setOffset(prev => prev + limit);
            setHasMore(newNotifications.length === limit);
        } catch (error) {
            console.error('Error fetching notifications', error);
            setHasMore(false);
        }
    };

    const markAsRead = async (ids: number[]) => {
        if (!ids || ids.length === 0) return;

        try {
            await api.patch(ApiRoutes.notification(), { data: { ids } });
            setNotifications(prev =>
                prev.map(notification =>
                    ids.includes(notification.id) ? { ...notification, isRead: true } : notification
                )
            );
            setLastCheckedCount(prev => Math.max(0, prev - ids.length));
            await fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notifications as read', error);
        }
    };

    const markSingleNotificationAsRead = async (id: number) => {
        try {
            await api.patch(ApiRoutes.notification(), { data: { ids: [id] } });
            setNotifications(prev =>
                prev.map(notification =>
                    notification.id === id ? { ...notification, isRead: true } : notification
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read', error);
        }
    };

    // Периодическое обновление счетчика непрочитанных уведомлений
    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 20000);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const value = {
        notifications,
        unreadCount,
        loadMoreNotifications,
        refreshNotifications,
        markAsRead,
        markSingleNotificationAsRead,
        hasMore,
        isInitialLoad,
        lastCheckedCount,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
