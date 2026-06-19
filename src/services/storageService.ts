import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

export const storageService = {
  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return data ? (JSON.parse(data) as User) : null;
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  },

  async savePosts(posts: Post[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },

  async getPosts(): Promise<Post[] | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.POSTS);
    return data ? (JSON.parse(data) as Post[]) : null;
  },

  async saveSavedPostIds(ids: string[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_POSTS, JSON.stringify(ids));
  },

  async getSavedPostIds(): Promise<string[] | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_POSTS);
    return data ? (JSON.parse(data) as string[]) : null;
  },

  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getTheme(): Promise<'light' | 'dark' | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.THEME) as Promise<'light' | 'dark' | null>;
  },

  async getFeedVersion(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.FEED_VERSION);
  },

  async setFeedVersion(version: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FEED_VERSION, version);
  },
};
