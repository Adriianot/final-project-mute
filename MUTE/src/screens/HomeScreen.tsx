import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewPager from "react-native-pager-view";
import { useTheme } from "../contexts/ThemeContext";
import { useDebounce } from "../hooks/useDebounce";
import { getDynamicStyles } from "../styles/homeStyles";
import {
  sendNotification,
  registerForPushNotifications,
} from "../utils/notifications";

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

const ProductItem = memo(({ item, onPress, dynamicStyles }: { item: Product; onPress: () => void; dynamicStyles: any }) => {
  return (
    <TouchableOpacity
      style={[dynamicStyles.productCard, { flex: 1, margin: 5 }]}
      onPress={onPress}
    >
      <Image source={{ uri: item.imagen }} style={dynamicStyles.productImage} resizeMode="cover" />
      <Text style={dynamicStyles.productTitle}>{item.nombre}</Text>
      <Text style={dynamicStyles.productPrice}>${item.precio.toFixed(2)}</Text>
    </TouchableOpacity>
  );
});


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const debouncedSearch = useDebounce(searchText, 300);
  const [currentIndex, setCurrentIndex] = useState(0);
  const viewPagerRef = useRef<ViewPager>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [hasMore, setHasMore] = useState(true);

  const shuffleArray = (array: Product[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const fetchProducts = useCallback(
    async (pageNum = 1, append = false) => {
      if (!hasMore || loadingMore) return; 

      try {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await fetch(
          `http://52.70.33.203:8000/auth/productos?page=${pageNum}&perPage=${perPage}`
        );
        const data = await response.json();

        if (!data || data.length === 0) {
          setHasMore(false); 
        }

        if (data.length < perPage) {
          setHasMore(false); 
        }

        const uniqueProducts = data.filter(
          (newProduct: Product) =>
            !products.some(
              (existingProduct) => existingProduct.id === newProduct.id
            )
        ); 

        if (uniqueProducts.length === 0) {
          setHasMore(false); 
          return;
        }

        let productsWithTallas = data.map((product: Product) => ({
          ...product,
          tallas: Array.isArray(product.tallas) ? product.tallas : [],
        }));

        productsWithTallas = shuffleArray(productsWithTallas);

        setProducts((prevProducts) =>
          append ? [...prevProducts, ...productsWithTallas] : productsWithTallas
        );
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
    fetchProducts(1, false);
  }, [selectedCategory]);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "Todos") {
      filtered = products.filter(
        (product) =>
          product.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (debouncedSearch !== "") {
      filtered = filtered.filter(
        (product) =>
          product.nombre
            .toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          product.descripcion
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          product.marca
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
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

  useEffect(() => {
    async function setupNotifications() {
      const token = await registerForPushNotifications();
      setTimeout(() => {
        sendNotification(
          "🏷️ Special Offers!",
          "Take advantage of discounts in our store. MUTE"
        );
      }, 3000);
    }

    setupNotifications();
  }, []);

  const handleProductPress = (product: Product) => {
    console.log("Producto seleccionado antes de navegar:", product);
    navigation.navigate("ProductDetail", { product });
  };

  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage, true);
    }
  }, [loadingMore, hasMore, page]);

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => <ProductItem item={item} onPress={() => handleProductPress(item)} dynamicStyles={dynamicStyles} />,
    [handleProductPress]
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        backgroundColor={isDarkMode ? "#121212" : "#ffffff"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : `product-${index}`
        }
        numColumns={2} 
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
        }}
        renderItem={renderProductItem} 
        contentContainerStyle={{ paddingBottom: 10 }} 
        ListHeaderComponent={
          <>
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

            {/* Banners con auto-slide */}
            <ViewPager
              ref={viewPagerRef}
              style={dynamicStyles.viewPager}
              initialPage={0}
            >
              {BANNER_ITEMS.map((item) => (
                <View key={item.id} style={dynamicStyles.bannerPage}>
                  <Image
                    source={item.image}
                    style={dynamicStyles.bannerImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ViewPager>

            {/* Categorías */}
            <View style={dynamicStyles.featuredSection}>
              <Text style={dynamicStyles.sectionTitle}>Products</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={dynamicStyles.categoryScroll}
              >
                {CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      dynamicStyles.categoryButton,
                      selectedCategory === category &&
                        dynamicStyles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        dynamicStyles.categoryText,
                        selectedCategory === category &&
                          dynamicStyles.categoryTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        }

        onEndReached={hasMore ? loadMoreProducts : null} 
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loadingMore ? <ActivityIndicator size="large" color="#000" /> : null
        }
        initialNumToRender={10} 
        maxToRenderPerBatch={10} 
        windowSize={5}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
//hasta aquo
