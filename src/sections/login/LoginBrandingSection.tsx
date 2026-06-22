import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export default function LoginBrandingSection() {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <View style={styles.logoCircle}>
        <Ionicons name="logo-edge" size={48} color={colors.white} />
      </View>
      <Text style={styles.appName}>Billion Tags</Text>
      <Text style={styles.tagline}>Connect with your community</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    textAlign: 'left',
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    textAlign: 'left',
  },
});
