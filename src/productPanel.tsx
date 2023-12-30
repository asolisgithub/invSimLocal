import './productPanel.css'
import { CreateProduct } from './create-product.dto';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

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

    const handleCategoryChange = (e:ChangeEvent<HTMLInputElement>) => {
        setProduct({...product, category : e.target.value.toUpperCase()});
    }

    const handleNumberInputChange = (e:ChangeEvent<HTMLInputElement>) => {
        const isValidNumber = /^\d+$/.test(e.target.value);
        if(isValidNumber || parseInt(e.target.value,10) === 0){
            setProduct({...product, stock : parseInt(e.target.value,10) });
        }
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            if((product.name!=="")&&(product.category!=="")){
                sendData(product);
                if (fileInputRef.current) { 
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
                <span>Upload Image</span>
                <input ref={(input) => (fileInputRef.current = input)} onChange={handleImageUpload} className="imgUpload" type="file" accept="image/*" name="image"/>
                </div>

                <div className="inputContainer">
                <span>Name</span>
                <input onChange={handleChange} className="formInput" type="text" name="name" value={product.name}/>
                </div>

                <div className="textareaContainer">
                <span>Description</span>
                <textarea onChange={handleChange} className="descriptionInput" name="description" rows={5} value={product.description}/>
                </div>

                <div className="inputContainer">
                <span>Category</span>
                <input onChange={handleCategoryChange} className="formInput" type="text" name="category" value={product.category}/>
                </div>

                <div className="inputContainer">
                <span>Stock</span>
                <input onChange={handleNumberInputChange} className="formInput" type="number" name="stock" value={product.stock}/>
                </div>
                { panelData.name === "" ? <button className="saveButton" disabled={(product.name===""||product.category==="")}>SAVE</button> : <div className="buttonContainer" ><button className="updateButton" type="submit" disabled={(product.name===""||product.category==="")}>UPDATE</button><button className="unselectButton" onClick={handleUnselect}>UNSELECT</button><button className="deleteButton" onClick={handleDelete}>DELETE</button></div> }
    

            </form>
        </div>
    )
}
export default ProductPanel;