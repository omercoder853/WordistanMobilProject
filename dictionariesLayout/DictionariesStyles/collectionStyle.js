import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    // --- Styles from collectionDetails.js ---
    detailsContainer: {
        backgroundColor: '#F3F4F6',
        flex: 1
    },
    headerCard: {
        borderRadius: 20,
        padding: 24,
        marginVertical: 15,
        marginHorizontal: 15,
        elevation: 10,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
    },
    collectionName: {
        fontWeight: '900',
        fontSize: 28,
        color: '#FFFFFF',
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    tagsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 12,
    },
    tag: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
        overflow: 'hidden',
    },
    divider: {
        borderWidth: 0.5, 
        borderColor: 'rgba(255, 255, 255, 0.3)', 
        marginVertical: 15
    },
    collectionDescription: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
    },
    wordList: {
        paddingTop: 5,
        paddingHorizontal: 15,
    },
    collectionWordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 10,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    wordImage: {
        width: 50,
        height: 50,
        borderRadius: 12,
        marginRight: 15,
        backgroundColor: '#F3F4F6'
    },
    wordContentWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    wordTarget: {
        fontWeight: '800',
        fontSize: 16,
        color: '#1F2937',
        marginBottom: 4,
    },
    wordMeaning: {
        fontWeight: '500',
        fontSize: 14,
        color: '#6B7280',
    },

    // --- Styles from collection.js (Card format) ---
    tileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        width: '100%'
    },
    tileImage: {
        width: 65, 
        height: 65, 
        borderRadius: 12, 
        marginRight: 15
    },
    tileContentWrapper: {
        flex: 1, 
        justifyContent: 'center'
    },
    tileTitle: {
        fontWeight: '800', 
        fontSize: 16, 
        color: '#1F2937', 
        marginBottom: 6
    },
    tileTagsRow: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: 6, 
        alignItems: 'center'
    },
    tileTagBlue: {
        fontSize: 10, 
        color: '#4F46E5', 
        fontWeight: '700', 
        backgroundColor: '#EEF2FF', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 10
    },
    tileTagPurple: {
        fontSize: 10, 
        color: '#7C3AED', 
        fontWeight: '700', 
        backgroundColor: '#F3E8FF', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 10
    },
    tileTagPink: {
        fontSize: 10, 
        color: '#EC4899', 
        fontWeight: '700', 
        backgroundColor: '#FDF2F8', 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 10
    }
});

export default styles;
