import ProductPanel from "./productPanel";
import ProductGrid from "./productGrid";
import SalesChart from "./salesChart";
import './App.css'
import { SalesChartSampleData, CategoriesChartSampleData } from "./chartSampleData"
import CategoriesChart from "./categoriesChart";
import { RetrieveProduct } from './retrieve-product.dto';
import { useEffect, useState } from "react";
import { createProductRequest, deleteProductById, editProductById, retrieveProductById, retrieveProductsArray } from "./api";
import { CategoryAmount } from "./category-data.dto";
import { CreateProduct } from "./create-product.dto";
import { generateSalesData } from "./auxFunctions";


function App() {
  interface productsState {
    selectedProduct: string, //activa el modo de edicion, activa el display de sales (pseudo bool: "productid" : "" )
    selectedCategory: string, //activa el filtrar el product grid (pseudo bool: "category" : "" )
    productsGridContent:  RetrieveProduct[], //debo guardarlo filtrado por categoria, depende de selectedCategory
    categories: CategoryAmount[],
    selectedProductData: RetrieveProduct,  //debo guardarlo con los datos del producto con id selectedProduct
  }
  const [state, setState] = useState<productsState>({
    selectedProduct: "", 
    selectedCategory: "",
    productsGridContent:  [],
    categories: [],
    selectedProductData: {
      _id: "",
      name: "",
      description: "",
      category: "",
      stock: 0,
      monthlySales: [],
      image: "",
    },
  });

  const refreshPanelAndCategories = async () => {

    await retrieveProductsArray().then((productsArray)=>{
          let totalProducts: number = 0;
          let returnArray: CategoryAmount[] = [];
          productsArray.forEach((product)=>{
            totalProducts++;
            if (returnArray.some((item) => item.category === product.category)){

              returnArray = returnArray.map((item) =>
                item.category === product.category
                ? { ...item, amount: item.amount + 1 }
                : item
              )
            }else{
              returnArray.push({category:product.category,amount:1});
            } 
          });
          setState({...state, productsGridContent: [...productsArray], categories : returnArray, selectedProductData: {
                                                                                                                        _id: "",
                                                                                                                        name: "",
                                                                                                                        description: "",
                                                                                                                        category: "",
                                                                                                                        stock: 0,
                                                                                                                        monthlySales: [],
                                                                                                                        image: "",
                                                                                                                      }
          });
    });

  }

  useEffect(()=>{

    refreshPanelAndCategories();

    },[])

  
  const handleUnselectProduct = () => {
    setState({...state, selectedProductData : {
      _id: "",
      name: "",
      description: "",
      category: "",
      stock: 0,
      monthlySales: [],
      image: "",
    }})
  }

  const handleDelete = async () => {
    await deleteProductById(state.selectedProductData._id);
    const indexToDelete = state.productsGridContent.findIndex(product => product._id === state.selectedProductData._id);
    const updatedArray = [...state.productsGridContent];
    const updatedCategories = [...state.categories];
    const indexToEditCategory = updatedCategories.findIndex((elem) => elem.category === state.selectedProductData.category);
    if(updatedCategories[indexToEditCategory].amount > 1){
      updatedCategories[indexToEditCategory].amount = updatedCategories[indexToEditCategory].amount - 1;
    }else{
      updatedCategories.splice(indexToEditCategory,1);
    }
    updatedArray.splice(indexToDelete,1);
    setState({...state, selectedProductData : {
      _id: "",
      name: "",
      description: "",
      category: "",
      stock: 0,
      monthlySales: [],
      image: "",
    },
      productsGridContent : [...updatedArray],
      categories : [...updatedCategories],
    })
  }

  const handlePanelData = async ( productData:CreateProduct ) => {

    if( state.selectedProductData._id === ""){

      const productDataWithSalesData: CreateProduct = {...productData,monthlySales:generateSalesData()};

      console.log(productDataWithSalesData);

      await createProductRequest(productDataWithSalesData).then(async ()=>{
      refreshPanelAndCategories();

      });
    }else{

      await editProductById( state.selectedProductData._id, productData ).then(async ()=>{
        const indexToEdit = state.productsGridContent.findIndex(product => product._id === state.selectedProductData._id);
        const updatedProducts = [...state.productsGridContent];
        updatedProducts[indexToEdit] = {...updatedProducts[indexToEdit],
          name: productData.name,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          image: productData.image,
        }
        
        setState({...state, selectedProductData : {
                                _id: "",
                                name: "",
                                description: "",
                                category: "",
                                stock: 0,
                                monthlySales: [],
                                image: "",
                            },
                                productsGridContent: [...updatedProducts]
                            })

      })

    }

  }

const handleProductClicked = async (productId: string) => {
    await retrieveProductById(productId).then((productData) => {
        if (productData) {
            setState({
                ...state,
                selectedProductData: {
                    _id: productData._id,
                    name: productData.name,
                    category: productData.category,
                    description: productData.description || "", // Provide a default value if description is undefined
                    stock: productData.stock,
                    monthlySales: [...productData.monthlySales],
                    image: productData.image || "", // Provide a default value if image is undefined
                },
            });
        }
    });
};

  const handleSelectedCategory = async (category:string) => {
    const allProductsArray = await retrieveProductsArray();
    setState({...state, productsGridContent: allProductsArray.filter((product) => product.category === category)})
  }

  const handleCategoryReset = async () => {
    const allProductsArray = await retrieveProductsArray();
     setState({...state, productsGridContent: [...allProductsArray] })
  }

  return (
    <div className="container">
      <div className="chartsContainer">
        <CategoriesChart selectedCategory={ handleSelectedCategory} categoryChartData={ state.categories }/>
        <button className="resetCategoryToAll" onClick={ handleCategoryReset } >Show All Products</button>
        <SalesChart salesChartData={ state.selectedProductData.monthlySales }/>
      </div>
      <ProductGrid productClicked={ handleProductClicked } gridContent={ state.productsGridContent }/>
      <ProductPanel deleteProduct={ handleDelete} unselectProduct={ handleUnselectProduct } sendData={ handlePanelData } panelData={ state.selectedProductData }/>
    </div>
  )
}

export default App;