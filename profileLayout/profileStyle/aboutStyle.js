import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const aboutStyles = StyleSheet.create({
  // ─── Layout ───
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ─── About Header ───
  headerSection: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 28,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  logoImage: {
    width: 90,
    height: 90,
    borderRadius: 22,
    marginBottom: 5,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A1D26",
    letterSpacing: -0.5,
  },
  slogan: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 20,
  },
  versionBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "rgba(91, 63, 211, 0.1)",
  },
  versionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5B3FD3",
    letterSpacing: 0.5,
  },

  // ─── Card ───
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardBody: {
    fontSize: 14,
    fontWeight: "400",
    color: "#4B5563",
    lineHeight: 22,
  },

  // ─── Developer Row ───
  developerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  developerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#5B3FD3",
    alignItems: "center",
    justifyContent: "center",
  },
  developerInitials: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  developerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1D26",
  },
  developerRole: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 2,
  },

  // ─── Legal Row ───
  legalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  legalRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  legalIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  legalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },

  // ─── Help & Support ───
  contactHeader: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
  },
  contactTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1D26",
    letterSpacing: -0.3,
  },
  contactSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
  },

  // ─── Email Form Card ───
  emailFormCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  emailFormHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  emailFormIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  emailFormTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1D26",
  },
  emailFormSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    marginTop: 14,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1A1D26",
  },
  textArea: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1A1D26",
    height: 100,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#5B3FD3",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  // ─── Social / Contact Card ───
  socialCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
  },
  socialIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  socialLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1D26",
  },
  socialHandle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 1,
  },
  socialSeparator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 74,
  },

  // ─── Footer ───
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#D1D5DB",
  },
});

export default aboutStyles;
