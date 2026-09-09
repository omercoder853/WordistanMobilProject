import { createContext, useContext } from "react";
import { BASE_URL, ENDPOINTS } from "../src/constants/ApiConfig";
import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { apiClient } from "../src/services/ApiClient";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isLogin } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [notificationPanel, setNotificationPanel] = useState(false);

    useEffect(() => {
        if (isLogin) {
            const fetchNotifications = async () => {
                await getNotifications();
            };
            fetchNotifications();
        }
    }, [isLogin]);

    const getNotifications = async () => {
        console.log("Fetching notifications...");
        const { ok, status, data } = await apiClient.get(ENDPOINTS.getNotifications)
        if (ok) {
            setNotifications(data);
            console.log("Notifications fetched successfully");
            return data;
        }
        else {
            console.log("Error while fetching notifications. ", status, data)
        }
    };

    const readAllNotifications = async () => {
        const { ok, status, data } = await apiClient.patch(ENDPOINTS.readAllNotifications);
        if (ok) {
            try {
                if (Array.isArray(data)) {
                    setNotifications(data);
                } else if (data && Array.isArray(data.notifications)) {
                    setNotifications(data.notifications);
                } else {
                    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
                }
            } catch {
                setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            }
            console.log("All notifications read successfully");
            return true;
        } else {
            console.log("Error while reading all notifications. ", status, data);
        }
    };

    const readNotification = async (notification_id) => {
        setNotifications(prev => prev.map(item =>
            item.id === notification_id ? { ...item, is_read: true } : item
        ));

        const { ok, status, data } = await apiClient.patch(ENDPOINTS.readNotification(notification_id));
        if (ok) {
            console.log("Notification read successfully");
            return true;
        }
        else {
            console.log("Error while reading notification", status, data);
        }
    };

    const newNotification = async (notificationData) => {
        const {ok,status,data} = await apiClient.post(ENDPOINTS.newNotification , notificationData);
            if (ok) {
                await getNotifications();
                return true;
            }
            else{
                console.log("Error while creating a new notification. ", status,data);
            }
    };

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, getNotifications, readAllNotifications, readNotification, notificationPanel, setNotificationPanel }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
