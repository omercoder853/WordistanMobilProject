export const BASE_URL = 'https://wordistan-backend.onrender.com/api/v1'

export const ENDPOINTS = {
    login:"/auth/login",
    register:"/auth/register",
    refresh:"/auth/refresh",
    changePassword:"/auth/change-password",
    deleteAccount:"/auth/delete-user",
    stats:"/stats/",
    dictionaries:"/dictionaries",
    words:"/words",
    wordDelete:"/words/delete/",
    dailyWord:"/words/daily-word",
    newDictionary:"/dictionaries/new",
    deleteDictionary:"/dictionaries/delete",
    newWord:"/words/add",
    incrementTranslation : "/stats/increment-translation",
    achievements : "/achievements/all",
    earnedAchievements : "/achievements/earned",
    gameSessions: "/games/sessions",
    
}