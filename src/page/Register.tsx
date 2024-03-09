// Register.tsx

//importaciones
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom'


import { Toast } from 'primereact/toast';

import { createUser } from '../api/users.api'



export function Register() {

  // Añade un ref para el componente Toast
  const toast = useRef(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    const { confirm_password, ...userData } = data;

    try {
      await createUser(userData);
      // Muestra un mensaje toast de éxito con estilo personalizado
      toast.current.show({
        severity: 'success',
        summary: 'Exito',
        detail: 'Usuario creado correctamente',
        life: 3000,
        className: 'custom-toast-success', // Clase de estilo personalizado
      });
      reset();
    } catch (error) {
      // Muestra un mensaje toast de error con estilo personalizado
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al crear el usuario',
        life: 3000,
        className: 'custom-toast-error', // Clase de estilo personalizado
      });
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <section className="">
      <Toast ref={toast} />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
              Registro
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                  <input type="text" {...register('nombre', { required: true })} className={`p-inputtext p-component bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.nombre && 'p-invalid'}`} placeholder="Nombre" />
                  {errors.nombre && <small className='text-red-500'>Nombre es requerido</small>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Apellido</label>
                  <input type="text" {...register('apellido', { required: true })} className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Apellido" />
                  {errors.apellido && <span className='text-red-500 text-xs'>Apellido es requerido</span>}
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo</label>
                <input type="email" {...register('email', { required: true })} className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="correo@example.com" />
                {errors.email && <span className='text-red-500 text-xs'>Correo es requerido</span>}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                <input type="username" {...register('username', { required: true })} className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="pepito_perez" />
                {errors.username && <span className='text-red-500 text-xs'>Username es requerido</span>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
                  <input type="password" {...register('password', { required: true })} placeholder="••••••••" className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  {errors.password && <span className='text-red-500 text-xs'>Contraseña es requerido</span>}
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmar Contraseña</label>
                  <input type="password" {...register('confirm_password', { required: true })} placeholder="••••••••" className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  {errors.confirm_password && <span className='text-red-500 text-xs'>Confirme su contraseña</span>}
                </div>
              </div>

              <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500 font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center dark:focus:ring-indigo-500 me-2 mb-2">Registrarse</button>
              <Link to="/login">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  ¿Ya tienes una cuenta? <a href="#" className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Inicia Sesión</a>
                </p>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>

  );
}

export default Register;
