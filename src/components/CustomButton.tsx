import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS } from '@/utils/theme';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const CustomButtonComponent: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: {
      button: { backgroundColor: colors.primary },
      text: { color: colors.white },
      loaderColor: colors.white,
    },
    secondary: {
      button: { backgroundColor: colors.primaryLight + '20' },
      text: { color: colors.primary },
      loaderColor: colors.primary,
    },
    outline: {
      button: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
      text: { color: colors.primary },
      loaderColor: colors.primary,
    },
    ghost: {
      button: { backgroundColor: 'transparent' },
      text: { color: colors.textSecondary },
      loaderColor: colors.textSecondary,
    },
  };

  const current = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.buttonBase,
        styles.solidButton,
        current.button,
        style,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={current.loaderColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.solidText, current.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  solidButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  solidText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

export const CustomButton = memo(CustomButtonComponent);
