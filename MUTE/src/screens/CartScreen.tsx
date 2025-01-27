import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
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
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  // Función para actualizar la cantidad de un producto
  const updateQuantity = (id: string, type: 'increase' | 'decrease') => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === 'increase'
                  ? item.quantity + 1
                  : item.quantity > 1
                  ? item.quantity - 1
                  : 1,
            }
          : item
      )
    );
  };

  // Calcula el total del carrito en base a las cantidades
  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const renderCartItem = ({ item }: { item: { id: string; name: string; price: number; quantity: number; image: any } }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartImage} />
      <View style={styles.cartDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.cartQuantity}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 'decrease')} style={styles.quantityButtonContainer}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, 'increase')} style={styles.quantityButtonContainer}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        style={styles.cartList}
      />
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.confirmButtonText}>CONFIRMAR</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmación de Compra</Text>
            <Text style={styles.modalText}>Tu total es:</Text>
            <Text style={styles.modalTotal}>${calculateTotal().toFixed(2)}</Text>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={() => {
                setIsModalVisible(false);
                console.log('Compra confirmada');
              }}
            >
              <Text style={styles.modalConfirmText}>Confirmar Pago</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cartList: { padding: 16 },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  cartImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  cartDetails: { flex: 1 },
  itemName: { fontSize: 14, color: '#000', lineHeight: 14 },
  itemPrice: { fontSize: 14, color: '#777', marginTop: 4, lineHeight: 18 },
  cartQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 110,
    justifyContent: 'space-between',
  },
  quantityButtonContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantityButton: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  quantityText: { fontSize: 16, color: '#000' },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  totalLabel: { fontSize: 20, color: '#000' },
  totalAmount: { fontSize: 19, fontWeight: 'bold', color: '#0070BA' },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  modalText: { fontSize: 16, color: '#000', marginBottom: 8 },
  modalTotal: { fontSize: 22, fontWeight: 'bold', color: '#0070BA', marginBottom: 16 },
  modalConfirmButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalConfirmText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalCancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCancelText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
});

export default CartScreen;
