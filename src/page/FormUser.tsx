import React, { useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';

import { SidebarComp } from '../components/SidebarComp';
import { createUser } from '../api/users.api';

interface UserForm {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}

export function FormUser() {
  const { control, handleSubmit, formState: { errors }, watch, reset } = useForm<UserForm>();
  const toast = useRef(null);
  const password = watch("password");

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const onSubmit = async (data: UserForm) => {
    try {
      await createUser(data);
      showToast('success', 'Éxito', 'Usuario creado correctamente');
      reset({
        nombre: '',
        apellido: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
      });
    } catch (error) {
      showToast('error', 'Error', 'Hubo un problema al crear el usuario');
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <div className='p-4'>
      <SidebarComp />
      <Toast ref={toast} />

      <div className="container mt-5">
        <div className="card">
          <div className="card-body">
            <form className="p-fluid p-d-flex p-flex-column p-ai-center" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <Controller
                  name="nombre"
                  control={control}
                  rules={{ required: 'Nombre es requerido.' }}
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

              <div className="mb-3">
                <Controller
                  name="apellido"
                  control={control}
                  rules={{ required: 'Apellido es requerido.' }}
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
                      {getFormErrorMessage('username')}
                    </>
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'Email es requerido.', pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico inválido' } }}
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
                        <label htmlFor={field.name}>Email</label>
                      </span>
                      {getFormErrorMessage('email')}
                    </>
                  )}
                />
              </div>

              <div className="mb-3">
                <div className="p-field">
                  <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Contraseña</label>
                  <span className="p-float-label">
                    <Controller
                      name="password"
                      control={control}
                      rules={{ required: 'Contraseña es requerida.' }}
                      render={({ field, fieldState }) => (
                        <Password
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                          toggleMask
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage('password')}
                </div>
              </div>

              <div className="mb-3">
                <div className="p-field">
                  <label htmlFor="confirm_password" className={classNames({ 'p-error': errors.confirm_password })}>Confirmar Contraseña</label>
                  <span className="p-float-label">
                    <Controller
                      name="confirm_password"
                      control={control}
                      rules={{
                        required: 'Confirmar contraseña es requerido.',
                        validate: value => value === password || 'Las contraseñas no coinciden'
                      }}
                      render={({ field, fieldState }) => (
                        <Password
                          id={field.name}
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                          toggleMask
                          feedback={false}
                        />
                      )}
                    />
                  </span>
                  {getFormErrorMessage('confirm_password')}
                </div>
              </div>

              <Button label="Submit" type='submit' icon="pi pi-check" iconPos="right" className="mt-3" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormUser;
