export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unity: "Un." | "Kg" | "L";
  checked: boolean;
}