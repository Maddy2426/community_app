import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

const HeaderComponent: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <View style={styles.row}>
        {showBack && (
          <TouchableOpacity onPress={onBack} style={styles.backButton} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAction ? (
          <View style={styles.rightAction}>{rightAction}</View>
        ) : showBack ? (
          <View style={styles.rightSpacer} />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'left',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
    textAlign: 'left',
  },
  rightAction: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSpacer: {
    width: 32,
  },
});

export const Header = memo(HeaderComponent);
