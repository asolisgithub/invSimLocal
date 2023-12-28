import { RetrieveProduct } from './retrieve-product.dto';
import { CreateProduct } from './create-product.dto';

const STORAGE_KEY = 'products';

const readDataFromLocalStorage = (): Promise<RetrieveProduct[]> => {
    return new Promise((resolve) => {

        const data = localStorage.getItem(STORAGE_KEY);
        resolve(data ? JSON.parse(data) : []); //si la coleccion es un array con cosas lo carga, sino  la coleccion es un array vacio y se inicia un array vacio

    });
};

const writeDataToLocalStorage = (data: RetrieveProduct[]): Promise<void> => {
    return new Promise((resolve) => {
            const jsonData = JSON.stringify(data); //convierte la data a json 
            localStorage.setItem(STORAGE_KEY, jsonData);
            resolve();
       
    });
};

export const createProductRequest = (product: CreateProduct): Promise<void> => {
    return new Promise(async (resolve) => {
        const products = await readDataFromLocalStorage();
        products.push({
            _id: Date.now().toString(),
            ...product,
            image: product.image || '', 
            monthlySales: product.monthlySales || [],
        });
        await writeDataToLocalStorage(products);
        resolve();
    });
};

export const retrieveProductsArray = (): Promise<RetrieveProduct[]> => {
    return readDataFromLocalStorage();
};

export const retrieveProductById = (id: string): Promise<RetrieveProduct | undefined> => {
    return new Promise(async (resolve) => {
        const products = await readDataFromLocalStorage();
        resolve(products.find((product) => product._id === id));
    });
};

export const editProductById = (id: string, body: CreateProduct): Promise<RetrieveProduct | null> => {
    return new Promise(async (resolve) => {
        const products = await readDataFromLocalStorage();
        const index = products.findIndex((product) => product._id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...body };
            await writeDataToLocalStorage(products);
            resolve(products[index]);
        } else {
            resolve(null);
        }
    });
};

export const deleteProductById = (id: string): Promise<void> => {
    return new Promise(async (resolve) => {
        const products = await readDataFromLocalStorage();
        const updatedProducts = products.filter((product) => product._id !== id);
        await writeDataToLocalStorage(updatedProducts);
        resolve();
    });
};