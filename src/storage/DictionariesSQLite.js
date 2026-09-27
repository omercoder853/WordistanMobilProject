import { getDB } from "./sqlite";

const insertDictionary = async ({ id, user_id, name, description, language, is_synced }) => {
    if (!id || id === 'null' || id === 'undefined') {
        console.error("❌ SQLite Ekleme Hatası: Geçersiz dictionary ID (null/undefined).");
        return false;
    }
    try {
        const db = await getDB();
        const result = await db.runAsync(
            `INSERT INTO dictionaries (id, user_id, name, description, language, is_synced) 
             VALUES (?, ?, ?, ?, ?, ?);`,
            [String(id), String(user_id), name, description, language, is_synced]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("❌ SQLite Ekleme Hatası:", error.message);
        console.error("Gönderilen Parametreler:", { id, user_id, name, description, language, is_synced });
        return false;
    }
};

const updateDictionary = async ({ id, name, description, language }) => {
    try {
        const db = await getDB();
        const result = await db.runAsync(
            `UPDATE dictionaries 
             SET name = ?, description = ?, language = ?, is_synced = 0 
             WHERE id = ?;`,
            [name, description ?? "", language, String(id)]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("❌ SQLite Güncelleme Hatası:", error.message);
        return false;
    }
};

const softDeleteDictionary = async (id) => {
    try {
        const db = await getDB();
        if (!id || id === 'null' || id === 'undefined') {
            const result = await db.runAsync(
                `DELETE FROM dictionaries WHERE id IS NULL OR id = 'null' OR id = 'undefined';`
            );
            return result.changes > 0;
        }
        const result = await db.runAsync(
            `UPDATE dictionaries SET is_deleted = 1, is_synced = 0 WHERE id = ?;`,
            [String(id)]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("❌ SQLite Soft Delete Hatası:", error.message);
        return false;
    }
};

const selectDictionaries = async (user_id) => {
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT * FROM dictionaries 
             WHERE user_id = ? AND is_deleted = 0 AND id IS NOT NULL AND id != 'null' AND id != 'undefined'
             ORDER BY created_at`,
            [String(user_id)]
        );
        return rows;
    } catch (error) {
        console.error("❌ SQLite Sözlük Çekme Hatası:", error.message);
        console.error("Gönderilen Parametreler:", user_id);
        return [];
    }
};

const selectOnlyLocalDictionaries = async (user_id) => {
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT id, user_id, name, description, language, created_at 
             FROM dictionaries 
             WHERE user_id = ? AND is_synced = 0 AND is_deleted = 0`,
            [user_id]
        );
        return rows;
    } catch (error) {
        console.error("❌ SQLite Local Sözlük Çekme Hatası:", error.message);
        console.error("Gönderilen Parametreler:", user_id);
        return [];
    }
};

const selectOnlyDeletedDictionaries = async (user_id) => {
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT id FROM dictionaries WHERE user_id = ? AND is_deleted = 1`,
            [user_id]
        );
        return rows.map((r) => r.id);
    } catch (error) {
        console.error("❌ SQLite Silinen Sözlük ID Hatası:", error.message);
        console.error("Gönderilen Parametreler:", user_id);
        return [];
    }
};

const markDictionariesSynced = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const placeholders = ids.map(() => '?').join(',');
        await db.runAsync(
            `UPDATE dictionaries SET is_synced = 1 WHERE id IN (${placeholders})`,
            ids
        );
        return true;
    } catch (error) {
        console.error("❌ SQLite markDictionariesSynced Hatası:", error.message);
        return false;
    }
};

const hardDeleteDictionaries = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const validIds = ids.filter(id => id && id !== 'null' && id !== 'undefined');
        if (validIds.length > 0) {
            const placeholders = validIds.map(() => '?').join(',');
            await db.runAsync(
                `DELETE FROM dictionaries WHERE id IN (${placeholders})`,
                validIds.map(String)
            );
        }
        await db.runAsync(`DELETE FROM dictionaries WHERE id IS NULL OR id = 'null' OR id = 'undefined';`);
        return true;
    } catch (error) {
        console.error("❌ SQLite hardDeleteDictionaries Hatası:", error.message);
        return false;
    }
};

const upsertDictionaries = async (serverDicts, fallbackUserId = null) => {
    if (!Array.isArray(serverDicts) || serverDicts.length === 0) return;
    const db = await getDB();
    await db.withTransactionAsync(async () => {
        for (const dict of serverDicts) {
            const dictId = dict.id || dict.dict_id || dict.dictionary_id;
            const userId = dict.user_id || fallbackUserId;
            if (!dictId || dictId === 'null' || dictId === 'undefined' || !userId) continue;

            await db.runAsync(
                `INSERT INTO dictionaries (id, user_id, name, description, language, is_synced, is_deleted, created_at)
                 VALUES (?, ?, ?, ?, ?, 1, 0, ?)
                 ON CONFLICT(id) DO UPDATE SET
                 name = excluded.name,
                 description = excluded.description,
                 language = excluded.language,
                 is_synced = 1,
                 is_deleted = 0;`,
                [String(dictId), String(userId), dict.name, dict.description ?? "", dict.language, dict.created_at ?? new Date().toISOString()]
            );
        }
    });
};

// ─── WORDS OPERATIONS ───

const insertWord = async ({ id, dictionary_id, word, meaning, is_synced = 0 }) => {
    if (!id || id === 'null' || id === 'undefined' || !dictionary_id) {
        console.error("❌ SQLite Kelime Ekleme Hatası: Geçersiz ID veya dictionary_id.");
        return false;
    }
    try {
        const db = await getDB();
        const result = await db.runAsync(
            `INSERT INTO words (id, dictionary_id, word, meaning, is_synced)
             VALUES (?, ?, ?, ?, ?);`,
            [String(id), String(dictionary_id), word, meaning, is_synced]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("❌ SQLite Kelime Ekleme Hatası:", error.message);
        return false;
    }
};

const checkWordExists = async (dictionary_id, word) => {
    if (!dictionary_id || !word) return false;
    try {
        const db = await getDB();
        const row = await db.getFirstAsync(
            `SELECT id FROM words 
             WHERE dictionary_id = ? 
               AND LOWER(TRIM(word)) = LOWER(TRIM(?)) 
               AND is_deleted = 0;`,
            [String(dictionary_id), String(word)]
        );
        return Boolean(row);
    } catch (error) {
        console.error("❌ SQLite checkWordExists Hatası:", error.message);
        return false;
    }
};

const selectWords = async (dictionary_id) => {
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT * FROM words WHERE dictionary_id = ? AND is_deleted = 0 ORDER BY added_at`,
            [dictionary_id]
        );
        return rows;
    } catch (error) {
        console.error("❌ SQLite Kelime Çekme Hatası:", error.message);
        return [];
    }
};

