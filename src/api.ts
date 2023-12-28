import { CreateProduct } from './create-product.dto'
import { RetrieveProduct } from './retrieve-product.dto';

const API = 'http://localhost:3000/products';

export const createProductRequest = (product: CreateProduct) =>
    fetch(API, {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
            'Content-Type': 'application/json'
        }
    });
export const retrieveProducts = () => fetch(API);
export const retrieveProductsArray = async(): Promise<RetrieveProduct[]> => {
    const response = await fetch(API);
    const data: RetrieveProduct[] = await response.json();
    return data;
}
export const retrieveProductById = async(id:string): Promise<RetrieveProduct> => {
    const response = await fetch(API+"/"+id);
    const data: RetrieveProduct = await response.json();
    return data;
}
export const editProductById = async(id:string,body:CreateProduct): Promise<RetrieveProduct> => {
    const response = await fetch(API+"/"+id, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data: RetrieveProduct = await response.json();
    return data;
}
export const deleteProductById = async(id:string) => {
    const response = await fetch(API+"/"+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = response.json();
    return data;
}