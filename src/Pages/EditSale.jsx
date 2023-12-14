import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSaleContext } from '../Context/SaleContext';
import { useProduct } from '../Context/ProductContext';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineMinus } from 'react-icons/ai';

function Edit_Bill() {
    const { Create, Sale, getDetailsSale, details, Count, fetchGain, total, newDetails, Sales, createManyDetails, setNewCost } = useSaleContext();
    const { getwholeProducts, AllProducts } = useProduct();
    const [newSaleID, setNewSaleID] = useState();
    const [salemss , Setsalemss] = useState();
    const forceUpdate = useForceUpdate(); 

    const CreateSale = () => {
        if(newDetails.length > 0){
            createManyDetails(newDetails);
            Count({
                ID_Sale : Sale.ID_Sale,
                Total : total,
                SubTotal : total
            })
            fetchGain(0)
        Setsalemss("Generado correctamente")
        }
        else{
            Setsalemss("No puedes Generar")
        }
    }
    useEffect(() => {
        getDetailsSale(Sale.ID_Sale);
    }, [Sale, newDetails]);

    useEffect(() => {
        getwholeProducts();
    }, []);

    useEffect(() => {
        if (Sales.length > 0) {
            setNewSaleID(Sale.ID_Sale);
        }
        else{
            setNewSaleID(1);
        }
        const subtotal = newDetails.reduce((acc, item) => {
            const product = AllProducts.find(product => product.ID_Product === item.Product_ID);
            return acc + (product.Price_Product * item.Lot);
        }, 0);
        const subtotal2 = details.reduce((acc, item) => {
            const product = AllProducts.find(product => product.ID_Product === item.Product_ID);
            return acc + (product.Price_Product * item.Lot);
        }, 0);
        fetchGain(subtotal + subtotal2);
        console.log(total)
    }, [newDetails]);

    const decreaseLot = (index) => {
        if (newDetails[index].Lot > 0) {
            newDetails[index].Lot -= 1;
            forceUpdate();
            updateTotal();
        }
    }

    const increaseLot = (index) => {
        newDetails[index].Lot += 1;
        forceUpdate();
        updateTotal();
    }

    // Función para actualizar el valor de total y llamar fetchGain
    const updateTotal = () => {
        const newTotal = newDetails.reduce((acc, item) => {
            const product = AllProducts.find(product => product.ID_Product === item.Product_ID);
            return acc + (product.Price_Product * item.Lot);
        }, 0);
        fetchGain(newTotal); // Llama a fetchGain con el nuevo valor de total
    }
    return (
        <div className="relative text-center h-full w-full flex flex-col mt-[3vh] items-center">
            <form className="mt-4">
                <h2 className="text-xl font-bold mb-2">Orden {Sale.ID_Sale}</h2>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-gray-600">Fecha:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        className="w-full p-2 border rounded-xl"
                        defaultValue={new Date().toISOString().substr(0, 10)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="waiter" className="block text-gray-600">Mesero:</label>
                    <select
                        id="waiter"
                        name="waiter"
                        className="w-full p-2 border rounded-xl"
                    >
                        <option value="mesero1">Mesero 1</option>
                        <option value="mesero2">Mesero 2</option>
                        <option value="mesero3">Mesero 3</option>
                    </select>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-xl">
                        <thead>
                            <tr>
                                <th className="">Producto</th>
                                <th className="p-1">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-1">
                                        {AllProducts.find(product => product.ID_Product === item.Product_ID).Name_Products}
                                    </td>
                                    <td className="flex flex-row items-center p-1 ml-[1vh]">
                                        <div className="lot-button cursor-pointer" onClick={() => decreaseLot(index)}>
                                            <AiOutlineMinus />
                                        </div>
                                        {item.Lot}
                                        <div className="lot-button cursor-pointer" onClick={() => increaseLot(index)}>
                                            <IoIosAdd />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {newDetails.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-1">
                                        {AllProducts.find(product => product.ID_Product === item.Product_ID).Name_Products}
                                    </td>
                                    <td className="flex flex-row items-center p-1 ml-[1vh]">
                                        <div className="lot-button cursor-pointer" onClick={() => decreaseLot(index)}>
                                            <AiOutlineMinus />
                                        </div>
                                        {item.Lot}
                                        <div className="lot-button cursor-pointer" onClick={() => increaseLot(index)}>
                                            <IoIosAdd />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-4">
                    <p>SubTotal: {(total)} Total: {total}</p>
                </div>
            </form>
            <Link to= '/sale'>
            <button
                className="bg-orange-500 text-white py-2 px-4 rounded"
                onClick={CreateSale}
            >
                Actualizar orden
            </button>
            </Link>
            <div>{salemss}</div>
        </div>
    );
}

function useForceUpdate() {
    const [, setTick] = useState(0);
    const update = () => {
        setTick((tick) => tick + 1);
    };
    return update;
}

export default Edit_Bill;