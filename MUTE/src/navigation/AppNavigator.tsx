import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext'; 
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Menu: undefined;
  CartScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isDarkMode } = useTheme(); 

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#ffffff', 
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#000000', 
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: '¿Olvidó su contraseña?' }} />
      <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menú' }} />
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Compra' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;