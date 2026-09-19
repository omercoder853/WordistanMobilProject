import NetInfo from "@react-native-community/netinfo";

export const NetworkUtils = {
    isOnline: async () => {
        const state = await NetInfo.fetch();
        return Boolean(state.isConnected && state.isInternetReachable !== false);
    },

    listen: (callback) => {
        return NetInfo.addEventListener((state) => {
            const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
            callback(isOnline, state);
        });
    }
};