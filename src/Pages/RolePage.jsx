import React, { useState, useEffect, useLayoutEffect, useRef } from "react";

// Icons
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { Assignment } from "@mui/icons-material";

// Diseño
import "../css/style.css";
import "../css/landing.css";

// Context
import { useRole } from "../Context/Role.context.jsx";
import { useUser } from '../Context/User.context.jsx';

// Componentes
import CreateRole from "../Components/CreateRole.jsx";
import UpdateRole from "../Components/UpdateRole.jsx";
import AssignPermissions from "../Components/AssignPermissions.jsx";

// Paginado
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function RolePage() {
    const { role, getRoles, toggleRoleStatus } = useRole();
    const { getUsers } = useUser()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenPrmissions, setIsModalOpenPrmissions] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [roleToEdit, setRoleToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const roleIdRef = useRef(null)

    const [showEnabledOnly, setShowEnabledOnly] = useState(
        localStorage.getItem("showEnabledOnly") === "true"
    );
    const itemsForPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getRoles(),
        getUsers();
        setCurrentPage(1);
    }, []);

    const navigateToCreateRole = () => {
        setIsModalOpen(true);
    };

    const AssignPermission = (id) => {
        roleIdRef.current = +id
        setIsModalOpenPrmissions(true);

    };

    const handleCreated = () => {
        getRoles();
    };

    const handleEdit = (role) => {
        setRoleToEdit(role);
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

    const filteredRoles = role.filter((rol) => {
        const { Name_Role } = rol;
        const searchString = `${Name_Role}`.toLowerCase();

        if (showEnabledOnly) {
            return rol.State && searchString.includes(searchTerm.toLowerCase());
        }

        return searchString.includes(searchTerm.toLowerCase());
    });

    const enabledRoles = filteredRoles.filter((rol) => rol.State);
    const disabledRoles = filteredRoles.filter((rol) => !rol.State);
    const sortedRoles = [...enabledRoles, ...disabledRoles];

    const pageCount = Math.ceil(sortedRoles.length / itemsForPage);

    const startIndex = (currentPage - 1) * itemsForPage;
    const endIndex = startIndex + itemsForPage;
    const visibleRoles = sortedRoles.slice(startIndex, endIndex);

    const statusRoles = role.State ? "" : "desactivado";

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <section className="pc-container">
            <div className="pcoded-content">
                <div className="row w-100">
                    <div className="col-md-12">
                        <div className=" w-100 col-sm-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5>Visualización de roles</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={navigateToCreateRole}
                                                title="Registrar un nuevo rol para un empleado para el sistema."
                                            >
                                                Registrar
                                            </button>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input
                                                    type="search"
                                                    className="form-control"
                                                    id="exampleInputEmail1"
                                                    aria-describedby="emailHelp"
                                                    placeholder="Buscador"
                                                    value={searchTerm}
                                                    onChange={handleSearchChange}
                                                    title="Se puede buscar el rol por el nombre"
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
                                                        <th className="text-center">Nombre</th>
                                                        <th className="text-center">Permisos</th>
                                                        <th className="text-center">Estado</th>
                                                        <th className="text-center">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {visibleRoles.map((rol) => (
                                                        <tr key={rol.ID_Role}>
                                                            <td title="Nombre del rol">{rol.Name_Role}</td>
                                                            <td>
                                                                {rol.ID_Role !== 1 ? (
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center"
                                                                        }}
                                                                    >
                                                                        <button
                                                                            title="Para poder remover o asignar permisos a un rol ya creado con anterioridad."
                                                                            type="button"
                                                                            className={`btn btn-icon btn-outline-dark btn-sm ${!rol.State
                                                                                ? "text-gray-400 cursor-not-allowed"
                                                                                : ""
                                                                                }`}
                                                                            disabled={!rol.State}
                                                                            onClick={() => AssignPermission(rol.ID_Role)}
                                                                        >
                                                                            <Assignment />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    "El administrador tiene todos los permisos."
                                                                )}
                                                            </td>
                                                            <td
                                                                title="El estado actual del rol seleccionado en el sistema."
                                                                className={`${statusRoles}`}
                                                            >
                                                                {rol.State ? "Habilitado" : "Deshabilitado"}
                                                            </td>
                                                            <td>
                                                                {rol.ID_Role !== 1 ? (
                                                                    <div
                                                                        style={{
                                                                            display: "flex",
                                                                            alignItems: "center"
                                                                        }}
                                                                    >
                                                                        <button
                                                                            onClick={() => handleEdit(rol)}
                                                                            className={`ml-1 btn btn-icon btn-primary ${!rol.State
                                                                                ? "text-gray-400 cursor-not-allowed"
                                                                                : ""
                                                                                }`}
                                                                            disabled={!rol.State}
                                                                            title="Para editar el nombre del rol seleccionado en el sistema."
                                                                        >
                                                                            <BiEdit />
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            title="Para cambiar el estado del rol seleccionado en el sistema. Sino te cambia asegurate de que no hayan usuarios con el rol."
                                                                            className={`ml-1 btn btn-icon btn-success ${statusRoles}`}
                                                                            onClick={() =>
                                                                                toggleRoleStatus(rol.ID_Role)
                                                                            }
                                                                        >
                                                                            {rol.State ? (
                                                                                <MdToggleOn
                                                                                    className={`estado-icon active ${statusRoles}`}
                                                                                />
                                                                            ) : (
                                                                                <MdToggleOff
                                                                                    className={`estado-icon inactive ${statusRoles}`}
                                                                                />
                                                                            )}
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    "El administrador no tiene acciones"
                                                                )}
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
                </div>
            </div>

            <div
                className="pagination-container pagination"
                title="Para moverse mas rapido por el modulo cuando hay varios registros en el sistema."
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

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 2,
                    title:
                        "Muestra la pagina en la que se encuentra actualmente de las paginas en total que existen."
                }}
            >
                <Typography variant="body2" color="text.secondary">
                    Página {currentPage} de {pageCount}
                </Typography>
            </Box>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="modal-overlay"
                        onClick={() => setIsModalOpen(false)}
                    ></div>
                    <div className="modal-container">
                        <CreateRole
                            onClose={() => setIsModalOpen(false)}
                            onCreated={handleCreated}
                        />
                    </div>
                </div>
            )}

            {isModalOpenPrmissions && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="modal-overlay"
                        onClick={() => setIsModalOpenPrmissions(false)}
                    ></div>
                    <div className="modal-container">
                        <AssignPermissions
                            onClose={() => setIsModalOpenPrmissions(false)}
                            onAssign={AssignPermission}
                            roleId={roleIdRef.current}
                        />
                    </div>
                </div>
            )}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="modal-overlay"
                        onClick={() => setIsEditModalOpen(false)}
                    ></div>
                    <div className="modal-container">
                        <UpdateRole
                            onClose={() => setIsEditModalOpen(false)}
                            roleToEdit={roleToEdit}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default RolePage;
