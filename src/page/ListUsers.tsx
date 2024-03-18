// Importaciones de componentes y funciones necesarias
import { SidebarComp } from '../components/SidebarComp'; // Importa el componente SidebarComp desde la ruta especificada
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'; // Importa React y sus hooks useState, useEffect, useRef, ChangeEvent y FormEvent
import { DataTable, DataTableFilterMeta } from 'primereact/datatable'; // Importa el componente DataTable y el tipo DataTableFilterMeta desde PrimeReact
import { classNames } from 'primereact/utils'; // Importa la función classNames desde PrimeReact para manejar clases de CSS
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'; // Importa el componente Column y el tipo ColumnFilterElementTemplateOptions desde PrimeReact
import { InputText } from 'primereact/inputtext'; // Importa el componente InputText desde PrimeReact para campos de texto
import { Password } from 'primereact/password'; // Importa el componente Password desde PrimeReact para campos de contraseña
import { Button } from 'primereact/button'; // Importa el componente Button desde PrimeReact para botones
import { getUsers, createUser, updateUser } from '../api/users.api'; // Importa las funciones getUsers y createUser desde el archivo users.api en la ruta especificada
import { FilterMatchMode } from 'primereact/api'; // Importa el tipo FilterMatchMode desde PrimeReact para manejar modos de filtro
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'; // Importa el componente Dropdown y el tipo DropdownChangeEvent desde PrimeReact para desplegables
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox'; // Importa el componente TriStateCheckbox y el tipo TriStateCheckboxChangeEvent desde PrimeReact para casillas de verificación de tres estados
import { Tag } from 'primereact/tag'; // Importa el componente Tag desde PrimeReact para etiquetas
import { Dialog } from 'primereact/dialog'; // Importa el componente Dialog desde PrimeReact para diálogos
import { Toolbar } from 'primereact/toolbar'; // Importa el componente Toolbar desde PrimeReact para barras de herramientas
import { Toast } from 'primereact/toast'; // Importa el componente Toast desde PrimeReact para mostrar mensajes emergentes
import { useForm, Controller, SubmitHandler } from 'react-hook-form'; // Importa useForm, Controller y SubmitHandler desde react-hook-form para manejar formularios de React


interface User {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  is_staff: boolean;
  is_active: boolean;
}

