import ProductPanel from "./productPanel";
import ProductGrid from "./productGrid";
import SalesChart from "./salesChart";
import './App.css'
import CategoriesChart from "./categoriesChart";
import { RetrieveProduct } from './retrieve-product.dto';
import { useEffect, useState } from "react";
import { createProductRequest, deleteProductById, editProductById, retrieveProductById, retrieveProductsArray } from "./api";
import { CategoryAmount } from "./category-data.dto";
import { CreateProduct } from "./create-product.dto";
import { generateSalesData } from "./auxFunctions";


function generateColorPalette(size:number, baseHue = Math.random() * 360, saturation = 75, lightness = 60, alpha = 1) {
  const colors = [];
  const hueIncrement = 360 / size;

  for (let i = 0; i < size; i++) {
    const hue = (baseHue + i * hueIncrement) % 360;
    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    colors.push(color);
  }

  return colors;
}

function randomColor(baseHue = Math.random() * 360, saturation = 75, lightness = 60, alpha = 1) {
  const color = `hsla(${baseHue}, ${saturation}%, ${lightness}%, ${alpha})`;
  return color;
}

function App() {
  interface productsState {
    selectedProduct: string, 
    selectedCategory: string,
    productsGridContent:  RetrieveProduct[],
    categories: CategoryAmount[],
    categoryColors: string[],
    selectedProductData: RetrieveProduct, 
  }
  const [state, setState] = useState<productsState>({
    selectedProduct: "", 
    selectedCategory: "",
    productsGridContent:  [],
    categories: [],
    categoryColors: [],
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

await retrieveProductsArray().then((productsArray) => {
  setState((prevState) => {
    let totalProducts = 0;
    let returnArray: CategoryAmount[] = [];

    productsArray.forEach((product) => {
      totalProducts++;

      if (returnArray.some((item) => item.category === product.category)) {
        returnArray = returnArray.map((item) =>
          item.category === product.category
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      } else {
        returnArray.push({ category: product.category, amount: 1 });
      }
    });

    return {
      ...prevState,
      productsGridContent: [...productsArray],
      categories: returnArray,
      categoryColors: prevState.categories.length === returnArray.length ? [...prevState.categoryColors] : generateColorPalette(returnArray.length),
      selectedProductData: {
        _id: "",
        name: "",
        description: "",
        category: "",
        stock: 0,
        monthlySales: [],
        image: "",
      },
    };
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
        const allProductsArray = await retrieveProductsArray();
        const indexToEdit = allProductsArray.findIndex(product => product._id === state.selectedProductData._id);
        const updatedProducts = [...allProductsArray];
        updatedProducts[indexToEdit] = {...updatedProducts[indexToEdit],
          name: productData.name,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          image: productData.image,
        }
        
        let totalProducts = 0;
        let returnArray: CategoryAmount[] = [];

        updatedProducts.forEach((product) => {
        totalProducts++;

        console.log("updatedProducts: ",updatedProducts);

        if (returnArray.some((item) => item.category === product.category)) {
          returnArray = returnArray.map((item) =>
            item.category === product.category
              ? { ...item, amount: item.amount + 1 }
              : item
          );
        } else {
          returnArray.push({ category: product.category, amount: 1 });
        }

        });

        console.log("categories: ",returnArray);

        setState((prevState) => ({
          ...prevState,
          selectedProductData: {
            _id: "",
            name: "",
            description: "",
            category: "",
            stock: 0,
            monthlySales: [],
            image: "",
          },
          productsGridContent: [...updatedProducts],
          categories: returnArray,
          categoryColors: prevState.categories.length < returnArray.length ? [...state.categoryColors, randomColor()] : [...state.categoryColors],
        }));

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
                    description: productData.description || "",
                    stock: productData.stock,
                    monthlySales: [...productData.monthlySales],
                    image: productData.image || "", 
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
        <div className="categoriesContainer">
          <CategoriesChart selectedCategory={ handleSelectedCategory} categoryChartData={ state.categories } categoryChartColors={ state.categoryColors }/>
          <button className="resetCategoryToAll" onClick={ handleCategoryReset } >SHOW ALL CATEGORIES</button>
        </div>
        <div className="salesContainer">
          { state.selectedProductData._id !== "" ? <SalesChart salesChartData={ state.selectedProductData.monthlySales }/> : <p>Select a product</p>}
        </div>
      </div>
      <div className="gridAndPanelDivMobile">
        <ProductGrid productClicked={ handleProductClicked } gridContent={ state.productsGridContent }/>
        <ProductPanel deleteProduct={ handleDelete } unselectProduct={ handleUnselectProduct } sendData={ handlePanelData } panelData={ state.selectedProductData }/>
      </div>
    </div>
  )
}

export default App;