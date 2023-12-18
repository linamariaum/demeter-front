import React from 'react';

import { createContext, useState, useContext } from 'react'
import { getProducts, getAllProduct } from '../Api/product.request.js'

export const ProductContext = createContext();

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error("El useUser debe usarse dentro de ProductProvider")
    }
    return context;
}

export const ProductProvider = ({ children }) => {

    const [Products, setProducts] = useState([]);
    const [Product, setProduct] = useState([]);
    const [AllProducts, setAllProducts] = useState([]);


    const fetchProduct = async (id) => {
        try {
            const res = await getProducts(id);
            return(res.data)
        } catch (error) {
            console.log(error)
        }
    }


    const getProduct = async (id) => {
        try {
            const res = await getProduct(id);
            setProduct(res.data)
        } catch (error) {
            console.log(error)
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
        <ProductContext.Provider
            value={{
                Product,
                Products,
                AllProducts,
                fetchProduct,
                getProduct,
                getwholeProducts    
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};