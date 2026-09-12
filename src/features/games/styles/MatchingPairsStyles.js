import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 16,
    },
    gameContainer: {
        flex: 1,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    columnArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#7C3AED',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
    },
    cardBase: {
        width: '100%',
        minHeight: 56,
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardDefault: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E9E3FF',
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    cardSelected: {
        backgroundColor: '#EDE9FE',
        borderColor: '#5B3FD3',
        borderWidth: 2,
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    cardMatched: {
        backgroundColor: '#DCFCE7',
        borderColor: '#22C55E',
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardWrong: {
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    cardTextBase: {
        fontSize: 15,
        textAlign: 'center',
    },
    textDefault: {
        color: '#1F2937',
        fontWeight: '600',
    },
    textSelected: {
        color: '#5B3FD3',
        fontWeight: '800',
    },
    textMatched: {
        color: '#15803D',
        fontWeight: '700',
    },
    textWrong: {
        color: '#B91C1C',
        fontWeight: '700',
    },
});

export default styles;