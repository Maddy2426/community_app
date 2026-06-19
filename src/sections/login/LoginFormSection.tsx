import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { CustomButton, CustomInput } from '@/components';
import { useAuth } from '@/hooks/useAppActions';
import { useTheme } from '@/hooks/useTheme';
import { validateEmailOrMobile } from '@/utils/helpers';

export default function LoginFormSection() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [errors, setErrors] = useState<{ username?: string; emailOrMobile?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!emailOrMobile.trim()) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    } else if (!validateEmailOrMobile(emailOrMobile)) {
      newErrors.emailOrMobile = 'Enter a valid email or mobile number';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(username, emailOrMobile);
    } finally {
      setLoading(false);
    }
  }, [username, emailOrMobile, login]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.formContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.welcomeText, { color: colors.textPrimary }]}>Welcome Back</Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            Sign in to continue to your feed
          </Text>

          <CustomInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            error={errors.username}
            autoCapitalize="none"
          />

          <CustomInput
            label="Email / Mobile Number"
            value={emailOrMobile}
            onChangeText={setEmailOrMobile}
            placeholder="Enter your email or mobile number"
            error={errors.emailOrMobile}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    marginTop: -24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'left',
  },
  subText: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'left',
  },
  loginButton: {
    marginTop: 8,
  },
});
