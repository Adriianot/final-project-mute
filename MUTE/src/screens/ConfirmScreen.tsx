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
import { useCart } from "../contexts/CartContext";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import PhoneInput from "react-native-phone-input";
import { CreditCardInput } from "react-native-credit-card-input";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDynamicStyles } from "../styles/confirmStyles";
import {
  registerForPushNotifications,
  sendNotification,
} from "../utils/notifications";

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
  const { clearCart } = useCart();
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const [mapKey, setMapKey] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form fields
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
    async function setupNotifications() {
      const token = await registerForPushNotifications();
    }

    getCurrentLocation();
    setupNotifications();

    setTimeout(() => {
      sendNotification("🔔 Take advantage of discounts in our store", "MUTE");
    }, 6000);
  }, []);

  useEffect(() => {
    async function handleSuccessNotification() {
      if (isSuccessVisible) {
        await sendNotification(
          "Confirmed purchase ✅",
          `Your purchase of $${total.toFixed(2)} has been confirmed.`,
          { total, productos: cartItems }
        );
      }
    }
    handleSuccessNotification();
  }, [isSuccessVisible]);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        let email = null;

        if (isLoaded && isSignedIn && clerkUser) {
          email = clerkUser.emailAddresses[0]?.emailAddress || null;
        }

        if (!email) {
          const storedEmail = await AsyncStorage.getItem("user_email");
          if (storedEmail) {
            email = storedEmail;
          }
        }

        if (!email) {
        } else {
          setUserEmail(email);
        }
      } catch (error) {
      }
    };

    fetchUserEmail();
  }, [isLoaded, isSignedIn]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Please activate location to continue.");
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

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ) => {
    try {
      const apiKey = "AIzaSyDntnxd8PrzjTg1-ywyH8nN6SaOwSupP5I";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.status === "OK") {
        return data.results[0].formatted_address;
      } else {
        return "Address not found";
      }
    } catch (error) {
      console.error(error);
      return "Error getting address";
    }
  };

  const handleMapPress = async (event: MapPressEvent) => {
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

  // Validations before confirming the purchase
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => phone.length >= 10;
  const isValidCreditCard = (card: any) =>
    card?.number && card?.expiry && card?.cvc;

  const handleConfirm = async () => {
    if (!userEmail) {
      Alert.alert("Error", "Failed to get user email.");
      return;
    }
    
    if (
      !name ||
      !phone ||
      !creditCard.number ||
      !location ||
      !address
    ) {
      Alert.alert("Error", "Please complete all fields.");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Error", "Invalid phone number.");
      return;
    }

    if (!isValidCreditCard(creditCard)) {
      Alert.alert("Error", "Invalid credit card.");
      return;
    }

    setIsProcessing(true);

    const compraData = {
      cliente_email: userEmail,
      total: total,
      productos: route.params.cartItems,
      telefono: phone,
      direccion: address,
      ubicacion: location,
      metodo_pago: "Credit card",
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

        clearCart();

        //Send notification after purchase confirmation
        await sendNotification(
          "🛒 Registered Purchase",
          `Your purchase of  $${total.toFixed(2)} has been successfully registered.`,
          { total, productos: cartItems }
        );
      } else {
        setIsProcessing(false);
        Alert.alert(
          "Error",
          result.detail || "The purchase could not be registered"
        );
      }
    } catch (error) {
      setIsProcessing(false);
      Alert.alert("Error", "A problem occurred while registering the purchase");
    }
  };

  const handleReturnHome = () => {
    setIsSuccessVisible(false);
    navigation.navigate("Home");
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
        <Text style={dynamicStyles.title}>Shipping Confirmation</Text>

        <TextInput
          style={dynamicStyles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={dynamicStyles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={userEmail|| ""}
          editable={false} 
        />

        <PhoneInput
          style={[dynamicStyles.input]}
          textStyle={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          initialCountry="us"
          textProps={{
            placeholder: "Phone number",
            placeholderTextColor: isDarkMode ? "#ccc" : "#555",
          }}
          onChangePhoneNumber={(number) => setPhone(number)}
        />

        <Text style={dynamicStyles.sectionTitle}>Location:</Text>
        {location ? (
          <>
            <MapView
              key={mapKey}
              ref={mapRef}
              style={dynamicStyles.map}
              region={region || undefined}
              onPress={handleMapPress}
            >
              <Marker coordinate={location} title="Selected Location" />
            </MapView>
          </>
        ) : (
          <Text style={dynamicStyles.errorText}>Getting location...</Text>
        )}

        <Text style={dynamicStyles.sectionTitle}>Credit card:</Text>
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
            {isProcessing ? "Processing..." : "CONFIRM"}
          </Text>
        </TouchableOpacity>
        {/*Processing Model*/}
        <Modal visible={isProcessing} transparent animationType="fade">
          <View style={dynamicStyles.modalContainer}>
            <Image
              source={require("../../assets/mute2-logo.png")}
              style={dynamicStyles.modalLogo}
            />
            <ActivityIndicator size="large" color="#0070BA" />
            <Text style={dynamicStyles.loadingText}>Processing...</Text>
          </View>
        </Modal>

        {/* Successful Payment Method */}
        <Modal visible={isSuccessVisible} animationType="slide">
          <View style={dynamicStyles.fullScreenModal}>
            <Text style={dynamicStyles.paidText}>PAID SUCCESSFULLY</Text>
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
                Return to Home
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmScreen;
