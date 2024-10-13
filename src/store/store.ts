import { Product } from '@/types/Product';
import { create } from 'zustand';

interface ProductStore {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  clearProducts: () => void;
  toggleProductChecked: (id: string) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  addProduct: (product) => set((state) => ({
    products: [...state.products, product],
  })),
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(product => product.id !== id),
  })),
  toggleProductChecked: (id: string) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, checked: !product.checked } : product
      ),
    })),
  clearProducts: () => set({ products: [] }),
}));
