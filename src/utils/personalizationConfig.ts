type PersonalizationConfig = {
  [key: string]: {
    canPersonalize: boolean;
    message?: string;
  };
};

export const personalizationConfig: PersonalizationConfig = {
  'cravates': {
    canPersonalize: false,
    message: 'Les cravates ne peuvent pas être personnalisées'
  },
  'portefeuilles': {
    canPersonalize: true
  },
  'ceintures': {
    canPersonalize: true
  },
  'chemises': {
    canPersonalize: true
  },
  'mallettes': {
    canPersonalize: true
  },
  'porte-cartes': {
    canPersonalize: true
  },
  'porte-cles': {
    canPersonalize: false,
    message: 'Les porte-clés ne peuvent pas être personnalisés'
  }
};

export const canItemBePersonalized = (itemGroup: string): boolean => {
  return personalizationConfig[itemGroup]?.canPersonalize ?? false;
};

export const getPersonalizationMessage = (itemGroup: string): string | undefined => {
  return personalizationConfig[itemGroup]?.message;
};