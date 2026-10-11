import * as SQLite from "expo-sqlite";

let db = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('wordistan.db');
  }
  return db;
};

export const initDatabase = async () => {
  const db = await getDB();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS dictionaries (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      language TEXT NOT NULL,
      cover TEXT DEFAULT 'dictionary_cover_1',
      words_count INTEGER DEFAULT 0,
      is_synced INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS words (
      id TEXT PRIMARY KEY NOT NULL,
      dictionary_id TEXT NOT NULL,
      word TEXT NOT NULL,
      meaning TEXT NOT NULL,
      is_synced INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      added_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (dictionary_id) REFERENCES dictionaries (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_stats (
    user_id TEXT PRIMARY KEY NOT NULL,
    total_xp INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    max_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date TEXT,
    translated_words INTEGER NOT NULL DEFAULT 0,
    saved_words INTEGER NOT NULL DEFAULT 0,
    dict_created INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    level INTEGER NOT NULL DEFAULT 1,
    xp_for_next DEFAULT 0,
    required_xp_for_level DEFAULT 0
  );

    CREATE TABLE IF NOT EXISTS game_sessions (
    id TEXT PRIMARY KEY NOT NULL,
    user_id TEXT NOT NULL,
    score FLOAT NOT NULL,
    performance_score FLOAT,
    game_mode TEXT NOT NULL,
    total_count INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    wrong_count INTEGER NOT NULL,
    passed_count INTEGER NOT NULL,
    duration_secs INTEGER NOT NULL,
    is_synced INTEGER DEFAULT 0,
    played_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS xp_logs (
    id TEXT PRIMARY KEY NOT NULL,           
    user_id TEXT NOT NULL,                   
    action_type TEXT NOT NULL,                
    amount INTEGER NOT NULL CHECK (amount > 0),
    created_at TEXT DEFAULT (datetime('now')),                 
    is_synced INTEGER DEFAULT 0        
    );

    CREATE INDEX IF NOT EXISTS idx_local_xp_logs_synced 
    ON xp_logs(is_synced, created_at ASC);
    CREATE INDEX IF NOT EXISTS idx_local_xp_logs_user 
    ON xp_logs(user_id);

    CREATE INDEX IF NOT EXISTS idx_words_dict_id ON words (dictionary_id);
    CREATE INDEX IF NOT EXISTS idx_words_sync ON words (is_synced);
    CREATE INDEX IF NOT EXISTS idx_dicts_sync ON dictionaries (is_synced);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_words_dict_word_unique ON words (dictionary_id, LOWER(TRIM(word))) WHERE is_deleted = 0;

    DELETE FROM dictionaries WHERE id IS NULL OR id = 'null' OR id = 'undefined' OR id = '';
    DELETE FROM words WHERE id IS NULL OR id = 'null' OR id = 'undefined' OR id = '';

    CREATE TRIGGER IF NOT EXISTS trigger_on_xp_log_added
    AFTER INSERT ON xp_logs
    FOR EACH ROW
    BEGIN
        INSERT OR IGNORE INTO user_stats (
            user_id, total_xp, current_streak, max_streak, last_activity_date,
            translated_words, saved_words, dict_created, updated_at
        )
        VALUES (
            NEW.user_id, 0, 0, 0, NULL,
            0, 0, 0, datetime('now'));

        UPDATE user_stats
        SET
            total_xp = total_xp + NEW.amount,

            current_streak = CASE
                WHEN NEW.action_type = 'streak' THEN
                    CASE
                        WHEN last_activity_date = date(NEW.created_at) THEN current_streak
                        WHEN last_activity_date = date(NEW.created_at, '-1 day') THEN current_streak + 1
                        ELSE 1
                    END
                ELSE current_streak
            END,

            max_streak = CASE
                WHEN NEW.action_type = 'streak' THEN
                    MAX(
                        max_streak,
                        CASE
                            WHEN last_activity_date = date(NEW.created_at) THEN current_streak
                            WHEN last_activity_date = date(NEW.created_at, '-1 day') THEN current_streak + 1
                            ELSE 1
                        END
                    )
                ELSE max_streak
            END,

            last_activity_date = CASE
                WHEN NEW.action_type = 'streak' AND (last_activity_date IS NULL OR date(NEW.created_at) > last_activity_date)
                THEN date(NEW.created_at)
                ELSE last_activity_date
            END,

            translated_words = translated_words + (CASE WHEN NEW.action_type = 'translated_words' THEN 1 ELSE 0 END),
            saved_words      = saved_words + (CASE WHEN NEW.action_type = 'saved_words' THEN 1 ELSE 0 END),
            dict_created     = dict_created + (CASE WHEN NEW.action_type = 'dict_created' THEN 1 ELSE 0 END),
            updated_at       = datetime('now')
        WHERE user_id = NEW.user_id;
    END;`);
    
  console.log("✅ SQLite Storage : Database initialized successfully.");
  return db;
};