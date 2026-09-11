import { StyleSheet } from "react-native";

const statisticsStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
    },
    scrollContent: {
        paddingBottom: 40,
        alignItems: "center",
        paddingTop: 16,
        paddingHorizontal: 12,
    },

    // ─── Level Card (preserved from original) ───
    card: {
        width: "95%",
        backgroundColor: "rgba(248, 247, 255, 0.92)",
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: "#EDE9FE",
        shadowColor: "#8B5CF6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    levelHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },
    levelBadge: {
        backgroundColor: "#8B5CF6",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    levelTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1E1B4B",
        flex: 1,
    },
    levelSubtitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#8B5CF6",
    },
    progressTrack: {
        height: 10,
        backgroundColor: "#EDE9FE",
        borderRadius: 5,
        overflow: "hidden",
        marginBottom: 10,
    },
    progressFillContainer: {
        height: "100%",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressFill: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    xpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 4,
    },
    xpCurrent: {
        fontSize: 13,
        fontWeight: "600",
        color: "#6366F1",
    },
    xpTarget: {
        fontSize: 13,
        fontWeight: "600",
        color: "#94A3B8",
    },
    xpHint: {
        fontSize: 12,
        color: "#64748B",
        textAlign: "center",
        marginTop: 6,
        fontStyle: "italic",
    },

    // ─── Chart Cards ───
    chartCard: {
        width: "95%",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 16,
        marginTop: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    chartTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#1E1B4B",
    },

    // ─── Filter Pills ───
    filterRow: {
        flexDirection: "row",
        gap: 6,
        marginBottom: 10,
    },
    filterPill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: "#F1F5F9",
    },
    filterPillActive: {
        backgroundColor: "#6366F1",
    },
    filterPillText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },
    filterPillTextActive: {
        color: "#FFFFFF",
    },

    // ─── Metric Tabs ───
    metricRow: {
        flexDirection: "row",
        gap: 4,
        marginBottom: 8,
    },
    metricTab: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        backgroundColor: "#F8F9FB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    metricTabActive: {
        backgroundColor: "#EEF2FF",
        borderColor: "#6366F1",
    },
    metricTabText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#94A3B8",
    },
    metricTabTextActive: {
        color: "#6366F1",
    },

    // ─── Average Score Badges ───
    avgRow: {
        flexDirection: "row",
        gap: 12,
        width: "95%",
        marginTop: 16,
    },
    avgBadge: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    avgBadgeHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 8,
    },
    avgBadgeLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },
    avgBadgeValue: {
        fontSize: 28,
        fontWeight: "800",
        color: "#1E1B4B",
    },
    avgBadgeSuffix: {
        fontSize: 12,
        fontWeight: "500",
        color: "#94A3B8",
        marginTop: 2,
    },

    // ─── Empty State ───
    emptyContainer: {
        width: "95%",
        alignItems: "center",
        paddingVertical: 40,
        marginTop: 16,
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E1B4B",
        marginBottom: 6,
    },
    emptyDesc: {
        fontSize: 13,
        color: "#94A3B8",
        textAlign: "center",
    },
});

export default statisticsStyle;
