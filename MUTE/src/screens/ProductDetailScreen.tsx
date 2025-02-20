import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Product } from "../interfaces/types";
import { getDynamicStyles } from "../styles/productStyles";
import { useCart } from "../contexts/CartContext";

type ProductDetailProps = StackScreenProps<RootStackParamList, "ProductDetail">;

const availableSizes = ["S", "M", "L", "XL"]; // Predefined sizes

const ProductDetailScreen: React.FC<ProductDetailProps> = ({
  route,
  navigation,
}) => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const { product } = route.params;
  const { addToCart } = useCart(); 
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert("⚠️ Required selection", "Please choose a size before adding to cart.");
      return;
    }
  
    const newItem = {
      id: product.nombre + selectedSize,
      nombre: product.nombre,
      precio: product.precio,
      talla: selectedSize,
      cantidad: quantity,
      imagen: product.imagen,
    };
  
    addToCart(newItem);

    Alert.alert(
      "✅ Product added",
      `${product.nombre} (${selectedSize}) was added to cart successfully.`,
      [{ text: "OK" }]
    );
  };

  return (
    <ScrollView contentContainerStyle={dynamicStyles.container}>
      <View style={dynamicStyles.imageContainer}>
        <Image source={{ uri: product.imagen }} style={dynamicStyles.image} />
      </View>

      <View style={dynamicStyles.infoContainer}>
        <Text style={dynamicStyles.title}>{product.nombre}</Text>
        <Text style={dynamicStyles.description}>{product.descripcion}</Text>
        <Text style={dynamicStyles.price}>${product.precio.toFixed(2)}</Text>

        {/* 📏 Size Selections */}
        <Text style={dynamicStyles.sectionTitle}>Select your size:</Text>
        <TouchableOpacity
          style={dynamicStyles.sizeSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={dynamicStyles.sizeSelectorText}>
            {selectedSize ? `Talla: ${selectedSize}` : "Choose a size"}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>

        {/* 🚻 Gender */}
        <Text style={dynamicStyles.sectionTitle}>Gender: {product.genero}</Text>
        
        {/* 🔢 Quantity counter*/}
        <View style={dynamicStyles.counterContainer}>
          <TouchableOpacity
            style={dynamicStyles.counterButton}
            onPress={() => setQuantity((prev) => Math.max(prev - 1, 1))}
          >
            <Text style={dynamicStyles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={dynamicStyles.counterText}>{quantity}</Text>
          <TouchableOpacity
            style={dynamicStyles.counterButton}
            onPress={() => setQuantity((prev) => prev + 1)}
          >
            <Text style={dynamicStyles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Adjust the add to cart button to include the quantity */}
        <TouchableOpacity
          style={[
            dynamicStyles.addButton,
            !selectedSize && dynamicStyles.disabledButton,
          ]}
          disabled={!selectedSize}
          onPress={handleAddToCart} 
        >
          <Icon name="shopping-cart" size={24} color="#fff" />
          <Text style={dynamicStyles.addButtonText}>Add to cart</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL TO SELECT SIZE */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>Select a size </Text>
            <View style={dynamicStyles.modalSizes}>
              {availableSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    dynamicStyles.sizeButton,
                    selectedSize === size && dynamicStyles.selectedSizeButton,
                  ]}
                  onPress={() => {
                    setSelectedSize(size);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      dynamicStyles.sizeText,
                      selectedSize === size && dynamicStyles.selectedSizeText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={dynamicStyles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={dynamicStyles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProductDetailScreen;
