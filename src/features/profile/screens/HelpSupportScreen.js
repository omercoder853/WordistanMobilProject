import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contextapis/AuthContext";
import aboutStyles from "../styles/AboutScreenStyle";
import { useCallback } from "react";
import { useTheme } from "@/contextapis/ThemeContext";

// ─── Social channels data ───
const socialChannels = [
  {
    id: "twitter",
    labelKey: "contactTwitter",
    url: "",
    handle: "@wordistan",
    icon: "logo-twitter",
    iconColor: "#1DA1F2",
    bgColor: "rgba(29, 161, 242, 0.1)",
  },
  {
    id: "linkedin",
    labelKey: "contactLinkedin",
    url: "https://www.linkedin.com/in/omrfrkgulsen",
    handle: "@omrfrkgulsen",
    icon: "logo-linkedin",
    iconColor: "#0A66C2",
    bgColor: "rgba(10, 102, 194, 0.1)",
  },
  {
    id: "website",
    labelKey: "contactWebsite",
    url: "https://wordistan-backend.onrender.com/",
    handle: "wordistan.com",
    icon: "globe-outline",
    iconColor: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
  {
    id: "github",
    labelKey: "contactGithub",
    url: "https://github.com/omercoder853",
    handle: "@omercoder853",
    icon: "logo-github",
    iconColor: "#24292F",
    bgColor: "rgba(36, 41, 47, 0.08)",
  },
];

export default function HelpSupport() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();

  // Default email from user context
  const userEmail = user?.email || "";
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const OpenUrl = async (url) => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url);
    }
    else {
      Alert.alert("This link can not be opened")
    }
  }

  const handleOpenChannel = (channel) => {
    if (channel.url) {
      OpenUrl(channel.url);
    } else {
      Alert.alert("This link can not be opened");
    }
  };

  const handleSendEmail = () => {
    // no-op
  };

  return (
    <View style={[aboutStyles.container, { backgroundColor: colors.common.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={aboutStyles.scrollContent}
      >
        {/* ─── Contact Header ─── */}
        <View style={aboutStyles.contactHeader}>
          <Text style={[aboutStyles.contactTitle, { color: colors.profile.textPrimary }]}>{t("contactGetInTouch")}</Text>
          <Text style={[aboutStyles.contactSubtitle, { color: colors.profile.textSecondary }]}>
            {t("contactSubtitle")}
          </Text>
        </View>

        {/* ─── Email Form Card ─── */}
        <View style={[aboutStyles.emailFormCard, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
          <View style={aboutStyles.emailFormHeader}>
            <View style={aboutStyles.emailFormIconBox}>
              <Ionicons name="mail-unread-outline" size={22} color="#3B82F6" />
            </View>
            <View>
              <Text style={[aboutStyles.emailFormTitle, { color: colors.profile.textPrimary }]}>
                {t("contactEmailTitle")}
              </Text>
              <Text style={[aboutStyles.emailFormSubtitle, { color: colors.profile.textSecondary }]}>
                {t("contactEmailSubtitle")}
              </Text>
            </View>
          </View>

          {/* Email (read-only / pre-filled) */}
          <Text style={[aboutStyles.inputLabel, { color: colors.profile.textSecondary }]}>{t("emailLabel")}</Text>
          <TextInput
            style={[aboutStyles.textInput, { backgroundColor: isDark ? colors.common.surface : '#F9FAFB', borderColor: colors.profile.separator, color: colors.profile.textPrimary }]}
            value={userEmail}
            editable={false}
          />

          {/* Subject */}
          <Text style={[aboutStyles.inputLabel, { color: colors.profile.textSecondary }]}>{t("contactSubjectLabel")}</Text>
          <TextInput
            style={[aboutStyles.textInput, { backgroundColor: isDark ? colors.common.surface : '#F9FAFB', borderColor: colors.profile.separator, color: colors.profile.textPrimary }]}
            value={subject}
            onChangeText={setSubject}
            placeholder={t("contactSubjectPlaceholder")}
            placeholderTextColor={colors.common.placeholder}
          />

          {/* Message */}
          <Text style={[aboutStyles.inputLabel, { color: colors.profile.textSecondary }]}>{t("contactMessageLabel")}</Text>
          <TextInput
            style={[aboutStyles.textArea, { backgroundColor: isDark ? colors.common.surface : '#F9FAFB', borderColor: colors.profile.separator, color: colors.profile.textPrimary }]}
            value={message}
            onChangeText={setMessage}
            placeholder={t("contactMessagePlaceholder")}
            placeholderTextColor={colors.common.placeholder}
            multiline
            numberOfLines={4}
          />

          {/* Send Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSendEmail}
            style={aboutStyles.sendButton}
          >
            <Ionicons name="send" size={16} color="#FFFFFF" />
            <Text style={aboutStyles.sendButtonText}>{t("contactSendBtn")}</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Social Channels Card ─── */}
        <View style={[aboutStyles.socialCard, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
          {socialChannels.map((channel, index) => (
            <React.Fragment key={channel.id}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleOpenChannel(channel)}
                style={aboutStyles.socialRow}
              >
                <View
                  style={[
                    aboutStyles.socialIconBox,
                    { backgroundColor: channel.bgColor },
                  ]}
                >
                  <Ionicons
                    name={channel.icon}
                    size={22}
                    color={channel.iconColor}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[aboutStyles.socialLabel, { color: colors.profile.textPrimary }]}>{t(channel.labelKey)}</Text>
                  <Text style={[aboutStyles.socialHandle, { color: colors.profile.textSecondary }]}>{channel.handle}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.profile.textSecondary}
                />
              </TouchableOpacity>
              {index < socialChannels.length - 1 && (
                <View style={[aboutStyles.socialSeparator, { backgroundColor: colors.profile.separator }]} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ─── Footer ─── */}
        <View style={aboutStyles.footer}>
          <Text style={aboutStyles.footerText}>
            Wordistan © 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}