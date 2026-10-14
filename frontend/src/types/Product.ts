export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  specifications: string;
  price: number;
  imageUrl?: string;
  stock: number;
  featured: boolean;
  categoryId?: number;
  category?: Category;
  createdAt: string;
}