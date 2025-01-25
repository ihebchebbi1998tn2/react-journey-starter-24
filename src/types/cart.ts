export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
  itemGroup?: string;
  hasPersonalization?: boolean;
  personalizationText?: string;
  personalizationFont?: string;
  personalizationColor?: string;
  boxType?: string;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  getPackagingFee: () => number;
  hasNewsletterDiscount: boolean;
  applyNewsletterDiscount: () => void;
  removeNewsletterDiscount: () => void;
  calculateTotal: () => { subtotal: number; discount: number; total: number; boxTotal: number };
}