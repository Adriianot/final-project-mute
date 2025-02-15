import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Alert } from "react-native";

// Configurar el manejador de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Función para solicitar permisos y obtener el Expo Push Token
export const registerForPushNotifications = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permiso denegado", "No podrás recibir notificaciones.");
      return;
    }

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      if (!projectId) throw new Error("No se encontró el Project ID");

      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log("Expo Push Token:", token);
      return token;
    } catch (error) {
      console.error("❌ Error obteniendo Expo Push Token:", error);
    }
  } else {
    Alert.alert("🚨 Debes usar un dispositivo físico para recibir notificaciones.");
  }
  return null;
};

// Función para enviar una notificación local
export const sendNotification = async (title: string, body: string, data: object = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: null, // Notificación inmediata
  });
};
