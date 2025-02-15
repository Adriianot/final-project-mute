import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";
import { useUser } from "@clerk/clerk-expo"; 
import { getDynamicStyles } from "../styles/cartStyles";

const PurchasesScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      let email = null;

      if (isLoaded && isSignedIn && clerkUser) {
        email = clerkUser.emailAddresses[0]?.emailAddress || null;
      }

      if (!email) {
        email = await AsyncStorage.getItem("user_email");
      }

      if (!email) {
        throw new Error("❌ No se pudo obtener el email del usuario");
      }

      setUserEmail(email);
      await AsyncStorage.setItem("user_email", email); // 🔹 Forzar actualización del email
      console.log("✅ Email obtenido y actualizado:", email);

      fetchPurchases(email);
    } catch (error) {
      console.error("❌ Error obteniendo el email:", error);
      setLoading(false);
    }
  };

    const fetchPurchases = async (email: string) => {
      try {
        const response = await axios.get(
          `http://192.168.100.128:8000/auth/purchase?email=${email}`
        );
        setPurchases(response.data);
        console.log("✅ Compras obtenidas:", response.data);
      } catch (error) {
        console.error("❌ Error al obtener las compras:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, isSignedIn]);

  const renderPurchaseItem = ({
    item,
  }: {
    item: {
      id?: string;
      total: number;
      productos: { id: string; nombre: string; imagen: string; precio: number; cantidad: number; talla: string }[];
    };
  }) => (
    <View style={dynamicStyles.cartItem}>
      <Text style={dynamicStyles.itemName}>
        Compra ID: {item.id ? item.id : "Sin ID"}
      </Text>
      <Text style={dynamicStyles.itemPrice}>
        Total: ${item.total.toFixed(2)}
      </Text>

      {/* ✅ Mostrar productos comprados */}
      {item.productos?.length > 0 ? (
        item.productos.map((producto, index) => (
          <View key={producto.id || index.toString()} style={dynamicStyles.cartItem}>
            <Image source={{ uri: producto.imagen }} style={dynamicStyles.cartImage} />
            <View style={dynamicStyles.cartDetails}>
              <Text style={dynamicStyles.itemName}>{producto.nombre}</Text>
              <Text style={dynamicStyles.itemPrice}>Talla: {producto.talla}</Text>
              <Text style={dynamicStyles.itemPrice}>Cantidad: {producto.cantidad}</Text>
              <Text style={dynamicStyles.itemPrice}>${producto.precio.toFixed(2)}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={dynamicStyles.itemPrice}>No hay productos en esta compra</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <ActivityIndicator size="large" color={isDarkMode ? "#fff" : "#000"} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Mis Compras</Text>
      </View>
      {purchases.length > 0 ? (
        <FlatList
          data={purchases}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderPurchaseItem}
          contentContainerStyle={dynamicStyles.cartList}
        />
      ) : (
        <Text style={dynamicStyles.totalText}>No tienes compras registradas</Text>
      )}
    </SafeAreaView>
  );
};

export default PurchasesScreen;
