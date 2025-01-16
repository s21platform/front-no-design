import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ApiRoutes } from '../../../lib/routes';

interface Notification {
    id: number;
    text: string;
    isRead: boolean;
}

const NotificationWidget: React.FC = () => {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const limit = 10;

    // Fetch unread notification count
    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(ApiRoutes.notificationCount());
            setUnreadCount(Math.min(response.data.count, 9)); // Show 9+ if more than 9
        } catch (error) {
            console.error('Error fetching unread count', error);
        }
    };

    // Fetch notifications when dropdown is opened
    const fetchNotifications = async (newOffset = 0) => {
        try {
            const response = await axios.get(ApiRoutes.notification(), {
                params: { limit, offset: newOffset },
            });
            const newNotifications: Notification[] = response.data.notifications;

            setNotifications((prev) => [...prev, ...newNotifications]);
            setOffset(newOffset + limit);
            setHasMore(newNotifications.length === limit); // Check if there's more to load
        } catch (error) {
            console.error('Error fetching notifications', error);
        }
    };

    // Mark notifications as read when dropdown is opened
    const markNotificationsAsRead = async () => {
        try {
            const unreadNotificationIds = notifications
                .filter((notification) => !notification.isRead)
                .map((notification) => notification.id);

            if (unreadNotificationIds.length > 0) {
                await axios.delete(ApiRoutes.notification(), { data: { ids: unreadNotificationIds } });
                setNotifications((prev) =>
                    prev.map((notification) => ({ ...notification, isRead: true }))
                );
                fetchUnreadCount(); // Update the unread count after marking as read
            }
        } catch (error) {
            console.error('Error marking notifications as read', error);
        }
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            fetchNotifications();
            markNotificationsAsRead();
        }
    };

    // Load more notifications on scroll
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        if (scrollHeight - scrollTop === clientHeight && hasMore) {
            fetchNotifications(offset);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    return (
        <div className="notification-widget" style={{ position: 'relative', display: 'inline-block' }}>
            <div
                className="notification-icon"
                onClick={toggleDropdown}
                style={{ position: 'relative', cursor: 'pointer' }}
            >
                <span role="img" aria-label="notifications" style={{ fontSize: '24px' }}>
                    🔔
                </span>
                {unreadCount > 0 && (
                    <span
                        className="notification-count"
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '4px',
                            fontSize: '12px',
                        }}
                    >
                        {unreadCount === 9 ? '9+' : unreadCount}
                    </span>
                )}
            </div>

            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="notification-dropdown"
                    style={{
                        position: 'absolute',
                        top: '30px',
                        right: '0',
                        width: '300px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                    }}
                    onScroll={handleScroll}
                >
                    {notifications.length === 0 ? (
                        <div style={{ padding: '10px', textAlign: 'center' }}>No notifications</div>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                style={{
                                    padding: '10px',
                                    borderBottom: '1px solid #f0f0f0',
                                    backgroundColor: notification.isRead ? '#f9f9f9' : '#fff',
                                }}
                            >
                                <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#555' }}>
                                    {notification.text}
                                </p>
                            </div>
                        ))
                    )}
                    {!hasMore && <div style={{ padding: '10px', textAlign: 'center' }}>No more notifications</div>}
                </div>
            )}
        </div>
    );
};

export default NotificationWidget;
