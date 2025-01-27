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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para manejar el token
import axios from 'axios';

const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  // Función para obtener datos del usuario
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Recupera el token
      if (!token) throw new Error('Token no encontrado');
  
      const response = await axios.get('http://192.168.100.128:8000/auth/user', {
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={require('../../assets/profile-placeholder.png')} // Imagen por defecto
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.nombre || 'Usuario'}</Text>
        <Text style={styles.profileSubtitle}>Ver Perfil</Text>
      </View>
      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigation('Home')}>
          <Icon name="home" size={24} color="#000" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Mis Compras')}>
          <Icon name="favorite" size={24} color="#000" />
          <Text style={styles.menuText}>Mis Compras</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Catálogo')}>
          <Icon name="view-list" size={24} color="#000" />
          <Text style={styles.menuText}>Catálogo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('CartScreen')}>
  <Icon name="shopping-cart" size={24} color="#000" />
  <Text style={styles.menuText}>Carrito de compras</Text>
</TouchableOpacity>
        <View style={styles.menuItem}>
          <Icon name="brightness-6" size={24} color="#000" />
          <Text style={styles.menuText}>Modo Oscuro</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Ayuda')}>
          <Icon name="help-outline" size={24} color="#000" />
          <Text style={styles.menuText}>Ayuda</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => console.log('Cerrar Sesión')}>
          <Icon name="logout" size={24} color="#000" />
          <Text style={styles.menuText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileSection: { alignItems: 'center', marginVertical: 24 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  profileName: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  profileSubtitle: { fontSize: 14, color: '#555' },
  menuItems: { flex: 1, paddingHorizontal: 16 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: { flex: 1, fontSize: 16, marginLeft: 16, color: '#000' },
});

export default MenuScreen;
