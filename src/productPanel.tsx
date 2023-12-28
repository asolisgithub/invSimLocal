import './productPanel.css'
import { CreateProduct } from './create-product.dto';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { createProductRequest, deleteProductById } from './api';
import { generateSalesData } from './auxFunctions';



interface ProductPanelProps {
    sendData: (data: CreateProduct) => void;
    unselectProduct: () => void;
    panelData: CreateProduct;
    deleteProduct: () => void;
}

function ProductPanel( {sendData, panelData, unselectProduct, deleteProduct} : ProductPanelProps ) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [product, setProduct] = useState<CreateProduct>({
        name: panelData.name,
        description: panelData.description,
        category: panelData.category,
        stock: panelData.stock,
        image: panelData.image,
    });

    useEffect(() => {
        setProduct({
            name: panelData.name,
            description: panelData.description,
            category: panelData.category,
            stock: panelData.stock,
            image: panelData.image,
        });
    }, [panelData]);

    const handleChange = (e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
        setProduct({...product, [e.target.name] : e.target.value });
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if((product.name!=="")&&(product.category!=="")){
            sendData(product);
            if (fileInputRef.current) { //se limpia el img uploader
            fileInputRef.current.value = '';
        }
        }
    }

    const handleUnselect = () => {
        unselectProduct();
    }

    const handleDelete = () => {
        deleteProduct();
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            const reader = new FileReader();
            reader.onloadend = () =>  {
                const base64Data = reader.result as string;
                setProduct({...product, image : base64Data})
            }
            reader.readAsDataURL(file);

        }
    }

    return(
        <div className="panelContainer">
            <form onSubmit={handleSubmit} action="">

                {product.image && <img className="previewImage" src={product.image}/>}

                <div className="inputContainer">
                <span>Product Image</span>
                <input ref={(input) => (fileInputRef.current = input)} onChange={handleImageUpload} className="formInput" type="file" accept="image/*" name="image"/>
                </div>

                <div className="inputContainer">
                <span>Name</span>
                <input onChange={handleChange} className="formInput" type="text" name="name" value={product.name}/>
                </div>

                <div className="inputContainer">
                <span>Description</span>
                <textarea onChange={handleChange} className="formInput" name="description" rows={5} value={product.description}/>
                </div>

                <div className="inputContainer">
                <span>Category</span>
                <input onChange={handleChange} className="formInput" type="text" name="category" value={product.category}/>
                </div>

                <div className="inputContainer">
                <span>Stock</span>
                <input onChange={handleChange} className="formInput" type="number" name="stock" value={product.stock}/>
                </div>

                { panelData.name === "" ? <button>Save</button> : <div className="buttonContainer" ><button type="submit">Update</button><button onClick={handleUnselect}>Unselect</button><button onClick={handleDelete}>Delete</button></div> }
    

            </form>
        </div>
    )
}
export default ProductPanel;