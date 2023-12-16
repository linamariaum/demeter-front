import React from 'react'
import { useNavigate } from 'react-router-dom';

function Instruction() {

    const navigate = useNavigate();
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
                                            <h5>Manuales</h5>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-3 px-5">
                                            <h4>Configuracion</h4>
                                            <button
                                                onClick={() => {
                                                    navigate('/');
                                                }}
                                                className="pc-link btn btn-outline-dark"
                                            >
                                                Manual
                                            </button>
                                        </div>
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

export default Instruction;