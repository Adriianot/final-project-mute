import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import PhoneInput from "react-native-phone-input";
import { CreditCardInput } from "react-native-credit-card-input";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import * as Location from "expo-location";
import { getDynamicStyles } from "../styles/confirmStyles";

type ConfirmScreenRouteProp = RouteProp<RootStackParamList, "ConfirmScreen">;
type ConfirmScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ConfirmScreen"
>;

const ConfirmScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const navigation = useNavigation<ConfirmScreenNavigationProp>();
  const route = useRoute<ConfirmScreenRouteProp>();
  const { total } = route.params;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [mapKey, setMapKey] = useState(0);

  // Campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creditCard, setCreditCard] = useState<{ number?: string; expiry?: string; cvc?: string }>({});
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Activa la ubicación para continuar.");
      return;
    }
    let loc = await Location.getCurrentPositionAsync({});
    const newLocation = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    setLocation(newLocation);
    setRegion({
      ...newLocation,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    setMapKey((prevKey) => prevKey + 1);
    mapRef.current?.animateToRegion({
      ...newLocation,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });

    setRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    mapRef.current?.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  // Validaciones antes de confirmar la compra
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.length >= 10; // Verificar longitud mínima
  const isValidCreditCard = (card: any) => card?.number && card?.expiry && card?.cvc;

  const handleConfirm = () => {
    if (!name || !email || !phone || !creditCard.number || !location) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Correo electrónico inválido.");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Número de teléfono inválido.");
      return;
    }

    if (!isValidCreditCard(creditCard)) {
      Alert.alert("Error", "Tarjeta de crédito inválida.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessVisible(true);
    }, 2000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={dynamicStyles.container}
    >
      <ScrollView contentContainerStyle={dynamicStyles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={dynamicStyles.title}>Confirmación de Envío</Text>

        <TextInput style={dynamicStyles.input} placeholder="Nombre Completo" placeholderTextColor="#999" value={name} onChangeText={setName} />
        <TextInput style={dynamicStyles.input} placeholder="Correo Electrónico" placeholderTextColor="#999" keyboardType="email-address" value={email} onChangeText={setEmail} />

        <PhoneInput
          style={[dynamicStyles.input]}
          textStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          initialCountry="us"
          textProps={{ placeholder: "Número de Teléfono", placeholderTextColor: isDarkMode ? "#ccc" : "#555" }}
          onChangePhoneNumber={(number) => setPhone(number)}
        />

        <Text style={dynamicStyles.sectionTitle}>Ubicación:</Text>
        {location ? (
          <>
            <MapView key={mapKey} ref={mapRef} style={dynamicStyles.map} region={region || undefined} onPress={handleMapPress}>
              <Marker coordinate={location} title="Ubicación Seleccionada" />
            </MapView>
            <TouchableOpacity style={dynamicStyles.resetButton} onPress={getCurrentLocation}>
              <Text style={dynamicStyles.resetButtonText}>Usar mi ubicación actual</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={dynamicStyles.errorText}>Obteniendo ubicación...</Text>
        )}

        <Text style={dynamicStyles.sectionTitle}>Tarjeta de Crédito:</Text>
        <CreditCardInput
          inputStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          labelStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          placeholderColor={isDarkMode ? "#bbb" : "#666"}
          onChange={(form) => setCreditCard(form.values)}
        />

        <Text style={dynamicStyles.total}>Total: ${total.toFixed(2)}</Text>

        <TouchableOpacity style={[dynamicStyles.confirmButton, isProcessing && dynamicStyles.disabledButton]} onPress={handleConfirm} disabled={isProcessing}>
          <Text style={dynamicStyles.confirmButtonText}>{isProcessing ? "Procesando..." : "CONFIRMAR"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmScreen;
