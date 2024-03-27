import { useEffect, useState, useRef } from 'react';
import { SidebarComp } from '../../components/SidebarComp';
import { Fieldset } from 'primereact/fieldset';
import { DataView } from 'primereact/dataview';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext'
import { Dialog } from 'primereact/dialog';
import QRCode from 'qrcode.react';
import { getQRs, updateQR, deleteQR } from '../../api/qrs.api';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';

interface QR {
  id: number;
  nombre: string;
  contenido: string;
  tamaño: number;
  redundancia: string;
  user: number;
}

export function ListQrs() {
  const [user, setUser] = useState<number | null>(null);
  const [qrs, setQRs] = useState<QR[]>([]);
  const [selectedQR, setSelectedQR] = useState<QR | null>(null);
  const [displayUpdateDialog, setDisplayUpdateDialog] = useState(false);
  const [displayDeleteDialog, setDisplayDeleteDialog] = useState(false);
  const [updatedQRData, setUpdatedQRData] = useState<Partial<QR>>({});
  const toast = useRef<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setUser(parseInt(userId)); // Convertir el ID a número
      fetchQRs(parseInt(userId));
    }
  }, []);

  const fetchQRs = async (userId: number) => {
    try {
      const response = await getQRs();
      const userQRs = response.data.filter(qr => qr.user === userId);
      setQRs(userQRs);
    } catch (error) {
      console.error('Error al obtener la lista de QRs:', error);
    }
  };

  const showUpdateDialog = (qr: QR) => {
    setSelectedQR(qr);
    setUpdatedQRData({}); // Limpiar datos actualizados
    setDisplayUpdateDialog(true);
  };

  const showDeleteDialog = (qr: QR) => {
    setSelectedQR(qr);
    setDisplayDeleteDialog(true);
  };

  const hideDialogs = () => {
    setDisplayUpdateDialog(false);
    setDisplayDeleteDialog(false);
  };

  const updateQRHandler = async () => {
    if (selectedQR) {
      try {
        const updatedQR = { ...selectedQR, ...updatedQRData };
        await updateQR(selectedQR.id, updatedQR);
        toast.current?.show({
          severity: 'success',
          summary: 'Éxito',
          detail: 'QR Actualizado correctamente',
          life: 3000,
          className: 'custom-toast-success',
        });
        hideDialogs();
        fetchQRs(user || 0); // Actualizar la lista después de la actualización
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al actualizar QR',
          life: 3000,
          className: 'custom-toast-error',
        });
        console.error('Error al actualizar el QR:', error);
      }
    }
  };

  const tamañoOptions = [
    { label: '128', value: 128 },
    { label: '256', value: 256 },
    { label: '512', value: 512 },
  ];

  const redundanciaOptions = [
    { label: 'Baja (7%)', value: 'L' },
    { label: 'Media (15%)', value: 'M' },
    { label: 'Alta (25%)', value: 'Q' },
    { label: 'Máxima (30%)', value: 'H' },
  ];


  const deleteQRHandler = async () => {
    if (selectedQR) {
      try {
        await deleteQR(selectedQR.id);
        toast.current?.show({
          severity: 'info',
          summary: 'Éxito',
          detail: 'QR eliminado correctamente',
          life: 3000,
          className: 'custom-toast-success',
        });
        hideDialogs();
        fetchQRs(user || 0); // Actualizar la lista después de la eliminación
      } catch (error) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un error al eliminar QR',
          life: 3000,
          className: 'custom-toast-error',
        });
        console.error('Error al eliminar el QR:', error);
      }
    }
  };

  const updateField = (key: keyof QR, value: any) => {
    setUpdatedQRData(prevData => ({ ...prevData, [key]: value }));
  };

  const downloadQR = (qr: QR) => {
    try {
      const canvas = document.getElementsByTagName('canvas')[0];
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'qr_code.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Mostrar el toast después de la descarga exitosa
      toast.current?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'El QR se descargó correctamente',
        life: 3000, // Duración del toast en milisegundos
        className: 'custom-toast-success',
      });
    } catch (error) {
      console.error('Error al generar el QR:', error);
      // Mostrar un toast de error si ocurre algún problema
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un error al generar el QR',
        life: 3000,
        className: 'custom-toast-error',
      });
    }
  };

  const itemTemplate = (qr: QR) => {
    return (
      <Panel key={qr.id} className='m-2'>

        <div className="container text-center">
          <div className="row">
            <div className="col-lg-2">
              <div className="text-center">
                <QRCode value={qr.contenido} level={qr.redundancia.toUpperCase()} style={{ width: '140px', height: '140px' }} />
              </div>
            </div>
            <div className="col">
              <Card title={qr.nombre} subTitle={qr.contenido}>
                <div className="row">
                  {/* Aquí puedes agregar más contenido si es necesario */}
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <p>
                      Tamaño: &nbsp;
                      <span className="badge bg-warning">{qr.tamaño}</span>
                    </p>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <p>
                      Redundancia: &nbsp;
                      <span className="badge bg-info">{qr.redundancia}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="col-lg-2">
              <Card>
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <Button icon="pi pi-pencil" severity='info' onClick={() => showUpdateDialog(qr)} />
                  <Button icon="pi pi-trash" severity='danger' className="btn-danger" onClick={() => showDeleteDialog(qr)} />
                  <Button icon="pi pi-download" severity='success' className="btn-success" onClick={() => downloadQR(qr)} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Panel>

    );
  };

  return (
    <div className='p-4'>
      <SidebarComp />
      <Toast ref={toast} />
      <br />
      <Fieldset>
        <Card title="Lista QRs">
          <div className="p-grid">
            <div className="p-col">
              <Button label="Refresh" icon="pi pi-undo" onClick={() => fetchQRs(user || 0)} />
            </div>
          </div>
          <DataView
            value={qrs}
            itemTemplate={itemTemplate}
            paginator
            rows={3}
            paginatorPosition="both"
            rowsPerPageOptions={[3, 5, 10]}
          />
          <Dialog
            visible={displayUpdateDialog}
            onHide={hideDialogs}
            style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Actualizar QR"
            footer={<div>
              <Button label="Cancelar" icon="pi pi-times" onClick={hideDialogs} className="p-button-text" />
              <Button label="Actualizar" icon="pi pi-check" onClick={updateQRHandler} autoFocus />
            </div>}
          >
            <div className="card p-grid p-fluid">
              <div className="p-col-4">
                <div className="flex justify-content-center">
                  <span className="p-float-label">
                    <InputText id="nombre" value={updatedQRData.nombre || selectedQR?.nombre || ''} onChange={(e) => updateField('nombre', e.target.value)} />
                    <label htmlFor="nombre">Nombre QR</label>
                  </span>
                </div>
              </div>
              <br />
              <div className="p-col-4">
                <div className="flex justify-content-center">
                  <span className="p-float-label">
                    <InputText id="contenido" value={updatedQRData.contenido || selectedQR?.contenido || ''} onChange={(e) => updateField('contenido', e.target.value)} />
                    <label htmlFor="contenido">Contenido QR</label>
                  </span>
                </div>
              </div>
              <br />
              <div className="p-col-2">
                <span className="p-float-label">
                  <Dropdown id="tamaño" value={updatedQRData.tamaño || selectedQR?.tamaño || 0} options={tamañoOptions} onChange={(e) => updateField('tamaño', e.value)} optionLabel="label" />
                  <label htmlFor="tamaño">Tamaño</label>
                </span>
              </div>
              <br />
              <div className="p-col-2">
                <span className="p-float-label">
                  <Dropdown id="redundancia" value={updatedQRData.redundancia || selectedQR?.redundancia || ''} options={redundanciaOptions} onChange={(e) => updateField('redundancia', e.value)} optionLabel="label" />
                  <label htmlFor="redundancia">Redundancia</label>
                </span>
              </div>
            </div>
          </Dialog>
          <Dialog
            visible={displayDeleteDialog}
            onHide={hideDialogs}
            style={{ width: '32rem' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="Eliminar QR"
            footer={
              <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={hideDialogs} className="p-button-text" />
                <Button label="Eliminar" icon="pi pi-trash" onClick={deleteQRHandler} autoFocus className="p-button-danger" />
              </div>
            }
          >
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} /> &nbsp;
              <span>
                ¿Está seguro de eliminar el QR <strong>{selectedQR?.nombre}</strong>?
              </span>
            </div>
          </Dialog>

        </Card>
      </Fieldset>
    </div>
  );
}

export default ListQrs;

