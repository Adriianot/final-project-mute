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

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 16,
      backgroundColor: isDarkMode ? "#121212" : "#ffffff",
    },

    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 20,
    },
    image: { width: windowWidth - 60, height: 300, resizeMode: "contain" },

    infoContainer: { marginTop: 10, paddingHorizontal: 16 },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDarkMode ? "#ffffff" : "#000000",
    },
    description: {
      fontSize: 16,
      color: isDarkMode ? "#aaaaaa" : "#666666",
      marginBottom: 10,
    },
    price: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FF5733",
      marginBottom: 16,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 10,
      color: isDarkMode ? "#ffffff" : "#000000",
    },

    sizeSelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginBottom: 12,
      backgroundColor: "#f0f0f0",
    },
    sizeSelectorText: {
      fontSize: 16,
      color: "#333",
    },

    addButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FF5733",
      padding: 12,
      borderRadius: 8,
      marginTop: 20,
    },
    addButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFF",
      marginLeft: 8,
    },

    disabledButton: { backgroundColor: "#ccc" },

    // Estilos para el modal
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: 300,
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    modalSizes: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
    },
    closeModalButton: {
      marginTop: 15,
      backgroundColor: "#FF5733",
      padding: 10,
      borderRadius: 5,
    },
    closeModalText: {
      color: "#fff",
      fontWeight: "bold",
    },

    sizeButton: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "#999",
      marginHorizontal: 5,
      backgroundColor: "#f0f0f0",
    },
    selectedSizeButton: {
      backgroundColor: "#FF5733",
      borderColor: "#FF5733",
    },
    sizeText: { fontSize: 14, fontWeight: "bold", color: "#333" },
    selectedSizeText: { color: "#FFF" },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 10,
    },
    counterButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FF5733",
      borderRadius: 8,
    },
    counterButtonText: {
      fontSize: 24,
      color: "#FFF",
      fontWeight: "bold",
    },
    counterText: {
      fontSize: 18,
      fontWeight: "bold",
      marginHorizontal: 15,
    },
  });

export default ProductDetailScreen;
