import { createContext,useContext } from "react";
import { BASE_URL,ENDPOINTS } from "../constants/ApiConfig";
import {useState,useEffect} from "react";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const {accToken,refToken,getNewToken,isLogin} = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [notificationPanel,setNotificationPanel] = useState(false);

    useEffect(()=>{
        if(isLogin && accToken && refToken){
            const fetchNotifications = async ()=>{
                await getNotifications();
            };
            fetchNotifications();
        }  
    },[isLogin,accToken,refToken]);

    const getNotifications = async (tokenToUse=accToken) => {
        try {
            console.log("Fetching notifications...");
            const response = await fetch(`${BASE_URL}${ENDPOINTS.getNotifications}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                console.log("Notifications fetched successfully");
                return data;
            }
            else if (response.status === 401) {
                const newToken = await getNewToken(refToken);
                return await getNotifications(newToken);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    };

    const readAllNotifications = async (tokenToUse=accToken) => {
        try {
            const response = await fetch(`${BASE_URL}${ENDPOINTS.readAllNotifications}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                }
            });
            if (response.ok) {
                try {
                    const data = await response.json();
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
            }
            else if (response.status === 401) {
                const newToken = await getNewToken(refToken);
                return await readAllNotifications(newToken);
            }
        } catch (error) {
            console.error('Error reading all notifications:', error);
            throw error;
        }
    };

    const readNotification = async (notification_id, tokenToUse=accToken) => {
        try {
            // Optimistic update: mark as read locally immediately
            setNotifications(prev => prev.map(item =>
                item.id === notification_id ? { ...item, is_read: true } : item
            ));

            const response = await fetch(`${BASE_URL}${ENDPOINTS.readNotification(notification_id)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                }
            });
            if (response.ok) {
                console.log("Notification read successfully");
                return true;
            }
            else if (response.status === 401) {
                const newToken = await getNewToken(refToken);
                return await readNotification(notification_id, newToken);
            }
            else{
                const message = await response.text();
                console.log("Error while reading notification" , message , response.status);
            }
        } catch (error) {
            console.error('Error reading notification:', error);
            throw error;
        }
    };

    const newNotification = async (notificationData, tokenToUse=accToken) => {
        try {
            const response = await fetch(`${BASE_URL}${ENDPOINTS.newNotification}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenToUse}`
                },
                body: JSON.stringify(notificationData)
            });
            if (response.ok) {
                await getNotifications(tokenToUse);
                return true;
            }
            else if (response.status === 401) {
                const newToken = await getNewToken(refToken);
                return await newNotification(notificationData, newToken);
            }
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    };

    return (
        <NotificationContext.Provider value={{notifications, setNotifications, getNotifications, readAllNotifications, readNotification, notificationPanel, setNotificationPanel}}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
