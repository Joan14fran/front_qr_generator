import { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { loginUser } from '../../api/users.api';
import { Header } from '../../components/Header';

interface LoginForm {
  username: string;
  password: string;
}

export function Login() {
  const { control, handleSubmit, formState: { errors }, reset } = useForm<LoginForm>();
  const navigate = useNavigate();
  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar el componente
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await loginUser(data.username, data.password);
      localStorage.setItem('token', response.data.token);
      showToast('success', 'Inicio de sesión exitoso', 'Bienvenido');
      navigate('/dashboard');
      reset({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      showToast('error', 'Error al iniciar sesión', 'Credenciales inválidas');
    }
  };

  return (
    <div className="container mt-5">
      <Header />
      <br />
      <div className="card">
        <div className="card-body">
          <Toast ref={toast} />
          <form className="p-fluid p-d-flex p-flex-column p-ai-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <Controller
                name="username"
                control={control}
                rules={{ required: 'Username es requerido.' }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.username })}></label>
                    <span className="p-float-label">
                      <InputText
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error })}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <label htmlFor={field.name}>Username</label>
                    </span>
                    {errors.username && <small className='text-danger'>{errors.username.message}</small>}
                  </>
                )}
              />
            </div>
            <div className="mb-3">
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Contraseña es requerida.' }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.password })}></label>
                    <span className="p-float-label">
                      <Password
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error })}
                        onChange={(e) => field.onChange(e.target.value)}
                        toggleMask
                        feedback={false}
                      />
                      <label htmlFor={field.name}>Contraseña</label>
                    </span>
                    {errors.password && <small className='text-danger'>{errors.password.message}</small>}
                  </>
                )}
              />
            </div>
            <Button label="Submit" type='submit' icon="pi pi-check" iconPos="right" className="mt-3" />
            <Link to="/register" className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2 d-flex align-items-center">
              <p className="m-0 me-2">¿Aún no tienes una cuenta?</p>
              <button type="button" className="btn btn-outline-primary btn-sm">Registrate</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
