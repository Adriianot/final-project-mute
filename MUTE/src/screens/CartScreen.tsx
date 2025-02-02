import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type CartScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CartScreen'>;

const CartScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dynamicStyles = getDynamicStyles(isDarkMode);
  const navigation = useNavigation<CartScreenNavigationProp>();

  const [cartItems, setCartItems] = useState([
    { id: '1', name: "Nike Air Force 1 Shadow Women's Shoes", price: 114.97, quantity: 1, image: require('../../assets/nike1.jpg') },
    { id: '2', name: "Nike Sportswear Classic Women's Leggings", price: 43.97, quantity: 1, image: require('../../assets/nike2.jpg') },
    { id: '3', name: 'Nike CITY Shoes', price: 100, quantity: 1, image: require('../../assets/nike3.jpg') },
    { id: '4', name: 'Nike Wool Classics Water-Repellent Jacket', price: 400, quantity: 1, image: require('../../assets/nike4.jpg') },
  ]);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (id: string, action: 'increase' | 'decrease') => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + (action === 'increase' ? 1 : -1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const renderCartItem = ({ item }: { item: { id: string; name: string; price: number; quantity: number; image: any } }) => (
    <View style={dynamicStyles.cartItem}>
      <Image source={item.image} style={dynamicStyles.cartImage} />
      <View style={dynamicStyles.cartDetails}>
        <Text style={dynamicStyles.itemName}>{item.name}</Text>
        <Text style={dynamicStyles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={dynamicStyles.cartQuantity}>
        <TouchableOpacity style={dynamicStyles.quantityButton} onPress={() => updateQuantity(item.id, 'decrease')}>
          <Text style={dynamicStyles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={dynamicStyles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity style={dynamicStyles.quantityButton} onPress={() => updateQuantity(item.id, 'increase')}>
          <Text style={dynamicStyles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Shopping Cart</Text>

          <Icon name="shopping-cart" size={24} color={isDarkMode ? '#ffffff' : '#000000'} />

      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        style={dynamicStyles.cartList}
      />
      <View style={dynamicStyles.footer}>
        <Text style={dynamicStyles.totalText}>TOTAL: ${calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity style={dynamicStyles.confirmButton}
        onPress={() => navigation.navigate('ConfirmScreen', { total: calculateTotal() })}
        >
          <Text style={dynamicStyles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#000000' },
    cartList: { padding: 16 },
    cartItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'center', backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff', padding: 10, borderRadius: 8, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    cartImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
    cartDetails: { flex: 1 },
    itemName: { fontSize: 16, color: isDarkMode ? '#ffffff' : '#000000' },
    itemPrice: { fontSize: 14, color: isDarkMode ? '#aaaaaa' : '#777777', marginTop: 4 },
    cartQuantity: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    quantityButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: isDarkMode ? '#555555' : '#000000', alignItems: 'center', justifyContent: 'center' },
    buttonText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
    quantityText: { fontSize: 17, fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#000000' },
    footer: { padding: 20, borderTopWidth: 1, borderColor: isDarkMode ? '#333333' : '#eeeeee', backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' },
    totalText: { fontSize: 18, fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#000000' },
    confirmButton: { marginTop: 16, backgroundColor: '#ff5722', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    confirmButtonText: { fontSize: 16, color: '#ffffff', fontWeight: 'bold' },
  });

export default CartScreen;
