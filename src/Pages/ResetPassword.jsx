import React, { useState } from 'react';
import logo from '../img/logo.png';
import { AiOutlineMail } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUser } from '../Context/User.context';
import '../css/style.css';
import '../css/landing.css';

function ResetPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { forgotPassword,  forgotPasswordError, forgotPasswordSuccess, } = useUser();

  
	const onSubmit = async (data) => {
    await forgotPassword(data.Email);
}
  
  return (
    <div className="">
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="card">
            <div className="row align-items-center text-center">
              <div className="col-md-12">
                <div className="card-body">
                  <img src={logo} alt="" className="img-fluid mb-4"/>
                  <p>Restablecer contraseña</p>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group mb-3">
                      <span className="input-group-text"><i data-feather="mail"><AiOutlineMail/></i></span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Correo electrónico *"
                        {...register('Email', {
                          pattern: {
                            value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
                            message: "El correo electrónico no es válido "
                          }
                        })}
                      />
                      {errors.Email && (
                        <p className="text-red-500">{errors.Email.message}</p>
                      )}
                    </div>
                 

                  {forgotPasswordError && (
                  <p className="error-message">{forgotPasswordError}</p>
                   )}
                 {forgotPasswordSuccess && (
                 <p className="success-message">{forgotPasswordSuccess}</p>
                  )}
                    <button type="submit" title="Presiona para enviar el correo" className="btn btn-block btn-danger mt-3 mr-3 ">Enviar</button>
                    <Link to="/">
                      <button title="Presiona para volver al login" className="btn btn-block btn-primary mt-3">
                        Cancelar
                      </button>
                    </Link>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;