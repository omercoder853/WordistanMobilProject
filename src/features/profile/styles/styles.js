import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },

    headerRowButtons: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    subscriptionArea: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#8B5CF6',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    profileHeader: {
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
        paddingBottom: 4,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 4,
    },
    avatarRing: {
        width: 122,
        height: 122,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:1,
        overflow:"hidden"
    },
    profilePhoto: {
        width: 122,
        height: 122,
        borderRadius: 51,
    },
    userName: {
        fontSize: 21,
        fontWeight: '800',
        letterSpacing: -0.3,
        marginBottom: 4,
    },
    nickBadge: {
        paddingHorizontal: 10,
        paddingVertical: 2.5,
        borderRadius: 10,
        marginBottom: 6,
    },
    nickText: {
        fontSize: 12,
        fontWeight: '700',
    },
    userEmailRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center',
    },
    userEmail: {
        fontSize: 12.5,
        fontWeight: '500',
    },
    // Stats Card
    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderWidth: 1,
        marginTop: 14,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    statColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    statIconBox: {
        width: 36,
        height: 36,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: -0.2,
    },
    statLabel: {
        fontSize: 11.5,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 32,
    },
    // Console list items
    consoleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 14,
        marginBottom: 9,
        borderWidth: 2,
        overflow: 'hidden',
    },
    consoleIconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    consoleLabel: {
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: -0.1,
    },
    chevron: {
        marginLeft: 'auto',
    },
});

export default styles;