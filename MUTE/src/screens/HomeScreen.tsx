import React, { useState, useCallback } from 'react';
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

// Types
type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
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
  { id: '1', image: require('../../assets/placeholder.jpg') },
  { id: '2', image: require('../../assets/placeholder.jpg') },
  { id: '3', image: require('../../assets/placeholder.jpg') },
  { id: '4', image: require('../../assets/placeholder.jpg') },
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
  // {
  //   id: '3',
  //   image: require('../../assets/product3.jpg'),
  //   title: 'Denim Jeans',
  //   price: '$69.99',
  // },
  // {
  //   id: '4',
  //   image: require('../../assets/product4.jpg'),
  //   title: 'Sport Top',
  //   price: '$39.99',
  // },
];

// Components
const Header: React.FC<{
  onMenuPress: () => void;
  onSearchPress: () => void;
  onCartPress: () => void;
}> = ({ onMenuPress, onSearchPress, onCartPress }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onMenuPress}>
      <Icon name="menu" size={24} color="#000" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>MUTE</Text>
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.headerIcon} onPress={onSearchPress}>
        <Icon name="search" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerIcon} onPress={onCartPress}>
        <Icon name="shopping-cart" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

const ProductCard: React.FC<Product & { onPress: (productId: string) => void }> = ({
  id,
  image,
  title,
  price,
  onPress,
}) => (
  <TouchableOpacity style={styles.productCard} onPress={() => onPress(id)}>
    <Image source={image} style={styles.productImage} resizeMode="cover" />
    <Text style={styles.productTitle}>{title}</Text>
    <Text style={styles.productPrice}>{price}</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [currentTab, setCurrentTab] = useState('home');

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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Header
        onMenuPress={handleMenuPress}
        onSearchPress={handleSearchPress}
        onCartPress={handleCartPress}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <ViewPager style={styles.viewPager} initialPage={0}>
          {BANNER_ITEMS.map((item) => (
            <View key={item.id} style={styles.bannerPage}>
              <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
            </View>
          ))}
        </ViewPager>
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Productos Destacados</Text>
          <View style={styles.productsGrid}>
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} {...product} onPress={handleProductPress} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  headerRight: { flexDirection: 'row' },
  headerIcon: { marginLeft: 16, padding: 8 },
  viewPager: { height: 200, marginVertical: 16 },
  bannerPage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bannerImage: { width: '100%', height: '100%' },
  featuredSection: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#000' },
  productsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: {
    width: (windowWidth - 48) / 2,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: { width: '100%', height: 150 },
  productTitle: { fontSize: 14, marginTop: 8, marginHorizontal: 8, color: '#000' },
  productPrice: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 8, color: '#000' },
});

export default HomeScreen;
