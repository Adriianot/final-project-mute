import React from 'react';
import {View,Text,Image,StyleSheet,FlatList,TouchableOpacity,} from 'react-native';
import { useTheme } from '../contexts/ThemeContext'; 

const CartScreen = () => {
  const { isDarkMode } = useTheme(); // Accede al estado del tema
  const dynamicStyles = getDynamicStyles(isDarkMode);

  const cartItems = [
    {
      id: '1',
      name: "Nike Air Force 1 Shadow Women's Shoes",
      price: 114.97,
      quantity: 1,
      image: require('../../assets/nike1.jpg'),
    },
    {
      id: '2',
      name: "Nike Sportswear Classic Women's Leggings",
      price: 43.97,
      quantity: 1,
      image: require('../../assets/nike2.jpg'),
    },
    {
      id: '3',
      name: 'Nike CITY Shoes',
      price: 100,
      quantity: 1,
      image: require('../../assets/nike3.jpg'),
    },
    {
      id: '4',
      name: 'Nike Wool Classics Water-Repellent Jacket',
      price: 400,
      quantity: 1,
      image: require('../../assets/nike4.jpg'),
    },
  ];

  const renderCartItem = ({ item }: { item: { id: string; name: string; price: number; quantity: number; image: any } }) => (
    <View style={dynamicStyles.cartItem}>
      <Image source={item.image} style={dynamicStyles.cartImage} />
      <View style={dynamicStyles.cartDetails}>
        <Text style={dynamicStyles.itemName}>{item.name}</Text>
        <Text style={dynamicStyles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={dynamicStyles.cartQuantity}>
        <Text style={dynamicStyles.quantityText}>{item.quantity}</Text>
      </View>
    </View>
  );

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={dynamicStyles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        style={dynamicStyles.cartList}
      />
      <View style={dynamicStyles.footer}>
        <Text style={dynamicStyles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity style={dynamicStyles.confirmButton}>
          <Text style={dynamicStyles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getDynamicStyles = (isDarkMode: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? '#121212' : '#ffffff' },
    cartList: { padding: 16 },
    cartItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
    cartImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
    cartDetails: { flex: 1 },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    itemPrice: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#777777',
      marginTop: 4,
    },
    cartQuantity: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: 60,
    },
    quantityText: { fontSize: 16, color: isDarkMode ? '#ffffff' : '#000000' },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderColor: isDarkMode ? '#333333' : '#eeeeee',
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    confirmButton: {
      marginTop: 16,
      backgroundColor: isDarkMode ? '#333333' : '#000000',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    confirmButtonText: {
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#ffffff',
      fontWeight: 'bold',
    },
  });

export default CartScreen;