const selectOnlyLocalWords = async (user_id) => {
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT w.id, w.dictionary_id, w.word, w.meaning, w.added_at 
             FROM words w
             JOIN dictionaries d ON w.dictionary_id = d.id
             WHERE d.user_id = ? AND w.is_synced = 0 AND w.is_deleted = 0`,
            [user_id]
        );
        return rows;
    } catch (error) {
        console.error("❌ SQLite Local Kelime Çekme Hatası:", error.message);
        return [];
    }
};

const selectOnlyDeletedWords = async (user_id) => {
    try {
        const db = await getDB();
        const rows = await db.getAllAsync(
            `SELECT w.id 
             FROM words w
             JOIN dictionaries d ON w.dictionary_id = d.id
             WHERE d.user_id = ? AND w.is_deleted = 1`,
            [user_id]
        );
        console.log("Deleted words ", rows);
        return rows.map((r) => r.id);
    } catch (error) {
        console.error("❌ SQLite Silinen Kelime ID Hatası:", error.message);
        return [];
    }
};

const markWordsSynced = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const placeholders = ids.map(() => '?').join(',');
        await db.runAsync(
            `UPDATE words SET is_synced = 1 WHERE id IN (${placeholders})`,
            ids
        );
        return true;
    } catch (error) {
        console.error("❌ SQLite markWordsSynced Hatası:", error.message);
        return false;
    }
};

const hardDeleteWords = async (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
        const db = await getDB();
        const placeholders = ids.map(() => '?').join(',');
        await db.runAsync(
            `DELETE FROM words WHERE id IN (${placeholders})`,
            ids
        );
        return true;
    } catch (error) {
        console.error("❌ SQLite hardDeleteWords Hatası:", error.message);
        return false;
    }
};

const softDeleteWord = async (id) => {
    try {
        const db = await getDB();
        const result = await db.runAsync(
            `UPDATE words SET is_deleted = 1, is_synced = 0 WHERE id = ?;`,
            [id]
        );
        return result.changes > 0;
    } catch (error) {
        console.error("❌ SQLite Kelime Soft Delete Hatası:", error.message);
        return false;
    }
};

const upsertWords = async (serverWords) => {
    if (!Array.isArray(serverWords) || serverWords.length === 0) return;
    const db = await getDB();
    await db.withTransactionAsync(async () => {
        for (const w of serverWords) {
            await db.runAsync(
                `INSERT INTO words (id, dictionary_id, word, meaning, is_synced, is_deleted, added_at)
                 VALUES (?, ?, ?, ?, 1, 0, ?)
                 ON CONFLICT(id) DO UPDATE SET
                 word = excluded.word,
                 meaning = excluded.meaning,
                 is_synced = 1,
                 is_deleted = 0;`,
                [w.id, w.dictionary_id, w.word, w.meaning, w.added_at ?? new Date().toISOString()]
            );
        }
    });
};

export const dictionariesSQLite = {
    // Dictionaries
    insertDictionary: ({ id, user_id, name, description = "", language, is_synced = 0 }) =>
        insertDictionary({ id, user_id, name, description, language, is_synced }),
    updateDictionary: ({ id, name, description, language }) =>
        updateDictionary({ id, name, description, language }),
    softDeleteDictionary: (id) => softDeleteDictionary(id),
    selectDictionaries: (user_id) => selectDictionaries(user_id),
    selectOnlyLocalDictionaries: (user_id) => selectOnlyLocalDictionaries(user_id),
    selectOnlyDeletedDictionaries: (user_id) => selectOnlyDeletedDictionaries(user_id),
    markDictionariesSynced: (ids) => markDictionariesSynced(ids),
    hardDeleteDictionaries: (ids) => hardDeleteDictionaries(ids),
    upsertDictionaries: (dicts, fallbackUserId) => upsertDictionaries(dicts, fallbackUserId),

    // Words
    insertWord: ({ id, dictionary_id, word, meaning, is_synced = 0 }) =>
        insertWord({ id, dictionary_id, word, meaning, is_synced }),
    checkWordExists: (dictionary_id, word) => checkWordExists(dictionary_id, word),
    selectWords: (dictionary_id) => selectWords(dictionary_id),
    selectOnlyLocalWords: (user_id) => selectOnlyLocalWords(user_id),
    selectOnlyDeletedWords: (user_id) => selectOnlyDeletedWords(user_id),
    markWordsSynced: (ids) => markWordsSynced(ids),
    hardDeleteWords: (ids) => hardDeleteWords(ids),
    softDeleteWord: (id) => softDeleteWord(id),
    upsertWords: (words) => upsertWords(words),
};