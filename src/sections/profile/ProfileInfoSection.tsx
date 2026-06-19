import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from '@/components';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useTheme } from '@/hooks/useTheme';
import { BORDER_RADIUS } from '@/utils/theme';
import ProfileStatCardSection from '@/sections/profile/ProfileStatCardSection';
import ProfilePostToggleSection, { ProfilePostFilter } from '@/sections/profile/ProfilePostToggleSection';

interface ProfileInfoSectionProps {
  postFilter: ProfilePostFilter;
  textCount: number;
  photoCount: number;
  onFilterChange: (filter: ProfilePostFilter) => void;
  stats: {
    totalPosts: number;
    totalLikes: number;
    savedCount: number;
  };
}

export default function ProfileInfoSection({
  postFilter,
  textCount,
  photoCount,
  onFilterChange,
  stats,
}: ProfileInfoSectionProps) {
  const { colors } = useTheme();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <View style={styles.headerContent}>
      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Avatar name={user.username} uri={user.avatar} size={88} />
        <Text style={[styles.username, { color: colors.textPrimary }]}>{user.username}</Text>
        <Text style={[styles.email, { color: colors.textSecondary }]}>{user.emailOrMobile}</Text>
      </View>

      <View style={styles.statsRow}>
        <ProfileStatCardSection icon="create-outline" label="Posts" value={stats.totalPosts} color={colors.primary} />
        <ProfileStatCardSection icon="heart-outline" label="Likes" value={stats.totalLikes} color={colors.like} />
        <ProfileStatCardSection
          icon="bookmark-outline"
          label="Saved"
          value={stats.savedCount}
          color={colors.primaryLight}
        />
      </View>

      <ProfilePostToggleSection
        active={postFilter}
        textCount={textCount}
        photoCount={photoCount}
        onChange={onFilterChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    padding: 16,
    paddingBottom: 8,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    padding: 24,
    marginBottom: 16,
  },
  username: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
});
