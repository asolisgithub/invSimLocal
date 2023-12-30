import './productGrid.css'

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
                    {product.image && <img className="productImage" src={product.image}/>}
                    <p><span className='attributeDecorator'>ID</span> {product._id}</p>
                    <p><span className='attributeDecorator'>Name</span> {product.name}</p>
                    <p><span className='attributeDecorator'>Stock</span> {product.stock}</p>
                </div>
            ))}
        </div>
    )
}
export default ProductGrid;