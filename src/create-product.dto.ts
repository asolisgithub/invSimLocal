import { MonthlySale } from "./retrieve-product.dto";
export interface CreateProduct {
    name: string,
    description?: string,
    category: string,
    stock: number
    image?: string,
    monthlySales?: MonthlySale[];
}