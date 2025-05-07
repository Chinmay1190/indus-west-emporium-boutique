
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  featured?: boolean;
  new?: boolean;
  bestSeller?: boolean;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  subcategories?: {
    id: string;
    name: string;
  }[];
};
