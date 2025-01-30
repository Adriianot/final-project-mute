import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext'; 

const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  // Función para obtener datos del usuario
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Recupera el token
      if (!token) throw new Error('Token no encontrado');

      const response = await axios.get('http:// 192.168.100.128:8000/auth/user', {
        headers: { Authorization: `Bearer ${token}` }, // Envía el token como encabezado
      });

      setUser(response.data); // Actualiza el estado con los datos del usuario
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    } finally {
      setLoading(false); // Finaliza el indicador de carga
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              // Navega al Home
              navigation.navigate('Login');
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const dynamicStyles = getDynamicStyles(isDarkMode);

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.profileSection}>
        <Image
          source={require('../../assets/profile-placeholder.png')} // Imagen por defecto
          style={dynamicStyles.profileImage}
        />
        <Text style={dynamicStyles.profileName}>{user?.nombre || 'Usuario'}</Text>
        <Text style={dynamicStyles.profileSubtitle}>Ver Perfil</Text>
      </View>
      <View style={dynamicStyles.menuItems}>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => handleNavigation('Home')}>
          <Icon name="home" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => console.log('Mis Compras')}>
          <Icon name="favorite" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Mis Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => console.log('Catálogo')}>
          <Icon name="view-list" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Catálogo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => navigation.navigate('CartScreen')}>
          <Icon name="shopping-cart" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Carrito de compras</Text>
        </TouchableOpacity>
        <View style={dynamicStyles.menuItem}>
          <Icon name="brightness-6" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Modo Oscuro</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => console.log('Ayuda')}>
          <Icon name="help-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={handleLogout}>
          <Icon name="logout" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
    },
    profileSection: { alignItems: 'center', marginVertical: 24 },
    profileImage: { width: 80, height: 80, borderRadius: 40 },
    profileName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 8,
      color: isDarkMode ? '#fff' : '#000',
    },
    profileSubtitle: { fontSize: 14, color: isDarkMode ? '#bbb' : '#555' },
    menuItems: { flex: 1, paddingHorizontal: 16 },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#eee',
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 16,
      color: isDarkMode ? '#fff' : '#000',
    },
  });

export default MenuScreen;