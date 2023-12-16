import { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";
import { getCategory_suppliesRequest, getOne_Category_suppliesRequest, createCategory_suppliesRequest, disableCategory_suppliesRequest, updateCategory_suppliesRequest, deleteCategory_suppliesRequest } from "../Api/SuppliesCategory.request";

const CategorySuppliesContext = createContext();

export const useCategorySupplies = () => {
    const context = useContext(CategorySuppliesContext);

    if (!context)
        throw new Error("Ha ocurrido un error con el uso del contexto de categoria de insumos");

    return context;
}

export function CategorySupplies({ children }) {
    const [Category_supplies, setCategory_supplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useLayoutEffect(() => {
        const storedCategories = localStorage.getItem("categories");
        if (storedCategories) {
            setCategory_supplies(JSON.parse(storedCategories));
            setLoading(false); 
        } else {
            loadCategorySupplies();
        }
    }, []);

    const getCategory_supplies = async () => {
        try {
            const res = await getCategory_suppliesRequest();
            setCategory_supplies(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const getOneCategory_supplies = async (id) => {
        try {
            const res = await getOne_Category_suppliesRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    const loadCategorySupplies = async () => {
        try {
            const res = await getCategory_suppliesRequest();
            setCategory_supplies(res.data);
            setLoading(false); 
        } catch (error) {
            console.error(error);
            setLoading(false); 
        }
    }

    const createCategory_supplies = async (category) => {
        const res = await createCategory_suppliesRequest(category);
        getCategory_supplies();
    }

    const toggleCategorySupplyStatus = async (id) => {
        try {
            const res = await disableCategory_suppliesRequest(id);

            if (res.status === 200) {
                setCategory_supplies((prevcategorySupplies) =>
                    prevcategorySupplies.map((category) =>
                        category.ID_SuppliesCategory === id ? { ...category, State: !category.State } : category
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateCategory_supplies = async (id, category) => {
        try {
            await updateCategory_suppliesRequest(id, category);
            getCategory_supplies();
        } catch (error) {
            console.error(error);
        }
    }

    const deleteCategory_supplies = async (id) => {
        try {
            const res = await deleteCategory_suppliesRequest(id)
            if (res.status === 204) setCategory_supplies(Category_supplies.filter(category => category.ID_SuppliesCategory !== id))
        } catch (error) {
            console.log(error);
        }

    }

    return (
        <CategorySuppliesContext.Provider value={{
            Category_supplies,
            getCategory_supplies,
            getOneCategory_supplies,
            loadCategorySupplies,
            createCategory_supplies,
            toggleCategorySupplyStatus,
            updateCategory_supplies,
            deleteCategory_supplies
        }}>
            {children}
        </CategorySuppliesContext.Provider>
    );
}