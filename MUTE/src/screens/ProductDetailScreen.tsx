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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Product } from "../interfaces/types";
import { getDynamicStyles } from "../styles/productStyles";

type ProductDetailProps = StackScreenProps<RootStackParamList, "ProductDetail">;

const { width: windowWidth } = Dimensions.get("window");

const availableSizes = ["S", "M", "L", "XL"]; // Tallas predefinidas

const ProductDetailScreen: React.FC<ProductDetailProps> = ({
  route,
  navigation,
}) => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    console.log("Añadiendo al carrito:", {
      nombre: product.nombre,
      precio: product.precio,
      talla: selectedSize,
    });
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

        {/* 📏 Selección de Tallas */}
        <Text style={dynamicStyles.sectionTitle}>Selecciona tu talla:</Text>
        <TouchableOpacity
          style={dynamicStyles.sizeSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={dynamicStyles.sizeSelectorText}>
            {selectedSize ? `Talla: ${selectedSize}` : "Elige una talla"}
          </Text>
          <Icon name="arrow-drop-down" size={24} color="#000" />
        </TouchableOpacity>

        {/* 🚻 Género */}
        <Text style={dynamicStyles.sectionTitle}>Género: {product.genero}</Text>
        
        {/* 🔢 Contador de cantidad */}
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

        {/* Ajustar el botón de agregar al carrito para incluir la cantidad */}
        <TouchableOpacity
          style={[
            dynamicStyles.addButton,
            !selectedSize && dynamicStyles.disabledButton,
          ]}
          disabled={!selectedSize}
          onPress={() => {
            if (!selectedSize) return;
            console.log("Añadiendo al carrito:", {
              nombre: product.nombre,
              precio: product.precio,
              talla: selectedSize,
              cantidad: quantity, // Se envía la cantidad seleccionada
            });
          }}
        >
          <Icon name="shopping-cart" size={24} color="#fff" />
          <Text style={dynamicStyles.addButtonText}>Agregar al carrito</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL PARA SELECCIONAR TALLA */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalContent}>
            <Text style={dynamicStyles.modalTitle}>Selecciona una talla</Text>
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
              <Text style={dynamicStyles.closeModalText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProductDetailScreen;
