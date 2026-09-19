import { useAuth } from "../contextapis/AuthContext";
import AppNavigation from "./AppNavigator";
import LoadingPage from "../shared/components/LoadingScreen";
import AuthStackNavigator from "../features/auth/AuthStackNavigator";
import { initDatabase } from "@/storage/sqlite";
import { useState, useEffect, useRef } from "react";
import { NetworkUtils } from "@/utils/NetworkUtils";
import { syncService } from "@/services/syncService";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";

export default function RootNavigation() {
    const [databaseLoading,setDatabaseLoading] = useState(true);
    const { isLogin, isLoading } = useAuth();
    const { showToast } = useFeedback();
    const { t } = useTranslation();
    const isSyncingRef = useRef(false);
    const prevOnlineRef = useRef(null);

    useEffect(() => {
        const loadDatabase = async () => {
            try {
                await initDatabase();
            } catch (error) {
                console.error("SQLite Veritabanı başlatılamadı:", error);
            } finally {
                setDatabaseLoading(false);
            }
        };
        loadDatabase();
    }, []);

    useEffect(() => {
        if (databaseLoading || !isLogin) return;

        const unsubscribe = NetworkUtils.listen(async (isOnline) => {
            const wasOnline = prevOnlineRef.current;
            prevOnlineRef.current = isOnline;

            if (!isOnline) {
                if (wasOnline === true || wasOnline === null) {
                    console.log("⚠️ Root Navigation : Internet disconnected. Synchronization paused.");
                    showToast(t("noInternetConnection"), t("syncPausedOfflineMsg"), "warning", "wifi");
                }
                return;
            }

            if (wasOnline === false) {
                console.log("✅ Root Navigation : Internet connection restored. Resuming synchronization...");
                showToast(t("internetRestored"), t("syncResumedOnlineMsg"), "success", "wifi");
            }

            if (isSyncingRef.current) {
                console.log("⚠️ Root Navigation : Sync is already in progress, ignoring duplicate trigger.");
                return;
            }
            isSyncingRef.current = true;
            try {
                console.log("🔄 Root Navigation : Internet detected, triggering background sync (Push -> Pull)...");
                await syncService.syncAll();
            } finally {
                isSyncingRef.current = false;
            }
        });

        return () => unsubscribe();
    }, [databaseLoading, isLogin]);

    if (isLoading || databaseLoading) {
        return (<LoadingPage />)
    }
    else if (isLogin) {
        return (<AppNavigation />)
    }
    return (<AuthStackNavigator />)
}