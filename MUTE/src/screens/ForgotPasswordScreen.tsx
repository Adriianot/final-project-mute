import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type ForgotPasswordScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://<TU_BACKEND>/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error al enviar el enlace');
      }

      Alert.alert('Éxito', 'Enlace de restablecimiento enviado, revisa tu correo');
      navigation.navigate('Login');
    } catch (error) {
        const errorMessage = (error as Error).message || 'Ocurrió un error';
        Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recuperar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleSendResetLink}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#fff' },
  content: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { width: '100%', height: 40, borderColor: '#ccc', borderWidth: 1, marginBottom: 16, paddingHorizontal: 8 },
  resetButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
  resetButtonText: { color: '#fff', fontSize: 16 },
});

export default ForgotPasswordScreen;
