import { useAuth } from "../contextapis/AuthContext";
import AppNavigation from "./AppNavigator";
import SplashScreen from "../shared/components/SplashScreen";
import AuthStackNavigator from "../features/auth/AuthStackNavigator";
import { initDatabase } from "@/storage/sqlite";
import { useState, useEffect, useRef } from "react";
import { NetworkUtils } from "@/utils/NetworkUtils";
import { syncService } from "@/services/SyncServisManager";
import { useFeedback } from "@/contextapis/FeedbackContext";
import { useTranslation } from "react-i18next";
import { storage } from "@/storage/storage";
import { STORAGE_KEYS } from "@/constants/StorageKeys";
import Onboarding from "@/shared/components/onboarding";

export default function RootNavigation() {
    const [databaseLoading,setDatabaseLoading] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(null);
    const { isLogin, isLoading } = useAuth();
    const { showToast } = useFeedback();
    const { t } = useTranslation();
    const isSyncingRef = useRef(false);
    const prevOnlineRef = useRef(null);

    useEffect(() => {
        let isActive = true;

        const loadOnboardingStatus = async () => {
            const completed = await storage.get(STORAGE_KEYS.PREFERENCES.ONBOARDING_COMPLETED);
            if (isActive) {
                setHasCompletedOnboarding(completed === true);
            }
        };

        loadOnboardingStatus().catch((error) => {
            console.error("Onboarding durumu yüklenemedi:", error);
            if (isActive) {
                setHasCompletedOnboarding(false);
            }
        });

        return () => {
            isActive = false;
        };
    }, []);

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

        // AppState listener başlat (background/active geçişlerinde sync)
        syncService.initAppStateListener();

        const unsubscribe = NetworkUtils.listen(async (isOnline) => {
            const isGuest = await storage.get(STORAGE_KEYS.SESSION.IS_GUEST);
            const wasOnline = prevOnlineRef.current;
            prevOnlineRef.current = isOnline;
            if (isGuest) {
                console.log("⚠️ Root Navigation : User has a guest account. Synchronization cant performed.");
                return;
            }

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

        return () => {
            unsubscribe();
            syncService.removeAppStateListener();
        };
    }, [databaseLoading, isLogin]);


    const completeOnboarding = async () => {
        try {
            const saved = await storage.set(STORAGE_KEYS.PREFERENCES.ONBOARDING_COMPLETED, true);
            if (!saved) {
                return false;
            }
            setHasCompletedOnboarding(true);
            return true;
        } catch (error) {
            console.error("Onboarding durumu kaydedilemedi:", error);
            return false;
        }
    };

    if (isLoading || databaseLoading || hasCompletedOnboarding === null) {
        return (<SplashScreen />)
    }
    else if (!hasCompletedOnboarding) {
        return (<Onboarding onComplete={completeOnboarding} />)
    }
    else if (isLogin) {
        return (<AppNavigation />)
    }
    return (<AuthStackNavigator />)
}