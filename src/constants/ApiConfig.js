export const BASE_URL = 'https://wordistan-backend.onrender.com/api/v1'

//bunları AUTHENTICATION ; NOTIFICATION ; GAMES ; DICTIONARY ; WORDS ; STATS ; ACHIEVEMENTS olarak ayırabiliriz
export const ENDPOINTS = {
    login:"/auth/login",
    register:"/auth/register",
    refresh:"/auth/refresh",
    me : "/auth/me",
    updateMe : "/auth/me/update",
    changePassword:"/auth/change-password",
    deleteAccount:"/auth/delete-user",
    forgotPassword:"/auth/forgot-password",
    verifyOTP:"/auth/verify-otp",
    resendOTP:"/auth/resend-otp",
    stats:"/stats/",
    dictionaries:"/dictionaries",
    words:"/words",
    wordDelete:"/words/delete/",
    dailyWord:"/words/daily-word",
    newDictionary:"/dictionaries/new",
    deleteDictionary: (dictionary_id)=> `/dictionaries/delete/${dictionary_id}`,
    updateDictionary: (dictionary_id)=> `/dictionaries/update/${dictionary_id}`,
    newWord:"/words/add",
    incrementTranslation : "/stats/increment-translation",
    achievements : "/achievements/all",
    earnedAchievements : "/achievements/earned",
    gameSessions: "/games/sessions",
    saveGameSession: "/games/new",
    getNotifications: "/notifications/",
    newNotification: "/notifications/new",
    readAllNotifications: "/notifications/read-all",
    readNotification: (notification_id) => `/notifications/${notification_id}/read`,
    syncPush : "/sync/push"
}