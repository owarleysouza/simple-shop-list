import { Product } from '@/types/Product';
import { Trash } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';

import { useProductStore } from '@/store/store';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useState } from 'react';

import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const productUnits = {
  'Un.': 'unidade(s)',
  Kg: 'kg',
  L: 'litro(s)',
};

const productCategories = {
  bakery: ['Padaria', 'bg-red-200'],
  hortifruti: ['Hortifruti', 'bg-green-200'],
  protein: ['Proteína', 'bg-yellow-200'],
  beverage: ['Bebida', 'bg-blue-200'],
  grocery: ['Mercearia', 'bg-orange-200'],
};

export default function ProductCard({ product }: ProductCardProps) {
  const [label, color] =
    productCategories[product.category as keyof typeof productCategories];
  const [removeProductLoading, setRemoveProductLoading] = useState(false);

  const { removeProduct, toggleProductChecked } = useProductStore();

  const { toast } = useToast();

  async function onRemoveProduct() {
    try {
      setRemoveProductLoading(true);

      await deleteDoc(doc(db, 'products', product.id));
      removeProduct(product.id);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado aconteceu',
        description: 'Um erro inesperado aconteceu ao tentar remover o produto',
      });
      console.error(error);
    } finally {
      setRemoveProductLoading(false);
    }
  }

  async function toggleProductStatus() {
    try {
      await updateDoc(doc(db, 'products', product.id), {
        checked: !product.checked,
      });

      toggleProductChecked(product.id);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado aconteceu',
        description:
          'Um erro inesperado aconteceu ao mudar o status do produto',
      });
      console.error(error);
    }
  }

  return (
    <article className="w-full bg-secondary rounded-2xl border border-accent shadow gap-2 py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            id={product.id}
            className="rounded-md h-5 w-5 border-primary"
            checked={product.checked}
            onCheckedChange={toggleProductStatus}
            aria-label={`Selecionar ${product.name}`}
          />
          <div className="flex flex-col">
            <h3
              className={`${
                product.checked ? 'line-through' : ''
              } text-md text-primary font-bold break-all ...`}
            >
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 font-semibold break-all ...">
              {`${product.quantity} ${productUnits[product.unity]}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span
            className={`opacity-75 px-4 py-1 rounded-xl text-sm text-black font-semibold ${color}`}
          >
            {label}
          </span>

          <button
            className="text-gray-400 cursor-pointer"
            onClick={() => onRemoveProduct()}
            aria-label={`Remover ${product.name}`}
            disabled={removeProductLoading}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
