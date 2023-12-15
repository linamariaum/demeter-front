import React, { useState, useEffect } from 'react';
import { useProduct } from '../Context/Product.context.jsx';
import { AiFillDelete } from 'react-icons/ai';

function ViewDetailProduct() {

    const { getDetailProduct, detailP, deleteDetailProduct, CurrentProd } = useProduct();

    useEffect(() => {
        getDetailProduct(CurrentProd);
    }, []);

    // const detailsArray = Array.isArray(detailP) ? detailP : [];

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center">Insumo</th>
                        <th className="text-center">Cantidad</th>
                        <th className="text-center">Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {detailP.map((detail) => (
                        <tr key={detail.ID_ProductDetail}>
                            <td>{detail.Supply ? detail.Supply.Name_Supplies : ''}</td>
                            <td>{detail.Lot_ProductDetail} {detail.Supply.measure}</td>
                            <td>
                                <div style={{ display: "flex", alignItems: "center", padding: '3px' }}>
                                    <button
                                        onClick={() => deleteDetailProduct(detail)}
                                        className={`ml-1 btn btn-icon btn-danger`}
                                    >
                                        <AiFillDelete />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default ViewDetailProduct