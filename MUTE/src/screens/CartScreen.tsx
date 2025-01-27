import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const CartScreen = () => {
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
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartImage} />
      <View style={styles.cartDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.cartQuantity}>
        <Text style={styles.quantityText}>{item.quantity}</Text>
      </View>
    </View>
  );

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        style={styles.cartList}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cartList: { padding: 16 },
  cartItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  cartImage: { width: 60, height: 60, borderRadius: 8, marginRight: 16 },
  cartDetails: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  itemPrice: { fontSize: 14, color: '#777', marginTop: 4 },
  cartQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
  },
  quantityText: { fontSize: 16, color: '#000' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  totalText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  confirmButton: {
    marginTop: 16,
    backgroundColor: '#000', // Botón negro
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default CartScreen;
