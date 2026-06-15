'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  category: string;
  rentalPeriod?: 'day' | 'week' | 'month';
  securityDeposit?: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minPurchase: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  couponError: string;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  securityDepositTotal: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  { code: "WELCOME10", discountPercent: 10, minPurchase: 500 },
  { code: "FLASH20", discountPercent: 20, minPurchase: 2000 },
  { code: "KYESTORE", discountPercent: 15, minPurchase: 1000 }
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('ky_cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
    const storedCoupon = localStorage.getItem('ky_coupon');
    if (storedCoupon) {
      try {
        setCoupon(JSON.parse(storedCoupon));
      } catch (e) {}
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('ky_cart', JSON.stringify(items));
  };

  const addToCart = (product: any, quantity: number = 1) => {
    const itemKey = product.rentalPeriod ? `${product.id}-${product.rentalPeriod}` : product.id;
    const existingItem = cartItems.find((item) => item.id === itemKey);
    let newItems;
    if (existingItem) {
      newItems = cartItems.map((item) =>
        item.id === itemKey
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [
        ...cartItems,
        {
          id: itemKey,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          quantity: quantity,
          image: product.image,
          category: product.category,
          rentalPeriod: product.rentalPeriod,
          securityDeposit: product.securityDeposit,
        },
      ];
    }
    saveCart(newItems);
  };

  const removeFromCart = (productId: string) => {
    const newItems = cartItems.filter((item) => item.id !== productId);
    saveCart(newItems);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newItems = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    saveCart(newItems);
  };

  const clearCart = () => {
    saveCart([]);
    removeCoupon();
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.trim().toUpperCase();
    const foundCoupon = AVAILABLE_COUPONS.find((c) => c.code === upperCode);
    
    if (!foundCoupon) {
      setCouponError('Invalid coupon code.');
      return false;
    }

    const currentSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (currentSubtotal < foundCoupon.minPurchase) {
      setCouponError(`Min purchase of ₹${foundCoupon.minPurchase} required for this coupon.`);
      return false;
    }

    setCoupon(foundCoupon);
    setCouponError('');
    localStorage.setItem('ky_coupon', JSON.stringify(foundCoupon));
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
    localStorage.removeItem('ky_coupon');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Recalculate coupon eligibility if cart changes
  useEffect(() => {
    if (coupon && subtotal < coupon.minPurchase) {
      setCoupon(null);
      setCouponError(`Coupon removed. Subtotal fell below min purchase of ₹${coupon.minPurchase}`);
      localStorage.removeItem('ky_coupon');
    }
  }, [subtotal, coupon]);

  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  
  // Free shipping over ₹1000, otherwise ₹99. No shipping for empty cart.
  const shippingFee = subtotal === 0 ? 0 : subtotal > 1000 ? 0 : 99;
  
  // Tax is 5% GST on the taxable amount (subtotal - discount)
  const taxAmount = Math.round((subtotal - discountAmount) * 0.05);
  
  // Security Deposit Total
  const securityDepositTotal = cartItems.reduce((acc, item) => acc + (item.securityDeposit || 0) * item.quantity, 0);
  
  const total = subtotal - discountAmount + shippingFee + taxAmount + securityDepositTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        securityDepositTotal,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
