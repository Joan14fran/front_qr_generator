import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Paginator } from 'primereact/paginator';
import { FilterMatchMode } from 'primereact/api';
import { SidebarComp } from '../components/SidebarComp';

import { getUsers } from '../api/users.api';

export function ListUsers() {
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [usersData, setUsersData] = useState([]); // Estado para almacenar los datos de los usuarios
  const [totalRecords, setTotalRecords] = useState(0); // Estado para almacenar el número total de registros

  const columns = [
    { field: 'nombre', header: 'Nombre', filter: true, filterMatchMode: FilterMatchMode.CONTAINS },
    { field: 'apellido', header: 'Apellido', filter: true, filterMatchMode: FilterMatchMode.CONTAINS },
    { field: 'username', header: 'Username', filter: true, filterMatchMode: FilterMatchMode.CONTAINS },
    { field: 'email', header: 'Email', filter: true, filterMatchMode: FilterMatchMode.CONTAINS },
    { field: 'estatus', header: 'Estatus', filter: true, filterMatchMode: FilterMatchMode.EQUALS, filterType: 'boolean' },
  ];

  useEffect(() => {
    // Función para obtener la lista de usuarios cuando el componente se monta
    const fetchUsers = async () => {
      try {
        const response = await getUsers(); // Llama a la función getUsers para obtener la lista de usuarios
        setUsersData(response.data); // Actualiza el estado con los datos de los usuarios recibidos del servidor
        setTotalRecords(response.data.length); // Actualiza el estado con el número total de registros
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
      }
    };

    fetchUsers(); // Llama a la función para obtener la lista de usuarios cuando el componente se monta
  }, []);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <div className='p-4'>
      <SidebarComp />
      <DataTable value={usersData} first={first} rows={rows} totalRecords={totalRecords} paginator={true} onPage={onPageChange}>
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            filter={col.filter}
            filterMatchMode={col.filterMatchMode}
            filterType={col.filterType}
          />
        ))}
      </DataTable>
    </div>
  );
}

export default ListUsers;
