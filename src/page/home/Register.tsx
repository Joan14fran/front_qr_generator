// Register.tsx

//importaciones
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Link } from 'react-router-dom';
import { createUser } from '../../api/users.api';
import { Header } from '../../components/Header';
import { Divider } from 'primereact/divider';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

export function Register() {
  const toast = useRef(null);
  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { confirm_password, ...userData } = data;

    try {
      await createUser(userData);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente',
        life: 3000,
        className: 'custom-toast-success',
      });
      reset({
        nombre: '',
        apellido: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
      }); // Restablecer el formulario después del envío exitoso
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al crear el usuario',
        life: 3000,
        className: 'custom-toast-error',
      });
      console.error('Error al crear usuario:', error);
    }
  };

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const password = watch("password", "");

  const footer = (
    <>
      <Divider />
      <p className="mt-2">Sugerencias</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li>Al menos una minúscula</li>
        <li>Al menos una mayúscula</li>
        <li>Al menos un número</li>
        <li>Mínimo 8 caracteres</li>
      </ul>
    </>
  );

  return (


    <div className="container mt-5">
      <Header />
      <br />
      <div className="">
        <div className="card-body">
          <Toast ref={toast} />
          <form className="p-fluid p-d-flex p-flex-column p-ai-center" onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col">
                <Controller name="nombre" control={control} rules={{ required: 'Nombre es requerido.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className={classNames({ 'p-error': errors.nombre })}></label>
                      <span className="p-float-label">
                        <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <label htmlFor={field.name}>Nombre</label>
                      </span>
                      {getFormErrorMessage('nombre')}
                    </>
                  )}
                />
              </div>
              <div className="col">
                <Controller name="apellido" control={control} rules={{ required: 'Apellido es requerido.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className={classNames({ 'p-error': errors.apellido })}></label>
                      <span className="p-float-label">
                        <InputText
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <label htmlFor={field.name}>Apellido</label>
                      </span>
                      {getFormErrorMessage('apellido')}
                    </>
                  )}
                />
              </div>
            </div>
            <div className="mb-3">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Correo es requerido.',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Correo electrónico inválido.',
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <label htmlFor={field.name} className={classNames({ 'p-error': errors.email })}></label>
                    <span className="p-float-label">
                      <InputText
                        id={field.name}
                        value={field.value}
                        className={classNames({ 'p-invalid': fieldState.error })}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                      <label htmlFor={field.name}>Correo</label>
                    </span>
                    {getFormErrorMessage('email')}
                  </>
                )}
              />
            </div>
            <div className="mb-3">
              <Controller name="username" control={control} rules={{ required: 'Username es requerido.' }}
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
                    {getFormErrorMessage('username')}
                  </>
                )}
              />
            </div>
            <div className="row g-3">
              <div className="col">
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
                          footer={footer}
                        />
                        <label htmlFor={field.name}>Contraseña</label>
                      </span>
                      {getFormErrorMessage('password')}
                    </>
                  )}
                />
              </div>
              <div className="col">
                <Controller
                  name="confirm_password"
                  control={control}
                  rules={{
                    required: 'Confirmar contraseña es requerido.',
                    validate: value => value === password || 'Las contraseñas no coinciden'
                  }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className={classNames({ 'p-error': errors.confirm_password })}></label>
                      <span className="p-float-label">
                        <Password
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                          toggleMask
                          feedback={false}
                        />
                        <label htmlFor={field.name}>Confirmar Contraseña</label>
                      </span>
                      {getFormErrorMessage('confirm_password')}
                    </>
                  )}
                />
              </div>
            </div>

            <Button label="Submit" type='submit' icon="pi pi-check" iconPos="right" className="mt-3" />
            <Link to="/login" className="text-sm font-light text-gray-500 dark:text-gray-400 mt-2 d-flex align-items-center">
              <p className="m-0 me-2">¿Ya tienes cuenta?</p>
              <button type="button" className="btn btn-outline-primary btn-sm">Inicia Sesión</button>
            </Link>
          </form>
        </div>
      </div>
    </div>



  );
}

export default Register;
