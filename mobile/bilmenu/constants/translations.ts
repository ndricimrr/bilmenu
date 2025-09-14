export const translations = {
  en: {
    // Tab names
    bilmenu: "BilMenu",
    notifications: "Notifications",
    settings: "Settings",

    // Header
    "header.subtitle": "Bilkent University Cafeteria",

    // Notifications
    lunchReminder: "Lunch Time! 🍽️",
    dinnerReminder: "Dinner Time! 🌙",
    lunchMessage:
      "Check out today's lunch menu at Bilkent University cafeteria!",
    dinnerMessage:
      "Check out today's dinner menu at Bilkent University cafeteria!",

    // Settings
    notificationsEnabled: "Enable Notifications",
    lunchNotifications: "Lunch Reminders",
    dinnerNotifications: "Dinner Reminders",
    language: "Language",
    english: "English",
    turkish: "Türkçe",

    // Common
    save: "Save",
    cancel: "Cancel",
    enabled: "Enabled",
    disabled: "Disabled",
  },
  tr: {
    // Tab names
    bilmenu: "BilMenu",
    notifications: "Bildirimler",
    settings: "Ayarlar",

    // Header
    "header.subtitle": "Bilkent Üniversitesi Kafeteryası",

    // Notifications
    lunchReminder: "Öğle Yemeği Zamanı! 🍽️",
    dinnerReminder: "Akşam Yemeği Zamanı! 🌙",
    lunchMessage:
      "Bilkent Üniversitesi kafeteryasında bugünkü öğle yemeği menüsüne göz atın!",
    dinnerMessage:
      "Bilkent Üniversitesi kafeteryasında bugünkü akşam yemeği menüsüne göz atın!",

    // Settings
    notificationsEnabled: "Bildirimleri Etkinleştir",
    lunchNotifications: "Öğle Yemeği Hatırlatıcıları",
    dinnerNotifications: "Akşam Yemeği Hatırlatıcıları",
    language: "Dil",
    english: "English",
    turkish: "Türkçe",

    // Common
    save: "Kaydet",
    cancel: "İptal",
    enabled: "Etkin",
    disabled: "Devre Dışı",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;
