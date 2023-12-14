import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Icons
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

// Diseño
import '../css/style.css'
import '../css/landing.css'

// Context
import { useUser } from '../Context/User.context.jsx';

// Componentes
import CreateWaiter from '../Components/CreateWaiter.jsx';
import UpdateWaiter from '../Components/UpdateWaiter.jsx';
import AuthorizationModal from '../Components/AuthorizationModal.jsx';

// Paginado
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function WaiterPage() {
    const { user, getWaiters, toggleUserStatus } = useUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [allWaiter, setAllWaiter] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [waiterToEdit, setWaiterToEdit] = useState(null);

    const [showEnabledOnly, setShowEnabledOnly] = useState(
        localStorage.getItem("showEnabledOnly") === "true"
    );
    const itemsForPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const users = await getWaiters();
                setAllWaiter(users);
            } catch (error) {
                console.error(error);
                console.log('Mostrar autenticacion useE', authorized);
            }
        };
        fetchData();
        setCurrentPage(1);
    }, [getWaiters]);


    const navigateToCreateWaiter = () => {
        setIsModalOpen(true);
    };

    const handleCreated = () => {
        getWaiters();
    };

    const handleEdit = (waiter) => {
        setWaiterToEdit(waiter);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        localStorage.setItem("showEnabledOnly", showEnabledOnly);
    }, [showEnabledOnly]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCheckboxChange = () => {
        setShowEnabledOnly(!showEnabledOnly);
    };

    const filteredWaiters = allWaiter.filter((waiter) => {
        const { Type_Document, Document, Name_User, LastName_User, Restaurant } = waiter;
        const searchString = `${Type_Document} ${Document} ${Name_User} ${LastName_User} ${Restaurant}`.toLowerCase();

        if (showEnabledOnly) {
            return waiter.State && searchString.includes(searchTerm.toLowerCase());
        }

        return searchString.includes(searchTerm.toLowerCase());
    });

    const enabledWaiters = filteredWaiters.filter((waiter) => waiter.State);
    const disabledWaiters = filteredWaiters.filter((waiter) => !waiter.State);
    const sortedWaiters = [...enabledWaiters, ...disabledWaiters];

    const pageCount = Math.ceil(sortedWaiters.length / itemsForPage);

    const startIndex = (currentPage - 1) * itemsForPage;
    const endIndex = startIndex + itemsForPage;
    const visibleWaiters = sortedWaiters.slice(startIndex, endIndex);

    const barraClass = user.State ? "" : "desactivado";

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const onStatusChange = async (id) => {

        const { hasError } = await toggleUserStatus(id)

        if (hasError) return

        setAllUsers((prevUser) =>
            prevUser.map((users) =>
                users.ID_User === id ? { ...users, State: !users.State } : users
            ))
    }

    const closeModal = () => {
        setIsModalOpen(false);
        navigate('/');
    };

    return (
        <section className="pc-container">
                <div className="pcoded-content">

                    <div className="row w-100">
                        <div className="col-md-12">
                            <div className=" w-100 col-sm-12">

                                <div className="card">
                                    <div className="card-header">
                                        <h5>Visualización de meseros</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <button
                                                    title='Crear un nuevo mesero.'
                                                    type='button'
                                                    className='btn btn-primary'
                                                    onClick={navigateToCreateWaiter}
                                                >
                                                    Registrar
                                                </button>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <input type="search" className="form-control"
                                                        id="exampleInputEmail1"
                                                        aria-describedby="emailHelp"
                                                        placeholder="Buscador"
                                                        value={searchTerm}
                                                        onChange={handleSearchChange}
                                                        title='Buscar uno o varios meseros por algun dato de los meseros.'
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-check ml-4 mt-1">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="showEnabledOnly"
                                                    checked={showEnabledOnly}
                                                    onChange={handleCheckboxChange}
                                                    title="Este interruptor sirve para visualizar únicamente las roles habilitadas."
                                                />
                                                <label className="form-check-label" htmlFor="showEnabledOnly">
                                                    Mostrar solo habilitados
                                                </label>
                                            </div>
                                        </div>


                                        <div className="card-body table-border-style">
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center">Tipo de documento</th>
                                                            <th className="text-center">N° documento</th>
                                                            <th className="text-center">Nombre</th>
                                                            <th className="text-center">Apellido</th>
                                                            <th className="text-center">Restaurante</th>
                                                            <th className="text-center">Estado</th>
                                                            <th className="text-center">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {visibleWaiters.map((waiter) => (
                                                            <tr key={waiter.ID_User}>
                                                                <td title='Tipo de documento del mesero.'>{waiter.Type_Document}</td>
                                                                <td title='Numero de identificacion del mesero.'>{waiter.Document}</td>
                                                                <td title='Nombre del mesero.'>{waiter.Name_User}</td>
                                                                <td title='Apellido del mesero.'>{waiter.LastName_User}</td>
                                                                <td title='Restaurante al que pertenece el mesero.'>{waiter.Restaurant}</td>
                                                                <td title='Estado actual del mesero.' className={`${barraClass}`}>
                                                                    {waiter.State ? "Habilitado" : "Deshabilitado"}
                                                                </td>
                                                                <td><div style={{ display: "flex", alignItems: "center", padding: '3px' }}>
                                                                    <button
                                                                        onClick={() => handleEdit(waiter)}
                                                                        className={`ml-1 btn btn-icon btn-primary ${!waiter.State ? "text-gray-400 cursor-not-allowed" : ""}`}
                                                                        disabled={!waiter.State}
                                                                    >
                                                                        <BiEdit />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        title='Cambiar el estado de un mesero.'
                                                                        className={`ml-1 btn btn-icon btn-success ${barraClass}`}
                                                                        onClick={() => onStatusChange(waiter.ID_User)}
                                                                    >
                                                                        {waiter.State ? (
                                                                            <MdToggleOn className={`estado-icon active ${barraClass}`} />
                                                                        ) : (
                                                                            <MdToggleOff className={`estado-icon inactive ${barraClass}`} />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="pagination-container pagination"
                            title='Para moverse mas rapido por el modulo cuando hay varios registros en el sistema.'
                        >
                            <Stack spacing={2}>
                                <Pagination
                                    count={pageCount}
                                    page={currentPage}
                                    siblingCount={2}
                                    onChange={handlePageChange}
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </Stack>
                        </div>

                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2, title: 'Muestra la pagina en la que se encuentra actualmente de las paginas en total que existen.' }}>
                            <Typography variant="body2" color="text.secondary">
                                Página {currentPage} de {pageCount}
                            </Typography>
                        </Box>
                    </div>

                </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay" onClick={() => setIsModalOpen(false)}></div>
                    <div className="modal-container">
                        <CreateWaiter onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}></div>
                    <div className="modal-container">
                        <UpdateWaiter onClose={() => setIsEditModalOpen(false)} waiterToEdit={waiterToEdit} />
                    </div>
                </div>
            )}
        </section>
    )
}

export default WaiterPage
