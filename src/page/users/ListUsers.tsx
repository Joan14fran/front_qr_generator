import React, { useState, useEffect, useRef } from 'react';
import { SidebarComp } from '../../components/SidebarComp';
import { getUsers, createUser, deleteUser, updateUser } from '../../api/users.api';
import { classNames } from 'primereact/utils';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
// import { Password } from 'primereact/password';
import { Controller, useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

import { Fieldset } from 'primereact/fieldset'
import { Card } from 'primereact/card'


interface User {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  is_staff: boolean;
  is_active: boolean;
}

const defaultFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  nombre: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  apellido: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  username: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  email: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  is_staff: {
    operator: FilterOperator.OR,
    constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
  },
  is_active: { value: null, matchMode: FilterMatchMode.EQUALS },
};

export function ListUsers() {

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const toast = useRef(null);

  const [statuses] = useState<boolean[]>([true, false]);

  const getSeverity = (status: boolean) => {
    return status ? 'success' : 'danger';
  };

  const statusBodyTemplate = (rowData: User) => {
    return <Tag value={rowData.is_staff ? 'Admin' : 'No Admin'} severity={getSeverity(rowData.is_staff)} />;
  };

  const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses.map(status => ({ label: status ? 'Admin' : 'No Admin', value: status }))}
        onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)}
        itemTemplate={statusItemTemplate}
        placeholder="Select One"
        className="p-column-filter"
        showClear
      />
    );
  };

  const statusItemTemplate = (option: { label: string, value: boolean }) => {
    return <Tag value={option.label} severity={getSeverity(option.value)} />;
  };

  const { control, handleSubmit, reset, formState: { errors }, watch } = useForm<User>();




  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };


  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        {/* <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined onClick={clearFilter} /> */}
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    );
  };


  const verifiedBodyTemplate = (rowData: User) => {
    return <i className={classNames('pi', { 'text-success pi-check-circle': rowData.is_active, 'text-danger pi-times-circle': !rowData.is_active })}></i>;
  };

  const verifiedFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <div className="flex align-items-center gap-2">
        <label htmlFor="verified-filter" className="font-bold">
          Verified
        </label>
        <TriStateCheckbox id="verified-filter" value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterCallback(e.value)} />
      </div>
    );
  };

  const header = renderHeader();



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    };

    fetchUsers();
  }, []);


  const onSubmit = async (data: User) => {
    try {
      if (!editMode) {
        // Crear usuario
        await createUser(data);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Usuario creado correctamente',
          life: 3000,
          className: 'custom-toast-success',
        });
      } else {
        // Actualizar usuario
        if (!data.password) {
          // Si no se ha ingresado una nueva contraseña, eliminar el campo de contraseña de los datos enviados
          delete data.password;
        }
        await updateUser(selectedUser!.id, data);
        toast.current?.show({
          severity: 'info',
          summary: 'Éxito',
          detail: 'Usuario actualizado correctamente',
          life: 3000,
          className: 'custom-toast-success',
        });
      }
      setDisplayDialog(false);
      reset();
      setEditMode(false);
      // Actualizar la lista de usuarios
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al guardar el usuario',
        life: 3000,
        className: 'custom-toast-error',
      });
      console.error('Error al guardar usuario:', error);
    }
  };



  const onDelete = async () => {
    if (!selectedUser) return;
    setDisplayConfirmation(true);
  };


  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser!.id);
      setSelectedUser(null);
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Usuario creado correctamente',
        life: 3000,
        className: 'custom-toast-success',
      });
      // Actualizar la lista de usuarios
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    } finally {
      setDisplayConfirmation(false);
    }
  };


  const onEdit = () => {
    if (!selectedUser) return;
    reset(selectedUser);
    setEditMode(true);
    setDisplayDialog(true);
  };

  const getFormErrorMessage = (name: string) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
  };

  const butoonAction = (
    <React.Fragment>
      <Button icon="pi pi-plus" className="p-button-success" onClick={() => {
        reset(); // Restablecer todos los campos del formulario
        setEditMode(false); // Asegurar que editMode esté en false
        setSelectedUser(null); // Limpiar el usuario seleccionado al abrir el diálogo de creación
        setDisplayDialog(true);
      }}
      />

      &nbsp;
      <Button icon="pi pi-pencil" className="p-button-warning" onClick={onEdit} disabled={!selectedUser} />
      &nbsp;
      <Button icon="pi pi-trash" className="p-button-danger" onClick={onDelete} disabled={!selectedUser} />
    </React.Fragment>

  );



  return (
    <div className='p-4'>
      <SidebarComp />
      <Toast ref={toast} />
      <br />
      <Fieldset>

        <Toolbar className="mb-4" start={butoonAction} end={header}></Toolbar>

        <Card title="Lista Usuario">
          <DataTable value={users} filters={filters} globalFilterFields={['nombre', 'apellido', 'username', 'email', 'is_staff']} paginator rows={5} rowsPerPageOptions={[5, 7, 25, 50]} tableStyle={{ minWidth: '50rem' }} dataKey="id" selectionMode="single" selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)}>
            <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
            <Column field="id" header="ID" />
            <Column field="nombre" header="Nombre" filter filterPlaceholder="Search by nombre" style={{ minWidth: '12rem' }} />
            <Column field="apellido" header="Apellido" filter filterPlaceholder="Search by apellido" style={{ minWidth: '12rem' }} />
            <Column field="username" header="Username" filter filterPlaceholder="Search by username" style={{ minWidth: '12rem' }} />
            <Column field="email" header="Email" filter filterPlaceholder="Search by email" style={{ minWidth: '12rem' }} />
            <Column field="is_staff" header="Admin" filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
            <Column field="is_active" header="Activo" dataType="boolean" bodyClassName="text-center" style={{ minWidth: '8rem' }} body={verifiedBodyTemplate} filter filterElement={verifiedFilterTemplate} />
          </DataTable>
        </Card>

      </Fieldset>

      <Dialog visible={displayDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} onHide={() => {
        setDisplayDialog(false);
        reset();
        setEditMode(false);
      }} header={editMode ? "Editar Usuario" : "Crear Usuario"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p>Datos Basicos</p>
          <div className="p-fluid">
            <div className="field">
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
            <div className="field">
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
                      <label htmlFor={field.name}>apellido</label>
                    </span>
                    {getFormErrorMessage('apellido')}
                  </>
                )}
              />
            </div>
            <div className="field">
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
                      <label htmlFor={field.name}>username</label>
                    </span>
                    {getFormErrorMessage('username')}
                  </>
                )}
              />
            </div>
            <div className="field">
              <Controller name="email" control={control} rules={{ required: 'Email es requerido.' }}
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
                      <label htmlFor={field.name}>email</label>
                    </span>
                    {getFormErrorMessage('email')}
                  </>
                )}
              />
            </div>

            {!editMode && (
              <div className="p-field">
                <Controller name="password" control={control} rules={{ required: 'Password es requerido.' }}
                  render={({ field, fieldState }) => (
                    <>
                      <label htmlFor={field.name} className={classNames({ 'p-error': errors.password })}></label>
                      <span className="p-float-label">
                        <InputText
                          id={field.name}
                          type="password"
                          value={field.value}
                          className={classNames({ 'p-invalid': fieldState.error })}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        <label htmlFor={field.name}>password</label>
                      </span>
                      {getFormErrorMessage('password')}
                    </>
                  )}
                />
              </div>
            )}
            <p>Estado Usuario</p>
            <div className="field">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <TriStateCheckbox
                    id="is_active"
                    value={field.value}
                    onChange={(e: TriStateCheckboxChangeEvent) => field.onChange(e.value)}
                  />
                )}
              />
            </div>
          </div>
          <br />
          <Button type="submit" icon='pi pi-check' label="Guardar" className="p-button-success" />
          &nbsp;&nbsp;&nbsp;
          <Button label="Cancelar" icon='pi pi-times' className="p-button-secondary" onClick={() => {
            setDisplayDialog(false);
            reset();
            setEditMode(false);
          }} />
        </form>
      </Dialog>
      <Dialog visible={displayConfirmation} onHide={() => setDisplayConfirmation(false)} header="Confirmar Eliminación"
        footer={
          <div>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={() => setDisplayConfirmation(false)} />
            &nbsp;&nbsp;&nbsp;
            <Button label="Eliminar" icon="pi pi-check" className="p-button-danger" onClick={confirmDelete} />
          </div>
        }
      >
        ¿Estás seguro que deseas eliminar al usuario {selectedUser ? selectedUser.nombre : ''}? <br />
        <Tag className="mr-2" icon="pi pi-info-circle" severity="warning">Usuario <b>{selectedUser ? selectedUser.username : ''}</b> identificado con ID#{selectedUser ? selectedUser.id : ''}</Tag>

      </Dialog>

    </div>
  );
}
