// localStorage can be unavailable (private mode, blocked site data); every access is guarded.
export function read(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

export function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const KEYS = {
  brand: "qaf_brand_demo_v2",
  savedIdeas: "qaf_ideas_v2",
  projects: "qaf_projects_v2",
  calendarPending: "qaf_calendar_pending_v1",
  calendarEvents: "qaf_calendar_events_v1",
  // Demo accounts live in this browser only; there is no server and passwords are never stored.
  account: "qaf_account_v1",
  session: "qaf_session_v1",
};

export const DEFAULT_BRAND = {
  name: "LUMA | لوما",
  description: "علامة عطور · هوية راقية بألوان هادئة",
  personality: "راقية، هادئة، معاصرة",
  style: "بسيط وأنيق، بألوان محايدة",
};
