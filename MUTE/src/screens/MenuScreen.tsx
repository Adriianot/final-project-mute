import React, { useEffect, useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext"; // Importa AuthContext
import { useClerkAuth } from "../contexts/ClerkContext";

const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { signOut: authSignOut } = useAuth();
  const { signOut: clerkSignOut } = useClerkAuth();

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  const handleNavigation = (screen: string) => {
    navigation.navigate(screen);
  };

  const fetchUserFromDatabase = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token not found in storage");

      const response = await axios.get(
        "http://192.168.100.128:8000/auth/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(response.data);
      setProfileImage(response.data.profileImage || null);
    } catch (error) {
      console.error("Error getting user data from database:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFromClerk = () => {
    if (isLoaded && isSignedIn && clerkUser) {
      setUser({
        nombre: clerkUser.firstName || "User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "No email",
      });
      setProfileImage(clerkUser.imageUrl || null);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token && !isSignedIn) {
        return;
      }
  
      if (isSignedIn) {
        fetchUserFromClerk();
      } else if (token) {
        await fetchUserFromDatabase();
      }
    };
  
    fetchUserData();
  }, [isLoaded, isSignedIn]);

  const requestPermissions = async () => {
    const { status: cameraStatus } =
      await ImagePicker.requestCameraPermissionsAsync();
    const { status: galleryStatus } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraStatus !== "granted" || galleryStatus !== "granted") {
      Alert.alert(
        "Required permissions",
        "You must allow access to the camera and gallery."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    Alert.alert("Select Image", "How do you want to add the image?", [
      {
        text: "Camera",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Gallery",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
          });

          if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aceptar",
          onPress: async () => {
            logoutUser();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const logoutUser = async () => {
    try {
      console.log("🔹 Cerrando sesión...");
  
      // ✅ Eliminar email guardado en AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user_email"); 
  
      // ✅ Cerrar sesión en ambos sistemas (Firebase/Auth y Clerk)
      if (authSignOut) {
        await authSignOut();
      }
      if (clerkSignOut) {
        await clerkSignOut();
      }
  
      console.log("✅ Sesión cerrada correctamente.");
      navigation.navigate("Login"); // Redirigir a la pantalla de login
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  const dynamicStyles = getDynamicStyles(isDarkMode);

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../../assets/profile-placeholder.png")
            }
            style={dynamicStyles.profileImage}
          />
        </TouchableOpacity>
        <Text style={dynamicStyles.profileName}>{user?.nombre || "User"}</Text>
        <Text style={dynamicStyles.profileSubtitle}>{user?.email || ""}</Text>
      </View>
      <View style={dynamicStyles.menuItems}>
        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => handleNavigation("Home")}
        >
          <Icon name="home" size={24} color={isDarkMode ? "#fff" : "#000"} />
          <Text style={dynamicStyles.menuText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("PurchasesScreen")}
        >
          <Icon
            name="favorite"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
          <Text style={dynamicStyles.menuText}>My Purchases</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Icon
            name="shopping-cart"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
          <Text style={dynamicStyles.menuText}>Shopping cart</Text>
        </TouchableOpacity>
        <View style={dynamicStyles.menuItem}>
          <Icon
            name="brightness-6"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
          <Text style={dynamicStyles.menuText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
        <TouchableOpacity
          style={dynamicStyles.menuItem}
          onPress={() => navigation.navigate("ChatAssistantScreen")}
        >
          <Icon
            name="help-outline"
            size={24}
            color={isDarkMode ? "#fff" : "#000"}
          />
          <Text style={dynamicStyles.menuText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.menuItem} onPress={handleLogout}>
          <Icon name="logout" size={24} color={isDarkMode ? "#fff" : "#000"} />
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
      backgroundColor: isDarkMode ? "#121212" : "#fff",
    },
    profileSection: { alignItems: "center", marginVertical: 24 },
    profileImage: { width: 80, height: 80, borderRadius: 40 },
    profileName: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 8,
      color: isDarkMode ? "#fff" : "#000",
    },
    profileSubtitle: { fontSize: 14, color: isDarkMode ? "#bbb" : "#555" },
    menuItems: { flex: 1, paddingHorizontal: 16 },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#444" : "#eee",
    },
    menuText: {
      flex: 1,
      fontSize: 16,
      marginLeft: 16,
      color: isDarkMode ? "#fff" : "#000",
    },
  });

export default MenuScreen;