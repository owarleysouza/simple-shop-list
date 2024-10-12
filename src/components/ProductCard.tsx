import { Product } from '@/types/Product';
import { Trash } from 'lucide-react';
import { Checkbox } from './ui/checkbox';

import { useProductStore } from '@/store/store';

interface ProductCardProps {
  product: Product;
}

const productUnits = {
  'Un.': 'unidade(s)',
  Kg: 'kg',
  L: 'litro(s)',
};

const productCategories = {
  bakery: ['Padaria', 'bg-myred'],
  hortifruti: ['Hortifruti', 'bg-mygreen'],
  protein: ['Proteína', 'bg-myyellow'],
  beverage: ['Bebida', 'bg-myblue'],
  grocery: ['Mercearia', 'bg-mypink'],
};

export default function ProductCard({ product }: ProductCardProps) {
  const [label, color] =
    productCategories[product.category as keyof typeof productCategories];
  const { removeProduct } = useProductStore();

  return (
    <article className="w-full bg-mysecondary rounded-2xl border border-myaccent shadow gap-2 py-4 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Checkbox
            className="rounded-md h-5 w-5 border-myprimary"
            checked={product.checked}
            aria-label={`Selecionar ${product.name}`}
          />
          <div className="flex flex-col">
            <h3 className="text-md text-myprimary font-bold break-all ...">
              {product.name}
            </h3>
            <p className="text-xs text-mygrey font-semibold break-all ...">
              {`${product.quantity} ${productUnits[product.unity]}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span
            className={`opacity-75 px-4 py-1 rounded-xl text-sm text-myblack font-semibold ${color}`}
          >
            {label}
          </span>

          <button
            className="text-gray-400 cursor-pointer"
            onClick={() => removeProduct(product.id)}
            aria-label={`Remover ${product.name}`}
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
