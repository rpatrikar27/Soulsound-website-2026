import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface CartItem {
  product_id: string;
  slug: string;
  name: string;
  image: string;
  color?: string;
  price: number;
  mrp: number;
  quantity: number;
  sku: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (product_id: string, color?: string) => void;
  updateQty: (product_id: string, qty: number, color?: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discount: number;
  totalMrp: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soulsound_cart_v2');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('soulsound_cart_v2', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product_id === newItem.product_id && item.color === newItem.color
      );

      if (existingIndex > -1) {
        const updatedItems = [...prev];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + newItem.quantity
        };
        return updatedItems;
      }

      return [...prev, newItem];
    });
  };

  const removeItem = (product_id: string, color?: string) => {
    setItems(prev => prev.filter(item => !(item.product_id === product_id && item.color === color)));
  };

  const updateQty = (product_id: string, qty: number, color?: string) => {
    setItems(prev => prev.map(item => {
      if (item.product_id === product_id && item.color === color) {
        return { ...item, quantity: Math.max(1, Math.min(10, qty)) };
      }
      return item;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + (item.price * item.quantity), 0), [items]);
  const totalMrp = useMemo(() => items.reduce((acc, item) => acc + (item.mrp * item.quantity), 0), [items]);
  const discount = useMemo(() => totalMrp - subtotal, [totalMrp, subtotal]);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQty, 
      clearCart, 
      totalItems, 
      subtotal, 
      discount,
      totalMrp
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
