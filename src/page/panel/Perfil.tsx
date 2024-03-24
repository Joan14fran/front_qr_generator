import { SidebarComp } from '../../components/SidebarComp';
import { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { getUserData, updateUser } from '../../api/users.api';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Avatar } from 'primereact/avatar'
import { Divider } from 'primereact/divider'
import { Card } from 'primereact/card'
import { InputMask } from "primereact/inputmask";
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
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
}

export function Perfil() {
  const [userData, setUserData] = useState<User | null>(null);
  const [value, setValue] = useState('');
  const [updatedUserData, setUpdatedUserData] = useState<Partial<User>>({});
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserData();
        setUserData(response.data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    };
    fetchData();
  }, []);

  const handleUpdateUser = async () => {
    setIsLoading(true);
    try {
      // Obtener la fecha de nacimiento en el formato YYYY-MM-DD
      const fechaNacimientoFormatted = updatedUserData.fecha_nacimiento?.toISOString().slice(0, 10);

      // Construir los datos actualizados incluyendo todos los campos del usuario
      const updatedFields = {
        ...userData, // Copiar todos los campos existentes del usuario
        fecha_nacimiento: fechaNacimientoFormatted,
        numero_celular: updatedUserData.numero_celular,
        genero: updatedUserData.genero,
      };

      await updateUser(userData!.id, updatedFields);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Datos actualizados correctamente',
        life: 3000,
        className: 'custom-toast-success',
      });
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al actualizar los datos',
        life: 3000,
        className: 'custom-toast-error',
      });
      console.error('Error al actualizar los datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleInputChange = (fieldName: keyof Partial<User>, value: any) => {
    setUpdatedUserData(prevData => ({
      ...prevData,
      [fieldName]: value
    }));
  };

  if (!userData) {
    return <div>Cargando...</div>;
  }

  const legendTemplate = (
    <div className="flex align-items-center gap-2 px-2">
      <Avatar icon="pi pi-user" shape="circle" className='m-2' />
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

  const showWarn = () => {
    toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Funcion no disponible', life: 3000 });
  }
  return (
    <div className='p-4'>
      <SidebarComp />
      <Toast ref={toast} />
      <br />
      <Fieldset legend={legendTemplate} className='p-4'>
        <p className="m-0">
          Bienvenido usuario <b>{userData.username}</b> a tu perfil y al sistema QR.
          <br />
          Apartado para visualizar datos de usuario autenticado, podra visualizar datos basicos(nombre, apellido, username, email, is_staff y is_active), mas adelante agregar la opcion de completar datos de usuarios,
          donde va poder completar su perfil con datos de numero, fecha_cumpleaños, genero y entreo otros mas.
        </p>
        <Divider />
        <Card title='Datos Usuario'>
          <div className="container text-center">
            <div className="row">
              <div className="col">
                <Card subTitle="Datos Basicos">
                  <label htmlFor="nombre">Nombre\s:</label><br />
                  <InputText id="nombre" className='m-2' disabled value={userData.nombre} />
                  <br />
                  <label htmlFor="apellido">Apellido\s:</label><br />
                  <InputText id="apellido" className='m-2' disabled value={userData.apellido} />
                  <br />
                  <label htmlFor="username">Username:</label><br />
                  <InputText id="username" className='m-2' disabled value={userData.username} />
                  <br />
                  <label htmlFor="email">Email:</label><br />
                  <InputText id="email" className='m-2' disabled value={userData.email} />

                  <Divider />
                  <figure>
                    <blockquote className="blockquote">
                      <p>Quien eres en el sistema</p>
                    </blockquote>
                    <figcaption className="blockquote-footer">
                      Identifiacamos a nuestros usaurios por estado y privilegios<cite title="Source Title"></cite>
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
                  <form onSubmit={handleUpdateUser}>
                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <Calendar id="fecha_nacimiento" dateFormat="yy/mm/dd" className='m-2' value={new Date((updatedUserData.fecha_nacimiento) || (userData.fecha_nacimiento))} onChange={(e) => handleInputChange('fecha_nacimiento', e.value)} />

                    <label htmlFor="numeroCelular">Número de Teléfono</label>
                    <InputMask id="numeroCelular" className='m-2' mask="999-999-9999" value={updatedUserData.numero_celular || userData.numero_celular} onChange={(e) => handleInputChange('numero_celular', e.target.value)} />
                    <br />

                    <label htmlFor="genero">Género</label>
                    <br />
                    <Dropdown id="genero" className='m-2' value={updatedUserData.genero || userData.genero} onChange={(e) => handleInputChange('genero', e.value)}
                      options={[
                        { label: 'Masculino', value: 'M' },
                        { label: 'Femenino', value: 'F' },
                        { label: 'Otro', value: 'O' }
                      ]} />

                    <br />
                    <Button
                      label="Guardar Cambios"
                      onClick={handleUpdateUser}
                      disabled={isLoading}
                    />
                  </form>
                  <Divider />
                </Card>
              </div>
              <div className="col">
                <Card subTitle="Cambiar contraseña">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="nombre">Nueva Contraseña</label> <br />
                      <Password value={value} className='m-2' onChange={(e) => setValue(e.target.value)} tabIndex={1} toggleMask />
                    </div>
                    <div className="col">
                      <label htmlFor="nombre">Confirmar contraseña</label> <br />
                      <Password value={value} className='m-2' onChange={(e) => setValue(e.target.value)} feedback={false} tabIndex={1} toggleMask />
                    </div>
                  </div>
                  <Divider />
                  <div className="col">
                    <label htmlFor="nombre">Contraseña Actual</label> <br />
                    <Password value={value} className='m-2' onChange={(e) => setValue(e.target.value)} feedback={false} tabIndex={1} toggleMask />
                  </div>
                  <Button label="Cambiar Contraseña" onClick={showWarn} severity="help" className='m-3' rounded />
                  <Divider />
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </Fieldset>
    </div>
  );
}

export default Perfil;
