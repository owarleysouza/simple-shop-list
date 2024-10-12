import { Product } from '@/types/Product';
import { create } from 'zustand';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  clearProducts: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
  })),
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(product => product.id !== id),
  })),
  clearProducts: () => set({ products: [] }),
}));
