import React from 'react';
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  selectedSize: string;
  sizes: string[];
  onSizeSelect: (size: string) => void;
  isCostume?: boolean;
  itemGroup?: string;
}

const SizeSelector = ({ selectedSize, sizes, onSizeSelect, isCostume = false, itemGroup }: SizeSelectorProps) => {
  const getAvailableSizes = () => {
    // Filter out sizes with quantity 0 or empty string
    const filteredSizes = sizes.filter(size => {
      // If the size is in the array, it means it has quantity > 0
      return size && size !== '0' && size !== '';
    });

    console.log('Filtered sizes:', filteredSizes);
    return filteredSizes;
  };

  const displaySize = (size: string) => {
    if (itemGroup === 'veste' || isCostume) {
      return size;
    }
    if (size === '3XL') return '3XL';
    return size;
  };

  const availableSizes = getAvailableSizes();

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-6 gap-1">
        {availableSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={cn(
              "py-2 text-sm font-medium rounded-md transition-all duration-200",
              selectedSize === size 
                ? 'bg-[#700100] text-white shadow-md transform scale-105' 
                : 'bg-white border border-gray-200 text-gray-900 hover:border-[#700100] hover:bg-gray-50'
            )}
          >
            {displaySize(size)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;