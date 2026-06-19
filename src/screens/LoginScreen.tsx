import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import LoginBrandingSection from '@/sections/login/LoginBrandingSection';
import LoginFormSection from '@/sections/login/LoginFormSection';

export default function LoginScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LoginBrandingSection />
      <LoginFormSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
