"use client";

import { useEffect } from "react";
import { useNavStore } from "@/lib/store";

export function StoreHydrator() {
  useEffect(() => {
    void useNavStore.persist.rehydrate();
  }, []);

  const theme = useNavStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}
