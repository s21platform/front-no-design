import React, { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

type NotificationProps = {
    message?: string;
    type?: "success" | "error";
    onClose: () => void;
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    useEffect(() => {
        // Уведомление исчезает через 5 секунд
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // Очистка таймера при размонтировании компонента
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <Snackbar
            open={!!message}
            autoHideDuration={5000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert 
                onClose={onClose} 
                severity={type} 
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
