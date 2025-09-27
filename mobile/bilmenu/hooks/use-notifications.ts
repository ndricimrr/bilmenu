import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Just request permissions, no push tokens needed
    requestNotificationPermissions();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    notification,
  };
}

async function requestNotificationPermissions() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

// Fun notification messages
const lunchMessages = {
  en: [
    "Lunch time! 🍽️ What's cooking today?",
    "Hungry? Check today's lunch menu! 🥘",
    "Lunch break! Time to see what's on the menu 🍴",
    "Feeling hungry? Today's lunch awaits! 🍕",
    "Lunch o'clock! What's for lunch today? 🍜",
    "Time to fuel up! Check the lunch menu 🍲",
    "Lunch alert! Something delicious is waiting 🍛",
    "Ready for lunch? See what's cooking! 🥗",
    "Lunch time! Don't miss today's special 🍖",
    "Hunger calling? Check today's lunch menu 🍔",
  ],
  tr: [
    "Öğle yemeği zamanı! 🍽️ Bugün ne var?",
    "Aç mısın? Bugünkü menüye bak! 🥘",
    "Öğle molası! Menüde ne var görelim 🍴",
    "Açlık mı? Bugünkü öğle yemeği bekliyor! 🍕",
    "Öğle saati! Bugün ne yiyoruz? 🍜",
    "Enerji zamanı! Öğle menüsüne bak 🍲",
    "Öğle uyarısı! Lezzetli bir şey bekliyor 🍛",
    "Öğle yemeğine hazır mısın? Ne pişiyor bakalım! 🥗",
    "Öğle zamanı! Bugünkü özel yemeği kaçırma 🍖",
    "Açlık çağırıyor? Bugünkü menüye bak 🍔",
  ],
};

const dinnerMessages = {
  en: [
    "Dinner time! 🌙 What's on tonight's menu?",
    "Evening hunger? Check dinner options! 🍽️",
    "Dinner o'clock! Time to see what's cooking 🌆",
    "Ready for dinner? Tonight's menu awaits! 🍖",
    "Dinner alert! Something tasty is ready 🌙",
    "Evening fuel! Check the dinner menu 🍲",
    "Dinner time! Don't miss tonight's special 🍜",
    "Hungry for dinner? See what's cooking! 🍕",
    "Dinner break! What's for dinner tonight? 🥘",
    "Evening meal time! Check today's dinner 🍛",
  ],
  tr: [
    "Akşam yemeği zamanı! 🌙 Bu akşam ne var?",
    "Akşam açlığı? Akşam yemeği seçeneklerine bak! 🍽️",
    "Akşam saati! Ne pişiyor görelim 🌆",
    "Akşam yemeğine hazır mısın? Bu akşamın menüsü bekliyor! 🍖",
    "Akşam uyarısı! Lezzetli bir şey hazır 🌙",
    "Akşam enerjisi! Akşam menüsüne bak 🍲",
    "Akşam yemeği zamanı! Bu akşamın özelini kaçırma 🍜",
    "Akşam yemeği için aç mısın? Ne pişiyor bakalım! 🍕",
    "Akşam molası! Bu akşam ne yiyoruz? 🥘",
    "Akşam yemeği zamanı! Bugünkü akşam yemeğine bak 🍛",
  ],
};

function getRandomMessage(messages: string[]): string {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  return messages[dayOfYear % messages.length];
}

export async function scheduleLunchNotification(language: "en" | "tr") {
  const title = language === "en" ? "Lunch Time! 🍽️" : "Öğle Yemeği Zamanı! 🍽️";
  const body = getRandomMessage(lunchMessages[language]);

  // Schedule lunch notification for 11:30 AM daily
  const notificationId = await Notifications.scheduleNotificationAsync({
    identifier: "lunch-notification",
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 11,
      minute: 30,
      repeats: true,
    },
  });

  return notificationId;
}

export async function scheduleDinnerNotification(language: "en" | "tr") {
  const title =
    language === "en" ? "Dinner Time! 🌙" : "Akşam Yemeği Zamanı! 🌙";
  const body = getRandomMessage(dinnerMessages[language]);

  // Schedule dinner notification for 5:30 PM daily
  const notificationId = await Notifications.scheduleNotificationAsync({
    identifier: "dinner-notification",
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour: 17,
      minute: 30,
      repeats: true,
    },
  });

  return notificationId;
}

export async function cancelLunchNotification() {
  await Notifications.cancelScheduledNotificationAsync("lunch-notification");
}

export async function cancelDinnerNotification() {
  await Notifications.cancelScheduledNotificationAsync("dinner-notification");
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Initialize notifications and restore scheduled notifications on app start
export async function initializeNotifications(language: "en" | "tr" = "en") {
  try {
    // Just request permissions for local notifications
    const hasPermissions = await requestNotificationPermissions();
    if (!hasPermissions) {
      return;
    }

    const AsyncStorage =
      require("@react-native-async-storage/async-storage").default;

    // Check if this is first run (no notification settings stored)
    const [lunchEnabledStr, dinnerEnabledStr] = await Promise.all([
      AsyncStorage.getItem("bilmenu-lunch-notifications"),
      AsyncStorage.getItem("bilmenu-dinner-notifications"),
    ]);

    const isFirstRun = lunchEnabledStr === null && dinnerEnabledStr === null;

    if (isFirstRun) {
      // First run: auto-schedule both notifications and save settings

      await Promise.all([
        scheduleLunchNotification(language as "en" | "tr"),
        scheduleDinnerNotification(language as "en" | "tr"),
        AsyncStorage.setItem(
          "bilmenu-lunch-notifications",
          JSON.stringify(true)
        ),
        AsyncStorage.setItem(
          "bilmenu-dinner-notifications",
          JSON.stringify(true)
        ),
      ]);
    } else {
      // Subsequent runs: restore based on saved settings
      const lunchEnabled = lunchEnabledStr
        ? JSON.parse(lunchEnabledStr)
        : false;
      const dinnerEnabled = dinnerEnabledStr
        ? JSON.parse(dinnerEnabledStr)
        : false;

      // Restore lunch notifications if enabled
      if (lunchEnabled === true) {
        await scheduleLunchNotification(language as "en" | "tr");
      }

      // Restore dinner notifications if enabled
      if (dinnerEnabled === true) {
        await scheduleDinnerNotification(language as "en" | "tr");
      }
    }
  } catch (error) {}
}
