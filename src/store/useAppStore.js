import { create } from 'zustand';

const useAppStore = create((set) => ({
  // App State
  currentView: 'home', // 'home', 'assistant', 'generating', 'report'
  setView: (view) => set({ currentView: view }),

  // Language
  language: 'darija', // 'en', 'darija', 'tamazight'
  setLanguage: (lang) => set({ language: lang }),

  // User Inputs
  animalType: '',
  herdSize: '',
  setAnimalType: (type) => set({ animalType: type }),
  setHerdSize: (size) => set({ herdSize: size }),

  // Report Data
  currentReport: null,
  setCurrentReport: (report) => set({ currentReport: report }),
}));

export default useAppStore;
