import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function FocusScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        {/* Icon Visual */}
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={40} color="#4F46E5" />
        </View>

        {/* Teks Utama */}
        <Text style={styles.title}>Focus</Text>
        
        {/* Badge Coming Soon */}
        <View style={styles.badge}>
          <Ionicons
            name="construct-outline"
            size={12}
            color="#4F46E5"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.badgeText}>UNDER DEVELOPMENT</Text>
        </View>

        {/* Progress Text */}
        <Text style={styles.percentage}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f6f9' },

  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 40 
  },

  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,

    // shadow biar floating
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },

  title: { 
    color: '#1a1a2e', 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 12 
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#c7d2fe',
    marginBottom: 20,
  },

  badgeText: {
    color: '#4F46E5',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  subtitle: { 
    color: '#6b7280', 
    fontSize: 15, 
    textAlign: 'center', 
    lineHeight: 22,
    marginBottom: 40 
  },

  progressTrack: {
    width: '60%',
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },

  percentage: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
});