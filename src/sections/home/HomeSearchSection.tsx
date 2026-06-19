import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS } from '@/utils/theme';

interface HomeSearchSectionProps {
  searchQuery: string;
  onSearch: (text: string) => void;
}

export default function HomeSearchSection({ searchQuery, onSearch }: HomeSearchSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={onSearch}
          placeholder="Search posts..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { color: colors.textPrimary }]}
        />
        {searchQuery.length > 0 && (
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textMuted}
            onPress={() => onSearch('')}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
});
