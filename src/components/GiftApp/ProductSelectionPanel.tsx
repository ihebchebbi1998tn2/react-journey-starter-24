import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '@/services/productsApi';
import { Input } from "@/components/ui/input";
import { Product } from '@/types/product';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CategoriesDisplay from './components/CategoriesDisplay';
import ProductGrid from './components/ProductGrid';
import { useIsMobile } from '@/hooks/use-mobile';
import AddItemDialog from './dialogs/AddItemDialog';
import { playTickSound } from '@/utils/audio';
import { toast } from '@/hooks/use-toast';

interface ProductSelectionPanelProps {
  onItemDrop: (item: Product, size: string, personalization: string) => void;
  packType: string;
  selectedContainerIndex: number;
  selectedItems: Product[];
}

const ProductSelectionPanel = ({ 
  onItemDrop, 
  packType, 
  selectedContainerIndex,
  selectedItems 
}: ProductSelectionPanelProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [personalization, setPersonalization] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const itemsPerPage = 4;
  const isMobile = useIsMobile();

  const getAvailableCategories = () => {
    if (packType === 'Pack Prestige') {
      const chemiseCount = selectedItems.filter(item => item.itemgroup_product === 'chemises').length;
      const beltCount = selectedItems.filter(item => item.itemgroup_product === 'ceintures').length;
      const cravateCount = selectedItems.filter(item => item.itemgroup_product === 'cravates').length;

      console.log('Current counts - Chemises:', chemiseCount, 'Belts:', beltCount, 'Cravates:', cravateCount);

      // First slot must be chemise
      if (chemiseCount === 0) {
        return [{ label: 'Chemises', type: 'itemgroup', value: 'chemises' }];
      }
      // Second slot must be belt after chemise is selected
      if (chemiseCount === 1 && beltCount === 0) {
        return [{ label: 'Ceintures', type: 'itemgroup', value: 'ceintures' }];
      }
      // Third slot must be cravate after chemise and belt are selected
      if (chemiseCount === 1 && beltCount === 1 && cravateCount === 0) {
        return [{ label: 'Cravates', type: 'itemgroup', value: 'cravates' }];
      }
      return [];
    }

    const categories = {
      'Pack Prestige': [
        [{ label: 'Chemises', type: 'itemgroup', value: 'chemises' }],
        [{ label: 'Ceintures', type: 'itemgroup', value: 'ceintures' }],
        [{ label: 'Cravates', type: 'itemgroup', value: 'cravates' }]
      ],
      'Pack Premium': [
        [{ label: 'Cravates', type: 'itemgroup', value: 'cravates' }],
        [{ label: 'Accessoires', type: 'type', value: 'accessoires' }]
      ],
      'Pack Trio': [
        [{ label: 'Portefeuilles', type: 'itemgroup', value: 'cortefeuilles' }],
        [{ label: 'Ceintures', type: 'itemgroup', value: 'ceintures' }],
        [{ label: 'Accessoires', type: 'type', value: 'accessoires' }]
      ],
      'Pack Duo': [
        [{ label: 'Portefeuilles', type: 'itemgroup', value: 'cortefeuilles' }],
        [{ label: 'Ceintures', type: 'itemgroup', value: 'ceintures' }]
      ],
      'Pack Mini Duo': [
        [{ label: 'Porte-cartes', type: 'itemgroup', value: 'porte-cartes' }],
        [{ label: 'Porte-clés', type: 'itemgroup', value: 'porte-cles' }]
      ]
    };

    const singleCategories = {
      'Pack Chemise': [{ label: 'Chemises', type: 'itemgroup', value: 'chemises' }],
      'Pack Ceinture': [{ label: 'Ceintures', type: 'itemgroup', value: 'ceintures' }],
      'Pack Cravatte': [{ label: 'Cravates', type: 'itemgroup', value: 'cravates' }],
      'Pack Malette': [{ label: 'Mallettes', type: 'itemgroup', value: 'mallettes' }]
    };

    if (singleCategories[packType as keyof typeof singleCategories]) {
      return singleCategories[packType as keyof typeof singleCategories];
    }

    const packCategories = categories[packType as keyof typeof categories];
    if (!packCategories) return [];

    return packCategories[selectedContainerIndex] || [];
  };

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', packType, selectedContainerIndex, selectedItems, searchTerm],
    queryFn: fetchAllProducts,
    select: (data) => {
      let filteredProducts = data;
      const categories = getAvailableCategories();
      
      console.log('Filtering with categories:', categories);
      
      if (categories.length > 0) {
        filteredProducts = data.filter(product => {
          return categories.some(category => {
            if (category.type === 'itemgroup') {
              // For chemises, also check if it's in the homme category
              if (category.value === 'chemises') {
                return product.itemgroup_product === category.value && 
                       product.category_product === 'homme';
              }
              return product.itemgroup_product === category.value;
            }
            if (category.type === 'type') {
              return product.type_product === category.value;
            }
            return false;
          });
        });

        // Filter out items that are already in the pack
        filteredProducts = filteredProducts.filter(product => 
          !selectedItems.some(item => item.id === product.id)
        );
      }

      // Apply search filter after category filtering
      return filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, product: Product) => {
    console.log('Drag started for product:', product.name);
    event.dataTransfer.setData('product', JSON.stringify(product));
  };

  const handleProductSelect = (product: Product) => {
    if (isMobile) {
      setSelectedProduct(product);
      setShowAddDialog(true);
      playTickSound();
    }
  };

  const handleConfirm = () => {
    if (selectedProduct && selectedSize) {
      const productWithSize = {
        ...selectedProduct,
        size: selectedSize,
        personalization: personalization
      };
      onItemDrop(productWithSize, selectedSize, personalization);
      setShowAddDialog(false);
      setSelectedSize('');
      setPersonalization('');
      setSelectedProduct(null);
      toast({
        title: "Article ajouté au pack",
        description: "L'article a été ajouté avec succès à votre pack cadeau",
        style: {
          backgroundColor: '#700100',
          color: 'white',
          border: '1px solid #590000',
        },
        duration: 3000,
      });
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20 h-[90%] flex flex-col">
      <div className="space-y-6 flex-1 flex flex-col">
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/50 border-white/30"
          />
        </div>

        <CategoriesDisplay 
          categories={getAvailableCategories()} 
          selectedItems={selectedItems}
          packType={packType}
        />
        
        <ProductGrid 
          products={products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
          onDragStart={handleDragStart}
          onProductSelect={handleProductSelect}
        />

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-[#700100] hover:bg-[#590000] text-white border-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} sur {Math.ceil(products.length / itemsPerPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(Math.ceil(products.length / itemsPerPage), p + 1))}
            disabled={currentPage >= Math.ceil(products.length / itemsPerPage)}
            className="bg-[#700100] hover:bg-[#590000] text-white border-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        droppedItem={selectedProduct}
        selectedSize={selectedSize}
        personalization={personalization}
        onSizeSelect={setSelectedSize}
        onPersonalizationChange={setPersonalization}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ProductSelectionPanel;
