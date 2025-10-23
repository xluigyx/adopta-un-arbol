// src/hooks/useSettings.ts
import { useEffect, useState } from "react";
import { AppSettings, getSettings, saveSettings, SETTINGS_KEY } from "../utils/settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => getSettings());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) setSettings(getSettings());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateSettings = (next: AppSettings) => {
    saveSettings(next);
    setSettings(next);
  };

  return { settings, setSettings: updateSettings };
}
