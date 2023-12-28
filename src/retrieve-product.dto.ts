export interface MonthlySale {
    year: number,
    month: number,
    sales: number,
}

export interface RetrieveProduct {
    _id: string,
    name: string,
    description?: string,
    category: string,
    stock: number
    monthlySales: MonthlySale[];
    image: string | undefined,
}