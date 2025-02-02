import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';

const RegisterScreen: React.FC = () => {
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
      Alert.alert('Error', 'El nombre completo es obligatorio.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor, ingresa un email válido.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.189.87:8000/auth/register', {
        nombre,
        email,
        password,
      });

      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada con éxito.');
      console.log('Token recibido:', response.data.token);
    } catch (error: any) {
      console.error('Error al registrar:', error.response?.data?.detail || error.message);
      Alert.alert('Error', error.response?.data?.detail || 'Hubo un problema con el registro.');
    }
  };

  const handleSocialLogin = (provider: 'facebook' | 'google') => {
    console.log('Social login with:', provider);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/mute-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <View style={styles.tableContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
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
              placeholder="Contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Confirmar Contraseña"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleRegister}>
          <Text style={styles.createButtonText}>Crear</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>O inicia sesión con</Text>
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
              onPress={() => handleSocialLogin('google')}
            >
              <Image
                source={require('../../assets/google-icon.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
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
    padding: 20,
  },
  logo: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 80,
    height: 80,
  
  
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialContainer: {
    marginTop: 20,
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

export default RegisterScreen;
