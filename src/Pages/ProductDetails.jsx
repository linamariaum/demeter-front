import React from 'react'
import UpdateProduct from '../Components/UpdateProduct.jsx';
import CreateDetailProduct from '../Components/CreateDetailProduct.jsx';
import ViewDetailProduct from '../Components/ViewDetailProduct.jsx';
import { useProduct } from '../Context/Product.context.jsx'

export default function ProductDetails() {

    const { CurrentProd } = useProduct();

    return (
        <section className="pc-container">
            <div className="pcoded-content">
                <div className="row w-100">
                    <div className="col-md-12">
                        <div className=" w-100 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>PRODUCTO {CurrentProd}</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <UpdateProduct />
                                        </div>
                                        <div className="col-md-4">
                                            <CreateDetailProduct />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <ViewDetailProduct />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    )
}
