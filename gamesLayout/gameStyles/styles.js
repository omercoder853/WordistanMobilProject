import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    gameButton: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 15,
        backgroundColor: 'white',
        elevation: 4,
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F0EAFB',
    },
    gameRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    gameCover: {
        width: 60,
        height: 60
    },
    gameName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4
    },
    gameTitle: {
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 24,
        marginVertical: 12,
        color: '#5B3FD3'
    },
    gameDesc: {
        textAlign: 'center',
        color: '#6B7280'
    },
    sourceButton: {
        backgroundColor: '#F8F7FC',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1.5,
        borderColor: "#E9E3FF",
        borderRadius: 16,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedSourceButton: {
        backgroundColor: "#5B3FD3",
        borderColor: "#5B3FD3"
    },
    optionLabel: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
        color: '#4B5563',
        marginTop: 12
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 10,
        backgroundColor: '#f8f1f1',
        elevation: 5
    },
    numericInput: {
        flex: 6,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        paddingHorizontal: 15
    },
    increaseButton: {
        backgroundColor: 'green',
        flex: 1,
        padding: 5,
        alignItems: 'center',
        borderRadius: 10
    },
    decreaseButton: {
        backgroundColor: 'red',
        flex: 1,
        padding: 5,
        alignItems: 'center',
        marginHorizontal: 8,
        borderRadius: 10
    },
    startGameButton: {
        width: '100%',
        alignSelf: 'center',
        marginTop: 24,
        marginBottom: 16,
        paddingVertical: 16,
        borderRadius: 20,
        backgroundColor: '#5B3FD3',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12
    },
    startGameText: {
        fontSize: 18,
        color: 'white',
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 0.5
    },
    gameHeaderRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 25
    },
    gameHeaderItem: {
        backgroundColor: '#382E45',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#5A4E6B'
    },
    questionNavArea: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
        marginTop: 'auto',
        alignItems: 'center'
    },
    questionNavButton: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 15
    },
    setupCard: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F0EAFB',
        elevation: 4,
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
    },
    setupCardTop: {
        zIndex: 10
    },
    setupOptionLabel: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 10,
        color: '#374151',
    },
    primarySourceButton: {
        backgroundColor: "#5B3FD3",
        borderColor: "#5B3FD3"
    },
    primaryStartButton: {
        backgroundColor: "#5B3FD3",
        elevation: 8,
        shadowColor: "#5B3FD3",
        shadowOffset: { height: 6, width: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 14
    },
    primaryStartText: {
        letterSpacing: 0.5
    }
});

export default styles;