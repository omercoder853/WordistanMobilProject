export const STORAGE_KEYS = Object.freeze({
  SECURE: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  },

  SESSION: {
    USER: 'user',
    USER_STATS: 'userStats',
    PENDING_TRANSLATED: 'pendingTranslated',
    PENDING_SAVED_WORDS: 'pendingSavedWords',
    PENDING_DICT_CREATED : 'pendingDictCreated',
    PENDING_XP: 'pendingXP',
    DAILY_WORD: 'dailyWord',
    RECENT_WORDS: 'recentWords',
    SHOWN_ACHIEVEMENTS : 'shownAchievements',
  },
  
  PREFERENCES:{
    LANGUAGE: 'language',
    VIBRATION_PREF: 'vibration',
    INITIAL_PAGE: 'initialPage',
    AUTO_CONT : 'autoCont'
  }
});