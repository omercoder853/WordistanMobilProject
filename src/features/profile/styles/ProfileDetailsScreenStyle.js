import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // ─── Page Container ───
  container: {
    flex: 1,
    backgroundColor: "#F8F9FB",
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: "center",
  },

  // ─── Avatar Section ───
  avatarSection: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarWrapper: {
    position: "relative",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "rgba(91, 63, 211, 0.15)",
  },
  editPhoto: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: "#5B3FD3",
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#5B3FD3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1A1D26",
    marginTop: 14,
    letterSpacing: -0.3,
  },
  avatarEmail: {
    fontSize: 13,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
  },

  // ─── Details Card ───
  detailsCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginTop: 20,
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 4,
  },
  profileDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 14,
  },
  detailIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  profileValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: "auto",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginLeft: 70,
  },

  // ─── Change Password Button ───
  changePasswordButton: {
    marginLeft: "auto",
    backgroundColor: "#5B3FD3",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: "#5B3FD3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  changePasswordText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  // ─── Delete Account Button ───
  deleteAccountButton: {
    width: "92%",
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    backgroundColor: "#FFF5F5",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  deleteAccountText: {
    textAlign: "center",
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default styles;