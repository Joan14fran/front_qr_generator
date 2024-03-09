// Login.tsx

//importaciones
import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { loginUser } from '../api/users.api'


export function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const toast = useRef(null); // Ref para acceder al componente Toast

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 3000 });
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await loginUser(data.username, data.password);
      console.log('Inicio de sesión exitoso. Token:', response.data.token);

      // Aquí puedes almacenar el token en el estado o en una cookie para usarlo en solicitudes posteriores.

      // Mostrar mensaje toast de éxito
      showToast('success', 'Inicio de sesión exitoso', `Token: ${response.data.token}`);

      // Redirigir a la página de Dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);

      // Mostrar mensaje toast de error
      showToast('error', 'Error al iniciar sesión', 'Credenciales inválidas');
    }
  };

  return (
    <section className="">
      <Toast ref={toast} />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-indigo-600 md:text-2xl dark:text-white">
              Inicia Sesión
            </h1>
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
