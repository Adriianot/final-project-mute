import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { styles } from "../styles/registerStyles";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';



const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!nombre.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'The password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://52.70.33.203:8000/auth/register', {
        nombre,
        email,
        password,
      });
  
      Alert.alert('Successful Registration', 'Your account has been successfully created.', [
        {
          text: 'OK',
          onPress: () => {
            // Clear the fields
            setNombre('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
  
            // Navigate to the login screen
            navigation.navigate('Login');
          },
        },
      ]);
  
      console.log('Token received:', response.data.token);
    } catch (error: any) {
      console.error('Registration error:', error.response?.data?.detail || error.message);
      Alert.alert('Error', error.response?.data?.detail || 'There was a problem with the registration.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

<KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
      <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/mute-logo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>
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
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

        <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};



export default RegisterScreen;
