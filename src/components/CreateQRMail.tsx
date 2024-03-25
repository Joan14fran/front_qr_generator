import React, { useState, useRef, FormEvent } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { createEmailQR } from '../api/qrs.api';
import QRCode from 'qrcode.react';

interface QR {
  user: string;
  nombre: string;
  tamaño: number;
  redundancia: string;
  contenido: string;
}

export function CreateQRMail() {
  const [qrContent, setQRContent] = useState('');
  const [qrName, setQRName] = useState('');
  const [qrSize, setQRSize] = useState<number>(128);
  const [qrErrorCorrection, setQRErrorCorrection] = useState<string>('L');
  const toast = useRef<any>(null);

  const handleGenerateQR = async (e: FormEvent) => {
    e.preventDefault();
    if (!qrName || !qrContent) {
      showToast('error', 'Error', 'El nombre y el correo son obligatorios');
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
      const response = await createEmailQR(qr);
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
        <Card title="Crear QRs">
          <Toast ref={toast} />
          <form onSubmit={handleGenerateQR}>

            <div className="row m-2">
              <div className="col-12 col-md-6">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    Nombre:
                  </span>
                  <InputText value={qrName} onChange={(e) => setQRName(e.target.value)} />
                </div>
              </div>
              <br />
              <div className="col-12 col-md-6 mt-2 mt-md-0">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    Correo:
                  </span>
                  <InputText value={qrContent} onChange={(e) => setQRContent(e.target.value)} />
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
            <div className="row m-2">
              <div className="col-12 col-md-6">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">
                    Tamaño
                  </span>
                  <Dropdown value={qrSize} options={sizeOptions} onChange={(e) => setQRSize(e.value as number)} />
                </div>
              </div>
              <br />
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
            <br />
          </form>
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
    </div>

  );
}

