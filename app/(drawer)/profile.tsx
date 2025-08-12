import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { UserInfoCard } from "@/components/profile/UserInfoCard";
import { GoalsCard } from "@/components/profile/GoalsCard";
import { PreferencesCard } from "@/components/profile/PreferencesCard";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useResponsiveStyles } from "@/hooks/useResponsiveStyles";
import { useTheme } from "@/hooks/useTheme";
import {
  ProfileData,
  UserInfo,
  Goals,
  Preferences,
  loadProfileData,
  saveUserInfo,
  saveGoals,
  savePreferences,
} from "@/utils/profileStorage";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { getStyles } = useResponsiveStyles();
  const styles = getStyles(mobileStyles(colors), tabletStyles(colors));

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await loadProfileData();
      setProfileData(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserInfo = async (userInfo: UserInfo) => {
    try {
      await saveUserInfo(userInfo);
      setProfileData(prev => prev ? { ...prev, userInfo } : null);
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleUpdateGoals = async (goals: Goals) => {
    try {
      await saveGoals(goals);
      setProfileData(prev => prev ? { ...prev, goals } : null);
    } catch (error) {
      console.error("Error updating goals:", error);
    }
  };

  const handleUpdatePreferences = async (preferences: Preferences) => {
    try {
      await savePreferences(preferences);
      setProfileData(prev => prev ? { ...prev, preferences } : null);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  if (loading || !profileData) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedText>Loading profile...</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserInfoCard
          userInfo={profileData.userInfo}
          units={profileData.preferences.weightUnits}
          onEdit={() => setEditModalVisible(true)}
        />

        <GoalsCard
          goals={profileData.goals}
          units={profileData.preferences.weightUnits}
          currentWeight={profileData.userInfo.weight}
          onUpdate={handleUpdateGoals}
        />

        <PreferencesCard
          preferences={profileData.preferences}
          onUpdate={handleUpdatePreferences}
        />

        <View style={styles.versionContainer}>
          <ThemedText style={styles.versionText}>
            TrainSync v1.0.0
          </ThemedText>
          <ThemedText style={styles.versionSubtext}>
            Your ultimate workout companion
          </ThemedText>
        </View>
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        userInfo={profileData.userInfo}
        units={profileData.preferences.weightUnits}
        onSave={handleUpdateUserInfo}
        onClose={() => setEditModalVisible(false)}
      />
    </View>
  );
}

const mobileStyles = (colors: ReturnType<typeof useTheme>["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingTop: 16,
      paddingBottom: 20,
    },
    versionContainer: {
      alignItems: "center",
      marginTop: 20,
      paddingVertical: 20,
    },
    versionText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: "600",
    },
    versionSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
  });

const tabletStyles = (colors: ReturnType<typeof useTheme>["colors"]) => {
  const mobile = mobileStyles(colors);
  return StyleSheet.create({
    ...mobile,
    scrollContent: {
      ...mobile.scrollContent,
      padding: 24,
      paddingTop: 20,
    },
  });
};
