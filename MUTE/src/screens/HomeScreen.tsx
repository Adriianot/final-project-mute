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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewPager from 'react-native-pager-view';
import { useTheme } from '../contexts/ThemeContext';

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
  onSearchPress: () => void;
  onCartPress: () => void;
  isDarkMode: boolean;
}> = ({ onMenuPress, onSearchPress, onCartPress, isDarkMode }) => {
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <View style={dynamicStyles.header}>
      <TouchableOpacity onPress={onMenuPress}>
        <Icon name="menu" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
      </TouchableOpacity>
      <Text style={dynamicStyles.headerTitle}>MUTE</Text>
      <View style={dynamicStyles.headerRight}>
        <TouchableOpacity style={dynamicStyles.headerIcon} onPress={onSearchPress}>
          <Icon name="search" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://192.168.100.128:8000/auth/productos'); // Cambia si usas otro host
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductPress = (productName: string) => {
    navigation.navigate('ProductDetail', { productId: productName });
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar backgroundColor={isDarkMode ? '#121212' : '#ffffff'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Header
        onMenuPress={() => navigation.navigate('Menu')}
        onSearchPress={() => console.log('Search pressed')}
        onCartPress={() => navigation.navigate('CartScreen')}
        isDarkMode={isDarkMode}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={dynamicStyles.scrollView}>
        
        {/* Banners */}
        <ViewPager style={dynamicStyles.viewPager} initialPage={0}>
          {BANNER_ITEMS.map((item) => (
            <View key={item.id} style={dynamicStyles.bannerPage}>
              <Image source={item.image} style={dynamicStyles.bannerImage} resizeMode="cover" />
            </View>
          ))}
        </ViewPager>

        {/* Productos Destacados */}
        <View style={dynamicStyles.featuredSection}>
          <Text style={dynamicStyles.sectionTitle}>Productos Destacados</Text>
          {loading ? (
            <Text style={dynamicStyles.loadingText}>Cargando productos...</Text>
          ) : (
            <View style={dynamicStyles.productsGrid}>
              {products.map((product, index) => (
                <TouchableOpacity key={index} style={dynamicStyles.productCard} onPress={() => handleProductPress(product.nombre)}>
                  <Image source={{ uri: product.imagen }} style={dynamicStyles.productImage} resizeMode="cover" />
                  <Text style={dynamicStyles.productTitle}>{product.nombre}</Text>
                  <Text style={dynamicStyles.productPrice}>${product.precio.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
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
  });

export default HomeScreen;
