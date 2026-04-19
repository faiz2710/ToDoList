import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Note } from "./index";

export default function ArchiveScreen() {
  const [completedNotes, setCompletedNotes] = useState<Note[]>([]);

  // 1. Load data yang sama dari AsyncStorage
  const loadCompletedNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem("@smartnote_notes");
      if (storedNotes) {
        const allNotes: Note[] = JSON.parse(storedNotes);
        // FILTER: Hanya ambil yang sudah selesai
        const filtered = allNotes.filter((n) => n.completed === true);
        setCompletedNotes(filtered);
      }
    } catch (error) {
      console.error("Gagal load archive:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCompletedNotes();
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SESUAI FIGMA */}
      <View style={styles.header}>
        <Text style={styles.subTitle}>TASK HISTORY</Text>
        <Text style={styles.mainTitle}>Completed</Text>
        <View style={styles.statsLine}>
          <View style={styles.line} />
          <Text style={styles.statsText}>
            {completedNotes.length} Tasks Finished
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* LIST TUGAS SELESAI */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>History</Text>
        </View>

        {completedNotes.length > 0 ? (
          completedNotes.map((item) => (
            <View key={item.id} style={styles.taskCard}>
              <View style={styles.checkIcon}>
                <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskMeta}>
                  {item.tag ? `${item.tag.toUpperCase()} ` : "NO TAG "}
                  {item.time ? `• ${item.time}` : ""}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>
            Belum ada tugas yang diselesaikan.
          </Text>
        )}

        {/* BLUE EFFICIENCY REPORT CARD */}
        <View style={styles.reportCard}>
          <Text style={styles.reportLabel}>EFFICIENCY REPORT</Text>
          <Text style={styles.reportMainText}>
            You're {completedNotes.length > 0 ? "15%" : "0%"} more productive
            than last week.
          </Text>
          <View style={styles.reportStatsRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>STREAK</Text>
              <Text style={styles.miniValue}>12 Days</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>VELOCITY</Text>
              <Text style={styles.miniValue}>
                {completedNotes.length > 0 ? "4.2" : "0"} Tasks/Day
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f9", paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 120 },

  header: { marginTop: 40, marginBottom: 20 },
  subTitle: {
    color: "#2563eb",
    fontWeight: "bold",
    fontSize: 11,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "600",
    color: "#1a1a2e",
    marginVertical: 5,
  },
  statsLine: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  line: { flex: 1, height: 1, backgroundColor: "#dde2ea", marginRight: 15 },
  statsText: { color: "#9ca3af", fontSize: 13 },

  sectionHeader: { marginTop: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a2e" },

  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#eaecf0",
  },
  checkIcon: { marginRight: 15 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a2e" },
  taskMeta: {
    fontSize: 11,
    color: "#9ca3af",
    marginTop: 4,
    letterSpacing: 0.5,
  },

  reportCard: {
    backgroundColor: "#2563eb",
    borderRadius: 24,
    padding: 25,
    marginTop: 30,
  },
  reportLabel: {
    color: "#93c5fd",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  reportMainText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "500",
    marginVertical: 15,
    lineHeight: 32,
  },
  reportStatsRow: { flexDirection: "row", justifyContent: "space-between" },
  miniCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 15,
    borderRadius: 16,
    width: "47%",
  },
  miniLabel: { color: "#93c5fd", fontSize: 10, fontWeight: "bold" },
  miniValue: { color: "#FFF", fontSize: 20, fontWeight: "bold", marginTop: 5 },

  emptyText: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 20,
    fontSize: 14,
  },
});
