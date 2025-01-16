export const calculateDiscountedPrice = (originalPrice: number, discount: string): number => {
  if (!discount || discount === "") return originalPrice;
  const discountValue = parseFloat(discount);
  if (isNaN(discountValue) || discountValue <= 0) return originalPrice;
  return originalPrice * (1 - discountValue / 100);
};

export const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

export const PERSONALIZATION_FEE = 30;

export const calculateFinalPrice = (
  basePrice: number, 
  discount: string, 
  itemGroup?: string, 
  hasPersonalization?: boolean,
  isInPack: boolean = false
): number => {
  console.log('Calculating final price:', { basePrice, discount, itemGroup, hasPersonalization, isInPack });
  
  const discountedPrice = calculateDiscountedPrice(basePrice, discount);
  
  // Add personalization fee for chemises if personalization exists and not in a pack
  const personalizationFee = (itemGroup === 'chemises' && hasPersonalization && !isInPack) ? PERSONALIZATION_FEE : 0;
  console.log('Personalization fee:', personalizationFee);
  
  const finalPrice = discountedPrice + personalizationFee;
  console.log('Final price:', finalPrice);
  
  return finalPrice;
};