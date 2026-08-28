import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contextapis/AuthContext";
import aboutStyles from "../profileStyle/aboutStyle";

// ─── Social channels data ───
const socialChannels = [
  {
    id: "twitter",
    labelKey: "contactTwitter",
    handle: "@wordistan",
    icon: "logo-twitter",
    iconColor: "#1DA1F2",
    bgColor: "rgba(29, 161, 242, 0.1)",
  },
  {
    id: "linkedin",
    labelKey: "contactLinkedin",
    handle: "linkedin.com/company/wordistan",
    icon: "logo-linkedin",
    iconColor: "#0A66C2",
    bgColor: "rgba(10, 102, 194, 0.1)",
  },
  {
    id: "website",
    labelKey: "contactWebsite",
    handle: "www.wordistan.com",
    icon: "globe-outline",
    iconColor: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.1)",
  },
  {
    id: "github",
    labelKey: "contactGithub",
    handle: "github.com/omercoder853",
    icon: "logo-github",
    iconColor: "#24292F",
    bgColor: "rgba(36, 41, 47, 0.08)",
  },
];

export default function HelpSupport() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Default email from user context
  const userEmail = user?.email || "";

  return (
    <View style={aboutStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={aboutStyles.scrollContent}
      >
        {/* ─── Header ─── */}
        <View style={aboutStyles.contactHeader}>
          <Text style={aboutStyles.contactTitle}>{t("contactGetInTouch")}</Text>
          <Text style={aboutStyles.contactSubtitle}>
            {t("contactSubtitle")}
          </Text>
        </View>

        {/* ─── Email Form Card ─── */}
        <View style={aboutStyles.emailFormCard}>
          <View style={aboutStyles.emailFormHeader}>
            <View style={aboutStyles.emailFormIconBox}>
              <Ionicons name="mail-outline" size={22} color="#3B82F6" />
            </View>
            <View>
              <Text style={aboutStyles.emailFormTitle}>
                {t("contactEmailTitle")}
              </Text>
              <Text style={aboutStyles.emailFormSubtitle}>
                {t("contactEmailSubtitle")}
              </Text>
            </View>
          </View>

          {/* Sender Email */}
          <Text style={aboutStyles.inputLabel}>{t("contactFromLabel")}</Text>
          <TextInput
            style={aboutStyles.textInput}
            defaultValue={userEmail}
            placeholder="email@example.com"
            placeholderTextColor="#D1D5DB"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
          />

          {/* Subject */}
          <Text style={aboutStyles.inputLabel}>{t("contactSubjectLabel")}</Text>
          <TextInput
            style={aboutStyles.textInput}
            placeholder={t("contactSubjectPlaceholder")}
            placeholderTextColor="#D1D5DB"
          />

          {/* Message */}
          <Text style={aboutStyles.inputLabel}>{t("contactMessageLabel")}</Text>
          <TextInput
            style={aboutStyles.textArea}
            placeholder={t("contactMessagePlaceholder")}
            placeholderTextColor="#D1D5DB"
            multiline
            numberOfLines={4}
          />

          {/* Send Button (no-op) */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={aboutStyles.sendButton}
            onPress={() => {}}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
            <Text style={aboutStyles.sendButtonText}>
              {t("contactSendBtn")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Social Links Card ─── */}
        <View style={[aboutStyles.card, { marginTop: 16, paddingVertical: 4, paddingHorizontal: 0 }]}>
          <Text style={[aboutStyles.cardTitle, { paddingHorizontal: 18, paddingTop: 14 }]}>
            {t("contactSocialTitle")}
          </Text>

          {socialChannels.map((channel, index) => (
            <View key={channel.id}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {}}
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
                  <Text style={aboutStyles.socialLabel}>
                    {t(channel.labelKey)}
                  </Text>
                  <Text style={aboutStyles.socialHandle}>{channel.handle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
              {index < socialChannels.length - 1 && (
                <View style={aboutStyles.socialSeparator} />
              )}
            </View>
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