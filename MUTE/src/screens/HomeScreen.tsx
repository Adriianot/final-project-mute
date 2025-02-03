import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TextInput
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewPager from 'react-native-pager-view';
import { useTheme } from '../contexts/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';

type RootStackParamList = {
  Home: undefined;
  ProductDetail: { productId: string };
  CartScreen: undefined;
  Menu: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

interface Product {
  nombre: string;
  imagen: string;
  precio: number;
  descripcion: string;
  categoria: string;
  marca: string;
  genero: string;
}

// Constants
const { width: windowWidth } = Dimensions.get('window');

const BANNER_ITEMS: { id: string; image: any }[] = [
  { id: '1', image: require('../../assets/banner1.jpg') },
  { id: '2', image: require('../../assets/banner2.jpg') },
  { id: '3', image: require('../../assets/banner3.jpg') },
  { id: '4', image: require('../../assets/banner4.jpg') },
];

// Components
const Header: React.FC<{
  onMenuPress: () => void;
  onCartPress: () => void;
  isDarkMode: boolean;
  onSearch: (text: string) => void;
  isSearching: boolean;
  toggleSearch: () => void;
}> = ({ onMenuPress, onCartPress, isDarkMode, onSearch, isSearching, toggleSearch }) => {
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={dynamicStyles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
      </TouchableOpacity>
      
      {!isSearching ? (
        <Text style={dynamicStyles.headerTitle}>MUTE</Text>
      ) : (
        <TextInput
          style={dynamicStyles.searchInput}
          placeholder="Buscar productos..."
          placeholderTextColor={isDarkMode ? '#bbbbbb' : '#666666'}
          onChangeText={onSearch}
          autoFocus
        />
      )}

      <View style={dynamicStyles.headerRight}>
        <TouchableOpacity style={dynamicStyles.headerIcon} onPress={toggleSearch}>
          <Icon name={isSearching ? 'close' : 'search'} size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.headerIcon} onPress={onCartPress}>
          <Icon name="shopping-cart" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
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
  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  //  `useDebounce` 300ms
  const debouncedSearch = useDebounce(searchText, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.100.128:8000/auth/productos'); 
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (debouncedSearch === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.descripcion?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.categoria?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.marca?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.genero?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [debouncedSearch, products]);

  const handleProductPress = (productName: string) => {
    navigation.navigate('ProductDetail', { productId: productName });
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar backgroundColor={isDarkMode ? '#121212' : '#ffffff'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header
        onMenuPress={() => navigation.navigate('Menu')}
        onCartPress={() => navigation.navigate('CartScreen')}
        isDarkMode={isDarkMode}
        onSearch={setSearchText}
        isSearching={isSearching}
        toggleSearch={() => {
          setIsSearching(!isSearching);
          setSearchText('');
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={dynamicStyles.scrollView}>
        
        {/* Banners with auto-slide */}
        <ViewPager style={dynamicStyles.viewPager} initialPage={0}>
          {BANNER_ITEMS.map((item) => (
            <View key={item.id} style={dynamicStyles.bannerPage}>
              <Image source={item.image} style={dynamicStyles.bannerImage} resizeMode="cover" />
            </View>
          ))}
        </ViewPager>

        {/* Products*/}
        <View style={dynamicStyles.featuredSection}>
          <Text style={dynamicStyles.sectionTitle}>Products</Text>
          {loading ? (
            <Text style={dynamicStyles.loadingText}>Cargando productos...</Text>
          ) : (
            <View style={dynamicStyles.productsGrid}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <TouchableOpacity key={index} style={dynamicStyles.productCard} onPress={() => handleProductPress(product.nombre)}>
                    <Image source={{ uri: product.imagen }} style={dynamicStyles.productImage} resizeMode="cover" />
                    <Text style={dynamicStyles.productTitle}>{product.nombre}</Text>
                    <Text style={dynamicStyles.productPrice}>${product.precio.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={dynamicStyles.noResultsText}>No hay productos que coincidan con la búsqueda</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
    scrollView: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
      paddingHorizontal: 16,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      elevation: 4,
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#000000' },
    headerRight: { flexDirection: 'row' },
    headerIcon: { marginLeft: 16, padding: 8 },
    viewPager: { height: 200, marginVertical: 16 },
    bannerPage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    bannerImage: { width: '100%', height: '100%' },
    featuredSection: { padding: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: isDarkMode ? '#ffffff' : '#000000' },
    loadingText: { textAlign: 'center', fontSize: 16, marginVertical: 10, color: isDarkMode ? '#ffffff' : '#000000' },
    productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    productCard: {
      width: (windowWidth - 48) / 2,
      marginBottom: 16,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRadius: 8,
      elevation: 2,
      overflow: 'hidden',
    },
    productImage: { width: '100%', height: 150 },
    productTitle: { fontSize: 14, marginTop: 8, marginHorizontal: 8, color: isDarkMode ? '#ffffff' : '#000000' },
    productPrice: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8, color: isDarkMode ? '#ffffff' : '#000000' },
    searchInput: {
      flex: 1,
      height: 40,
      backgroundColor: isDarkMode ? '#222222' : '#f0f0f0',
      borderRadius: 8,
      paddingHorizontal: 10,
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    noResultsText: {
      textAlign: 'center',
      fontSize: 16,
      marginVertical: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#ff4444' : '#cc0000', 
    },
  });

export default HomeScreen;
