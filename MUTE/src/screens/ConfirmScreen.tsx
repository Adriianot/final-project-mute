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
  const { total, cartItems } = route.params;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [mapKey, setMapKey] = useState(0);

  // Campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creditCard, setCreditCard] = useState<{
    number?: string;
    expiry?: string;
    cvc?: string;
  }>({});
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [address, setAddress] = useState<string>("");

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
    mapRef.current?.animateToRegion(
      {
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );
    const formattedAddress = await getAddressFromCoordinates(
      newLocation.latitude,
      newLocation.longitude
    );
    setAddress(formattedAddress);
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const apiKey = "AIzaSyDntnxd8PrzjTg1-ywyH8nN6SaOwSupP5I"; // Reemplázala con tu API Key
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        return data.results[0].formatted_address;
      } else {
        return "Dirección no encontrada";
      }
    } catch (error) {
      console.error(error);
      return "Error al obtener la dirección";
    }
  };

  const handleMapPress = async  (event: MapPressEvent) => {
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

    mapRef.current?.animateToRegion(
      {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000
    );

    const formattedAddress = await getAddressFromCoordinates(
      coordinate.latitude,
      coordinate.longitude
    );
    setAddress(formattedAddress);
  };

  // Validaciones antes de confirmar la compra
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.length >= 10; // Verificar longitud mínima
  const isValidCreditCard = (card: any) =>
    card?.number && card?.expiry && card?.cvc;

  const handleConfirm = async () => {
    if (!name || !email || !phone || !creditCard.number || !location || !address) {
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

    const compraData = {
      cliente_email: email,
      total: total,
      productos: route.params.cartItems, // Asegúrate de pasar los productos desde el carrito
      telefono: phone,
      direccion: address, // ✅ Usamos la dirección real obtenida de Google Maps
      ubicacion: location,
      metodo_pago: "Tarjeta de Crédito",
    };

    try {
      const response = await fetch("http://192.168.100.128:8000/auth/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsProcessing(false);
        setIsSuccessVisible(true);
      } else {
        setIsProcessing(false);
        Alert.alert("Error", result.detail || "No se pudo registrar la compra");
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Error", "Ocurrió un problema al registrar la compra");
    }
  };
  const handleReturnHome = () => {
    setIsSuccessVisible(false);
    navigation.navigate("Home"); // ✅ Redirige al usuario a Home después de confirmar
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={dynamicStyles.container}
    >
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={dynamicStyles.title}>Confirmación de Envío</Text>

        <TextInput
          style={dynamicStyles.input}
          placeholder="Nombre Completo"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <PhoneInput
          style={[dynamicStyles.input]}
          textStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          initialCountry="us"
          textProps={{
            placeholder: "Número de Teléfono",
            placeholderTextColor: isDarkMode ? "#ccc" : "#555",
          }}
          onChangePhoneNumber={(number) => setPhone(number)}
        />

        <Text style={dynamicStyles.sectionTitle}>Ubicación:</Text>
        {location ? (
          <>
            <MapView
              key={mapKey}
              ref={mapRef}
              style={dynamicStyles.map}
              region={region || undefined}
              onPress={handleMapPress}
            >
              <Marker coordinate={location} title="Ubicación Seleccionada" />
            </MapView>
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

        <TouchableOpacity
          style={[
            dynamicStyles.confirmButton,
            isProcessing && dynamicStyles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={isProcessing}
        >
          <Text style={dynamicStyles.confirmButtonText}>
            {isProcessing ? "Procesando..." : "CONFIRMAR"}
          </Text>
        </TouchableOpacity>
        {/* Modal de Procesamiento */}
        <Modal visible={isProcessing} transparent animationType="fade">
          <View style={dynamicStyles.modalContainer}>
          <Image
              source={require("../../assets/mute2-logo.png")}
              style={dynamicStyles.modalLogo}
            />
            <ActivityIndicator size="large" color="#0070BA" />
            <Text style={dynamicStyles.loadingText}>Procesando...</Text>
          </View>
        </Modal>

        {/* Modal de Pago Exitoso */}
        <Modal visible={isSuccessVisible} animationType="slide">
          <View style={dynamicStyles.fullScreenModal}>
            <Text style={dynamicStyles.paidText}>PAGADO CON ÉXITO</Text>
            <Image
              source={require("../../assets/paypal-logo.png")}
              style={dynamicStyles.modalLogo}
              resizeMode="contain"
            />
            <Text style={dynamicStyles.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity
              onPress={handleReturnHome}
              style={dynamicStyles.confirmButton}
            >
              <Text style={dynamicStyles.confirmButtonText}>
                Volver a Inicio
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmScreen;
