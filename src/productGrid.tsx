import './productGrid.css'
import { retrieveProducts } from './api'
import { RetrieveProduct } from './retrieve-product.dto';
import { useEffect, useState } from 'react';

interface ProductGridProps{
    gridContent: RetrieveProduct[];
    productClicked: (id: string) => void;
}

function ProductGrid({ gridContent, productClicked }: ProductGridProps) {
    const [products, setProducts] = useState<RetrieveProduct[]>(gridContent);
    const handleProductClick = (e: React.MouseEvent<HTMLDivElement>) => {
        productClicked(e.currentTarget.getAttribute('data-key') || '');
    }
    useEffect(()=>{
        setProducts([...gridContent]);
    },[gridContent]);
    return(
        <div className="gridContainer">
            {products.map((product)=>(
                <div className="productContainer" key={product._id} onClick={handleProductClick} data-key={product._id}>
                    {product.image && <img src={product.image}/>}
                    <p>ID: {product._id}</p>
                    <p>Name: {product.name}</p>
                    <p>Stock: {product.stock}</p>
                </div>
            ))}
        </div>
    )
}
export default ProductGrid;