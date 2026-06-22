import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAppActions';

export default function ProfileHeaderActionsSection() {
  const { colors, toggleTheme, isDark } = useTheme();
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={styles.headerActions}>
      <TouchableOpacity onPress={toggleTheme} hitSlop={12} accessibilityLabel="Toggle theme">
        <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={colors.white} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} hitSlop={12} accessibilityLabel="Logout">
        <Ionicons name="log-out-outline" size={22} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingBottom: 16,
  },
});
