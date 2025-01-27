import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options ={{title: '¿Olvidó su contraseña?'}} />
      <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menú' }} /> 
      <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Su compra' }} /> 
    </Stack.Navigator>
  );
};

export default AppNavigator;
