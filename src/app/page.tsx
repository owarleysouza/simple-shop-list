'use client';

import ProductCard from '@/components/ProductCard';

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

const formSchema = z.object({
  name: z.string().min(2).max(30),
  quantity: z.coerce
    .number({ message: 'Quantidade inválida' })
    .int()
    .positive({ message: 'Quantidade precisa ser positiva' }),
  unity: z.enum(['Un.', 'Kg', 'L']),
  category: z.string(),
});

import { db } from '@/lib/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { Product } from '@/types/Product';
import { useEffect, useState } from 'react';
import LoadingComponent from '@/components/commom/Loading';
import { LoaderCircle } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { products, addProduct } = useProductStore();
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingAddProduct, setLoadingAddProduct] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      unity: 'Un.',
      category: 'bakery',
    },
  });

  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoadingAddProduct(true);
    const newProduct = {
      ...values,
      checked: false,
    };

    const userId = getOrCreateUserId();

    try {
      const { id } = await addDoc(collection(db, 'products'), {
        ...newProduct,
        userId,
      });

      addProduct({ ...newProduct, id: id });
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado aconteceu',
        description: 'Um erro inesperado aconteceu ao adicionar o produto',
      });
      console.error(error);
    } finally {
      setLoadingAddProduct(false);
    }
  }

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

      productSnapshot.docs.map((doc) => {
        const product: Product = {
          id: doc.id,
          name: doc.data().name,
          category: doc.data().category,
          quantity: doc.data().quantity,
          unity: doc.data().unity,
          checked: doc.data().checked,
        };
        addProduct(product);
      });

      setLoadingProducts(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ops! Algo de errado aconteceu',
        description: 'Um erro inesperado aconteceu ao carregar os produtos',
      });
      console.error(error);
    }
  }

  useEffect(() => {
    getProductsByUser();
  }, []);

  return (
    <main className="min-h-screen bg-mysecondary lg:px-64 md:px-32 px-8 py-6">
      <header className="mb-2">
        <h1 className="text-3xl text-myprimary font-bold">Lista de Compras</h1>
      </header>

      {loadingProducts ? (
        <LoadingComponent />
      ) : (
        <>
          <section className="py-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-wrap items-end justify-center gap-4"
                aria-label="Formulário de adição de produtos"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-1/3 min-w-[150px]">
                      <FormLabel htmlFor="product-name">Item</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="product-name"
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-1">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormLabel htmlFor="product-quantity">
                          Quantidade
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            id="product-quantity"
                            className="w-full"
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
                      <FormItem className="w-20">
                        <FormLabel htmlFor="product-unity">Unidade</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl className="bg-mywhite">
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
                    <FormItem className="w-1/4 min-w-[150px]">
                      <FormLabel htmlFor="product-category">
                        Categoria
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl className="bg-mywhite">
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

                <Button
                  type="submit"
                  disabled={loadingAddProduct}
                  className="bg-myaccent px-4 rounded-lg"
                >
                  {loadingAddProduct ? (
                    <LoaderCircle className="animate-spin w-[60px]" />
                  ) : (
                    'Adicionar'
                  )}
                </Button>
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

      <footer className="fixed bottom-0 left-0 w-full flex flex-wrap items-center justify-center">
        Developed with 🧐 by Warley Soares.
      </footer>
    </main>
  );
}
