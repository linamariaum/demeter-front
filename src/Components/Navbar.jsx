import React, { useState, useEffect, useRef } from 'react';
import logo from '../img/logo.png'
import '../css/style.css'
import '../css/landing.css'
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SecurityIcon from '@mui/icons-material/Security';
import PeopleIcon from '@mui/icons-material/People';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useUser } from '../Context/User.context';

const Navbar = () => {
    const {isAuthenticated} = useUser();
    const [submenuComprasVisible, setSubmenuComprasVisible] = useState(false);
    const [submenuVentasVisible, setSubmenuVentasVisible] = useState(false);

    const navigate = useNavigate();

    const toggleSubmenuCompras = () => {
        setSubmenuComprasVisible(prevStateC => !prevStateC);

        setTimeout(() => setSubmenuComprasVisible(false), 5000);
    };

    const toggleSubmenuVentas = () => {
        setSubmenuVentasVisible(prevStateV => !prevStateV);

        setTimeout(() => setSubmenuVentasVisible(false), 5000);
    }

    if(!isAuthenticated){
        return ''
    }

    return (
        <nav className="pc-sidebar ">
            <div className="navbar-wrapper">
                <div className="m-header">
                    <button
                        onClick={() => {
                            navigate('/dashboard');
                        }}
                        className="b-brand"
                        title='Dirigirse a la pagina principal del sistema.'
                    >
                        <img src={logo} alt="Demeter SOFT" className="logo logo-lg" width="130" height="60" />
                    </button>
                </div>
                <div className="navbar-content">
                    <ul className="pc-navbar">
                        <li className="pc-item pc-caption">
                            <label>MENÚ</label>
                        </li>
                        <li className="pc-item">
                            <button
                                onClick={() => {
                                    navigate('/dashboard');
                                }}
                                className="pc-link"
                                title='Dirigirse al DashBoard del sistema.'
                            >
                                <span className="pc-micon">
                                    <i className="material-icons-two-tone">
                                        <DashboardIcon />
                                    </i>
                                </span>
                                <span className="pc-mtext">
                                    Dashboard
                                </span>
                            </button>
                        </li>
                        <li className="pc-item pc-caption">
                            <span>Gestión de configuración</span>
                        </li>
                        <li className="pc-item pc-hasmenu">
                            <button
                                onClick={() => {
                                    navigate('/setting');
                                }}
                                className="pc-link"
                                title='Dirigirse al modulo de roles con asignacion de permisos del sistema.'
                            >
                                <span className="pc-micon">
                                    <i className="material-icons-two-tone">
                                        <SecurityIcon />
                                    </i>
                                </span>
                                <span className="pc-mtext">
                                    Configuración
                                </span>
                            </button>
                        </li>
                        <li className="pc-item pc-caption">
                            <span>Gestión de usuarios</span>
                        </li>
                        <li className="pc-item">
                            <button
                                onClick={() => {
                                    navigate('/user');
                                }}
                                className="pc-link"
                                title='Dirigirse al modulo de empleados del sistema.'
                            >
                                <span className="pc-micon">
                                    <i className="material-icons-two-tone">
                                        <PeopleIcon />
                                    </i>
                                </span>
                                <span className="pc-mtext">
                                    Empleados
                                </span>
                            </button>
                        </li>
                        <li className="pc-item pc-caption">
                            <span>Gestión de compras</span>
                        </li>
                        <li className="pc-item pc-hasmenu">
                            <button
                                onClick={toggleSubmenuCompras}
                                className="pc-link"
                                title='Desplegar el submenu hacia abajo con los modulos correspondientes de la gestion de compras.'
                            >
                                <span className="pc-micon">
                                    <i className="material-icons-two-tone">
                                        <StoreIcon />
                                    </i>
                                </span>
                                <span className="pc-mtext">
                                    Gestión de compras
                                </span>
                                <span className="pc-arrow"> <ExpandMoreIcon /></span>
                            </button>
                            {submenuComprasVisible && (
                                <ul className="pc-submenu">
                                    <li
                                        className="pc-item"
                                    >
                                        <button
                                            onClick={() => {
                                                navigate('/category_supplies')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de categoria de insumos del sistema.'
                                        >
                                            Categoría insumos
                                        </button>
                                    </li>
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/supplies')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de insumos del sistema.'
                                        >
                                            Insumos
                                        </button>
                                    </li>
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/supplier')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de proveedores del sistema.'
                                        >
                                            Proveedores
                                        </button>
                                    </li>
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/shopping')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de compras del sistema.'
                                        >
                                            Compras
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="pc-item pc-caption">
                            <span>Gestión de ventas</span>
                        </li>
                        <li className="pc-item pc-hasmenu">
                            <button
                                onClick={toggleSubmenuVentas}
                                className="pc-link"
                                title='Desplegar el submenu hacia abajo con los modulos correspondientes de la gestion de ventas.'
                            >
                                <span className="pc-micon">
                                    <i className="material-icons-two-tone">
                                        <ShoppingCartIcon />
                                    </i>
                                </span>
                                <span className="pc-mtext">
                                    Gestión de ventas
                                </span>
                                <span className="pc-arrow"> <ExpandMoreIcon /></span>
                            </button>
                            {submenuVentasVisible && (
                                <ul className="pc-submenu">
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/category_product')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de categoria de productos del sistema.'
                                        >
                                            Categoría producto
                                        </button>
                                    </li>
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/product')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de productos del sistema.'
                                        >
                                            Producto
                                        </button>
                                    </li>
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/waiter')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de meseros del sistema.'
                                        >
                                            Meseros
                                        </button>
                                    </li>
                                    <li
                                        className="pc-item">
                                        <button
                                            onClick={() => {
                                                navigate('/sale')
                                            }}
                                            className="pc-link"
                                            title='Dirigirse al modulo de ventas del sistema.'
                                        >
                                            Venta
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li className="pc-item pc-caption">
                            <span>Manuales</span>
                        </li>
                        <li className="pc-item pc-hasmenu">
                            <button
                                onClick={() => {
                                    navigate('/instructions');
                                }}
                                className="pc-link"
                                title='Dirigirse al modulo de roles con asignacion de permisos del sistema.'
                            >
                                <span className="pc-micon">
                                    <i className="material-icons-two-tone">
                                        <AutoStoriesIcon />
                                    </i>
                                </span>
                                <span className="pc-mtext">
                                    Manuales
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar
