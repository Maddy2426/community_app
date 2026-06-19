import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS } from '@/utils/theme';

export type ProfilePostFilter = 'text' | 'photo';

interface ProfilePostToggleSectionProps {
  active: ProfilePostFilter;
  textCount: number;
  photoCount: number;
  onChange: (filter: ProfilePostFilter) => void;
}

export default function ProfilePostToggleSection({
  active,
  textCount,
  photoCount,
  onChange,
}: ProfilePostToggleSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.toggleContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[styles.toggleButton, active === 'text' && { backgroundColor: colors.primary }]}
        onPress={() => onChange('text')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="document-text-outline"
          size={18}
          color={active === 'text' ? colors.white : colors.textSecondary}
        />
        <Text
          style={[styles.toggleLabel, { color: active === 'text' ? colors.white : colors.textSecondary }]}
        >
          Text ({textCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.toggleButton, active === 'photo' && { backgroundColor: colors.primary }]}
        onPress={() => onChange('photo')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="image-outline"
          size={18}
          color={active === 'photo' ? colors.white : colors.textSecondary}
        />
        <Text
          style={[styles.toggleLabel, { color: active === 'photo' ? colors.white : colors.textSecondary }]}
        >
          Photo ({photoCount})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS - 4,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});
