export const STORAGE_KEYS = Object.freeze({
  SECURE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  },

  SESSION: {
    IS_GUEST : 'is_guest',
    USER: 'user',
    USER_STATS: 'userStats',
    DAILY_WORD: 'dailyWord',
    RECENT_WORDS: 'recentWords',
    SHOWN_ACHIEVEMENTS : 'shownAchievements',
  },
  
  PREFERENCES:{
    THEME : "theme_mode",
    LANGUAGE: 'language',
    VIBRATION_PREF: 'vibration',
    INITIAL_PAGE: 'initialPage',
    AUTO_CONT : 'autoCont',
    ONBOARDING_COMPLETED: 'onboardingCompleted',
  }
});