import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSaleContext } from '../Context/SaleContext';
import { useProduct } from '../Context/ProductContext';
import { IoIosAdd } from 'react-icons/io';
import { AiOutlineMinus } from 'react-icons/ai';
import { useUser } from "../Context/User.context.jsx";
function Bill() {
    const { Create, Sale, getDetailsSale, details, Count, fetchGain, total, newDetails, Sales, setnewDetails, createManyDetails, setNewCost, CancelDet, deleteDetail } = useSaleContext();
    const { getwholeProducts, AllProducts } = useProduct();
    const [newSaleID, setNewSaleID] = useState();
    const [salemss, Setsalemss] = useState();
    const forceUpdate = useForceUpdate();
    const { user, getWaiters, toggleUserStatus } = useUser();
    const [waiters, setWaiters] = useState([]);
    const [selectedWaiter, setSelectedWaiter] = useState("11");

    const CreateSale = () => {
        if (newDetails.length > 0) {
            Create(selectedWaiter).then(createManyDetails(newDetails));
            Setsalemss("Generado correctamente");
            createManyDetails([]); // Limpiar la lista de detalles después de generar la orden
        } else {
            Setsalemss("No puedes Generar");
        }
    }
    const removeDetail = (index) => {
        const updatedDetails = [...newDetails];
        updatedDetails.splice(index, 1);
        setnewDetails(updatedDetails);
    };

    useEffect(() => {
        getwholeProducts();
        getWaiters();
    }, []);
    useEffect(() => {
        // Mapear la lista de usuarios para obtener nombres y crear las opciones del select
        const waiterOptions = user.map((userData) => (
          <option key={userData.ID_User} value={userData.ID_User}>
            {userData.Name_User} {userData.LastName_User}
          </option>
        ));
    
        setWaiters(waiterOptions);
      }, [user]);

    useEffect(() => {
        if (Sales.length > 0) {
            setNewSaleID((Sales[Sales.length - 1].ID_Sale) + 1);
        } else {
            setNewSaleID(1);
        }
        const subtotal = newDetails.reduce((acc, item) => {
            const product = AllProducts.find(product => product.ID_Product === item.Product_ID);
            return acc + (product.Price_Product * item.Lot);
        }, 0);
        fetchGain(subtotal);
    }, [newDetails, AllProducts, Sales]);

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

    const updateTotal = () => {
            const newTotal = newDetails.reduce((acc, item) => {
                const product = AllProducts.find(product => product.ID_Product === item.Product_ID);
                return acc + (product.Price_Product * item.Lot);
        }, 0);
        fetchGain(newTotal);
    }
    const handleWaiterChange = (event) => {
        const selectedWaiterValue = event.target.value;
        setSelectedWaiter(selectedWaiterValue);
        console.log(selectedWaiter)
        
      };

    return (
        <div className="relative text-center h-full w-full flex flex-col mt-[3vh] items-center">
            <form className="mt-4">
                <h2 className="text-xl font-bold mb-2">Orden {newSaleID}</h2>
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
                        value={selectedWaiter}
                        onChange={handleWaiterChange}
                    >
                       {waiters}
                    </select>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-xl">
                        <thead>
                            <tr>
                                <th className="">Producto</th>
                                <th className="p-1">Cantidad</th>
                                <th className="p-1">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {newDetails.map((item, index) => (
                                <tr key={index}>
                                    <td className="p-1">
                                        + {AllProducts.find(product => product.ID_Product === item.Product_ID).Name_Products}
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
                                    <td className="p-1 cursor-pointer" onClick={() => removeDetail(index)}>
                                        X
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mb-4 p-3">
                    <p>Total: {total}</p>
                </div>
            </form>

            <div className="buttons flex-row space-x-[3vh]">
                <Link to='/sale'>
                    <button
                        className="bg-orange-500 text-white py-2 px-4 rounded"
                        onClick={CreateSale}
                    >
                        Generar orden
                    </button>
                </Link>

                <Link to='/sale'>
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded"
                    >
                        Cancelar Venta
                    </button>
                </Link>
            </div>
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

export default Bill;
