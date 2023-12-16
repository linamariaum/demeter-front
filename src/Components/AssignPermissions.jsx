import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useModule } from "../Context/Module.context";
import { useRole } from "../Context/Role.context";

const style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 680,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

export default function AssignPermissions({ onClose, onCreated = () => null, roleId }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm();

  const { getModuleNamesAndRoleState, removeMultipleModulePermissions } = useModule();
  const { addMultipleModuleAndRole } = useRole()
  const rolesAssignRef = useRef([])
  const rolesDisabledRef = useRef([])
  const onSubmit = handleSubmit(async () => {

    if (rolesAssignRef.current.length > 0) {
      await addMultipleModuleAndRole(roleId, rolesAssignRef.current)
    }

    const newDisabledRoles = rolesDisabledRef.current.filter(r => r.remove)

    if (newDisabledRoles.length > 0) {
      await removeMultipleModulePermissions(roleId, newDisabledRoles.map(n => n.moduleId))
    }
    onCreated();
    onClose();
  });

  const [modules, setModules] = useState([]);

  useEffect(() => {
    return async () => {
      const data = await getModuleNamesAndRoleState(roleId);
      setModules(data);
      rolesDisabledRef.current = data.filter(d => d.roleState).map(d => ({
        moduleId: d.ID_Module,
        remove: false
      }))
    };
  }, [roleId]);

  const onCancel = () => {
    onClose();
  };

  const handleModuleState = (moduleId) => {
    const idExists = rolesAssignRef.current.findIndex(r => r === moduleId)
    const disabledRoleId = rolesDisabledRef.current.findIndex(rd => +rd.moduleId === moduleId)
    if (idExists !== -1) {
      rolesAssignRef.current.splice(idExists, 1)

    }
    else if (disabledRoleId !== -1) {
      rolesDisabledRef.current[disabledRoleId] = {
        ...rolesDisabledRef.current[disabledRoleId],
        remove: !rolesDisabledRef.current[disabledRoleId].remove
      }
    }
    else {
      rolesAssignRef.current.push(moduleId)

    }

    setModules(prev => prev.map(p => ({
      ...p,
      roleState: p.ID_Module === moduleId ? !p.roleState : p.roleState
    })))
  }
  return (
    <Box sx={{ ...style, height: 585, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5>Asignacion de permisos</h5>
          </div>
          <div className="card-body">
            <form onSubmit={onSubmit} className="d-flex gap-2 flex-wrap align-items-center">

              {modules.map(({ ID_Module, Name_Module, roleState }) => (
                <div className="form-group d-flex flex-column gap-1 align-content-center m-2" key={ID_Module}>
                  <h5>{Name_Module}</h5>
                  <button
                    type="button"
                    className={`${roleState ? "" : "desactivado"}`}
                    onClick={() => handleModuleState(ID_Module)}
                  >
                    {roleState ? (
                      <>
                        <p>Desactivar</p>
                        <MdToggleOn className="btn btn-success" />
                      </>
                    ) : (
                      <>
                        <p>Activar</p>
                        <MdToggleOff className="btn btn-danger" />
                      </>
                    )}
                  </button>
                </div>
              ))}
            </form>
            <div className="buttonconfirm pt-5">
              <div className="mb-3">
                <button
                  className="btn btn-primary mr-5"
                  type="submit"
                  title='Se guarda la información recien ingresado en el sistema.'
                >
                  Confirmar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={onCancel}
                  type="button"
                  title='Se cancela la información recien ingresada en el sistema.'
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}