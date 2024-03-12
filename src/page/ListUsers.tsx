import { SidebarComp } from '../components/SidebarComp';
import React, { useState, useEffect } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { classNames } from 'primereact/utils';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { getUsers } from '../api/users.api';
import { FilterMatchMode } from 'primereact/api';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { TriStateCheckbox, TriStateCheckboxChangeEvent } from 'primereact/tristatecheckbox';
import { Tag } from 'primereact/tag';


interface User {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
}

export function ListUsers() {

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    apellido: { value: null, matchMode: FilterMatchMode.CONTAINS },
    username: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    is_staff: { value: null, matchMode: FilterMatchMode.EQUALS },
    is_active: { value: null, matchMode: FilterMatchMode.EQUALS }
  });

  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [statuses] = useState<string[]>(['false', 'true']);

  const getSeverity = (is_staff: boolean) => {
    switch (is_staff) {
      case false:
        return 'danger';

      case true:
        return 'success';

      default:
        return null; // Agrega un caso por defecto o maneja el caso en el que el valor no es booleano
    }
  };

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
      <div className="flex justify-content-end">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    );
  };

  const statusBodyTemplate = (rowData: User) => {
    return <Tag value={rowData.is_staff} severity={getSeverity(rowData.is_staff)} />;
  };

  const statusItemTemplate = (option: string) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const verifiedBodyTemplate = (rowData: User) => {
    return <i className={classNames('pi', { 'text-success pi-check-circle': rowData.is_active, 'text-danger pi-times-circle': !rowData.is_active })}></i>;
  };

  const statusRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterApplyCallback(e.value)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear style={{ minWidth: '12rem' }} />
    );
  };

  const verifiedRowFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return <TriStateCheckbox value={options.value} onChange={(e: TriStateCheckboxChangeEvent) => options.filterApplyCallback(e.value)} />;
  };



  const header = renderHeader();
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const [usersData, setUsersData] = useState<User[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

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

  const [selectedUser, setSelectedUser] = useState(null);



  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const actionBodyTemplate = (rowData: User) => {
    return (
      <div className="p-d-flex p-jc-around">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => handleUpdate(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => handleDelete(rowData.id)} />
      </div>
    );
  };

  const handleUpdate = (rowData: User) => {
  };

  const handleDelete = (userId: number) => {
  };

  return (
    <div className='p-4'>
      <SidebarComp />
      <div className="table-responsive"> {/* Envuelve la tabla en un contenedor responsive */}
        <DataTable value={usersData} stripedRows tableStyle={{ minWidth: '50rem' }} paginator rows={10} dataKey="id"
          filters={filters} filterDisplay="row" globalFilterFields={['nombre', 'apellido', 'username', 'email']} header={header}
          emptyMessage="No customers found." first={first} totalRecords={totalRecords} onPage={onPageChange}
          paginatorLeft={paginatorLeft} paginatorRight={paginatorRight} selectionMode="single" selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)}>
          <Column field="nombre" header="Nombre" filter filterPlaceholder="Buscar por nombre" style={{ width: '25%' }} />
          <Column field="apellido" header="Apellido" filter filterPlaceholder="Buscar por apellido" style={{ width: '25%' }} />
          <Column field="username" header="Username" filter filterPlaceholder="Buscar por username" style={{ width: '25%' }} />
          <Column field="email" header="Email" filter filterPlaceholder="Buscar por email" style={{ width: '25%' }} />
          <Column field="is_staff" header="Admin" showFilterMenu={false} filterMenuStyle={{ width: '25%' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
          <Column field="is_active" header="Active" dataType="boolean" style={{ width: '25%' }} body={verifiedBodyTemplate} filter filterElement={verifiedRowFilterTemplate} />
          <Column body={actionBodyTemplate} style={{ width: '10%', textAlign: 'center' }} />
        </DataTable>
      </div>
    </div>
  );
}

export default ListUsers;
