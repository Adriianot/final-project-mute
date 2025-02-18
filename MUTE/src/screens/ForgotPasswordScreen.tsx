import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Modal,
} from "react-native";

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // 🔹 Simula el envío de código de verificación
  const handleSendResetCode = () => {
    if (!email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    // 🔥 Genera un código aleatorio de 6 dígitos
    const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(mockCode);

    Alert.alert("📧 Demo", `Code sent: ${mockCode}`); // Simula que se envió el código al email
    setModalVisible(true);
  };

  // 🔹 Simula la verificación del código y el cambio de contraseña
  const handleResetPassword = () => {
    if (code !== generatedCode) {
      Alert.alert("Error", "Invalid code. Try again.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    Alert.alert("✅ Success", "Your password has been changed.");
    setModalVisible(false);
    setEmail("");
    setCode("");
    setNewPassword("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContentWrapper}>
        <Image
          source={require("../../assets/mute-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContentWrapper}>
        <Text style={styles.title}>Recover your account</Text>
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.label}>Enter your email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleSendResetCode}>
        <Text style={styles.resetButtonText}>Send Code</Text>
      </TouchableOpacity>

      {/* 🔹 MODAL DE VERIFICACIÓN Y CAMBIO DE CONTRASEÑA */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Code & New Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter Code"
              placeholderTextColor="#aaa"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
              <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 30 },
  logoContentWrapper: { alignItems: "center", marginBottom: 140 },
  logo: { width: 80, height: 80 },
  textContentWrapper: { alignItems: "center", marginBottom: 30 },
  title: { fontSize: 24, fontWeight: "bold", color: "#333", textAlign: "center" },
  tableContainer: { backgroundColor: "#f9f9f9", borderRadius: 8, padding: 30, marginBottom: 40 },
  label: { fontSize: 14, color: "#333", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, backgroundColor: "#fff", height: 40, paddingHorizontal: 10, fontSize: 16, color: "#333", width: "100%", marginBottom: 15 },
  resetButton: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: "center", width: "100%" },
  resetButtonText: { color: "#fff", fontSize: 16 },
  cancelButton: { marginTop: 10, backgroundColor: "#ccc", padding: 10, borderRadius: 8, alignItems: "center", width: "100%" },
  cancelButtonText: { color: "#333", fontSize: 16 },

  // 🔹 Estilos del Modal
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "90%", backgroundColor: "#fff", padding: 20, borderRadius: 8, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});

export default ForgotPasswordScreen;
