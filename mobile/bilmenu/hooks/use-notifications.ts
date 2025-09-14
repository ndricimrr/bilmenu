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
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token || "")
    );

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
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

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
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

export async function scheduleLunchNotification(language: "en" | "tr") {
  const title = language === "en" ? "Lunch Time! 🍽️" : "Öğle Yemeği Zamanı! 🍽️";
  const body =
    language === "en"
      ? "Check out today's lunch menu at Bilkent University cafeteria!"
      : "Bilkent Üniversitesi kafeteryasında bugünkü öğle yemeği menüsüne göz atın!";

  // Cancel existing lunch notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule lunch notification for 11:30 AM daily
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      hour: 11,
      minute: 30,
      repeats: true,
    },
  });
}

export async function scheduleDinnerNotification(language: "en" | "tr") {
  const title =
    language === "en" ? "Dinner Time! 🌙" : "Akşam Yemeği Zamanı! 🌙";
  const body =
    language === "en"
      ? "Check out today's dinner menu at Bilkent University cafeteria!"
      : "Bilkent Üniversitesi kafeteryasında bugünkü akşam yemeği menüsüne göz atın!";

  // Schedule dinner notification for 5:30 PM daily
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: {
      hour: 17,
      minute: 30,
      repeats: true,
    },
  });
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
