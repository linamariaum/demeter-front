import { createContext, useContext, useState } from 'react';
import { getRolesRequest, getRoleRequest, createRoleRequest, toggleRoleRequest, updateRoleRequest, AddModuleToRole, AddMultipleModuleAndRole, AddMultipleModuleAndRoleAndDeleteIfExists } from '../Api/Role.request.js'

export const RoleContext = createContext();

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("El useRole debe usarse dentro de RoleProvider")
    }
    return context;
}

export const Role = ({ children }) => {
    const [role, setRole] = useState([]);

    const getRoles = async () => {
        try {
            const res = await getRolesRequest();
            setRole(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getRole = async (id) => {
        try {
            const res = await getRoleRequest(id);
            return res.data
        } catch (error) {
            console.error(error);
        }
    }

    const createRole = async (Role) => {
        try {
            const res = await createRoleRequest(Role);
            getRoles();
        } catch (error) {
            console.log(error);
        }
    }

    const toggleRoleStatus = async (id) => {
        try {
            const res = await toggleRoleRequest(id);

            if (res.status === 200) {
                setRole((prevRole) =>
                    prevRole.map((rol) =>
                    rol.ID_Role === id ? { ...rol, State: !rol.State } : rol
                    )
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    const updateRole = async (id, rol) => {
        try {
            await updateRoleRequest(id, rol);
            getRoles();
        } catch (error) {
            console.error(error);
        }
    }
    
    const addModuleToRole = async (Role) => {
        try {
            const createdRole = await AddModuleToRole(Role);
            return createdRole.data
        } catch (error) {
            console.log(error);
        }

        return {}
    }

    const addMultipleModuleAndRole = async (roleId, Role) => {
        try {
            const createdRole = await AddMultipleModuleAndRole(roleId, Role);
            return createdRole.data
        } catch (error) {
            console.log(error);
        }

        return {}
    }

    const addMultipleModuleAndRoleAndDeleteIfExists = async (roleId, Role) => {
        try {
            const createdRole = await AddMultipleModuleAndRoleAndDeleteIfExists(roleId, Role);
            return createdRole.data
        } catch (error) {
            console.log(error);
        }

        return {}
    }

    return (
        <RoleContext.Provider
            value={{
                role,
                getRoles,
                getRole,
                createRole,
                toggleRoleStatus,
                updateRole,
                addModuleToRole,
                addMultipleModuleAndRole,
                addMultipleModuleAndRoleAndDeleteIfExists
            }}
        >
            {children}
        </RoleContext.Provider>
    );
};