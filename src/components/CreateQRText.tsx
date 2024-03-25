import React, { useState, useRef, FormEvent } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { createTextoQR } from '../api/qrs.api';
import QRCode from 'qrcode.react';
import { InputText } from 'primereact/inputtext';

interface QR {
  user: string;
  nombre: string;
  tamaño: number;
  redundancia: string;
  contenido: string;
}

export function CreateQRText() {
  const [qrContent, setQRContent] = useState('');
  const [qrName, setQRName] = useState('');
  const [qrSize, setQRSize] = useState<number>(128);
  const [qrErrorCorrection, setQRErrorCorrection] = useState<string>('L');
  const toast = useRef<any>(null);

  const handleGenerateQR = async (e: FormEvent) => {
    e.preventDefault(); // Evitar la recarga de la página
    if (!qrName || !qrContent) {
      showToast('error', 'Error', 'El nombre y el contenido son obligatorios');
      return;
    }

    const qr: QR = {
      user: localStorage.getItem('user_id') || '',
      nombre: qrName,
      tamaño: qrSize,
      redundancia: qrErrorCorrection,
      contenido: qrContent
    };

    try {
      const response = await createTextoQR(qr);
      console.log('QR creado exitosamente:', response.data);
      showToast('success', 'Éxito', 'El QR se creó exitosamente');
    } catch (error) {
      console.error('Error al crear el QR:', error.response);
      showToast('error', 'Error', 'Error al crear el QR. Inténtalo de nuevo más tarde');
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr_code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const showToast = (severity: string, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail });
    }
  };

  const sizeOptions = [
    { label: '128', value: 128 },
    { label: '256', value: 256 },
    { label: '512', value: 512 },
  ];

  const errorCorrectionOptions = [
    { label: 'Baja (7%)', value: 'L' },
    { label: 'Media (15%)', value: 'M' },
    { label: 'Alta (25%)', value: 'Q' },
    { label: 'Máxima (30%)', value: 'H' },
  ];

  return (
    <div className='p-2 p-md-4'>
      <Fieldset>
        <Card title="Crear QR de Texto">
          <Toast ref={toast} />
          <form onSubmit={handleGenerateQR}>
            <div className="container">
              <div className="row">
                <div className="col-12 col-md-6">
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      Nombre:
                    </span>
                    <InputText value={qrName} onChange={(e) => setQRName(e.target.value)} />
                  </div>
                </div>
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                      Contenido:
                    </span>
                    <InputTextarea rows={2} value={qrContent} onChange={(e) => setQRContent(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <br />
            <div className="d-flex justify-content-center">
              {qrContent && (
                <div className="mt-3">
                  <QRCode value={qrContent} size={qrSize} level={qrErrorCorrection} />
                </div>
              )}
            </div>
            <br />
            <div className="row m-1">
              <div className="col-12 col-md-6">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    Tamaño
                  </span>
                  <Dropdown value={qrSize} options={sizeOptions} onChange={(e) => setQRSize(e.value as number)} />
                </div>
              </div>
              <div className="col-12 col-md-6 mt-2 mt-md-0">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    Redundancia
                  </span>
                  <Dropdown value={qrErrorCorrection} options={errorCorrectionOptions} onChange={(e) => setQRErrorCorrection(e.value as string)} />
                </div>
              </div>
            </div>
            <br />
            <div className="col-12 col-md-6">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon" style={{ width: '100%' }}>
                  Guardar y Administrar QR
                </span>
                <Button icon="pi pi-cog" severity="secondary" type="submit" style={{ width: '40%' }} />
                <i className="pi pi-question m-2 m-md-4" style={{ color: 'var(--primary-color)' }}></i>
              </div>
            </div>

          </form>
          <br />
          <div className="col-12 col-md-6 mt-2 mt-md-0">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon" style={{ width: '100%' }}>
                Descargar QR
              </span>
              <Button icon="pi pi-download" severity="help" onClick={handleDownloadQR} style={{ width: '40%' }} />
              <i className="pi pi-question m-2 m-md-4" style={{ color: 'var(--primary-color)' }}></i>
            </div>
          </div>
        </Card>
      </Fieldset>
    </div >

  );
}
