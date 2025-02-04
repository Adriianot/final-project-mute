import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/AppNavigator";
import { StackNavigationProp } from "@react-navigation/stack";
import { getDynamicStyles } from "../styles/confirmStyles";

type ConfirmScreenRouteProp = RouteProp<RootStackParamList, "ConfirmScreen">;
type ConfirmScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ConfirmScreen"
>;

const ConfirmScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const navigation = useNavigation<ConfirmScreenNavigationProp>(); // ✅ Tipo correcto
  const route = useRoute<ConfirmScreenRouteProp>();
  const { total } = route.params;

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccessVisible(true);
    }, 2000);
  };

  const handleReturnHome = () => {
    setIsSuccessVisible(false);
    navigation.navigate("Home"); // ✅ Redirige al usuario a Home
  };
  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Confirmación de Envío</Text>

      <TextInput
        style={dynamicStyles.input}
        placeholder="Nombre Completo"
        placeholderTextColor="#999"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder="Número de Teléfono"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder="Dirección"
        placeholderTextColor="#999"
      />
      <TextInput
        style={dynamicStyles.input}
        placeholder="Tarjeta de Crédito"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />

      <Text style={dynamicStyles.total}>Total: ${total.toFixed(2)}</Text>

      <TouchableOpacity
        style={dynamicStyles.confirmButton}
        onPress={handleConfirm}
      >
        <Text style={dynamicStyles.confirmButtonText}>CONFIRMAR</Text>
      </TouchableOpacity>

      {/* Skeleton Modal */}
      {/* Modal de Procesamiento */}
      <Modal visible={isProcessing} transparent animationType="fade">
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.logoContainer}>
            <Image
              source={require("../../assets/mute2-logo.png")}
              style={dynamicStyles.modalLogo}
            />
          </View>
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
            <Text style={dynamicStyles.confirmButtonText}>Volver a Inicio</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


export default ConfirmScreen;
