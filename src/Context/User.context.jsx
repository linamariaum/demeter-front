import { createContext, useContext, useEffect, useState } from 'react';
import { getUsersRequest, GetCurrentUser, getUserRequest, createUserRequest, statusUserRequest, updateUserRequest, deleteUserRequest, loginRequest, verifyTokenRequest, forgotPasswordRequest, NewPasswordRequest, GetUserCookies, existUserByEmailOrIdRequest, getWaiterRequest } from '../Api/User.request.js'
import { getWaitersRequest, createWaiterRequest, updateWaiterRequest } from '../Api/User.request.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("El useUser debe usarse dentro de UserProvider")
  }
  return context;
}

export const User = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');

  const navigate = useNavigate();



  const getUsers = async () => {
    try {
      const res = await getUsersRequest();
      setUser(res);
      return res.data
    } catch (error) {
      console.log(error);
    }

    return []
  }
  const getUser = async (id) => {
    try {
      const res = await getUserRequest(id);
      return res.data
    } catch (error) {
      console.error(error);
    }
  }

  const existUserByEmailOrId = async (document, email, userType) => {
    try {
      const res = await existUserByEmailOrIdRequest(document, email, userType);
      return res.data
    } catch (error) {
      return true
    }
  }

  const existSupplierByEmailOrId = async (document, email) => {
    return await existUserByEmailOrId(document, email, "supplier")
  }

  const getUserCookies = async () => {
    const { data = [] } = await GetUserCookies() || {};
    return data
  }


  const createUser = async (user) => {
    try {
      const res = await createUserRequest(user);
      getUsers();
      setisAuthenticated(true);
    } catch (error) {
      console.log(error);
    }
  }

  const getCurrentUser = async (user) => {
    try {
      const res = await GetCurrentUser(user);
      return res.data
    } catch (error) {
      console.log(error);
    }

    return {}
  }

  const toggleUserStatus = async (id) => {

    let userData = {}
    let hasError = false
    try {
      const res = await statusUserRequest(id);

      userData = res.data

    } catch (error) {
      console.log(error);
      hasError = true
    }

    return {
      userData,
      hasError
    }
  }

  const updateUser = async (id, users) => {
    try {
      await updateUserRequest(id, users);
      getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  const deleteUser = async (id) => {
    try {
      const res = await deleteUserRequest(id)
      if (res.status === 204) setUser(user.filter(users => users.ID_User !== id))
    } catch (error) {
      console.log(error);
    }
  }

  //-------------------------------------login----------------------------------------------//
  const signin = async (userData) => {
    try {
      const res = await loginRequest(userData);
      if (res && res.data) {
        setisAuthenticated(true);
        setUser(res.data);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === 'Email invalido') {
          setLoginError('El email no está registrado.');
        } else if (error.response.data.message === 'Contraseña incorrecta') {
          setLoginError('contraseña incorrecta.');
        } else {
          setLoginError('Error desconocido.');
        }
        setTimeout(() => {
          setLoginError(null);
        }, 5000);
      }
    }
  };


  const forgotPassword = async (email) => {
    try {
      const res = await forgotPasswordRequest({ Email: email });
      if (res.message === 'Usuario no encontrado') {
        setForgotPasswordError('El correo electrónico no está registrado.');
        setTimeout(() => {
          setForgotPasswordError('');
        }, 5000);
      } else {
        setForgotPasswordSuccess('Se ha enviado un correo para restablecer la contraseña.');
        setTimeout(() => {
          setForgotPasswordSuccess('');
        }, 5000);
      }
    } catch (error) {
      console.log('Error:', error);
      setForgotPasswordError('Email inválido');
      setTimeout(() => {
        setForgotPasswordError('');
      }, 5000);
      setForgotPasswordSuccess('');
    }
  };

  //cambiar la contraseña NewPasswordd

  // const NewPasswordd = async (token, password, confirmPassword) => {
  //     try {
  //       if (password !== confirmPassword) {
  //         setChangePasswordError('Las contraseñas no coinciden.');
  //         setTimeout(() => {
  //           setChangePasswordError('');
  //         }, 5000);
  //       } else {
  //         const res = await NewPasswordRequest({ token, Password: password });
  //         if (res.msg === 'Se actualizó correctamente') {
  //           setChangePasswordSuccess('Contraseña cambiada exitosamente.');
  //           setTimeout(() => {
  //             setChangePasswordSuccess('');
  //           }, 5000);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error:', error);
  //       setChangePasswordError('Hubo un problema al cambiar la contraseña.');
  //       setTimeout(() => {
  //         setChangePasswordError('');
  //       }, 5000);
  //     }
  //   };

  const NewPasswordd = async (token, password, confirmPassword) => {
    console.log("password2")
    console.log(password)
    console.log(confirmPassword)
    console.log(password !== confirmPassword)
    try {
      if (password !== confirmPassword) {
        console.log('Las contraseñas no coinciden:', password, confirmPassword);
        setChangePasswordError('Las contraseñas no coinciden.');
        setTimeout(() => {
          setChangePasswordError('');
        }, 5000);
      } else {
        const res = await NewPasswordRequest({ token, Password: password });
        if (!res.hasError) {
          console.log("Here")

          setChangePasswordSuccess('Contraseña cambiada exitosamente.');
          setTimeout(() => {
            navigate('/');
          }, 700);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setChangePasswordError('Hubo un problema al cambiar la contraseña.');
      setTimeout(() => {
        setChangePasswordError('');
      }, 5000);
    }
  };



  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get()

      //comprueba si hay un token, si no hay uno entonces la autenticación es false
      if (!cookies.token) {
        setisAuthenticated(false);
        setLoading(false);
        return setUser(null);
      }
      //si hay un token, envialo al backend, si no responde ningún dato entonces envialo a false
      //pero si sí hay uno entonces el usuario está autenticado y me muestra el usuario
      try {
        const res = await verifyTokenRequest(cookies.token)
        if (!res.data) {
          setisAuthenticated(false);
          setLoading(false);
          return;
        }

        setisAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setisAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    }
    checkLogin();
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setisAuthenticated(false);
    setUser(null);
    navigate('/');
  }

  // --------------------------- Mesero --------------------------- //

  const getWaiters = async () => {
    try {
      const res = await getWaitersRequest();
      setUser(res.data)

      return res.data
    } catch (error) {
      console.log(error)
    }
    return []
  }

  const getWaiter = async (id) => {
    try {
      const res = await getWaiterRequest(id);
      return res.data
    } catch (error) {
      console.error(error);
    }
  }

  const createWaiter = async (user) => {
    try {
      const res = await createWaiterRequest(user);
      getWaiters();
      console.log(res)
    } catch (error) {
      console.log(error);
    }
  }

  const updateWaiter = async (users) => {
    try {
      await updateWaiterRequest(users);
      getUsers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        getUsers,
        getUser,
        createUser,
        toggleUserStatus,
        updateUser,
        deleteUser,
        // ---------- Mesero ---------- //
        getWaiters,
        getWaiter,
        createWaiter,
        updateWaiter,
        //------------- Login ------------//
        isAuthenticated,
        signin,
        loading,
        logout,
        forgotPassword,
        NewPasswordd,
        loginError,
        forgotPasswordError,
        forgotPasswordSuccess,
        changePasswordError,
        setChangePasswordError,
        changePasswordSuccess,
        setChangePasswordSuccess,
        getUserCookies,
        getCurrentUser,
        existUserByEmailOrId,
        existSupplierByEmailOrId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};