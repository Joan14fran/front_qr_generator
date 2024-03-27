import { useState, useEffect } from 'react';
import { SidebarComp } from '../../components/SidebarComp';
import { Fieldset } from 'primereact/fieldset'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';
import { getQRsCard, getQRsEmail, getQRsText, getQRsUrl } from '../../api/qrs.api';
import { getUsers } from '../../api/users.api'
import { Panel } from 'primereact/panel';
import { Chart } from 'primereact/chart';
import { Link } from 'react-router-dom';

interface QR {
  id: number;
  nombre: string;
  user: number;
}
interface User {
  username: number;
  nombre: string;
  email: number;
  is_active: boolean;
  is_staff: boolean;
}

export function Dashboard() {

  const [qrscards, setQrsCard] = useState<QR[]>([]);
  const [qrsemail, setQrsEmail] = useState<QR[]>([]);
  const [qrstext, setQrsText] = useState<QR[]>([]);
  const [qrsurl, setQrsUrl] = useState<QR[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener Usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getQRsCard();
        setQrsCard(response.data);
      } catch (error) {
        console.error('Error al obtener QR de Tarjeta:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getQRsEmail();
        setQrsEmail(response.data);
      } catch (error) {
        console.error('Error al obtener QR de Email:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getQRsText();
        setQrsText(response.data);
      } catch (error) {
        console.error('Error al obtener QR de Texto:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getQRsUrl();
        setQrsUrl(response.data);
      } catch (error) {
        console.error('Error al obtener QR de Url:', error);
      }
    };

    fetchUsers();
  }, []);

  // Calcular la cantidad de usuarios administradores
  const adminCount = users.filter(user => user.is_staff).length;

  // Calcular la cantidad de usuarios activos e inactivos
  const activeCount = users.filter(user => user.is_active).length;
  const inactiveCount = users.length - activeCount;
  const userRegister = users.length;

  // Configurar los datos del gráfico de barras
  const chartDataUser = {
    labels: ['Administradores', 'Activos', 'Inactivos'],
    datasets: [
      {
        label: 'Cantidad de Usuarios',
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        borderWidth: 1,
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBorderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        data: [adminCount, activeCount, inactiveCount]
      }
    ]
  };

  // Calcular el número de registros de cada tipo de QR
  const qrCardCount = qrscards.length;
  const qrEmailCount = qrsemail.length;
  const qrTextCount = qrstext.length;
  const qrUrlCount = qrsurl.length;

  // Configurar los datos del gráfico
  const chartData = {
    labels: ['Tarjeta', 'Email', 'Texto', 'URL'],
    datasets: [
      {
        data: [qrCardCount, qrEmailCount, qrTextCount, qrUrlCount],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const allQRs = qrCardCount + qrEmailCount + qrTextCount + qrUrlCount;

  return (
    <div className="p-4">
      <SidebarComp />
      <br />
      <Fieldset>
        <Card title="Dash Board">
          <Panel header="Panel">
            <div className="container overflow-hidden text-center">
              <div className="row gx-5">
                <div className="col">
                  <div className="p-3">
                    <Card>
                      <figure>
                        <blockquote className="blockquote">
                          <p>Administrar Usuarios</p>
                        </blockquote>
                        <figcaption className="blockquote-footer">
                          Numero de registros de usuarios <b>{userRegister}</b>
                        </figcaption>
                      </figure>
                      <Link to="/usuarios" >
                        <Button icon="pi pi-arrow-right" rounded text aria-label="Filter" style={{ height: '100%' }} />
                      </Link>
                    </Card>
                  </div>
                </div>
                <div className="col">
                  <div className="p-3">
                    <Card >
                      <figure>
                        <blockquote className="blockquote">
                          <p>Administrar QRs</p>
                        </blockquote>
                        <figcaption className="blockquote-footer">
                          Numero de registros de QR <b>{allQRs}</b>
                        </figcaption>
                      </figure>
                      <Link to="/qrs" >
                        <Button icon="pi pi-arrow-right" rounded severity="warning" text aria-label="Filter" style={{ height: '100%' }} />
                      </Link>
                    </Card>
                  </div>
                </div>
                <div className="col">
                  <div className="p-3">
                    <Card >
                      <figure>
                        <blockquote className="blockquote">
                          <p>Estructura Proyecto</p>
                        </blockquote>
                        <figcaption className="blockquote-footer">
                          documentacion y explicacion del sistema
                        </figcaption>
                      </figure>
                      <Button icon="pi pi-arrow-right" rounded severity="info" text aria-label="Filter" style={{ height: '100%' }} />
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
          <br />
          <Panel header="QRs">
            <div className="container text-center">
              <div className="row">
                <div className="col">
                  <Card subTitle="De tarjeta">
                    <ScrollPanel style={{ width: '100%', height: '200px' }}>
                      <DataTable value={qrscards}>
                        <Column field="id" header="Id"></Column>
                        <Column field="nombre" header="Nombre QR"></Column>
                        <Column field="user" header="User"></Column>
                      </DataTable>
                    </ScrollPanel>
                  </Card>
                </div>
                <div className="col">
                  <Card subTitle="De Email">
                    <ScrollPanel style={{ width: '100%', height: '200px' }}>
                      <DataTable value={qrsemail}>
                        <Column field="id" header="Id"></Column>
                        <Column field="nombre" header="Nombre QR"></Column>
                        <Column field="user" header="User"></Column>
                      </DataTable>
                    </ScrollPanel>
                  </Card>
                </div>
                <div className="col">
                  <Card subTitle="De Texto">
                    <ScrollPanel style={{ width: '100%', height: '200px' }}>
                      <DataTable value={qrstext}>
                        <Column field="id" header="Id"></Column>
                        <Column field="nombre" header="Nombre QR"></Column>
                        <Column field="user" header="User"></Column>
                      </DataTable>
                    </ScrollPanel>
                  </Card>
                </div>
                <div className="col">
                  <Card subTitle="De Urls">
                    <ScrollPanel style={{ width: '100%', height: '200px' }}>
                      <DataTable value={qrsurl}>
                        <Column field="id" header="Id"></Column>
                        <Column field="nombre" header="Nombre QR"></Column>
                        <Column field="user" header="User"></Column>
                      </DataTable>
                    </ScrollPanel>
                  </Card>
                </div>
              </div>
            </div>
          </Panel>
          <br />
          <div className="container text-center">
            <div className="row">
              <br />
              <div className="col">
                <Panel header="Estadisticas Users">
                  <Chart type="bar" data={chartDataUser} />
                </Panel>
              </div>
              <br />
              <div className="col-md-auto">
                <Panel header="Estadisticas QRs">
                  <Chart type="pie" data={chartData} className='' />
                </Panel>
              </div>
            </div>
          </div>
          <br />
          <div className="container text-center">
            <div className="row">

            </div>
          </div>

        </Card>
      </Fieldset>
    </div>
  );
}

export default Dashboard;
