'use client';

import ProductCard from '@/components/Product/ProductCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useProductStore } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import LoadingComponent from '@/components/commom/Loading';
import { Product } from '@/types/Product';
import FormInputField from '@/components/Form/FormInput';
import FormSelectField from '@/components/Form/FormSelect';
import FormNumberField from '@/components/Form/FormNumber';

const formSchema = z.object({
  name: z.string().min(2).max(30),
  quantity: z.coerce.number().int().positive(),
  unity: z.enum(['Un.', 'Kg', 'L']),
  category: z.string(),
});

export default function Home() {
  const { products, addProduct } = useProductStore();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAddProduct, setLoadingAddProduct] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', quantity: 1, unity: 'Un.', category: 'bakery' },
  });

  function getOrCreateUserId(): string {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  async function getProductsByUser() {
    try {
      const userId = getOrCreateUserId();
      const q = query(
        collection(db, 'products'),
        where('userId', '==', userId)
      );
      const productSnapshot = await getDocs(q);
      productSnapshot.docs.forEach((doc) =>
        addProduct({ ...doc.data(), id: doc.id } as Product)
      );
      setLoadingProducts(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao carregar produtos' });
      console.error(error);
    }
  }

  useEffect(() => {
    getProductsByUser();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingAddProduct(true);
    const newProduct = { ...values, checked: false };
    const userId = getOrCreateUserId();

    try {
      const { id } = await addDoc(collection(db, 'products'), {
        ...newProduct,
        userId,
      });
      addProduct({ ...newProduct, id });
      form.reset();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao adicionar produto' });
      console.error(error);
    } finally {
      setLoadingAddProduct(false);
    }
  }

  return (
    <main className="min-h-screen bg-secondary lg:px-64 md:px-32 px-8 py-6">
      <header>
        <h1 className="text-3xl text-primary font-bold">Lista de Compras</h1>
      </header>

      {loadingProducts ? (
        <LoadingComponent />
      ) : (
        <>
          <section className="py-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap"
                aria-label="Formulário de adição de produtos"
              >
                <FormInputField
                  control={form.control}
                  name="name"
                  label="Item"
                  id="product-name"
                  className="md:w-1/3 min-w-[150px] sm:w-full"
                  placeholder="Digite o nome do item"
                />

                <div className="flex flex-row md:w-1/3 px-1 w-full">
                  <FormNumberField
                    control={form.control}
                    name="quantity"
                    label="Quantidade"
                    id="product-quantity"
                    placeholder="Digite a quantidade"
                  />

                  <FormSelectField
                    control={form.control}
                    name="unity"
                    label="Unidade"
                    id="product-unity"
                    options={[
                      { value: 'Un.', label: 'Un.' },
                      { value: 'Kg', label: 'Kg' },
                      { value: 'L', label: 'Litro' },
                    ]}
                    placeholder="Selecione uma unidade"
                    className="w-20"
                  />
                </div>

                <FormSelectField
                  control={form.control}
                  name="category"
                  label="Categoria"
                  id="product-category"
                  options={[
                    { value: 'bakery', label: 'Padaria' },
                    { value: 'hortifruti', label: 'Hortifruti' },
                    { value: 'protein', label: 'Proteína' },
                    { value: 'beverage', label: 'Bebida' },
                    { value: 'grocery', label: 'Mercearia' },
                  ]}
                  placeholder="Selecione uma categoria"
                  className="md:w-1/3 px-1 w-full"
                />

                <div className="w-full md:w-1/8 px-1 flex justify-end items-end mt-1">
                  <Button
                    type="submit"
                    disabled={loadingAddProduct}
                    className="bg-accent rounded-lg"
                  >
                    {loadingAddProduct ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      'Adicionar'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </section>

          <section className="space-y-4 mb-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </section>
        </>
      )}

      <footer className="fixed bottom-0 left-0 w-full flex items-center justify-center">
        Developed with 🧐 by Warley Soares.
      </footer>
    </main>
  );
}
