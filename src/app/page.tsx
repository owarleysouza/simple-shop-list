'use client';

import ProductCard from '@/components/Product/ProductCard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useProductStore } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import LoadingComponent from '@/components/commom/Loading';
import { Product } from '@/types/Product';

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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full md:w-1/3 px-1 min-w-[150px] sm:w-full">
                      <FormLabel htmlFor="product-name">Item</FormLabel>
                      <FormControl className="bg-white">
                        <Input {...field} id="product-name" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-row md:w-1/3 px-1 w-full">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="product-quantity">
                          Quantidade
                        </FormLabel>
                        <FormControl className="bg-white">
                          <Input
                            {...field}
                            id="product-quantity"
                            type="number"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="product-unity">Unidade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="bg-white">
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma unidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Un.">Un.</SelectItem>
                            <SelectItem value="Kg">Kg</SelectItem>
                            <SelectItem value="L">Litro</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="md:w-1/3 px-1 w-full">
                      <FormLabel htmlFor="product-category">
                        Categoria
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="bg-white">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bakery">Padaria</SelectItem>
                          <SelectItem value="hortifruti">Hortifruti</SelectItem>
                          <SelectItem value="protein">Proteína</SelectItem>
                          <SelectItem value="beverage">Bebida</SelectItem>
                          <SelectItem value="grocery">Mercearia</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
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
