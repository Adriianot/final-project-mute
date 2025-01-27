import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
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

  const [isSkeletonVisible, setIsSkeletonVisible] = useState(false);
  const [isBillingFormVisible, setIsBillingFormVisible] = useState(false);
  const [isReceiptVisible, setIsReceiptVisible] = useState(false);
  const [isLoadingInBilling, setIsLoadingInBilling] = useState(false);

  const calculateTotal = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleConfirmPayment = () => {
    setIsSkeletonVisible(true);

    setTimeout(() => {
      setIsSkeletonVisible(false);
      setIsBillingFormVisible(true); // Pasar a la factura después del skeleton
    }, 3000);
  };

  const handleBillingFormSubmit = () => {
    setIsLoadingInBilling(true); // Muestra el cargando en la misma pantalla de factura

    setTimeout(() => {
      setIsLoadingInBilling(false); // Oculta el cargando
      setIsReceiptVisible(true); // Muestra la ventana de "Pagado con éxito"
    }, 3000);
  };

  const renderCartItem = ({ item }: { item: { id: string; name: string; price: number; quantity: number; image: any } }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartImage} />
      <View style={styles.cartDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
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
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>CONFIRMAR PAGO</Text>
        </TouchableOpacity>
      </View>

      {/* Skeleton Modal */}
      <Modal visible={isSkeletonVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.skeletonBackground} />
          <Image
            source={require('../../assets/mute2-logo.png')} // Nuevo logo de MUTE
            style={styles.extraLargeSkeletonLogo}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#0070BA" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      </Modal>

      {/* Ventana de Factura */}
      <Modal visible={isBillingFormVisible} animationType="slide">
        <View style={styles.fullScreenModal}>
          <TouchableOpacity
            onPress={() => setIsBillingFormVisible(false)}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/mute-logo.png')}
            style={styles.muteLogo}
            resizeMode="contain"
          />
          <Text style={styles.billingTitle}>FACTURA</Text>
          {isLoadingInBilling ? (
            <View style={styles.billingLoadingContainer}>
              <ActivityIndicator size="large" color="#0070BA" />
              <Text style={styles.loadingText}>Procesando...</Text>
            </View>
          ) : (
            <>
              <TextInput placeholder="Nombre completo" style={styles.input} />
              <TextInput placeholder="Dirección" style={styles.input} />
              <TextInput placeholder="Teléfono" style={styles.input} />
              <TextInput placeholder="Correo electrónico" style={styles.input} />
              <TouchableOpacity
                style={styles.billingButton}
                onPress={handleBillingFormSubmit}
              >
                <Text style={styles.billingButtonText}>Guardar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Ventana de Pagado */}
      <Modal visible={isReceiptVisible} animationType="slide">
        <View style={styles.fullScreenModal}>
          <TouchableOpacity
            onPress={() => {
              setIsReceiptVisible(false);
              setIsBillingFormVisible(true); // Regresa a la factura
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Regresar</Text>
          </TouchableOpacity>
          <Text style={styles.paidText}>PAGADO CON ÉXITO</Text>
          <Image
            source={require('../../assets/paypal-logo.png')}
            style={styles.largePayPalIcon}
            resizeMode="contain"
          />
          <Text style={styles.totalAmount}>Total: ${calculateTotal().toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.smallCloseButton}
            onPress={() => navigation.navigate('Home')} // Regresa a la pantalla de inicio
          >
            <Text style={styles.smallCloseButtonText}>CERRAR</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cartList: { padding: 16 },
  cartItem: { flexDirection: 'row', marginBottom: 16, alignItems: 'center' },
  cartImage: { width: 80, height: 80, borderRadius: 8, marginRight: 16 },
  cartDetails: { flex: 1 },
  itemName: { fontSize: 16, color: '#000' },
  itemPrice: { fontSize: 14, color: '#777', marginTop: 4 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 18, color: '#000' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 10 },
  confirmButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  skeletonBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo translúcido
  },
  extraLargeSkeletonLogo: { width: 300, height: 300, marginBottom: 20 },
  loadingText: { fontSize: 18, color: '#000', marginTop: 8 },
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  backButtonText: { fontSize: 14, color: '#000' },
  muteLogo: { width: 150, height: 150, marginBottom: 20 },
  billingTitle: { fontSize: 30, fontWeight: 'bold', marginBottom: 16 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 12 },
  billingButton: { backgroundColor: '#000', paddingVertical: 14, borderRadius: 8, alignItems: 'center', width: '60%' },
  billingButtonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
  billingLoadingContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  largePayPalIcon: { width: 220, height: 220, marginVertical: 20 },
  paidText: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 20 },
  smallCloseButton: { backgroundColor: '#000', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 20 },
  smallCloseButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default CartScreen;
