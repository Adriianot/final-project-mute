import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { styles } from "../styles/loginStyles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../contexts/AuthContext";
import { useClerkAuth } from "../contexts/ClerkContext";
import SkeletonPlaceholder from "../components/SkeletonPlaceholder";

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const { signInWithGoogle } = useClerkAuth();

  const handleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate("Register");
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (isSubmitting) {
    return <SkeletonPlaceholder />;
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and tittle */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/mute-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>MUTE</Text>
        </View>

        {/* Form*/}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            <Text style={styles.forgotPasswordText}>
              ¿Forgot your password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccount}
            onPress={handleNavigateToRegister}
          >
            <Text style={styles.createAccountText}>Create new account</Text>
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Or log in with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
              >
                <Image
                  source={require("../../assets/google-icon.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
