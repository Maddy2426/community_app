import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { useTheme } from '@/hooks/useTheme';
import HomeHeaderSection from '@/sections/home/HomeHeaderSection';
import HomeLoadingSection from '@/sections/home/HomeLoadingSection';
import HomeFeedSection from '@/sections/home/HomeFeedSection';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { posts, isLoading } = useAppSelector((state) => state.posts);


  if (isLoading && posts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <HomeHeaderSection />
        <HomeLoadingSection />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <HomeHeaderSection />
      <HomeFeedSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
