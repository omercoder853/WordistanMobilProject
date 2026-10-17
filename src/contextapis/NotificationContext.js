import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL, ENDPOINTS } from "../constants/ApiConfig";
import { useAuth } from "./AuthContext";
import { apiClient } from "../services/ApiClient";
import { useFeedback } from "./FeedbackContext";
import { useTranslation } from "react-i18next";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const { isLogin ,isGuest } = useAuth();
    const { showToast } = useFeedback();
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState([]);
    const [notificationPanel, setNotificationPanel] = useState(false);

    useEffect(() => {
        if (isLogin && !isGuest) {
            const fetchNotifications = async () => {
                await getNotifications();
            };
            fetchNotifications();
        }
    }, [isLogin]);

    const getNotifications = async () => {
        console.log("🔄 Notification Context : Fetching notifications...");
        const { ok, status, data } = await apiClient.get(ENDPOINTS.getNotifications);
        if (ok) {
            setNotifications(data);
            console.log("✅ Notification Context : Notifications fetched successfully.");
            return data;
        }
        else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            }
            console.log("❌ Notification Context : Error while fetching notifications :", status, data);
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
            console.log("✅ Notification Context : All notifications read successfully.");
            return true;
        } else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            }
            console.log("❌ Notification Context : Error while reading all notifications :", status, data);
        }
    };

    const readNotification = async (notification_id) => {
        setNotifications(prev => prev.map(item =>
            item.id === notification_id ? { ...item, is_read: true } : item
        ));

        const { ok, status, data } = await apiClient.patch(ENDPOINTS.readNotification(notification_id));
        if (ok) {
            console.log("✅ Notification Context : Notification read successfully.");
            return true;
        }
        else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            }
            console.log("❌ Notification Context : Error while reading notification :", status, data);
        }
    };

    const newNotification = async (notificationData) => {
        const { ok, status, data } = await apiClient.post(ENDPOINTS.newNotification, notificationData);
        if (ok) {
            await getNotifications();
            return true;
        }
        else {
            if (status === 408) {
                showToast(t("requestTimeout"), t("requestTimeoutMessage"), "danger", "wifi");
            }
            console.log("❌ Notification Context : Error while creating a new notification :", status, data);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications, getNotifications, readAllNotifications, readNotification, notificationPanel, setNotificationPanel }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
