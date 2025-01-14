import { Product } from '@/types/product';

type CategoryType = {
  label: string;
  type: string;
  value: string;
};

export const getAvailableCategories = (
  packType: string,
  selectedContainerIndex: number,
  selectedItems: Product[]
): CategoryType[] => {
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