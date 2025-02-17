import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TextInput,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewPager from "react-native-pager-view";
import { useTheme } from "../contexts/ThemeContext";
import { useDebounce } from "../hooks/useDebounce";
import { getDynamicStyles } from "../styles/homeStyles";

type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  CartScreen: undefined;
  Menu: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Home">;
};

interface Product {
  id: string;
  nombre: string;
  imagen: string;
  precio: number;
  descripcion: string;
  categoria: string;
  marca: string;
  genero: string;
  tallas: [];
}

// Constants
const BANNER_ITEMS: { id: string; image: any }[] = [
  { id: "1", image: require("../../assets/banner1.jpg") },
  { id: "2", image: require("../../assets/banner2.jpg") },
  { id: "3", image: require("../../assets/banner3.jpg") },
  { id: "4", image: require("../../assets/banner4.jpg") },
];

// Components
const CATEGORIES = [
  "Todos",
  "Pantalones",
  "Calzado",
  "Shorts",
  "Chaquetas",
  "Accesorios",
];
const Header: React.FC<{
  onMenuPress: () => void;
  onCartPress: () => void;
  isDarkMode: boolean;
  onSearch: (text: string) => void;
  isSearching: boolean;
  toggleSearch: () => void;
}> = ({
  onMenuPress,
  onCartPress,
  isDarkMode,
  onSearch,
  isSearching,
  toggleSearch,
}) => {
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={dynamicStyles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon
          name="menu"
          size={24}
          color={isDarkMode ? "#ffffff" : "#000000"}
        />
      </TouchableOpacity>

      {!isSearching ? (
        <Text style={dynamicStyles.headerTitle}>MUTE</Text>
      ) : (
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={isDarkMode ? "#bbbbbb" : "#666666"}
          onChangeText={onSearch}
          autoFocus
        />
      )}

      <View style={dynamicStyles.headerRight}>
        <TouchableOpacity
          style={dynamicStyles.headerIcon}
          onPress={toggleSearch}
        >
          <Icon
            name={isSearching ? "close" : "search"}
            size={24}
            color={isDarkMode ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={dynamicStyles.headerIcon}
          onPress={onCartPress}
        >
          <Icon
            name="shopping-cart"
            size={24}
            color={isDarkMode ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  //  `useDebounce` 300ms
  const debouncedSearch = useDebounce(searchText, 300);

  const [currentIndex, setCurrentIndex] = useState(0);
  const viewPagerRef = useRef<ViewPager>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://192.168.100.128:8000/auth/productos"
        );
        const data = await response.json();
        const productsWithTallas = data.map((product: Product) => ({
          ...product,
          tallas: Array.isArray(product.tallas) ? product.tallas : [],
        }));
    
        setProducts(productsWithTallas);
        setFilteredProducts(productsWithTallas);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
useEffect(() => {
  let filtered = products;

  if (selectedCategory !== "Todos") {
    filtered = products.filter(
      (product) => product.categoria.toLowerCase() === selectedCategory.toLowerCase()
    );
  }

  if (debouncedSearch !== "") {
    filtered = filtered.filter(
      (product) =>
        product.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.marca?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.genero?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }

  setFilteredProducts(filtered);
}, [debouncedSearch, products, selectedCategory]);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER_ITEMS.length);
    viewPagerRef.current?.setPage((currentIndex + 1) % BANNER_ITEMS.length);
  }, 3000);

  return () => clearInterval(interval);
}, [currentIndex]);

  const handleProductPress = (product: Product) => {
    console.log("Producto seleccionado antes de navegar:", product);
    navigation.navigate("ProductDetail", { product }); 
  };
  

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        backgroundColor={isDarkMode ? "#121212" : "#ffffff"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <Header
        onMenuPress={() => navigation.navigate("Menu")}
        onCartPress={() => navigation.navigate("CartScreen")}
        isDarkMode={isDarkMode}
        onSearch={setSearchText}
        isSearching={isSearching}
        toggleSearch={() => {
          setIsSearching(!isSearching);
          setSearchText("");
        }}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={dynamicStyles.scrollView}
      >
        {/* Banners with auto-slide */}
        <ViewPager
          ref={viewPagerRef}
          style={dynamicStyles.viewPager}
          initialPage={0}
        >
          {BANNER_ITEMS.map((item, index) => (
            <View key={item.id} style={dynamicStyles.bannerPage}>
              <Image
                source={item.image}
                style={dynamicStyles.bannerImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ViewPager>

        {/* Products*/}
        <View style={dynamicStyles.featuredSection}>
          <Text style={dynamicStyles.sectionTitle}>Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={dynamicStyles.categoryScroll}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            dynamicStyles.categoryButton,
            selectedCategory === category && dynamicStyles.categoryButtonSelected,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              dynamicStyles.categoryText,
              selectedCategory === category && dynamicStyles.categoryTextSelected,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
          {loading ? (
            <Text style={dynamicStyles.loadingText}>Cargando productos...</Text>
          ) : (
            <View style={dynamicStyles.productsGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <TouchableOpacity
                    key={index}
                    style={dynamicStyles.productCard}
                    onPress={() => handleProductPress(product)}
                  >
                    <Image
                      source={{ uri: product.imagen }}
                      style={dynamicStyles.productImage}
                      resizeMode="cover"
                    />
                    <Text style={dynamicStyles.productTitle}>
                      {product.nombre}
                    </Text>
                    <Text style={dynamicStyles.productPrice}>
                      ${product.precio.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={dynamicStyles.noResultsText}>
                  No hay productos que coincidan con la búsqueda
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
