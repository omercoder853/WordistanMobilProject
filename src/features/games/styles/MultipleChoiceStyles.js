import { StyleSheet } from "react-native";

const mcqStyles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F5F3FF',
        paddingHorizontal: 20,
    },
    questionCard: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: '#E9E3FF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginVertical: 14,
        shadowColor: '#5B3FD3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    questionPrompt: {
        fontSize: 12,
        fontWeight: '700',
        color: '#7C3AED',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    questionText: {
        fontSize: 28,
        color: '#1F2937',
        fontWeight: '900',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    optionArea: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 4,
    },
});

export default mcqStyles;