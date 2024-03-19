import React, { useState, useEffect } from 'react';
import { SidebarComp } from '../components/SidebarComp';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users.api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useForm } from 'react-hook-form';

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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const { register, handleSubmit, reset } = useForm<User>();

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
      if (selectedUserForEdit) {
        await updateUser(selectedUserForEdit.id, data);
      } else {
        await createUser(data);
      }
      setDisplayDialog(false);
      reset();
      // Actualizar la lista de usuarios
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
    }
  };

  const onDelete = async () => {
    if (!selectedUser) return;

    try {
      await deleteUser(selectedUser.id);
      setSelectedUser(null);
      // Actualizar la lista de usuarios
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const onEdit = (user: User) => {
    setSelectedUser(user);
    setSelectedUserForEdit(user);
    setDisplayDialog(true);
  };

  return (
    <div className='p-4'>
      <SidebarComp />
      <div className="card">
        <Button label="Crear Usuario" icon="pi pi-plus" className="p-button-success mt-3 mb-3" onClick={() => {
          setSelectedUserForEdit(null);
          setDisplayDialog(true);
        }} />
        <Button label="Eliminar Usuario" icon="pi pi-trash" className="p-button-danger mt-3 mb-3" onClick={onDelete} disabled={!selectedUser} />
        <DataTable value={users} paginator rows={10} dataKey="id" selectionMode="single" selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)}>
          <Column field="id" header="ID" />
          <Column field="nombre" header="Nombre" />
          <Column field="apellido" header="Apellido" />
          <Column field="username" header="Username" />
          <Column field="email" header="Email" />
          <Column field="is_staff" header="Admin" />
          <Column field="is_active" header="Activo" />
          <Column
            body={(rowData) => (
              <Button label="Editar" className="p-button-primary" onClick={() => onEdit(rowData)} />
            )}
          />
        </DataTable>
      </div>
      <Dialog visible={displayDialog} onHide={() => {
        setSelectedUserForEdit(null);
        setDisplayDialog(false);
      }} header={selectedUserForEdit ? "Editar Usuario" : "Crear Usuario"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="nombre">Nombre</label>
              <input type="text" {...register('nombre', { required: true })} defaultValue={selectedUserForEdit?.nombre} />
            </div>
            <div className="p-field">
              <label htmlFor="apellido">Apellido</label>
              <input type="text" {...register('apellido', { required: true })} defaultValue={selectedUserForEdit?.apellido} />
            </div>
            <div className="p-field">
              <label htmlFor="username">Username</label>
              <input type="text" {...register('username', { required: true })} defaultValue={selectedUserForEdit?.username} />
            </div>
            <div className="p-field">
              <label htmlFor="email">Email</label>
              <input type="email" {...register('email', { required: true })} defaultValue={selectedUserForEdit?.email} />
            </div>
            <div className="p-field">
              <label htmlFor="password">Contraseña</label>
              <input type="password" {...register('password', { required: true })} />
            </div>
          </div>
          <Button type="submit" label="Guardar" className="p-button-success" />
          <Button label="Crear Usuario" icon="pi pi-plus" className="p-button-success mt-3 mb-3" onClick={() => {
            setSelectedUser(null); // Asegurar que selectedUser se restablezca a null
            setDisplayDialog(true);
          }} />
        </form>
      </Dialog>
    </div>
  );
}
