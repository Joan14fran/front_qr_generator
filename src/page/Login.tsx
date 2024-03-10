// Login.tsx

//importaciones
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';


import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';

import { Header } from '../components/Header'
import { loginUser } from '../api/users.api'

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const toast = useRef(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const onSubmit = async (data) => {
    try {
      setShowWelcome(true);
      setTimeout(async () => {
        const response = await loginUser(data.username, data.password);
        localStorage.setItem('token', response.data.token);
        showToast('success', 'Inicio de sesión exitoso', `Token: ${response.data.token}`);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showToast('error', 'Error al iniciar sesión', 'Credenciales inválidas');
    }
  };


  return (

    <section className="p-4">
      <Header />
      <Toast ref={toast} />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
              Inicia Sesión
            </h1>
            {showWelcome && (
              <Message severity="success" text="Bienvenido..." />
            )}
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register('username', { required: true })}
                  className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="pepito_perez"
                />
                {errors.username && <small className='text-red-500'>Username es requerido</small>}
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', { required: true })}
                  className="bg-gray-100 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-600 focus:border-indigo-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                />
                {errors.password && <small className='text-red-500'>Contraseña es requerido</small>}
              </div>
              <div className="flex items-center justify-between">
                <a href="#" className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline">Forgot password?</a>
              </div>
              <button type="submit" className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-500 font-medium rounded-lg text-sm px-6 py-3 text-center inline-flex items-center dark:focus:ring-indigo-500 me-2 mb-2">Sign in</button>
              <Link to="/register">
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  ¿Aún no tienes una cuenta? <a href="#" className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">Registrarse</a>
                </p>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </section>

  );
}

export default Login;
