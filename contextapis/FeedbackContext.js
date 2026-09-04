import { createContext } from "react";
import { useContext, useState } from "react";

const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) => {
    const [toastVisible, setToastVisible] = useState(false);
    const [toastTitle , setToastTitle] = useState("");
    const [toastMessage , setToastMessage] = useState("");
    const [toastType , setToastType] = useState("default");

    const showToast = (title, message, type = "default") => {
        setToastTitle(title);
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    }

    const hideToast = () => {
        setToastVisible(false);
        setToastMessage("");
        setToastTitle("");
        setToastType("default");
    }

    const [alertVisible,setAlertVisible] = useState(false);
    const [alertTitle,setAlertTitle] = useState("");
    const [alertMessage,setAlertMessage] = useState("");
    const [alertButtons,setAlertButtons] = useState([]);

    const showAlert = (title, message, buttons) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertButtons(buttons);
        setAlertVisible(true);
    }

    const hideAlert = () => {
        setAlertVisible(false);
        setAlertTitle("");
        setAlertMessage("");
        setAlertButtons([]);
    }

    return (
        <FeedbackContext.Provider value={{ toastVisible, toastTitle, toastMessage, toastType, showToast, hideToast, 
        alertVisible, alertTitle, alertMessage, alertButtons, showAlert,hideAlert }}>
            {children}
        </FeedbackContext.Provider>
    )
}

export const useFeedback = () =>{
    const context = useContext(FeedbackContext);
    return context;
}