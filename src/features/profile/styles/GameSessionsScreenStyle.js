import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const gameSessionsStyle = StyleSheet.create({
    // ─── Layout ───
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 30,
    },

    // ─── Summary Header ───
    summaryRow: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    summaryBadge: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    summaryValue: {
        fontSize: 22,
        fontWeight: "800",
        color: "#1E1B4B",
    },
    summaryLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#94A3B8",
        marginTop: 2,
    },

    // ─── Session Card ───
    sessionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    sessionCardBest: {
        borderWidth: 1.5,
        borderColor: "#FCD34D",
        backgroundColor: "#FFFBEB",
    },
    modeIconBox: {
        width: 44,
        height: 44,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    sessionMiddle: {
        flex: 1,
    },
    sessionModeName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E1B4B",
    },
    sessionDate: {
        fontSize: 11,
        fontWeight: "500",
        color: "#94A3B8",
        marginTop: 2,
    },
    sessionRight: {
        alignItems: "flex-end",
    },
    sessionScore: {
        fontSize: 20,
        fontWeight: "800",
        color: "#6366F1",
    },
    sessionScoreBest: {
        color: "#D97706",
    },
    sessionSubScore: {
        fontSize: 11,
        fontWeight: "500",
        color: "#94A3B8",
        marginTop: 1,
    },
    bestBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF3C7",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginTop: 4,
        gap: 3,
    },
    bestBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#D97706",
    },

    // ─── Modal ───
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 30,
        maxHeight: "80%",
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: "#E5E7EB",
        alignSelf: "center",
        marginBottom: 16,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1E1B4B",
    },
    modalCloseBtn: {
        padding: 4,
    },

    // ─── Modal Score Circles ───
    scoresRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 24,
        marginBottom: 20,
    },
    scoreCircle: {
        alignItems: "center",
    },
    scoreCircleLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        marginTop: 8,
    },
    scoreCircleLabelText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },

    // ─── Modal Stats Grid ───
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 8,
    },
    statItem: {
        width: (width - 60) / 3 - 8,
        backgroundColor: "#F8F9FB",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
    },
    statItemValue: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1E1B4B",
    },
    statItemLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: "#94A3B8",
        marginTop: 2,
    },

    // ─── Modal Best Banner ───
    bestBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFBEB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 10,
        marginBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: "#FCD34D",
    },
    bestBannerText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#D97706",
    },

    // ─── Empty State ───
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1E1B4B",
        marginTop: 16,
    },
    emptyDesc: {
        fontSize: 13,
        color: "#94A3B8",
        textAlign: "center",
        marginTop: 6,
        paddingHorizontal: 40,
    },
});

export default gameSessionsStyle;
