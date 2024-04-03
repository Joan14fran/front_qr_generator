import { SidebarComp } from '../../components/SidebarComp';
import { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { getUserData, updateUser, changePassword } from '../../api/users.api';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { Toast } from 'primereact/toast';

interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  is_staff: boolean;
  is_active: boolean;
  fecha_nacimiento: Date;
  numero_celular: string;
  genero: string;
  new_password: string;
  confirm_password: string;
  current_password: string;
}

export const Perfil: React.FC = () => {
  const toast = useRef(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading] = useState<boolean>(false);
  const { control: controlAdditionalData, handleSubmit: handleSubmitAdditionalData, formState: { errors: errorsAdditionalData } } = useForm();
  const { control: controlChangePassword, handleSubmit: handleSubmitChangePassword, formState: { errors: errorsChangePassword }, reset: resetChangePassword } = useForm();


  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getUserData();
        setUserData(response.data);
      } catch (error: any) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };
    fetchData();
  }, []);

  if (!userData) {
    return <div>Cargando...</div>;
  }


  const generos = [
    { name: 'Maculino', value: 'M' },
    { name: 'Femenino', value: 'F' },
    { name: 'Otro', value: 'O' },
  ];
  const onSubmitAdditionalData = async (data) => {
    try {
      const fechaNacimiento = data.fecha_nacimiento;
      const fechaNacimientoFormateada = new Date(fechaNacimiento).toISOString().split('T')[0];

      const datosActualizados = {
        ...userData,
        fecha_nacimiento: fechaNacimientoFormateada,
        numero_celular: data.numero_celular,
        genero: data.genero,
      };

      await updateUser(userData.id, datosActualizados);

      // Mostrar Toast de éxito
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Los datos del usuario se actualizaron correctamente.' });

    } catch (error) {
      // Mostrar Toast de error
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al actualizar los datos del usuario.' });
      console.error('Error al actualizar los datos del usuario:', error);
    }
  };


  const onSubmitChangePassword = async (data) => {
    try {
      // Realizar la solicitud al backend para cambiar la contraseña
      await changePassword(data.current_password, data.new_password);

      // Si la solicitud se completa con éxito, muestra un mensaje de éxito usando Toast
      toast.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Contraseña cambiada exitosamente' });

      // Reiniciar el formulario
      resetChangePassword({
        new_password: '',
        confirm_password: '',
        current_password: '',
      });
    } catch (error) {
      // Si la solicitud falla, muestra un mensaje de error usando Toast
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cambiar la contraseña' });
      console.error('Error al cambiar la contraseña:', error);
    }
  };


  const getFormErrorMessageAditional = (name: string) => {
    return errorsAdditionalData[name] ? <small className="p-error">{errorsAdditionalData[name].message}</small> : null;
  };

  const getFormErrorMessageChangaP = (name: string) => {
    return errorsChangePassword[name] ? <small className="p-error">{errorsChangePassword[name].message}</small> : null;
  };


  const legendTemplate = (
    <div className="flex align-items-center gap-2 px-2">
      <Avatar icon="pi pi-user" shape="circle" className="m-2" />
      <span className="font-bold">{userData.nombre} {userData.apellido}</span>
    </div>
  );

  const BooleanActiveUser = (rowData: User) => {
    return (
      <i
        className={classNames('pi', {
          'text-success pi-check-circle': rowData.is_active,
          'text-danger pi-times-circle': !rowData.is_active
        })}
      ></i>
    );
  };

  const BooleanStaffUser = (rowData: User) => {
    return (
      <i
        className={classNames('pi', {
          'text-success pi-check-circle': rowData.is_staff,
          'text-danger pi-times-circle': !rowData.is_staff
        })}
      ></i>
    );
  };

  return (
    <div className='p-4'>
      <SidebarComp />
      <Toast ref={toast} />
      <br />
      <Fieldset legend={legendTemplate} className='p-4'>
        <p className="m-0">
          Bienvenido usuario <b>{userData.username}</b> a tu perfil y al sistema QR.
          <br />
          Apartado para visualizar datos de usuario autenticado, podrás visualizar datos básicos (nombre, apellido, username, email, is_staff y is_active).
        </p>
        <Divider />
        <Card title='Datos Usuario'>
          <div className="container text-center">
            <div className="row">
              <div className="col">
                <Card subTitle="Datos Básicos">
                  <div className='p-fluid'>
                    <span className="p-float-label">
                      <InputText id="nombre" className='m-2' disabled value={userData.nombre} />
                      <label htmlFor="nombre">Nombre:</label>
                    </span>
                  </div>
                  <br />
                  <div className='p-fluid'>
                    <span className="p-float-label">
                      <InputText id="apellido" className='m-2' disabled value={userData.apellido} />
                      <label htmlFor="apellido">Apellido:</label>
                    </span>
                  </div>


                  <br />
                  <div className='p-fluid'>
                    <span className="p-float-label">
                      <InputText id="username" className='m-2' disabled value={userData.username} />
                      <label htmlFor="username">Username:</label>
                    </span>
                  </div>

                  <br />
                  <div className='p-fluid'>
                    <span className="p-float-label">
                      <InputText id="email" className='m-2' disabled value={userData.email} />
                      <label htmlFor="email">Email:</label>
                    </span>
                  </div>



                  <Divider />
                  <figure>
                    <blockquote className="blockquote">
                      <p>Quién eres en el sistema</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                      Identificamos a nuestros usuarios por estado y privilegios<cite title="Source Title"></cite>
                    </figcaption>
                    <div className="row">
                      <div className="col">
                        Estado <br />
                        {BooleanActiveUser(userData)}
                      </div>
                      <div className="col">
                        Privilegios <br />
                        {BooleanStaffUser(userData)}
                      </div>
                    </div>
                  </figure>
                </Card>
              </div>

              <div className="col">
                <Card subTitle="Completar Datos Adicionales">
                  <form onSubmit={handleSubmitAdditionalData(onSubmitAdditionalData)}>
                    <div className="row">
                      <div className="p-fluid">
                        <Controller
                          name="fecha_nacimiento"
                          control={controlAdditionalData}
                          rules={{ required: 'Fecha Nacimiento es requerido.' }}
                          defaultValue={userData.fecha_nacimiento ? new Date(userData.fecha_nacimiento) : null} // Asigna el valor actual del usuario
                          render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                <Calendar
                                  inputId={field.name}
                                  value={field.value}
                                  onChange={field.onChange}
                                  dateFormat="dd/mm/yy"
                                  className={classNames({ 'p-invalid': fieldState.error })} showIcon
                                />
                                <label htmlFor={field.name}>Fecha Nacimiento</label>
                              </span>
                              {getFormErrorMessageAditional(field.name)}
                            </>
                          )}
                        />
                      </div>
                      <br /><br /><br />
                      <div className="p-fluid">
                        <Controller
                          name="numero_celular"
                          control={controlAdditionalData}
                          rules={{ required: 'Numero Celular is required.' }}
                          defaultValue={userData.numero_celular} // Asigna el valor actual del usuario
                          render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                <InputMask
                                  id={field.name}
                                  value={field.value}
                                  mask="999-999-9999"
                                  className={classNames({ 'p-invalid': fieldState.error })}
                                  onChange={(e) => field.onChange(e.target.value)}
                                />
                                <label htmlFor={field.name}>Numero Celular</label>
                              </span>
                              {getFormErrorMessageAditional(field.name)}
                            </>
                          )}
                        />
                      </div>
                      <br /><br /><br />
                      <Divider />
                      <div className="p-fluid">
                        <label htmlFor="genero">Género</label><br />
                        <Controller
                          name="genero"
                          control={controlAdditionalData}
                          rules={{ required: 'Genero is required.' }}
                          defaultValue={userData.genero ? userData.genero : null} // Asigna el valor actual del usuario
                          render={({ field, fieldState }) => (
                            <Dropdown
                              id={field.name}
                              value={field.value || userData.genero} // Asignar userData.genero como valor inicial
                              optionLabel="name"
                              placeholder="Select a City"
                              options={generos}
                              onChange={(e) => field.onChange(e.value)}
                              className={classNames({ 'p-invalid': fieldState.error })}
                            />
                          )}
                        />
                        {getFormErrorMessageAditional('genero')}
                      </div>
                    </div>
                    <br />
                    <Button type='submit' severity="info" label="Guardar Cambios" disabled={isLoading} />
                  </form>
                  <Divider />
                </Card>
              </div>


              <div className="col">
                <Card subTitle="Cambiar contraseña">
                  <form onSubmit={handleSubmitChangePassword(onSubmitChangePassword)}>
                    <div className="row">
                      <br />
                      <div className="p-fluid">
                        <Controller
                          name="new_password"
                          control={controlChangePassword}
                          rules={{ required: 'Nueva Contraseña is required.' }}
                          render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                <Password id={field.name} {...field} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} toggleMask />
                                <label htmlFor={field.name} className={classNames({ 'p-error': errorsChangePassword.nombre })}>
                                  Nueva Contraseña
                                </label>
                              </span>
                              {getFormErrorMessageChangaP(field.name)}
                            </>
                          )}
                        />
                      </div>
                      <br /><br /><br />
                      <div className="p-fluid">
                        <Controller
                          name="confirm_password"
                          control={controlChangePassword}
                          rules={{ required: 'Confirmar Contraseña is required.' }}
                          render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                <Password id={field.name} {...field} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} feedback={false} toggleMask />
                                <label htmlFor={field.name} className={classNames({ 'p-error': errorsChangePassword.nombre })}>
                                  Confirmar Contraseña
                                </label>
                              </span>
                              {getFormErrorMessageChangaP(field.name)}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <Divider />
                    <br />
                    <div className="row">
                      <div className="p-fluid">
                        <Controller
                          name="current_password"
                          control={controlChangePassword}
                          rules={{ required: 'Contraseña Actual is required.' }}
                          render={({ field, fieldState }) => (
                            <>
                              <span className="p-float-label">
                                <Password id={field.name} {...field} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} feedback={false} toggleMask />
                                <label htmlFor={field.name} className={classNames({ 'p-error': errorsChangePassword.nombre })}>
                                  Contraseña Actual
                                </label>
                              </span>

                              {getFormErrorMessageChangaP(field.name)}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <Button type='submit' severity="success" label="Cambiar Contraseña" className='m-3' rounded />
                    <Divider />
                  </form>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </Fieldset>
    </div>
  );
};

export default Perfil;
