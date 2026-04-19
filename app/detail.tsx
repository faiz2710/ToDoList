import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Subtask = {
  id: string;
  label: string;
  done: boolean;
};

type Note = {
  id: string;
  title: string;
  snippet?: string;
  date?: string;
  time?: string;
  dueDate?: string;
  tag?: string;
  priority?: string;
  completed: boolean;
  subtasks?: Subtask[];
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  "High Priority": { bg: "#fce7f3", text: "#9d174d" },
  "Steady Pace": { bg: "#ede9fe", text: "#5b21b6" },
  "Low Focus": { bg: "#e0f2fe", text: "#0369a1" },
};

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);

  // --- STATE UNTUK EDIT ---
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSnippet, setEditSnippet] = useState("");

  const [addingSubtask, setAddingSubtask] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const loadNote = async () => {
    try {
      const stored = await AsyncStorage.getItem("@smartnote_notes");
      if (stored) {
        const all: Note[] = JSON.parse(stored);
        const found = all.find((n) => n.id === id);
        if (found) {
          setNote(found);
          setEditTitle(found.title);
          setEditSnippet(found.snippet || "");
        }
      }
    } catch (e) {
      console.error("Gagal load note:", e);
    }
  };

  const saveNote = async (updated: Note) => {
    try {
      const stored = await AsyncStorage.getItem("@smartnote_notes");
      const all: Note[] = stored ? JSON.parse(stored) : [];
      const newAll = all.map((n) => (n.id === updated.id ? updated : n));
      await AsyncStorage.setItem("@smartnote_notes", JSON.stringify(newAll));
      setNote(updated);
    } catch (e) {
      console.error("Gagal simpan:", e);
    }
  };

  const handleSaveEdit = async () => {
    if (!note || !editTitle.trim()) {
      Alert.alert("Error", "Judul tidak boleh kosong");
      return;
    }
    const updated = { ...note, title: editTitle, snippet: editSnippet };
    await saveNote(updated);
    setIsEditing(false);
    Alert.alert("Sukses", "Catatan berhasil diperbarui");
  };

  const toggleComplete = async () => {
    if (!note) return;
    const updated = { ...note, completed: !note.completed };
    await saveNote(updated);
  };

  const toggleSubtask = async (subtaskId: string) => {
    if (!note) return;
    const updated = {
      ...note,
      subtasks: (note.subtasks || []).map((s) =>
        s.id === subtaskId ? { ...s, done: !s.done } : s,
      ),
    };
    await saveNote(updated);
  };

  const addSubtask = async () => {
    if (!note || !newSubtask.trim()) return;
    const updated = {
      ...note,
      subtasks: [
        ...(note.subtasks || []),
        { id: Date.now().toString(), label: newSubtask.trim(), done: false },
      ],
    };
    await saveNote(updated);
    setNewSubtask("");
    setAddingSubtask(false);
  };

  const deleteNote = async () => {
    Alert.alert("Hapus Task", "Yakin mau hapus task ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem("@smartnote_notes");
            const all: Note[] = stored ? JSON.parse(stored) : [];
            const filtered = all.filter((n) => n.id !== id);
            await AsyncStorage.setItem(
              "@smartnote_notes",
              JSON.stringify(filtered),
            );
            router.back();
          } catch (e) {
            console.error("Gagal hapus:", e);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadNote();
  }, [id]);

  if (!note) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const priorityStyle = note.priority
    ? (PRIORITY_COLORS[note.priority] ?? { bg: "#f0f2f7", text: "#6b7280" })
    : null;

  const subtasks = note.subtasks || [];
  const doneSubtasks = subtasks.filter((s) => s.done).length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#1a1a2e" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {isEditing ? "Editing Mode" : (note.tag ?? "Task Detail")}
        </Text>
        <TouchableOpacity
          style={[styles.headerBtn, isEditing && styles.headerBtnActive]}
          onPress={() => {
            if (isEditing) {
              setEditTitle(note.title);
              setEditSnippet(note.snippet || "");
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Ionicons
            name={isEditing ? "close" : "create-outline"}
            size={20}
            color={isEditing ? "#ef4444" : "#1a1a2e"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isEditing ? (
          /* MODE EDITING */
          <View style={styles.editContainer}>
            <Text style={styles.sectionLabel}>TITLE</Text>
            <TextInput
              style={styles.inputTitle}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Enter title..."
              multiline
            />

            <View style={{ height: 20 }} />

            <Text style={styles.sectionLabel}>DESCRIPTION / SCOPE</Text>
            <TextInput
              style={styles.inputSnippet}
              value={editSnippet}
              onChangeText={setEditSnippet}
              placeholder="Enter description..."
              multiline
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.saveEditBtn}
              onPress={handleSaveEdit}
            >
              <Text style={styles.saveEditBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* MODE VIEW (NORMAL) */
          <>
            <View style={styles.pillsRow}>
              {priorityStyle && note.priority ? (
                <View
                  style={[styles.pill, { backgroundColor: priorityStyle.bg }]}
                >
                  <Text
                    style={[styles.pillText, { color: priorityStyle.text }]}
                  >
                    {note.priority.toUpperCase()}
                  </Text>
                </View>
              ) : null}
              {note.tag ? (
                <View style={[styles.pill, { backgroundColor: "#ede9fe" }]}>
                  <Text style={[styles.pillText, { color: "#5b21b6" }]}>
                    {note.tag}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.title}>{note.title}</Text>

            <View style={styles.metaRow}>
              {note.date && (
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{note.date}</Text>
                </View>
              )}
              {note.time && (
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#6b7280" />
                  <Text style={styles.metaText}>{note.time}</Text>
                </View>
              )}
            </View>

            {note.snippet ? (
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>PROJECT SCOPE</Text>
                <Text style={styles.sectionBody}>{note.snippet}</Text>
              </View>
            ) : null}

            <View style={styles.coverBox}>
              <View style={styles.coverInner}>
                <Image
                  source={require("../assets/images/low.gif")}
                  style={styles.gif}
                />
              </View>
            </View>
          </>
        )}

        {/* EXECUTION ROADMAP (Tetap muncul di bawah) */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>EXECUTION ROADMAP</Text>
            {subtasks.length > 0 && (
              <Text style={styles.subtaskCount}>
                {doneSubtasks}/{subtasks.length}
              </Text>
            )}
          </View>

          {subtasks.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.subtaskCard}
              onPress={() => toggleSubtask(s.id)}
            >
              <View
                style={[
                  styles.subtaskCheckbox,
                  s.done && styles.subtaskCheckboxDone,
                ]}
              >
                {s.done && <Ionicons name="checkmark" size={12} color="#fff" />}
              </View>
              <Text
                style={[styles.subtaskLabel, s.done && styles.subtaskLabelDone]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}

          {addingSubtask ? (
            <View style={styles.subtaskInputRow}>
              <TextInput
                style={styles.subtaskInput}
                placeholder="Nama subtask..."
                value={newSubtask}
                onChangeText={setNewSubtask}
                autoFocus
                onSubmitEditing={addSubtask}
              />
              <TouchableOpacity onPress={addSubtask}>
                <Ionicons name="checkmark" size={20} color="#2563eb" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addSubtaskBtn}
              onPress={() => setAddingSubtask(true)}
            >
              <Ionicons name="add" size={16} color="#2563eb" />
              <Text style={styles.addSubtaskText}>Add Subtask</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM BAR (Hanya muncul jika tidak sedang edit) */}
      {!isEditing && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[
              styles.completeBtn,
              note.completed && styles.completeBtnDone,
            ]}
            onPress={toggleComplete}
          >
            <Ionicons
              name={note.completed ? "checkmark-done" : "checkmark"}
              size={18}
              color="#fff"
            />
            <Text style={styles.completeBtnText}>
              {note.completed ? "Completed" : "Mark as Complete"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={deleteNote}>
            <Ionicons name="trash-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f4f6f9" },
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { fontSize: 14, color: "#9ca3af" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#eaecf0",
  },
  headerBtnActive: { borderColor: "#ef4444" },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a2e",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  pillsRow: { flexDirection: "row", gap: 8, marginBottom: 14, marginTop: 4 },
  pill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 },
  pillText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 24 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  metaText: { fontSize: 13, color: "#6b7280" },
  section: { marginBottom: 24 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 10,
  },
  sectionBody: { fontSize: 14, color: "#374151", lineHeight: 22 },
  subtaskCount: { fontSize: 12, color: "#9ca3af", fontWeight: "600" },
  coverBox: {
    alignItems: "center",
    marginVertical: 20,
  },

  coverInner: {
    width: 220,
    height: 220,
    backgroundColor: "#f8fafc", // abu soft (light mode)
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",

    // shadow biar keliatan kayak card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  gif: {
    width: 160,
    height: 160,
    resizeMode: "contain",
  },
  subtaskCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 0.5,
    borderColor: "#eaecf0",
  },
  subtaskCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  subtaskCheckboxDone: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  subtaskLabel: { fontSize: 14, color: "#1a1a2e", fontWeight: "500", flex: 1 },
  subtaskLabelDone: { textDecorationLine: "line-through", color: "#9ca3af" },
  addSubtaskBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  addSubtaskText: { fontSize: 14, fontWeight: "600", color: "#2563eb" },
  subtaskInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2563eb",
    marginBottom: 8,
  },
  subtaskInput: { flex: 1, fontSize: 14, color: "#1a1a2e" },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    backgroundColor: "#f4f6f9",
    gap: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#eaecf0",
  },
  completeBtn: {
    flex: 1,
    backgroundColor: "#6d5acd",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completeBtnDone: { backgroundColor: "#16a34a" },
  completeBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  deleteBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#eaecf0",
  },

  /* EDIT STYLES */
  editContainer: { marginTop: 10 },
  inputTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a2e",
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    paddingBottom: 5,
  },
  inputSnippet: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    fontSize: 14,
    color: "#374151",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#eaecf0",
  },
  saveEditBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 25,
  },
  saveEditBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
