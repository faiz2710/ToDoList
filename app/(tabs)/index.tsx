import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Note = {
  id: string;
  title: string;
  snippet?: string;
  date?: string;
  time?: string;
  dueDate?: string;
  tag?: string;
  priority?: string;
  completed: boolean;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("@smartnote_notes");
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Gagal load catatan:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      const updatedNotes = notes.map((note) => {
        if (note.id === id) {
          return { ...note, completed: !note.completed };
        }
        return note;
      });
      setNotes(updatedNotes);
      await AsyncStorage.setItem(
        "@smartnote_notes",
        JSON.stringify(updatedNotes)
      );
    } catch (error) {
      console.error("Gagal update status:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const completedCount = notes.filter((n) => n.completed).length;
  const totalCount = notes.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const filledBars =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 5) : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerAvatar}>
            <Image
              source={require("../../assets/images/profile.jpg")}
              style={styles.logoimage}
            />
          </View>
          <Text style={styles.headerBrand}>Midnight Focus</Text>
        </View>
        <TouchableOpacity style={styles.headerSettings}>
          <Ionicons name="settings-outline" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROGRESS SECTION */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>DAILY PROGRESS</Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
          <Text style={styles.progressDesc}>
            Daily momentum achieved. You're outperforming 92% of your peer
            group today.
          </Text>
          <View style={styles.progressBarRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.progressBar,
                  { backgroundColor: i < filledBars ? "#2563eb" : "#e4e8f0" },
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressCount}>
            {completedCount} / {totalCount} task selesai
          </Text>
        </View>

        {/* TODAY'S FOCUS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Focus</Text>
          <View style={styles.sectionBadgePill}>
            <Text style={styles.sectionBadgeText}>
              {notes.filter((n) => !n.completed).length} Remaining
            </Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {notes.length > 0 ? (
            notes.map((item) => (
              <View
                key={item.id}
                style={[styles.taskCard, item.completed && styles.taskCardDone]}
              >
                <View style={styles.cardContent}>
                  {/* CHECKBOX — toggle complete */}
                  <TouchableOpacity
                    onPress={() => toggleComplete(item.id)}
                    style={[
                      styles.cardCheckbox,
                      item.completed && styles.cardCheckboxChecked,
                    ]}
                  >
                    {item.completed && (
                      <Ionicons name="checkmark" size={13} color="#fff" />
                    )}
                  </TouchableOpacity>

                  {/* INFO — tap ke detail */}
                  <TouchableOpacity
                    style={styles.cardInfo}
                    onPress={() =>
                      router.push({
                        pathname: "/detail",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text
                      style={[
                        styles.cardTitle,
                        item.completed && styles.cardTitleDone,
                      ]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>

                    {item.snippet ? (
                      <Text
                        style={[
                          styles.cardSnippet,
                          item.completed && styles.cardSnippetDone,
                        ]}
                        numberOfLines={2}
                      >
                        {item.snippet}
                      </Text>
                    ) : null}

                    {/* TANGGAL + JAM + TAG */}
                    <View style={styles.cardMeta}>
                      {item.date ? (
                        <View style={styles.cardMetaItem}>
                          <Ionicons
                            name="calendar-outline"
                            size={11}
                            color={item.completed ? "#c4c9d4" : "#9ca3af"}
                          />
                          <Text
                            style={[
                              styles.cardMetaText,
                              item.completed && styles.cardMetaTextDone,
                            ]}
                          >
                            {item.date}
                          </Text>
                        </View>
                      ) : null}

                      {item.time ? (
                        <View style={styles.cardMetaItem}>
                          <Ionicons
                            name="time-outline"
                            size={11}
                            color={item.completed ? "#c4c9d4" : "#9ca3af"}
                          />
                          <Text
                            style={[
                              styles.cardMetaText,
                              item.completed && styles.cardMetaTextDone,
                            ]}
                          >
                            {item.time}
                          </Text>
                        </View>
                      ) : null}

                      {item.tag ? (
                        <View
                          style={[
                            styles.cardTagPill,
                            item.completed && styles.cardTagPillDone,
                          ]}
                        >
                          <Text
                            style={[
                              styles.cardTagText,
                              item.completed && styles.cardTagTextDone,
                            ]}
                          >
                            {item.tag}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>

                  {/* CHEVRON — juga ke detail */}
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/detail",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Ionicons name="chevron-forward" size={14} color="#d1d5db" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="clipboard-outline" size={22} color="#b0b8c8" />
              </View>
              <Text style={styles.emptyText}>Belum ada catatan.</Text>
            </View>
          )}
        </View>

        {/* INSIGHTS */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <View style={styles.insightDot} />
            <Text style={styles.insightTitle}>PRODUCTIVITY INSIGHTS</Text>
          </View>
          <View style={styles.insightGrid}>
            <View style={styles.insightStat}>
              <Text style={styles.insightNum}>{totalCount}</Text>
              <Text style={styles.insightLbl}>Total catatan</Text>
            </View>
            <View style={styles.insightStat}>
              <Text style={styles.insightNum}>{completedCount}</Text>
              <Text style={styles.insightLbl}>Selesai hari ini</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f6f9" },
  scrollContent: { paddingBottom: 130 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, overflow: "hidden" },
  logoimage: { width: 36, height: 36, borderRadius: 18 },
  headerBrand: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a2e",
    letterSpacing: -0.3,
  },
  headerSettings: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#edf0f5",
    alignItems: "center",
    justifyContent: "center",
  },

  progressSection: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 },
  progressLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9ca3af",
    letterSpacing: 0.9,
    marginBottom: 6,
  },
  progressPercent: {
    fontSize: 60,
    fontWeight: "400",
    color: "#1a1a2e",
    letterSpacing: -3,
    lineHeight: 66,
  },
  progressDesc: { fontSize: 13, color: "#6b7280", marginTop: 8, lineHeight: 20 },
  progressBarRow: { flexDirection: "row", marginTop: 18 },
  progressBar: { flex: 1, height: 6, borderRadius: 99, marginRight: 5 },
  progressCount: { fontSize: 12, color: "#9ca3af", marginTop: 8 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a2e" },
  sectionBadgePill: {
    backgroundColor: "#edf0f5",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: "#dde2ea",
  },
  sectionBadgeText: { fontSize: 12, color: "#6b7280" },

  cardsContainer: { paddingHorizontal: 16 },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 0.5,
    borderColor: "#eaecf0",
    marginBottom: 8,
  },
  taskCardDone: { opacity: 0.55 },
  cardContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    alignSelf: "flex-start",
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  cardCheckboxChecked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#1a1a2e", marginBottom: 2 },
  cardTitleDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  cardSnippet: { fontSize: 12, color: "#6b7280", lineHeight: 18 },
  cardSnippetDone: { color: "#c4c9d4" },

  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
  },
  cardMetaItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  cardMetaText: { fontSize: 11, color: "#9ca3af" },
  cardMetaTextDone: { color: "#c4c9d4" },
  cardTagPill: {
    backgroundColor: "#eff4ff",
    borderRadius: 99,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  cardTagPillDone: { backgroundColor: "#f1f2f4" },
  cardTagText: { fontSize: 10, fontWeight: "600", color: "#2563eb", letterSpacing: 0.4 },
  cardTagTextDone: { color: "#c4c9d4" },

  emptyContainer: { alignItems: "center", paddingVertical: 48, gap: 10 },
  emptyIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#edf0f5",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { fontSize: 14, color: "#9ca3af" },

  insightCard: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 0.5,
    borderColor: "#eaecf0",
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  insightDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2563eb" },
  insightTitle: { fontSize: 11, fontWeight: "700", color: "#2563eb", letterSpacing: 0.7 },
  insightGrid: { flexDirection: "row", gap: 8 },
  insightStat: { flex: 1, backgroundColor: "#f4f6f9", borderRadius: 10, padding: 12 },
  insightNum: { fontSize: 26, fontWeight: "400", color: "#1a1a2e", letterSpacing: -0.5 },
  insightLbl: { fontSize: 11, color: "#9ca3af", marginTop: 2 },

  fab: {
    position: "absolute",
    bottom: 116,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
});