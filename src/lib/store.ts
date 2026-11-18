"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type NavUIState = {
  theme: Theme;
  query: string;
  engine: string;
  activeCategory: string | null;
  activeSub: string | null;
  expanded: Record<string, boolean>;
  favorites: string[];
  recent: string[];
  asideCollapsed: boolean;
  compact: boolean;
  selectedSiteId: string | null;

  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setQuery: (query: string) => void;
  setEngine: (engine: string) => void;
  selectCategory: (categoryId: string | null, sub?: string | null) => void;
  toggleExpanded: (id: string) => void;
  toggleFavorite: (siteId: string) => void;
  addRecent: (siteId: string) => void;
  toggleAside: () => void;
  setCompact: (compact: boolean) => void;
  setSelectedSite: (siteId: string | null) => void;
  clearFilters: () => void;
};

export const useNavStore = create<NavUIState>()(
  persist(
    (set, get) => ({
      theme: "light",
      query: "",
      engine: "站内",
      activeCategory: null,
      activeSub: null,
      expanded: {},
      favorites: [],
      recent: [],
      asideCollapsed: false,
      compact: false,
      selectedSiteId: null,

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setQuery: (query) => set({ query }),
      setEngine: (engine) => set({ engine }),
      selectCategory: (categoryId, sub = null) =>
        set({ activeCategory: categoryId, activeSub: sub }),
      toggleExpanded: (id) =>
        set((state) => ({
          expanded: { ...state.expanded, [id]: !state.expanded[id] },
        })),
      toggleFavorite: (siteId) =>
        set((state) => ({
          favorites: state.favorites.includes(siteId)
            ? state.favorites.filter((id) => id !== siteId)
            : [siteId, ...state.favorites],
        })),
      addRecent: (siteId) =>
        set((state) => ({
          recent: [siteId, ...state.recent.filter((id) => id !== siteId)].slice(0, 12),
        })),
      toggleAside: () => set({ asideCollapsed: !get().asideCollapsed }),
      setCompact: (compact) => set({ compact }),
      setSelectedSite: (siteId) => set({ selectedSiteId: siteId }),
      clearFilters: () => set({ query: "", activeCategory: null, activeSub: null }),
    }),
    {
      name: "nav-ui",
      skipHydration: true,
      partialize: (state) => ({
        theme: state.theme,
        favorites: state.favorites,
        recent: state.recent,
        asideCollapsed: state.asideCollapsed,
        compact: state.compact,
      }),
    }
  )
);
