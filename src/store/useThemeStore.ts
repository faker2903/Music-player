import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
    isDarkMode: boolean;
    toggleTheme: () => void;
    setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            isDarkMode: true, // Default to dark mode as per user preference
            toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
            setDarkMode: (isDark) => set({ isDarkMode: isDark }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
