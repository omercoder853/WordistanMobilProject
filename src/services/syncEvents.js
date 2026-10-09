/**
 * Basit event emitter — syncService ile DictContext arasında
 * bağımsız iletişim sağlar.
 */
const listeners = new Set();
const sessionListeners = new Set();

export const syncEvents = {
    onSyncComplete: (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
    },
    emitSyncComplete: () => {
        listeners.forEach(cb => cb());
    },
    onSessionHydrated: (callback) => {
        sessionListeners.add(callback);
        return () => sessionListeners.delete(callback);
    },
    emitSessionHydrated: (data) => {
        sessionListeners.forEach(cb => cb(data));
    }
};

