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
    scopes: ["openid", "profile", "email"], // Info to get from Google
  });


  const handleGoogleLogin = async (token: string) => {
    try {
      const res = await fetch("https://192.168.189.87:8000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("Login successful", "Welcome " + data.name);
        // Save the JWT for future requests
      } else {
        Alert.alert("Error", data.detail || "The login could not be completed.");
      }
    } catch (error) {
      Alert.alert("Error", "There was a problem with authentication.");
    }
  };

  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.accessToken) {
        handleGoogleLogin(authentication.accessToken);
      } else {
        Alert.alert("Error", "Failed to get Google token.");
      }
    }
  }, [response]);

  return (
    <Button
      title="Sign in with Google"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
};
