export type DashboardTheme = "midnight" | "aurora";

const THEME_KEY = "twentyfour.dashboard-theme";
const PAUSE_KEY = "twentyfour.pause-mode";

export interface PausePreference {
  active: boolean;
  until: string | null;
  reason: string;
}

export function getDashboardTheme(): DashboardTheme {
  return localStorage.getItem(THEME_KEY) === "aurora" ? "aurora" : "midnight";
}

export function applyDashboardTheme(theme: DashboardTheme) {
  document.documentElement.dataset.dashboardTheme = theme;
  localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new CustomEvent("twentyfour:theme", { detail: theme }));
}

export function initializePreferences() {
  applyDashboardTheme(getDashboardTheme());
}

export function getPausePreference(): PausePreference {
  const fallback: PausePreference = { active: false, until: null, reason: "" };
  try {
    const saved = JSON.parse(localStorage.getItem(PAUSE_KEY) ?? "null") as PausePreference | null;
    if (!saved?.active || !saved.until) return fallback;
    if (new Date(saved.until).getTime() <= Date.now()) {
      localStorage.removeItem(PAUSE_KEY);
      return fallback;
    }
    return saved;
  } catch {
    return fallback;
  }
}

export function savePausePreference(preference: PausePreference) {
  localStorage.setItem(PAUSE_KEY, JSON.stringify(preference));
  window.dispatchEvent(new CustomEvent("twentyfour:pause", { detail: preference }));
}
