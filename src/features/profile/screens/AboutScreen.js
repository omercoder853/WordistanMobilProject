import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import aboutStyles from "../styles/AboutScreenStyle";
import { useTheme } from "@/contextapis/ThemeContext";

export default function About() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <View style={[aboutStyles.container, { backgroundColor: colors.common.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={aboutStyles.scrollContent}
      >
        {/* ─── Header: Logo + Name + Slogan + Version ─── */}
        <View style={[aboutStyles.headerSection, { backgroundColor: colors.profile.cardBg }]}>
          <Image
            source={require("@/shared/assets/logo.png")}
            style={aboutStyles.logoImage}
            resizeMode="contain"
          />
          <Text style={[aboutStyles.appName, { color: colors.profile.textPrimary }]}>Wordistan</Text>
          <Text style={[aboutStyles.slogan, { color: colors.profile.textSecondary }]}>{t("aboutSlogan")}</Text>
          <View style={aboutStyles.versionBadge}>
            <Text style={aboutStyles.versionText}>v1.0.0</Text>
          </View>
        </View>

        {/* ─── Description Card ─── */}
        <View style={[aboutStyles.card, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
          <Text style={[aboutStyles.cardTitle, { color: colors.profile.sectionTitle }]}>{t("aboutDescTitle")}</Text>
          <Text style={[aboutStyles.cardBody, { color: colors.profile.textSecondary }]}>{t("aboutDescBody")}</Text>
        </View>

        {/* ─── Developer Card ─── */}
        <View style={[aboutStyles.card, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
          <Text style={[aboutStyles.cardTitle, { color: colors.profile.sectionTitle }]}>{t("aboutDeveloper")}</Text>
          <View style={aboutStyles.developerRow}>
            <View style={aboutStyles.developerAvatar}>
              <Text style={aboutStyles.developerInitials}>ÖG</Text>
            </View>
            <View>
              <Text style={[aboutStyles.developerName, { color: colors.profile.textPrimary }]}>Ömer Faruk Gülşen</Text>
              <Text style={[aboutStyles.developerRole, { color: colors.profile.textSecondary }]}>
                {t("aboutDeveloperRole")}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Legal Card ─── */}
        <View style={[aboutStyles.card, { backgroundColor: colors.profile.cardBg, borderColor: colors.profile.cardBorder }]}>
          <Text style={[aboutStyles.cardTitle, { color: colors.profile.sectionTitle }]}>{t("aboutLegal")}</Text>

          {/* Privacy Policy */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { }}
            style={aboutStyles.legalRow}
          >
            <View style={aboutStyles.legalRowLeft}>
              <View
                style={[
                  aboutStyles.legalIconBox,
                  { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                ]}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
              </View>
              <Text style={aboutStyles.legalLabel}>{t("aboutPrivacy")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>

          <View style={aboutStyles.separator} />

          {/* Terms of Use */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => { }}
            style={aboutStyles.legalRow}
          >
            <View style={aboutStyles.legalRowLeft}>
              <View
                style={[
                  aboutStyles.legalIconBox,
                  { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                ]}
              >
                <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={aboutStyles.legalLabel}>{t("aboutTerms")}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        {/* ─── Footer ─── */}
        <View style={aboutStyles.footer}>
          <Text style={aboutStyles.footerText}>
            © 2026 Wordistan. {t("aboutAllRights")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}