import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeMode } from '@/types';
import { getThemeColors } from '@/utils/theme';
import { storageService } from '@/services/storageService';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ReturnType<typeof getThemeColors>;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    storageService.getTheme().then((saved) => {
      if (saved) setMode(saved);
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      storageService.saveTheme(next);
      return next;
    });
  }, []);

  const colors = useMemo(() => getThemeColors(mode), [mode]);

  const value = useMemo(
    () => ({ mode, colors, toggleTheme, isDark: mode === 'dark' }),
    [mode, colors, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: colors.primary }}
          edges={['top', 'left', 'right']}
        >
          <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
          <View style={{ flex: 1, backgroundColor: colors.background }}>{children}</View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
