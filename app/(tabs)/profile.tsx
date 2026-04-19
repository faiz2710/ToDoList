import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [name, setName] = useState("Alex Rivera");
  const [email, setEmail] = useState("alex.rivera@kinetic.flow");
  const [avatarUri, setAvatarUri] = useState("https://i.pravatar.cc/300?img=11");

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const savedProfile = await AsyncStorage.getItem("userProfile");
          if (savedProfile) {
            const parsed = JSON.parse(savedProfile);
            if (parsed.name) setName(parsed.name);
            if (parsed.email) setEmail(parsed.email);
            if (parsed.avatar) setAvatarUri(parsed.avatar);
          }
        } catch (error) {
          console.error("Failed to load profile:", error);
        }
      };
      void loadProfile();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/(tabs)")}
          style={styles.backBtn}
          activeOpacity={0.7}>
          <Feather name="chevron-left" size={20} color="#1f2933" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={() => router.push("/editprofile")} activeOpacity={0.7}>
          <Text style={styles.editLink}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          {/* Cover */}
          <View style={styles.coverBg} />

          {/* Avatar */}
          <View style={styles.avatarArea}>
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
              <TouchableOpacity
                onPress={() => router.push("/editprofile")}
                style={styles.editAvatarBtn}
                activeOpacity={0.8}>
                <Feather name="edit-2" size={9} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
            <View style={styles.premiumBadge}>
              <Feather name="star" size={10} color="#185FA5" />
              <Text style={styles.premiumText}>PREMIUM</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>128</Text>
              <Text style={styles.statLabel}>Sesi</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Hari Aktif</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>9.8</Text>
              <Text style={styles.statLabel}>Skor</Text>
            </View>
          </View>
        </View>

        {/* SECTION: AKUN */}
        <Text style={styles.sectionLabel}>AKUN</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="user"
            label="Edit Profil"
            iconBg="#E6F1FB"
            iconColor="#185FA5"
            onPress={() => router.push("/editprofile")}
          />
          <MenuItem
            icon="lock"
            label="Keamanan"
            iconBg="#EAF3DE"
            iconColor="#3B6D11"
            onPress={() => router.push("/kemanan")}
          />
          <MenuItem
            icon="bell"
            label="Notifikasi"
            iconBg="#FAECE7"
            iconColor="#993C1D"
            last
          />
        </View>

        {/* SECTION: TAMPILAN */}
        <Text style={styles.sectionLabel}>TAMPILAN</Text>
        <View style={styles.menuCard}>
          <View style={styles.switchRow}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: "#EEEDFE" }]}>
                <Feather name="moon" size={16} color="#534AB7" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.menuLabel}>Tema Gelap</Text>
                <Text style={styles.menuSubLabel}>
                  Mode {isDarkMode ? "gelap" : "terang"} aktif
                </Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#D3D1C7", true: "#185FA5" }}
              thumbColor="#fff"
              ios_backgroundColor="#D3D1C7"
              onValueChange={() => setIsDarkMode(!isDarkMode)}
              value={isDarkMode}
            />
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Feather name="log-out" size={16} color="#A32D2D" />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <Text style={styles.footerText}>Kinetic Flow · v2.4.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Inline MenuItem component ────────────────────────────
type FeatherName = React.ComponentProps<typeof Feather>["name"];

function MenuItem({
  icon,
  label,
  iconBg,
  iconColor,
  last = false,
  onPress,
}: {
  icon: FeatherName;
  label: string;
  iconBg: string;
  iconColor: string;
  last?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, !last && styles.menuItemBorder]}
      onPress={onPress}
      activeOpacity={0.6}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
          <Feather name={icon} size={16} color={iconColor} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={16} color="#B4B2A9" />
    </TouchableOpacity>
  );
}

// ── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1EFE8",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#F1EFE8",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#2C2C2A",
  },
  editLink: {
    fontSize: 14,
    fontWeight: "500",
    color: "#185FA5",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },

  // Profile Card
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
    marginBottom: 24,
  },
  coverBg: {
    height: 80,
    backgroundColor: "#E6F1FB",
  },
  avatarArea: {
    alignItems: "center",
    marginTop: -36,
    marginBottom: 4,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#185FA5",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#2C2C2A",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#888780",
    marginBottom: 10,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E6F1FB",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#0C447C",
    letterSpacing: 0.6,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: "#D3D1C7",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: "#D3D1C7",
    marginVertical: 10,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "500",
    color: "#2C2C2A",
  },
  statLabel: {
    fontSize: 11,
    color: "#888780",
    marginTop: 2,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#888780",
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },

  // Menu
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: "#D3D1C7",
    overflow: "hidden",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#D3D1C7",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C2C2A",
    marginLeft: 12,
  },
  menuSubLabel: {
    fontSize: 12,
    color: "#888780",
    marginLeft: 12,
    marginTop: 1,
  },

  // Switch row
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
  },

  // Logout
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#FCEBEB",
    borderWidth: 0.5,
    borderColor: "#F7C1C1",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#A32D2D",
  },

  // Footer
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#B4B2A9",
    letterSpacing: 0.4,
  },
});