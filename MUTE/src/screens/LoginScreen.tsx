import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../contexts/AuthContext";
import { useClerkAuth } from "../contexts/ClerkContext";
import { GoogleLogin } from "../components/GoogleLogin";

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const { signInWithGoogle } = useClerkAuth();

  const handleSignIn =  async() => {
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

  const handleSocialLogin = (provider: 'facebook' | 'google') => {
    
    console.log('Social login with:', provider);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      Alert.alert("Success", "Google login successful");
      navigation.navigate('Home')
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and tittle */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/mute-logo.png')} 
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

          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn} disabled={isSubmitting}>
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
            <Text style={styles.forgotPasswordText}>¿Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createAccount}
            onPress={handleNavigateToRegister}
          >
            <Text style={styles.createAccountText}>Create new account</Text>
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialText}>Or log in with</Text>
            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin('facebook')}
              >
                <Image
                  source={require('../../assets/facebook-icon.png')} 
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleSignIn}
              >
                <Image
                  source={require('../../assets/google-icon.png')} 
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 0.5,
  },
  loginButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
  },
  createAccount: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  createAccountText: {
    color: '#fff',
    fontSize: 16,
  },
  socialContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialText: {
    color: '#666',
    marginBottom: 15,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    padding: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
  },
});

export default LoginScreen;
