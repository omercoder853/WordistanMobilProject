const ACHIEVEMENTLIST = [
  { 
    id: "translator_1", 
    image: require("../../assets/achievement_images/translator_1.png"),
    type: "bronze",
    requirementField: "translated_words",
    requirementValue: 10
  },
  { 
    id: "translator_2", 
    image: require("../../assets/achievement_images/translator_2.png"),
    type: "silver",
    requirementField: "translated_words",
    requirementValue: 25
  },
  { 
    id: "librarian_1", 
    image: require("../../assets/achievement_images/librarian_1.png"),
    type: "bronze",
    requirementField: "saved_words",
    requirementValue: 10 
  },
  { 
    id: "archivist_1", 
    image: require("../../assets/achievement_images/archivist_1.png"),
    type: "bronze",
    requirementField: "created",
    requirementValue: 3 
  },
  { 
    id: "archivist_2", 
    image: require("../../assets/achievement_images/archivist_2.png"),
    type: "silver",
    requirementField: "created",
    requirementValue: 10
  },
  { 
    id: "curious_novice", 
    image: require("../../assets/achievement_images/curious_novice.png"),
    type: "bronze",
    requirementField: "current_streak",
    requirementValue: 3 // 3 günlük seri
  },
  { 
    id: "eager_learner", 
    image: require("../../assets/achievement_images/eager_learner.png"),
    type: "bronze",
    requirementField: "current_streak",
    requirementValue: 7
  },
  { 
    id: "word_hunter", 
    image: require("../../assets/achievement_images/word_hunter.png"),
    type: "silver",
    requirementField: "current_streak",
    requirementValue: 15 
  },
  { 
    id: "lexicon_scholar", 
    image: require("../../assets/achievement_images/lexicon_scholar.png"),
    type: "silver",
    requirementField: "current_streak",
    requirementValue: 30
  },
  { 
    id: "word_master", 
    image: require("../../assets/achievement_images/word_master.png"),
    type: "gold",
    requirementField: "current_streak",
    requirementValue: 60
  }
];

export default ACHIEVEMENTLIST;