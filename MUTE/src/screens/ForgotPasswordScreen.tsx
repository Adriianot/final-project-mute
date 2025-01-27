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
import { useNavigation } from '@react-navigation/native';

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    setLoading(true);
    try {
      Alert.alert('Éxito', 'Enlace de restablecimiento enviado, revisa tu correo');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al buscar la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    try {
      //navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'No se pudo navegar a la pantalla de inicio de sesión.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContentWrapper}>
        <Image
          source={require('../../assets/mute-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContentWrapper}>
        <Text style={styles.title}>Recuperar tu cuenta</Text>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.label}>Introduce tu correo electrónico para buscar tu cuenta:</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleNavigateToLogin}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resetButton, loading && styles.disabledButton]}
          onPress={handleSendResetLink}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>{loading ? 'Buscando...' : 'Buscar'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  logoContentWrapper: {
    alignItems: 'center',
    marginBottom: 140,
  },
  logo: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: 80,
    height: 80,
  },
  textContentWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 30,
    marginBottom: 40,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#7d7d7d',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
