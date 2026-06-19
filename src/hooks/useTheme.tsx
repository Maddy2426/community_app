import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
