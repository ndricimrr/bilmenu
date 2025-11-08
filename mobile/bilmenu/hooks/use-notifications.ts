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
  try {
    if (Platform.OS === "android") {
      // Create notification channel BEFORE requesting permissions (required for Android 8+)
      console.log("[Notifications] Creating Android notification channel...");
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
        sound: "default",
        enableVibrate: true,
        showBadge: true,
      });
      console.log("[Notifications] Android notification channel created");
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      console.log(
        `[Notifications] Current permission status: ${existingStatus}`
      );

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        console.log("[Notifications] Requesting notification permissions...");
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
        console.log(`[Notifications] Permission request result: ${status}`);
      }

      if (finalStatus !== "granted") {
        console.warn(`[Notifications] Permission not granted: ${finalStatus}`);
        return false;
      }

      console.log("[Notifications] Permissions granted successfully");
      return true;
    } else {
      console.warn("[Notifications] Not running on a physical device");
      return false;
    }
  } catch (error) {
    console.error("[Notifications] Error requesting permissions:", error);
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

  // TEMPORARY: Check for custom test time from Settings
  // TODO: Remove this test time feature after testing
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  let hour = 11;
  let minute = 30;
  let repeats = true;

  try {
    const testTime = await AsyncStorage.getItem("bilmenu-lunch-test-time");
    if (testTime) {
      // Parse time from "HH:MM" format
      const [testHour, testMinute] = testTime.split(":").map(Number);
      if (!isNaN(testHour) && !isNaN(testMinute)) {
        hour = testHour;
        minute = testMinute;
        repeats = false; // Don't repeat test notifications
      }
    }
  } catch (error) {
    // Fall back to default if error
  }

  // Schedule lunch notification
  try {
    console.log(
      `[Notifications] Scheduling lunch notification for ${hour}:${minute
        .toString()
        .padStart(2, "0")}, repeats: ${repeats}`
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: "lunch-notification",
      content: {
        title,
        body,
        sound: "default",
        ...(Platform.OS === "android" && { channelId: "default" }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats,
      },
    });

    console.log(
      `[Notifications] Lunch notification scheduled with ID: ${notificationId}`
    );
    return notificationId;
  } catch (error) {
    console.error(
      "[Notifications] Error scheduling lunch notification:",
      error
    );
    throw error;
  }
}

export async function scheduleDinnerNotification(language: "en" | "tr") {
  const title =
    language === "en" ? "Dinner Time! 🌙" : "Akşam Yemeği Zamanı! 🌙";
  const body = getRandomMessage(dinnerMessages[language]);

  // TEMPORARY: Check for custom test time from Settings
  // TODO: Remove this test time feature after testing
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  let hour = 17;
  let minute = 0;
  let repeats = true;

  try {
    const testTime = await AsyncStorage.getItem("bilmenu-dinner-test-time");
    if (testTime) {
      // Parse time from "HH:MM" format
      const [testHour, testMinute] = testTime.split(":").map(Number);
      if (!isNaN(testHour) && !isNaN(testMinute)) {
        hour = testHour;
        minute = testMinute;
        repeats = false; // Don't repeat test notifications
      }
    }
  } catch (error) {
    // Fall back to default if error
  }

  // Schedule dinner notification
  try {
    console.log(
      `[Notifications] Scheduling dinner notification for ${hour}:${minute
        .toString()
        .padStart(2, "0")}, repeats: ${repeats}`
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      identifier: "dinner-notification",
      content: {
        title,
        body,
        sound: "default",
        ...(Platform.OS === "android" && { channelId: "default" }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute,
        repeats,
      },
    });

    console.log(
      `[Notifications] Dinner notification scheduled with ID: ${notificationId}`
    );
    return notificationId;
  } catch (error) {
    console.error(
      "[Notifications] Error scheduling dinner notification:",
      error
    );
    throw error;
  }
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
    console.log("[Notifications] Initializing notifications...");

    // Just request permissions for local notifications
    const hasPermissions = await requestNotificationPermissions();
    if (!hasPermissions) {
      console.warn(
        "[Notifications] Permissions not granted, skipping initialization"
      );
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
    console.log(`[Notifications] First run: ${isFirstRun}`);

    if (isFirstRun) {
      // First run: auto-schedule both notifications and save settings
      console.log("[Notifications] First run - scheduling both notifications");

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

      console.log(
        "[Notifications] First run notifications scheduled successfully"
      );
    } else {
      // Subsequent runs: restore based on saved settings
      const lunchEnabled = lunchEnabledStr
        ? JSON.parse(lunchEnabledStr)
        : false;
      const dinnerEnabled = dinnerEnabledStr
        ? JSON.parse(dinnerEnabledStr)
        : false;

      console.log(
        `[Notifications] Restoring - Lunch: ${lunchEnabled}, Dinner: ${dinnerEnabled}`
      );

      // Restore lunch notifications if enabled
      if (lunchEnabled === true) {
        await scheduleLunchNotification(language as "en" | "tr");
      }

      // Restore dinner notifications if enabled
      if (dinnerEnabled === true) {
        await scheduleDinnerNotification(language as "en" | "tr");
      }
    }

    // Verify scheduled notifications
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(
      `[Notifications] Total scheduled notifications: ${scheduled.length}`
    );
    scheduled.forEach((notif) => {
      const trigger = notif.trigger as any;
      console.log(
        `[Notifications] - ${notif.identifier}: ${JSON.stringify(trigger)}`
      );
    });
  } catch (error) {
    console.error("[Notifications] Error initializing notifications:", error);
  }
}
