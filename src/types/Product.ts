export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unity: "Un." | "Kg" | "L";
  checked: boolean;
}