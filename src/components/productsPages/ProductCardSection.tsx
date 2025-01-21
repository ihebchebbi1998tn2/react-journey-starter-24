import React from 'react';
import { Product } from '../../types/product';
import { useCart } from '../cart/CartProvider';
import { Button } from "@/components/ui/button";
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCardSection = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any parent click handlers
    e.stopPropagation(); // Stop event bubbling
    console.log('Add to cart clicked for:', product.name);
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      discount_product: product.discount_product,
      type_product: product.type_product,
      itemgroup_product: product.itemgroup_product
    });
  };

  return (
    <div 
      className="h-full hover:shadow-lg hover:transform hover:scale-[1.02] transition-all duration-300 relative"
    >
      <div className="h-[300px] bg-transparent overflow-hidden mb-3"> 
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-normal" 
        />
      </div>
      <div className="p-2 md:p-4">
        <div className="flex justify-between items-center">
          <div className="text-base font-['WomanFontRegular'] text-[#591C1C]">
            {product.name}
          </div>
          <div className="text-base font-bold text-black">
            $ {product.price}
          </div>
        </div>
        <div className="text-sm text-gray-600 uppercase mt-1">
          {product.material}<br />
          {product.color}
        </div>
        <Button 
          onClick={handleAddToCart}
          className="w-full mt-4 bg-[#700100] hover:bg-[#590000]"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Ajouter au panier
        </Button>
      </div>
    </div>
  );
};

export default ProductCardSection;