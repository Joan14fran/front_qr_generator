import { SidebarComp } from '../../components/SidebarComp';
import { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { getUserData } from '../../api/users.api';
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

interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  is_staff: boolean;
  is_active: boolean;
}

export function Perfil() {
  const [userData, setUserData] = useState<User | null>(null);
  const [date, setDate] = useState<User | null>(null);
  const [value, setValue] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const cities = [
    { name: 'Hombre', code: 'M' },
    { name: 'Mujer', code: 'F' },
  ];

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



  return (
    <div className='p-4'>
      <SidebarComp />
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
                  <span className="p-float-label m-4">
                    <InputText id="nombre" disabled value={userData.nombre} />
                    <label htmlFor="nombre">Nombre\s:</label>
                  </span>
                  <span className="p-float-label m-4">
                    <InputText id="apellido" disabled value={userData.apellido} />
                    <label htmlFor="apellido">Apellido\s:</label>
                  </span>
                  <span className="p-float-label m-4">
                    <InputText id="username" disabled value={userData.username} />
                    <label htmlFor="username">Username:</label>
                  </span>
                  <span className="p-float-label m-4">
                    <InputText id="email" disabled value={userData.email} />
                    <label htmlFor="email">Email:</label>
                  </span>
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
                  <label htmlFor="nombre">Numero de Telefono</label>
                  <InputMask id="phone" mask="999-999-9999" className='m-2'></InputMask>

                  <label htmlFor="apellido">Fecha de Nacimientos</label>
                  <Calendar id="buttondisplay" value={date} onChange={(e) => setDate(e.value)} className='m-2' />
                  <br />
                  <label htmlFor="nombre">Genero</label> <br />
                  <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                    placeholder="Select a City" className="w-full md:w-14rem m-2" />

                  <Divider />
                </Card>
              </div>
              <div className="col">
                <Card subTitle="Cambiar contraseña">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="nombre">Nueva Contraseña</label> <br />
                      <Password value={value} className='m-2' onChange={(e) => setValue(e.target.value)}  tabIndex={1} toggleMask />
                    </div>
                    <div className="col">
                      <label htmlFor="nombre">Confirmar contraseña</label>
                      <Password value={value} className='m-2' onChange={(e) => setValue(e.target.value)} feedback={false} tabIndex={1} toggleMask />
                    </div>
                  </div>
                  <Divider />
                  <div className="col">
                    <label htmlFor="nombre">Contraseña Actual</label>
                    <Password value={value} className='m-2' onChange={(e) => setValue(e.target.value)} feedback={false} tabIndex={1} toggleMask />
                  </div>
                  <Button label="Cambiar Contraseña" severity="help" rounded />
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
