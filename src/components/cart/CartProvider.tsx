import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveCartItems, getCartItems } from '@/utils/cartStorage';
import { getPersonalizations } from '@/utils/personalizationStorage';
import { calculateDiscountedPrice } from '@/utils/priceCalculations';
import { getPersonalizationPrice } from '@/utils/personalizationPricing';
import { toast } from "@/hooks/use-toast";
import { stockReduceManager } from '@/utils/StockReduce';
import { clearDevCache } from '@/utils/devUtils';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  personalization?: string;
  fromPack?: boolean;
  pack?: string;
  withBox?: boolean;
  discount_product?: string;
  type_product?: string;
  itemgroup_product?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  hasNewsletterDiscount: boolean;
  applyNewsletterDiscount: () => void;
  removeNewsletterDiscount: () => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number; boxTotal: number };
}

const BOX_PRICE = 30;

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hasNewsletterDiscount, setHasNewsletterDiscount] = useState<boolean>(() => {
    return localStorage.getItem('newsletterSubscribed') === 'true';
  });

  useEffect(() => {
    clearDevCache();
    const savedItems = getCartItems();
    const personalizations = getPersonalizations();
    
    const itemsWithPersonalization = savedItems.map(item => ({
      ...item,
      personalization: item.personalization || personalizations[item.id] || '',
    }));
    
    if (itemsWithPersonalization.length > 0) {
      setCartItems(itemsWithPersonalization);
    }
  }, []);

  useEffect(() => {
    saveCartItems(cartItems);
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    console.log('Adding item to cart:', item);
    
    setCartItems(prevItems => {
      if (item.fromPack || item.type_product === "Pack") {
        const packType = item.pack;
        const existingPackItems = prevItems.filter(i => i.pack === packType);
        if (existingPackItems.some(i => i.id === item.id)) {
          console.log('Item already exists in pack, skipping...');
          return prevItems;
        }
      }

      const existingItem = prevItems.find(i => 
        i.id === item.id && 
        i.size === item.size && 
        i.color === item.color && 
        i.personalization === item.personalization &&
        i.withBox === item.withBox &&
        i.pack === item.pack
      );
      
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id && 
          i.size === item.size && 
          i.color === item.color && 
          i.personalization === item.personalization &&
          i.withBox === item.withBox &&
          i.pack === item.pack
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      const finalPrice = item.discount_product 
        ? calculateDiscountedPrice(item.price, item.discount_product)
        : item.price;

      const personalizationPrice = getPersonalizationPrice(
        item.itemgroup_product || '',
        item.personalization,
        item.fromPack || false
      );

      const itemWithPack = {
        ...item,
        price: finalPrice + personalizationPrice,
        originalPrice: item.discount_product ? item.price : undefined,
        pack: item.pack || 'aucun',
        size: item.size || '-',
        personalization: item.personalization || '-'
      };

      return [...prevItems, itemWithPack];
    });
  };

  const removeFromCart = (id: number) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    
    if (itemToRemove) {
      setCartItems(prevItems => {
        // If the item is a pack packaging fee or from a pack
        if (itemToRemove.type_product === "Pack" || itemToRemove.fromPack) {
          const packType = itemToRemove.type_product === "Pack" 
            ? itemToRemove.name.split(' - ')[0]  // Extract pack type from packaging fee name
            : itemToRemove.pack;
          
          // Remove all items from this pack including the packaging fee
          const remainingItems = prevItems.filter(item => {
            const isPackagingFee = item.type_product === "Pack" && 
                                 item.name.split(' - ')[0] === packType;
            const isPackItem = item.pack === packType && item.fromPack;
            
            return !isPackagingFee && !isPackItem;
          });
          
          toast({
            title: "Pack supprimé",
            description: "Le pack et tous ses articles ont été supprimés du panier",
            style: {
              backgroundColor: '#700100',
              color: 'white',
              border: '1px solid #590000',
            },
            duration: 5000,
          });
          
          return remainingItems;
        }
        
        // Regular item removal (non-pack items)
        return prevItems.filter(item => item.id !== id);
      });
    }
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    stockReduceManager.clearItems();
  };

  const applyNewsletterDiscount = () => {
    const subscribedEmail = localStorage.getItem('subscribedEmail');
    if (!subscribedEmail) return;

    const usedDiscountEmails = JSON.parse(localStorage.getItem('usedDiscountEmails') || '[]');
    
    if (usedDiscountEmails.includes(subscribedEmail)) {
      setHasNewsletterDiscount(false);
      localStorage.removeItem('newsletterSubscribed');
      return;
    }

    usedDiscountEmails.push(subscribedEmail);
    localStorage.setItem('usedDiscountEmails', JSON.stringify(usedDiscountEmails));
    
    setHasNewsletterDiscount(true);
    localStorage.setItem('newsletterSubscribed', 'true');
  };

  const removeNewsletterDiscount = () => {
    setHasNewsletterDiscount(false);
    localStorage.removeItem('newsletterSubscribed');
  };

  const calculateTotal = () => {
    const itemsSubtotal = cartItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const boxTotal = cartItems.reduce((sum, item) => 
      sum + (item.withBox ? BOX_PRICE * item.quantity : 0), 0);
    
    const subtotal = itemsSubtotal + boxTotal;
    const discount = hasNewsletterDiscount ? subtotal * 0.05 : 0;
    const total = subtotal - discount;
    
    return { subtotal: itemsSubtotal, discount, total, boxTotal };
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      hasNewsletterDiscount,
      applyNewsletterDiscount,
      removeNewsletterDiscount,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