export function ListUsers() {
  // Estado inicial del formulario
  const [formData, setFormData] = useState<User>({
    id: 0,
    nombre: '',
    apellido: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    is_staff: false,
    is_active: false
  });

  // Referencia para mostrar toasts
  const toast = useRef<any>(null);

  // Hook useForm para manejar el estado del formulario
  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<User>();

  // Función para manejar la presentación de datos cuando se envía el formulario
  const onSubmit: SubmitHandler<User> = async (data) => {
    const { confirm_password, ...userData } = data;

    try {
      // Llamada a la función para crear un usuario en el servidor
      await createUser(userData);

      // Mostrar mensaje de éxito
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado exitosamente'
      });

      // Limpiar el formulario después de enviarlo
      reset({
        nombre: '',
        apellido: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
      });

      // Cerrar el diálogo de agregar usuario
      setDisplayAddDialog(false);

      // Refrescar los datos de la tabla
      const response = await getUsers();
      setUsersData(response.data);
      setTotalRecords(response.data.length);
    } catch (error) {
      // Mostrar mensaje de error si falla la creación del usuario
      console.error('Error al crear usuario:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al crear usuario. Por favor, inténtelo de nuevo más tarde.'
      });
    }
  };

  const onSubmitEdit: SubmitHandler<User> = async (data) => {
    if (!selectedUser || selectedUser.id === undefined) {
      // Manejar el caso en que selectedUser es null o su id es undefined
      return;
    }

    const { id, ...updatedUserData } = data;

    try {
      // Llamada a la función para actualizar un usuario en el servidor
      await updateUser(selectedUser.id, updatedUserData);

      // Mostrar mensaje de éxito
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario actualizado exitosamente'
      });

      // Cerrar el diálogo de editar usuario
      setDisplayEditDialog(false);

      // Refrescar los datos de la tabla
      const response = await getUsers();
      setUsersData(response.data);
      setTotalRecords(response.data.length);
    } catch (error) {
      // Mostrar mensaje de error si falla la actualización del usuario
      console.error('Error al actualizar usuario:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar usuario. Por favor, inténtelo de nuevo más tarde.'
      });
    }
  };



  // Botones de paginación
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  // Estado y funciones para manejar los filtros de la tabla
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    apellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    is_staff: { value: null, matchMode: FilterMatchMode.EQUALS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  // Estado y funciones para manejar el filtro global de la tabla
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  // Estado y función para manejar los estados de los usuarios
  const [statuses] = useState<string[]>(['false', 'true']);

  // Función para obtener la gravedad del estado del usuario
  const getSeverity = (is_staff: boolean) => {
    switch (is_staff) {
      case false:
        return 'danger';

      case true:
        return 'success';

      default:
        return null;
    }
  };

  // Función para manejar cambios en el filtro global
  const onGlobalFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Renderizado del encabezado de la tabla
  const renderHeader = () => {
    return (
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    );
  };

  // Plantillas para mostrar el estado y verificación de los usuarios
  const statusBodyTemplate = (rowData: User) => {
    return <Tag value={rowData.is_staff} severity={getSeverity(rowData.is_staff)} />;
  };

  const verifiedBodyTemplate = (rowData: User) => {
    return <i className={classNames('pi', { 'text-success pi-check-circle': rowData.is_active, 'text-danger pi-times-circle': !rowData.is_active })}></i>;
  };

  // Plantillas para los filtros de la tabla
  const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)} itemTemplate={(option: string) => <Tag value={option} severity={getSeverity(option === 'true')} />} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
    );
  };

  const verifiedRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return <TriStateCheckbox value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterApplyCallback(e.value)} />;
  };

  // Encabezado de la tabla
  const header = renderHeader();

  // Estados y funciones para la paginación
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  // Obtener datos de usuarios al cargar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsersData(response.data);
        setTotalRecords(response.data.length);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  // Estados para manejar la edición, adición y eliminación de usuarios
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [displayAddDialog, setDisplayAddDialog] = useState(false);
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);

  // Función para manejar cambios de página en la tabla
  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  // Plantillas para las barras de herramientas de la tabla
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={() => setDisplayAddDialog(true)} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return <Button label="Export" icon="pi pi-upload" className="p-button-help" />;
  };

  // Plantilla para los botones de acción en cada fila de la tabla
  const actionBodyTemplate = () => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => {
          if (selectedUser) {
            setFormData(selectedUser); // Establece los datos del usuario seleccionado en el formulario
            setDisplayEditDialog(true); // Muestra el diálogo de edición
          }
        }} />
        &nbsp;
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => setDisplayDeleteDialog(true)} />
      </React.Fragment>
    );
  };

  // Función para ocultar los diálogos de edición, adición y eliminación de usuarios
  const onHide = () => {
    setDisplayAddDialog(false);
    setDisplayEditDialog(false);
    setDisplayDeleteDialog(false);
    setSelectedUser(null);
  };

  // Plantilla para el pie del diálogo de eliminación de usuario
  const deleteDialogFooter = (
    <div>
      <Button label="No" icon="pi pi-times" onClick={onHide} className="p-button-text" />
      <Button label="Yes" icon="pi pi-check" onClick={onHide} autoFocus />
    </div>
  );


  return (
    <div className='p-4'>
      <SidebarComp />
      <div className="card">
        <Toast ref={toast} />
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <div className="table-responsive">
          <DataTable value={usersData} stripedRows paginator rows={10} dataKey="id"
            filters={filters} filterDisplay="row" globalFilterFields={['nombre', 'apellido', 'username', 'email']} header={header}
            emptyMessage="No customers found." first={first} totalRecords={totalRecords} onPage={onPageChange}
            paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} selection={selectedUser} selectionMode="single"
            onSelectionChange={(e) => setSelectedUser(e.value as User)}>
            <Column field="nombre" header="Nombre" filter filterPlaceholder="Buscar por nombre" style={{ width: '25%' }} />
            <Column field="apellido" header="Apellido" filter filterPlaceholder="Buscar por apellido" style={{ width: '25%' }} />
            <Column field="username" header="Username" filter filterPlaceholder="Buscar por username" style={{ width: '25%' }} />
            <Column field="email" header="Email" filter filterPlaceholder="Buscar por email" style={{ width: '25%' }} />
            <Column field="is_staff" header="Admin" showFilterMenu={false} filterMenuStyle={{ width: '25%' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
            <Column field="is_active" header="Active" dataType="boolean" style={{ width: '25%' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate} />
            <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
          </DataTable>
        </div>
      </div>

      <Dialog visible={displayAddDialog} onHide={onHide} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid" header="Agregar Usuario">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="nombre" className="font-bold">Nombre</label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: 'Nombre es requerido.' }}
              render={({ field }) => (
                <>
                  <InputText
                    id="nombre"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
                </>
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="apellido" className="font-bold">Apellido</label>
            <Controller
              name="apellido"
              control={control}
              rules={{ required: 'Apellido es requerido.' }}
              render={({ field }) => (
                <>
                  <InputText
                    id="apellido"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {errors.apellido && <small className="p-error">{errors.apellido.message}</small>}
                </>
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="username" className="font-bold">Username</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: 'Username es requerido.' }}
              render={({ field }) => (
                <>
                  <InputText
                    id="username"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {errors.username && <small className="p-error">{errors.username.message}</small>}
                </>
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="email" className="font-bold">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{ required: 'Email es requerido.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Correo electrónico inválido.' } }}
              render={({ field }) => (
                <>
                  <InputText
                    id="email"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {errors.email && <small className="p-error">{errors.email.message}</small>}
                </>
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="password" className="font-bold">Contraseña</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Contraseña es requerida.' }}
              render={({ field }) => (
                <>
                  <Password
                    id="password"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    toggleMask
                  />
                  {errors.password && <small className="p-error">{errors.password.message}</small>}
                </>
              )}
            />
          </div>
          <div className="field">
            <label htmlFor="confirm_password" className="font-bold">Confirmar Contraseña</label>
            <Controller
              name="confirm_password"
              control={control}
              rules={{ required: 'Confirmar contraseña es requerido.', validate: value => value === watch('password') || 'Las contraseñas no coinciden' }}
              render={({ field }) => (
                <>
                  <Password
                    id="confirm_password"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    toggleMask
                  />
                  {errors.confirm_password && <small className="p-error">{errors.confirm_password.message}</small>}
                </>
              )}
            />
          </div>
          <br />
          <Button type="submit" label="Guardar" />
          <Button type="button" label="Cancelar" onClick={onHide} className="p-button-secondary" />
        </form>
      </Dialog>


      <Dialog visible={displayEditDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} modal className="p-fluid" onHide={() => { setDisplayEditDialog(false); setSelectedUser(null); }}
        header="Edit User"
      >
        <form onSubmit={handleSubmit(onSubmitEdit)}>
          <div className="field">
            <label htmlFor="name" className="font-bold">Nombre</label>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <>
                  <InputText id="name" {...field} value={formData?.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} />
                  {errors.nombre && <small className="p-error">{errors.nombre.message}</small>}
                </>
              )}
            />
          </div>
          <br />
          <div className="field">
            <label htmlFor="apellido" className="font-bold">Apellido</label>
            <Controller
              name="apellido"
              control={control}
              render={({ field }) => (
                <>
                  <InputText id="apellido" {...field} value={formData?.apellido} onChange={(e) => setFormData({ ...formData, apellido: e.target.value })} />
                  {errors.apellido && <small className="p-error">{errors.apellido.message}</small>}
                </>
              )}
            />
          </div>
          <br />
          <div className="field">
            <label htmlFor="username" className="font-bold">Username</label>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <>
                  <InputText id="username" {...field} value={formData?.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                  {errors.username && <small className="p-error">{errors.username.message}</small>}
                </>
              )}
            />
          </div>
          <br />
          <div className="field">
            <label htmlFor="email" className="font-bold">Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <InputText id="email" {...field} value={formData?.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  {errors.email && <small className="p-error">{errors.email.message}</small>}
                </>
              )}
            />
          </div>
          <br />
          {/* Campo de contraseña deshabilitado */}
          <div className="field">
            <label htmlFor="password" className="font-bold">Contraseña</label>
            <InputText id="password" type="password" disabled value="********" />
          </div>
          <br />
          <Button type="submit" label="Guardar" />
          <Button type="button" label="Cancelar" onClick={onHide} className="p-button-secondary" />
        </form>
      </Dialog>


      <Dialog visible={displayDeleteDialog} style={{ width: '30vw' }} onHide={onHide} header="Delete User" footer={deleteDialogFooter}>
        Are you sure you want to delete this user?
      </Dialog>
    </div>
  );
}

export default ListUsers;
