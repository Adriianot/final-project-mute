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
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios';
import { useTheme } from '../contexts/ThemeContext'; // Contex of the theme

const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser(); // Hook of Clerk

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  // Function for obtain user data from backend
  const fetchUserFromDatabase = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Bring token from storage
      if (!token) throw new Error('Token not found in storage'); // If token not found

      const response = await axios.get('http://192.168.0.109:8000/auth/user', {
        headers: { Authorization: `Bearer ${token}` }, // Send token in headers
      });

      setUser(response.data); // Update user state
    } catch (error) {
      console.error('Error getting user data from database:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function for obtain user data from Clerk
  const fetchUserFromClerk = () => {
    if (isLoaded && isSignedIn && clerkUser) {
      setUser({
        nombre: clerkUser.firstName || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || 'No email',
      });
      setLoading(false);
    }
  };

  // Clerk or BD?
  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoaded && isSignedIn) {
        // Auth with Clerk
        fetchUserFromClerk();
      } else {
        // Clerk search in the BD
        await fetchUserFromDatabase();
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn]);

  // Logout function
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
              await AsyncStorage.removeItem('token'); // Clean Storage Token
              navigation.navigate('Login'); // Go to Login
            } catch (error) {
              console.error('Error logging out:', error);
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
          source={require('../../assets/profile-placeholder.png')}
          style={dynamicStyles.profileImage}
        />
        <Text style={dynamicStyles.profileName}>{user?.nombre || 'User'}</Text>
        <Text style={dynamicStyles.profileSubtitle}>{user?.email || ''}</Text>
      </View>
      <View style={dynamicStyles.menuItems}>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => handleNavigation('Home')}>
          <Icon name="home" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => console.log('Mis Compras')}>
          <Icon name="favorite" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>My Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => console.log('Catálogo')}>
          <Icon name="view-list" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Catalog</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate('CartScreen')}
        >
          <Icon name="shopping-cart" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Shopping cart</Text>
        </TouchableOpacity>
        <View style={dynamicStyles.menuItem}>
          <Icon name="brightness-6" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={() => console.log('Ayuda')}>
          <Icon name="help-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={handleLogout}>
          <Icon name="logout" size={24} color={isDarkMode ? '#fff' : '#000'} />
          <Text style={dynamicStyles.menuText}>Log out</Text>
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