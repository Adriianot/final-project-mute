import React, { createContext, useContext, useState } from "react";

interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  talla: string;
  cantidad: number;
  imagen: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, action: "increase" | "decrease") => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.id === item.id && cartItem.talla === item.talla
      );
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.id === item.id && cartItem.talla === item.talla
            ? { ...cartItem, cantidad: cartItem.cantidad + item.cantidad }
            : cartItem
        );
      } else {
        return [...prevItems, item];
      }
    });
  };

  const updateQuantity = (id: string, action: "increase" | "decrease") => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad + (action === "increase" ? 1 : -1) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider");
  }
  return context;
};
