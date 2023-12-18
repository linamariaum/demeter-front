import React, { useEffect, useState } from 'react';
import { useProductCategories } from '../Context/ProductCategoriesContext.jsx';
import { useProduct } from '../Context/ProductContext.jsx';
import { useSaleContext } from '../Context/SaleContext.jsx';
import Bill from './Bill_Sale.jsx';
import Edit_Bill from './EditSale.jsx';

function Sales() {
    const { ProductCategories, fetchProductCategories } = useProductCategories();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { fetchProduct } = useProduct();
    const [selectedCategoryName, setSelectedCategoryName] = useState({});
    const [categoryImages, setCategoryImages] = useState({});
    const [productNames, setProductNames] = useState({});
    const { Sale, CreateDetail, getDetailsSale, Count, total, fetchSales, Sales, addnewDetail, newDetails, setNewCost, newCost, action } = useSaleContext();
    const [newSaleID, setNewSaleID] =useState()
    useEffect(() => {
        fetchProductCategories();
        
        if (Sales.length > 0 && action == 1) {
            setNewSaleID((Sales[Sales.length - 1].ID_Sale) + 1);
        }
        else if(action == 2){
            setNewSaleID(Sale.ID_Sale)

        }
        else{
            setNewSaleID(1);
        }
        
    }, []);
    const handleCategoryChange = (event) => {
        const newCategoryID = event.target.value;

        if (selectedCategories.includes(newCategoryID)) {
            const updatedCategories = selectedCategories.filter(
                (category) => category !== newCategoryID
            );
            setSelectedCategories(updatedCategories);
            const updatedCategoryImages = { ...categoryImages };
            const updatedProductNames = { ...productNames };
            delete updatedCategoryImages[newCategoryID];
            delete updatedProductNames[newCategoryID];
            setCategoryImages(updatedCategoryImages);
            setProductNames(updatedProductNames);
        } else {
            setSelectedCategories([...selectedCategories, newCategoryID]);
            setSelectedCategory(newCategoryID);
            setSelectedCategoryName({ ...selectedCategoryName, [newCategoryID]: event.target.options[event.target.selectedIndex].text });
            fetchProductsForCategory(newCategoryID);
        }

        
    };

    useEffect(() => {
        if (selectedCategory) {
            const selectElement = document.getElementById('categorias');
            selectElement.value = selectedCategory;
        }
    }, [selectedCategory]);

    const fetchProductsForCategory = (categoryID) => {
        fetchProduct(categoryID)
            .then(data => {
                const images = data.map(product => product.Image);
                const names = data.map(product => product.Name_Products);
                setCategoryImages({ ...categoryImages, [categoryID]: images });
                setProductNames({ ...productNames, [categoryID]: names });
            })
            .catch(error => {
                console.error('Error al cargar productos:', error);
            });
    };

    const detail = ( ID_Product) =>{
        const data = {
            Sale_ID : newSaleID,
            Product_ID : ID_Product,
            Lot: 1
        }
        addnewDetail(data)
        
    }
    const handleImageClick = async (categoryID, imageIndex) => {
        
    
        try {
            const data = await fetchProduct(categoryID);
            const selectedProductID = data[imageIndex].ID_Product;
            detail(selectedProductID);
        } catch (error) {
            console.error('Error al cargar productos o detalles:', error);
        }
        setSelectedCategory('');
        console.log(newDetails)
    };
    
    
    return (
        <div className=" ">
            <h1 className="text-3xl font-bold mb-4">Ventas 1.0 </h1>
            <div className='flex flex-grid'>
                <div className="w-[100vh] min-h-[87vh] ml-[30vh]">
                    <div className="float-left mt-[3vh]">
                        <label htmlFor="categorias" className="text-lg font-medium text-gray-700">Seleccione categorías: </label>
                        <select
                            id="categorias"
                            name="categorias"
                            className="w-[20vh] h-[1vh]p-2 mt-1 rounded-md border border-orange-300 shadow-sm focus:ring-orange-500 focus:border-orange-500"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                        >
                            {ProductCategories.map(category => (
                                <option key={category.ID_ProductCategory} value={category.ID_ProductCategory}>
                                    {category.Name_ProductCategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    {selectedCategories.map((categoryID, index) => (
                        <div key={index}>
                            <h1 className="text-3xl font-bold mb-4 mt-[10vh]">
                                {selectedCategoryName[categoryID]}
                            </h1>
                            <div className="images flex flex-grid">
                                {categoryImages[categoryID] && categoryImages[categoryID].map((image, imageIndex) => (
                                    <button
                                        key={imageIndex}
                                        className='pl-[3vh] transform transition-transform hover:scale-105'
                                        onClick={() => handleImageClick(categoryID, imageIndex)}
                                    >
                                        <img
                                            src={image}
                                            alt=""
                                            className='h-[3vh] cursor-pointer'
                                        />
                                        <p className="text-lg font-semibold text-orange-600">{productNames[categoryID][imageIndex]}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="contenedor derecho w-[50vh] bg-gray-200 border border-gray-400 rounded-lg h-[60vh] shadow-lg relative mt-[10vh]">
                    <div className="h-full w-full overflow-hidden">
                    
                    {action === 1 ? <Bill /> : action === 2 ? <Edit_Bill /> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sales;