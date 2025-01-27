import React from "react";
import * as Google from "expo-auth-session/providers/google";
import { Button, Alert } from "react-native";
import { makeRedirectUri } from "expo-auth-session";

export const GoogleLogin = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "344595398435-8akq4s86728rcmdfofd3s4fuqaddtjot.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      scheme: "mute",
      }),
    scopes: ["openid", "profile", "email"], // Scopes básicos
  });


  const handleGoogleLogin = async (token: string) => {
    try {
      const res = await fetch("http://192.168.100.128:8000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Inicio de sesión exitoso", "Bienvenido " + data.name);
        // Guardar el JWT para futuras solicitudes
      } else {
        Alert.alert("Error", data.detail || "No se pudo completar el inicio de sesión.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema con la autenticación.");
    }
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      } else {
        Alert.alert("Error", "No se pudo obtener el token de Google.");
      }
    }
  }, [response]);

  return (
    <Button
      title="Iniciar sesión con Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
};
