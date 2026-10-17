import { createContext } from "react";
import { useContext, useState } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) => {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastTitle , setToastTitle] = useState("");
    const [toastMessage , setToastMessage] = useState("");
    const [toastType , setToastType] = useState("default");
    const [toastIcon, setToastIcon] = useState(null);

    const showToast = (title, message, type = "default", icon = null) => {
        setToastTitle(title);
        setToastMessage(message);
        setToastType(type);
        setToastIcon(icon);
        setToastVisible(true);
    }

    const hideToast = () => {
        setToastVisible(false);
        setToastMessage("");
        setToastTitle("");
        setToastType("default");
        setToastIcon(null);
    }

    const [alertVisible,setAlertVisible] = useState(false);
    const [alertTitle,setAlertTitle] = useState("");
    const [alertMessage,setAlertMessage] = useState("");
    const [alertButtons,setAlertButtons] = useState([]);
    const [alertLoading , setAlertLoading] = useState(false);
    const [verticalButtons,setVerticalButtons] = useState(false);

    const addAlertButton = (button) => {
        setAlertButtons(prevButtons => [...prevButtons, button]);
    }

    const hideAlert = () => {
        setAlertVisible(false);
        setAlertTitle("");
        setAlertMessage("");
        setAlertButtons([]);
        setAlertLoading(false);
        setVerticalButtons(false);
    }


    return (
        <FeedbackContext.Provider value={{ toastVisible, toastTitle, toastMessage, toastType, 
        toastIcon, showToast, hideToast, verticalButtons,setVerticalButtons,
        alertVisible, alertTitle, alertMessage, alertButtons, 
        alertLoading , setAlertTitle, setAlertMessage, addAlertButton, setAlertVisible,
        setAlertLoading,hideAlert }}>
            {children}
        </FeedbackContext.Provider>
    )
}

export const useFeedback = () =>{
    const context = useContext(FeedbackContext);
    return context;
}