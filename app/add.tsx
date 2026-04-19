// app/writenote.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const TAGS = ["PERSONAL", "STRATEGY", "PROJECT"];
const PRIORITIES = [
  { label: "High Priority", icon: "trending-up-outline" },
  { label: "Steady Pace",   icon: "trending-up"         },
  { label: "Low Focus",     icon: "remove-outline"      },
];

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

export default function add() {
  const [title,    setTitle]    = useState("");
  const [content,  setContent]  = useState("");
  const [tag,      setTag]      = useState(TAGS[0]);
  const [priority, setPriority] = useState("Steady Pace");
  const [currentDate, setCurrentDate] = useState("");

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [selectedDay,  setSelectedDay]  = useState(today.getDate());

  // Time state
  const [selectedHour,   setSelectedHour]   = useState(String(today.getHours()).padStart(2, "0"));
  const [selectedMinute, setSelectedMinute] = useState(String(today.getMinutes()).padStart(2, "0"));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickingHour,    setPickingHour]    = useState(true); // true = pilih jam, false = pilih menit

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric", month: "long", year: "numeric",
    };
    setCurrentDate(today.toLocaleDateString("id-ID", options));
  }, []);

  const toggleTag = () => {
    const currentIndex = TAGS.indexOf(tag);
    setTag(TAGS[(currentIndex + 1) % TAGS.length]);
  };

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert("Eits!", "Judul atau isi catatan nggak boleh kosong dong.");
      return;
    }
    try {
      const existing = await AsyncStorage.getItem("@smartnote_notes");
      const notesArray = existing ? JSON.parse(existing) : [];
      const newNote = {
        id:       Date.now().toString(),
        title:    title.trim() || "Tanpa Judul",
        snippet:  content.trim() || "...",
        tag,
        date:     currentDate,
        time:     `${selectedHour}:${selectedMinute}`,
        priority,
        dueDate:  `${currentYear}-${String(currentMonth + 1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`,
        completed: false,
      };
      notesArray.unshift(newNote);
      await AsyncStorage.setItem("@smartnote_notes", JSON.stringify(notesArray));
      router.back();
    } catch (e) {
      console.error("Gagal menyimpan:", e);
      Alert.alert("Error", "Gagal menyimpan catatan.");
    }
  };

  const getWeekDates = () => {
    const date = new Date(currentYear, currentMonth, selectedDay);
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  const shiftWeek = (direction: number) => {
    const d = new Date(currentYear, currentMonth, selectedDay + direction * 7);
    setSelectedDay(d.getDate());
    setCurrentMonth(d.getMonth());
    setCurrentYear(d.getFullYear());
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Task</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.headerSave}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HERO */}
          <View style={styles.heroSection}>
            <Text style={styles.heroLabel}>TASK CREATION</Text>
            <Text style={styles.heroTitle}>Define your{"\n"}next move.</Text>
          </View>

          {/* META PILLS */}
          <View style={styles.metaRow}>
            <View style={styles.pill}>
              <Ionicons name="calendar-outline" size={13} color="#64748b" />
              <Text style={styles.pillText}>{currentDate}</Text>
            </View>
            <TouchableOpacity style={styles.pill} onPress={toggleTag} activeOpacity={0.7}>
              <Ionicons name="pricetag-outline" size={13} color="#2563eb" />
              <Text style={[styles.pillText, { color: "#2563eb" }]}>{tag}</Text>
            </TouchableOpacity>
          </View>

          {/* INPUT OBJECTIVE */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>THE OBJECTIVE</Text>
            <TextInput
              style={styles.inputBox}
              placeholder="What needs to be done?"
              placeholderTextColor="#b0b8cc"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* INPUT DETAIL */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>CONTEXT & DETAILS</Text>
            <TextInput
              style={[styles.inputBox, styles.inputMultiline]}
              placeholder="Add any specific requirements or links..."
              placeholderTextColor="#b0b8cc"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />
          </View>

          {/* CALENDAR CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardIconBox}>
                <Ionicons name="calendar-outline" size={18} color="#2563eb" />
              </View>
              <Text style={styles.cardLabel}>TIMELINE</Text>
            </View>

            <View style={styles.monthNav}>
              <TouchableOpacity onPress={() => shiftWeek(-1)}>
                <Ionicons name="chevron-back" size={20} color="#555" />
              </TouchableOpacity>
              <Text style={styles.monthText}>
                {MONTHS[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity onPress={() => shiftWeek(1)}>
                <Ionicons name="chevron-forward" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            <View style={styles.weekRow}>
              {DAYS.map((d, i) => (
                <Text key={i} style={styles.dayLabel}>{d}</Text>
              ))}
            </View>

            <View style={styles.weekRow}>
              {weekDates.map((d, i) => {
                const isSelected =
                  d.getDate()     === selectedDay &&
                  d.getMonth()    === currentMonth &&
                  d.getFullYear() === currentYear;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.dateBtn, isSelected && styles.dateBtnActive]}
                    onPress={() => {
                      setSelectedDay(d.getDate());
                      setCurrentMonth(d.getMonth());
                      setCurrentYear(d.getFullYear());
                    }}
                  >
                    <Text style={[styles.dateText, isSelected && styles.dateTextActive]}>
                      {d.getDate()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* TIME PICKER TRIGGER */}
            <View style={styles.timeDivider} />
            <TouchableOpacity
              style={styles.timeRow}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <View style={styles.timeLeft}>
                <Ionicons name="time-outline" size={16} color="#2563eb" />
                <Text style={styles.timeLabel}>Time</Text>
              </View>
              <View style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>
                  {selectedHour}:{selectedMinute}
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#2563eb" />
              </View>
            </TouchableOpacity>
          </View>

          {/* PRIORITY CARD */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconBox, { backgroundColor: "#ffe4e4" }]}>
                <Ionicons name="alert" size={18} color="#e53e3e" />
              </View>
              <Text style={styles.cardLabel}>INTENSITY</Text>
            </View>

            {PRIORITIES.map((p) => {
              const isActive = priority === p.label;
              return (
                <TouchableOpacity
                  key={p.label}
                  style={[styles.priorityRow, isActive && styles.priorityRowActive]}
                  onPress={() => setPriority(p.label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                    {isActive && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.priorityText, isActive && styles.priorityTextActive]}>
                    {p.label}
                  </Text>
                  {isActive && (
                    <Ionicons name={p.icon as any} size={18} color="#2563eb" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* BOTTOM BAR */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveBtnText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* TIME PICKER MODAL */}
      <Modal
        visible={showTimePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowTimePicker(false)}
        >
          <TouchableOpacity
            style={styles.modalSheet}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Time</Text>
              <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                <Text style={styles.modalDone}>Done</Text>
              </TouchableOpacity>
            </View>

            {/* Tab: Hour / Minute */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, pickingHour && styles.tabBtnActive]}
                onPress={() => setPickingHour(true)}
              >
                <Text style={[styles.tabText, pickingHour && styles.tabTextActive]}>
                  Hour
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, !pickingHour && styles.tabBtnActive]}
                onPress={() => setPickingHour(false)}
              >
                <Text style={[styles.tabText, !pickingHour && styles.tabTextActive]}>
                  Minute
                </Text>
              </TouchableOpacity>
            </View>

            {/* Selected display */}
            <View style={styles.timeDisplay}>
              <Text style={styles.timeDisplayText}>
                {selectedHour}:{selectedMinute}
              </Text>
            </View>

            {/* Scroll list */}
            <FlatList
              data={pickingHour ? HOURS : MINUTES}
              keyExtractor={(item) => item}
              style={styles.pickerList}
              showsVerticalScrollIndicator={false}
              getItemLayout={(_, index) => ({
                length: 52,
                offset: 52 * index,
                index,
              })}
              renderItem={({ item }) => {
                const isActive = pickingHour
                  ? item === selectedHour
                  : item === selectedMinute;
                return (
                  <TouchableOpacity
                    style={[styles.pickerItem, isActive && styles.pickerItemActive]}
                    onPress={() => {
                      if (pickingHour) {
                        setSelectedHour(item);
                        setPickingHour(false); // auto pindah ke menit
                      } else {
                        setSelectedMinute(item);
                        setShowTimePicker(false); // auto close setelah menit dipilih
                      }
                    }}
                  >
                    <Text style={[styles.pickerText, isActive && styles.pickerTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: "#f0f2f7" },
  flex:  { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a2e" },
  headerSave:  { fontSize: 15, fontWeight: "600", color: "#2563eb" },

  // HERO
  heroSection: { marginBottom: 20, marginTop: 4 },
  heroLabel: {
    fontSize: 11, fontWeight: "700", color: "#2563eb",
    letterSpacing: 1.2, marginBottom: 8,
  },
  heroTitle: {
    fontSize: 36, fontWeight: "800", color: "#1a1a2e",
    lineHeight: 42, letterSpacing: -1,
  },

  // META PILLS
  metaRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  pill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "#e8ecf4", paddingVertical: 7,
    paddingHorizontal: 12, borderRadius: 20,
  },
  pillText: { fontSize: 12, fontWeight: "600", color: "#475569" },

  // INPUT
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 11, fontWeight: "700", color: "#9ca3af",
    letterSpacing: 0.8, marginBottom: 8,
  },
  inputBox: {
    backgroundColor: "#e8ecf4", borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: "#1a1a2e",
  },
  inputMultiline: { height: 110, paddingTop: 14 },

  // CARD
  card: {
    backgroundColor: "#fff", borderRadius: 18,
    padding: 18, marginBottom: 14,
    borderWidth: 0.5, borderColor: "rgba(0,0,0,0.06)",
  },
  cardHeader: {
    flexDirection: "row", alignItems: "center",
    gap: 10, marginBottom: 16,
  },
  cardIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#eff4ff",
    alignItems: "center", justifyContent: "center",
  },
  cardLabel: {
    fontSize: 12, fontWeight: "700",
    color: "#9ca3af", letterSpacing: 0.8,
  },

  // CALENDAR
  monthNav: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", marginBottom: 14,
  },
  monthText: { fontSize: 15, fontWeight: "600", color: "#1a1a2e" },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between", marginBottom: 6,
  },
  dayLabel: {
    width: 36, textAlign: "center",
    fontSize: 12, fontWeight: "600", color: "#9ca3af",
  },
  dateBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
  },
  dateBtnActive: { backgroundColor: "#2563eb" },
  dateText:       { fontSize: 14, color: "#1a1a2e", fontWeight: "500" },
  dateTextActive: { color: "#fff", fontWeight: "700" },

  // TIME ROW (inside calendar card)
  timeDivider: {
    height: 0.5,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginVertical: 14,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timeLabel: { fontSize: 14, fontWeight: "600", color: "#1a1a2e" },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#eff4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  timeBadgeText: { fontSize: 14, fontWeight: "700", color: "#2563eb" },

  // PRIORITY
  priorityRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, borderRadius: 12,
    backgroundColor: "#f4f6f9", marginBottom: 8,
  },
  priorityRowActive: {
    backgroundColor: "#eff4ff",
    borderWidth: 1.5, borderColor: "#2563eb",
  },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: "#c0c8d8",
    alignItems: "center", justifyContent: "center",
  },
  radioOuterActive: { borderColor: "#2563eb" },
  radioInner: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: "#2563eb",
  },
  priorityText:       { flex: 1, fontSize: 14, color: "#6b7280", fontWeight: "500" },
  priorityTextActive: { color: "#1a1a2e", fontWeight: "600" },

  // BOTTOM BAR
  bottomBar: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24, paddingVertical: 16,
    backgroundColor: "#f0f2f7",
  },
  cancelBtn:   { paddingVertical: 14, paddingHorizontal: 20 },
  cancelText:  { fontSize: 15, color: "#9ca3af", fontWeight: "500" },
  saveBtn: {
    flex: 1, marginLeft: 16, backgroundColor: "#2563eb",
    borderRadius: 16, paddingVertical: 16, alignItems: "center",
  },
  saveBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "65%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.07)",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a2e" },
  modalDone:  { fontSize: 15, fontWeight: "600", color: "#2563eb" },

  // TABS
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 14,
    backgroundColor: "#f0f2f7",
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  tabBtnActive: { backgroundColor: "#fff" },
  tabText:       { fontSize: 13, fontWeight: "600", color: "#9ca3af" },
  tabTextActive: { color: "#1a1a2e" },

  // TIME DISPLAY
  timeDisplay: {
    alignItems: "center",
    paddingVertical: 16,
  },
  timeDisplayText: {
    fontSize: 40,
    fontWeight: "300",
    color: "#1a1a2e",
    letterSpacing: -1,
  },

  // PICKER LIST
  pickerList: { maxHeight: 260 },
  pickerItem: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    borderRadius: 12,
  },
  pickerItemActive: { backgroundColor: "#eff4ff" },
  pickerText:       { fontSize: 20, fontWeight: "400", color: "#9ca3af" },
  pickerTextActive: { fontSize: 22, fontWeight: "700", color: "#2563eb" },
});