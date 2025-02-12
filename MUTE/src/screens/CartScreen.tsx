import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { getDynamicStyles } from "../styles/cartStyles";
import { useCart } from "../contexts/CartContext"; // Importamos el contexto del carrito

type CartScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CartScreen"
>;

const CartScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const navigation = useNavigation<CartScreenNavigationProp>();

  const { cartItems, updateQuantity, removeFromCart } = useCart(); // Usamos el contexto del carrito

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.precio * item.cantidad, 0);

  const renderCartItem = ({
    item,
  }: {
    item: {
      id: string;
      nombre: string;
      precio: number;
      talla: string;
      cantidad: number;
      imagen: string;
    };
  }) => (
    <View style={dynamicStyles.cartItem}>
      <Image source={{ uri: item.imagen }} style={dynamicStyles.cartImage} />
      <View style={dynamicStyles.cartDetails}>
        <Text style={dynamicStyles.itemName}>{item.nombre}</Text>
        <Text style={dynamicStyles.itemPrice}>Talla: {item.talla}</Text>
        <Text style={dynamicStyles.itemPrice}>${item.precio.toFixed(2)}</Text>
      </View>
      <View style={dynamicStyles.cartQuantity}>
        <TouchableOpacity
          style={dynamicStyles.quantityButton}
          onPress={() => updateQuantity(item.id, "decrease")}
        >
          <Text style={dynamicStyles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.quantityText}>{item.cantidad}</Text>
        <TouchableOpacity
          style={dynamicStyles.quantityButton}
          onPress={() => updateQuantity(item.id, "increase")}
        >
          <Text style={dynamicStyles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={dynamicStyles.quantityButton}
        onPress={() => removeFromCart(item.id)}
      >
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Shopping Cart</Text>
        <Icon
          name="shopping-cart"
          size={24}
          color={isDarkMode ? "#ffffff" : "#000000"}
        />
      </View>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderCartItem}
          contentContainerStyle={dynamicStyles.cartList}
        />
      ) : (
        <Text style={dynamicStyles.totalText}>Tu carrito está vacío</Text>
      )}
      <View style={dynamicStyles.footer}>
        <Text style={dynamicStyles.totalText}>
          TOTAL: ${calculateTotal().toFixed(2)}
        </Text>
        <TouchableOpacity
          style={dynamicStyles.confirmButton}
          onPress={() =>
            navigation.navigate("ConfirmScreen", { total: calculateTotal(), cartItems: cartItems,})
          }
          disabled={cartItems.length === 0}
        >
          <Text style={dynamicStyles.confirmButtonText}>Confirmar Compra</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
