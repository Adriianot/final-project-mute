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
  ImageSourcePropType,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewPager from 'react-native-pager-view';
import { useTheme } from '../contexts/ThemeContext';

// Screens
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ProductDetail: { productId: string };
  CartScreen: undefined;
  Menu: undefined;
};

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

// Interfaces
interface Product {
  id: string;
  image: ImageSourcePropType;
  title: string;
  price: string;
}

interface BannerItem {
  id: string;
  image: ImageSourcePropType;
}

// Constants
const { width: windowWidth } = Dimensions.get('window');

const BANNER_ITEMS: BannerItem[] = [
  { id: '1', image: require('../../assets/banner1.jpg') },
  { id: '2', image: require('../../assets/banner2.jpg') },
  { id: '3', image: require('../../assets/banner3.jpg') },
  { id: '4', image: require('../../assets/banner4.jpg') },
];

const FEATURED_PRODUCTS: Product[] = [
  {
    id: '1',
    image: require('../../assets/placeholder.jpg'),
    title: 'Pants Sport',
    price: '$59.99',
  },
  {
    id: '2',
    image: require('../../assets/placeholder.jpg'),
    title: 'Nike Sneakers',
    price: '$89.99',
  },
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

const ProductCard: React.FC<Product & { onPress: (productId: string) => void; isDarkMode: boolean }> = ({
  id,
  image,
  title,
  price,
  onPress,
  isDarkMode,
}) => {
  const dynamicStyles = getDynamicStyles(isDarkMode);

  return (
    <TouchableOpacity style={dynamicStyles.productCard} onPress={() => onPress(id)}>
      <Image source={image} style={dynamicStyles.productImage} resizeMode="cover" />
      <Text style={dynamicStyles.productTitle}>{title}</Text>
      <Text style={dynamicStyles.productPrice}>{price}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);

  const [currentPage, setCurrentPage] = useState(0);
  const viewPagerRef = useRef<ViewPager>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % BANNER_ITEMS.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (viewPagerRef.current) {
      viewPagerRef.current.setPage(currentPage);
    }
  }, [currentPage]);

  const handleProductPress = useCallback(
    (productId: string) => {
      navigation.navigate('ProductDetail', { productId });
    },
    [navigation]
  );

  const handleCartPress = useCallback(() => {
    navigation.navigate('CartScreen');
  }, [navigation]);

  const handleMenuPress = useCallback(() => {
    navigation.navigate('Menu');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    console.log('Search pressed');
  }, []);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar
        backgroundColor={isDarkMode ? '#121212' : '#ffffff'}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <Header
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        onCartPress={handleCartPress}
        isDarkMode={isDarkMode}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={dynamicStyles.scrollView}>
        <ViewPager
          style={dynamicStyles.viewPager}
          initialPage={0}
          ref={viewPagerRef}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {BANNER_ITEMS.map((item) => (
            <View key={item.id} style={dynamicStyles.bannerPage}>
              <Image source={item.image} style={dynamicStyles.bannerImage} resizeMode="cover" />
            </View>
          ))}
        </ViewPager>
        <View style={dynamicStyles.featuredSection}>
          <Text style={dynamicStyles.sectionTitle}>Productos Destacados</Text>
          <View style={dynamicStyles.productsGrid}>
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onPress={handleProductPress}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
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
