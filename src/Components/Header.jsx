import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import '../css/style.css'
import '../css/landing.css'
import NotificationsIcon from '@mui/icons-material/Notifications';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useUser } from '../Context/User.context';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [headerView, setHeaderView] = useState(true);
	const { getCurrentUser, logout } = useUser();
	const [currentUser, setCurrentUser] = useState({})

	const dropdownRef = useRef();
	const location = useLocation()
	const navigate = useNavigate();

	const toggleDropdown = () => {
		setShowDropdown(prevState => !prevState)

		setTimeout(() => setShowDropdown(false), 3000);
	};
	useLayoutEffect(() => {
		return async () => {
		  const user = await getCurrentUser()
		  setCurrentUser(user)
		};
	  }, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showDropdown]);


	useLayoutEffect(() => {
		const forbiddenLocations = ["resetPassword", "newPassword"]
		const newLocation = location.pathname.replace(/\/+/g, "")
		const condition = forbiddenLocations.some(f => (newLocation !== "" && newLocation.includes(f)) || location.pathname === "/")
		if (condition) {
			setHeaderView(false)
		}
		else if (!headerView) {
			setHeaderView(true)
		}
	}, [location.pathname])

	return (
		<header className={headerView ? "pc-header" : ""}>
			{
				headerView && (
					<>
						<div className="mr-auto pc-mob-drp">
							<ul className="list-unstyled">
								<li className="dropdown pc-h-item">
									<h3 title='Nombre del sistema.'>DEMETER</h3>
								</li>
							</ul>
						</div>
						<div className="ml-auto">
							<ul className="list-unstyled">
								<li className="dropdown pc-h-item">
									<button
										className="p-2 dropdown-toggle arrow-none mr-0"
										onClick={() => {
											navigate('/alert');
										}}
										title='Dirigirse a la sesion de notificaciones del sistema.'
									>
										<i className="material-icons-two-tone">
											<NotificationsIcon />
										</i>
									</button>
									<button
										className="pc-head-link dropdown-toggle arrow-none mr-0"
										role="button"
										aria-haspopup="false"
										aria-expanded="false"
										onClick={toggleDropdown}
										// ref={dropdownRef}
										title='Nombre de la persona que esta logueada y submenu para cerrar sesion del sistema o ver los manuales de uso de cada modulo.'
									>
										<span>
											<span className="user-name"> {`${currentUser.Name_User} ${currentUser.LastName_User}`}</span>
										</span>
									</button>
									{showDropdown && (
										<ul className="dropdown-menu dropdown-menu-right pc-h-dropdown flex-column">
											<li className="dropdown-item">
												<button
													onClick={() => {
														logout();
													}}
													title='Cerrar la sesion del usuario logueado en el sistema.'
												>
													<i className="material-icons-two-tone">
														<ExitToAppIcon />
													</i>
													<span>Cerrar sesion</span>
												</button>
											</li>
										</ul>
									)}
								</li>
							</ul>
						</div>
					</>
				)
			}
		</header>
	);
};

export default Header;