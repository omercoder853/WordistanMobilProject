import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F9FB",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 40,
    },

    // ─── Section ───
    sectionContainer: {
        marginTop: 14,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "700",
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 8,
        marginLeft: 4,
    },

    // ─── Card ───
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingHorizontal: 16,
        paddingVertical: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },

    // ─── Row Item ───
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
    },
    settingLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginRight: 12,
        gap: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1E293B",
    },
    settingDesc: {
        fontSize: 12,
        fontWeight: "400",
        color: "#94A3B8",
        marginTop: 2,
        lineHeight: 16,
    },
    separator: {
        height: 1,
        backgroundColor: "#F1F5F9",
        marginVertical: 4,
    },

    // ─── Setting Block (for options with segmented controls) ───
    settingBlock: {
        paddingVertical: 10,
    },
    settingHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
    },

    // ─── Segmented Control ───
    segmentedContainer: {
        flexDirection: "row",
        backgroundColor: "#F1F5F9",
        borderRadius: 14,
        padding: 4,
        gap: 4,
    },
    segmentBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 9,
        paddingHorizontal: 4,
        borderRadius: 10,
        gap: 5,
    },
    segmentBtnActive: {
        backgroundColor: "#FFFFFF",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    segmentText: {
        fontSize: 12.5,
        fontWeight: "600",
        color: "#64748B",
    },
    segmentTextActive: {
        color: "#5B3FD3",
        fontWeight: "700",
    },
});

export default styles;