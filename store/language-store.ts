import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { LanguageId } from '@/types/learning';

type LanguageState = {
  hasHydrated: boolean;
  selectedLanguageId: LanguageId | null;
  setHasHydrated: (hasHydrated: boolean) => void;
  setSelectedLanguage: (languageId: LanguageId) => void;
  clearSelectedLanguage: () => Promise<void>;
};

export const languageStorageKey = 'lingua-language-storage';

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      selectedLanguageId: null,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setSelectedLanguage: (languageId) => set({ selectedLanguageId: languageId }),
      clearSelectedLanguage: async () => {
        await AsyncStorage.removeItem(languageStorageKey);
        set({ selectedLanguageId: null });
      },
    }),
    {
      name: languageStorageKey,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        selectedLanguageId: state.selectedLanguageId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
