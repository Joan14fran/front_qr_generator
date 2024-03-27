import React, { useState, useEffect } from 'react';
import { SidebarComp } from '../../components/SidebarComp';
import { Fieldset } from 'primereact/fieldset'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ScrollPanel } from 'primereact/scrollpanel';
import { getQRsCard, getQRsEmail, getQRsText, getQRsUrl } from '../../api/qrs.api';

interface QR {
  id: number;
  nombre: string;
  user: number;
}

export function Dashboard() {

  const [qrscards, setQrsCard] = useState<QR[]>([]);
  const [qrsemail, setQrsEmail] = useState<QR[]>([]);
  const [qrstext, setQrsText] = useState<QR[]>([]);
  const [qrsurl, setQrsUrl] = useState<QR[]>([]);

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

  return (
    <div className="p-4">
      <SidebarComp />
      <br />
      <Fieldset>
        <Card title="Dash Board">
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
                        Numero de registros de usuarios <b>11</b>
                      </figcaption>
                    </figure>
                    <Button icon="pi pi-arrow-right" rounded text aria-label="Filter" style={{ height: '100%' }} />
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
                        Numero de registros de QR <b>52</b>
                      </figcaption>
                    </figure>
                    <Button icon="pi pi-arrow-right" rounded severity="warning" text aria-label="Filter" style={{ height: '100%' }} />
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

          <div className="container text-center">
            <div className="row">
              <div className="col">
                <Card title="QRs" subTitle="De tarjeta">
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
                <Card title="QRs" subTitle="De Email">
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
                <Card title="QRs" subTitle="De Texto">
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
                <Card title="QRs" subTitle="De Urls">
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
        </Card>
      </Fieldset>
    </div>
  );
}

export default Dashboard;
