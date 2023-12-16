import { createContext, useContext, useState } from "react";
import { getProductsRequest, getProductByCategoryRequest, createProductsRequest, statusProductsRequest, updateProductsRequest, deleteProductsRequest, getProductByIdRequest } from "../Api/Product.request.js"
import { getProductSale, getAllProduct, getDetailProductRequest, getDetailProductRequest2, createDetailPRequest, deleteDetailProductRequest } from "../Api/Product.request.js" //Detalles
import useLocaStorage from "../hooks/useLocaStorage.jsx";

const ProductContext = createContext();

export const useProduct = () => {
    const context = useContext(ProductContext);

    if (!context)
        throw new Error("Ha ocurrido un error con el uso del contexto de los insumos");

    return context;
}

export function Product({ children }) {
    const [product, setProduct] = useState([]);
    const [detailP, setDetailP] = useState([]);
    const [Products, setProducts] = useState([]);
    const [Product, setproduct] = useState([]);
    const [AllProducts, setAllProducts] = useState([]);
    const [CurrentProd, setCurrentProd] = useLocaStorage("currentProd", null);


    const getCurrentProduct = (id) => {
        try {
            setCurrentProd(id)
        } catch (error) {
            console.error(error);
        }
    }

    const getProducts = async () => {
        try {
            const res = await getProductsRequest();
            setProduct(res.data);

        } catch (error) {
            console.error(error);
        }
    }

    const getProductByCategory = async (id) => {
        try {
            const res = await getProductByCategoryRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const createProduct = async (products) => {
        try {
            const res = await createProductsRequest(products);
            getProducts(res);
        } catch (error) {
            console.error(error);
        }
    }

    const toggleProducStatus = async (id) => {
        try {
            const res = await statusProductsRequest(id);

            if (res.status === 200) {
                setProduct((prevProduct) =>
                    prevProduct.map((products) =>
                        products.ID_Product === id ? { ...products, State: !products.State } : products
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateProduct = async (id, product) => {
        try {
            await updateProductsRequest(id, product);
            getProducts();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteProduct = async (id) => {
        try {
            const res = await deleteProductsRequest(id)
            if (res.status === 204)
                setProduct(product.filter(product => product.ID_Product !== id))
        } catch (error) {
            console.log(error);
        }
    }

    // Detalles

    const getDetailProduct = async (id) => {
        try {
            const res = await getDetailProductRequest(id);
            setDetailP(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getDetailProduct2 = async (id) => {
        try {
            const res = await getDetailProductRequest2(id);
            return res;
        } catch (error) {
            console.error(error);
        }
    }

    const createDetailP = async (datilsP) => {
        try {
            await createDetailPRequest(datilsP);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteDetailProduct = async (id) => {
        try {
            const res = await deleteDetailProductRequest(id)
            if (res.status === 204)
                setDetailP(detailP.filter(detail => detail.ID_ProductDetail !== id))
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProduct = async (id) => {
        try {
            const res = await getProductSale(id);
            return (res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getProduct = async (id) => {
        try {
            const res = await getProduct(id);
            setproduct(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getProductById = async (id) => {
        try {
            const res = await getProductByIdRequest(id);
            console.log("res2", res)
            return res.data
        } catch (error) {
            console.log("error", error.message)
            return {}
        }
    }

    const getwholeProducts = async () => {
        try {
            const res = await getAllProduct();
            setAllProducts(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <ProductContext.Provider value={{
            product,
            getProducts,
            getProductByCategory,
            createProduct,
            toggleProducStatus,
            updateProduct,
            deleteProduct,
            getCurrentProduct,
            // Datalles
            getDetailProduct,
            createDetailP,
            getDetailProduct2,
            detailP,
            deleteDetailProduct,
            Product,
            Products,
            AllProducts,
            CurrentProd,
            fetchProduct,
            getProduct,
            getwholeProducts,
            getProductById
        }}>
            {children}
        </ProductContext.Provider>
    );
}