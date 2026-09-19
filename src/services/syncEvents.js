/**
 * Basit event emitter — syncService ile DictContext arasında
 * bağımsız iletişim sağlar.
 */
const listeners = new Set();

export const syncEvents = {
    onSyncComplete: (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },
    emitSyncComplete: () => {
        listeners.forEach(cb => cb());
    }
};
