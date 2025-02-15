import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext'; // Import the context of the theme
import { Product } from '../interfaces/types';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import MenuScreen from '../screens/MenuScreen';
import CartScreen from '../screens/CartScreen';
import ConfirmScreen from '../screens/ConfirmScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ChatAssistantScreen from '../screens/ChatAssistantScreen'; 
import PurchasesScreen from '../screens/PurchasesScreen'; 

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Menu: undefined;
  CartScreen: undefined;
  ConfirmScreen: { total: number; cartItems: any[] };
  ProductDetail: { product: Product };
  ChatAssistantScreen: undefined; 
  PurchasesScreen: undefined;

};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isDarkMode } = useTheme(); // Go to the context and get the theme

  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? '#121212' : '#ffffff', // Background color of the header
        },
        headerTintColor: isDarkMode ? '#ffffff' : '#000000', // Text color
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: '¿Forgot Password?' }} />
      <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Your cart' }} />
      <Stack.Screen name="ConfirmScreen" component={ConfirmScreen} options={{ title: 'Confirm Order'  }} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Details' }} />
      <Stack.Screen name="ChatAssistantScreen" component={ChatAssistantScreen} options={{ title: 'Virtual Assistant' }} />
      <Stack.Screen name="PurchasesScreen" component={PurchasesScreen} options={{ title: 'My Purchases' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;