import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

const LoaderComponent: React.FC<LoaderProps> = ({
  fullScreen = true,
  size = 'large',
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
  },
});

export const Loader = memo(LoaderComponent);
