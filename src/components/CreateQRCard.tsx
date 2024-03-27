import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { createTarjetaQR } from '../api/qrs.api'; // Ajustar la función de creación de QR para la tarjeta de presentación
import QRCode from 'qrcode.react';

interface QRCard {
  user: string;
  nombre: string;
  tamaño: number;
  redundancia: string;
  nombre_apellido: string;
  email: string;
  direccion: string;
  empresa: string;
  web: string;
  cargo: string;
}

export function CreateQRCard() {
  const [qrContent, setQRContent] = useState('');
  const [qrName, setQRName] = useState('');
  const [qrNameAndSurName, setQRNameAndSurName] = useState('');
  const [qrEmail, setQREmail] = useState('');
  const [qrAddress, setQRAddress] = useState('');
  const [qrCompany, setQRCompany] = useState('');
  const [qrWeb, setQRWeb] = useState('');
  const [qrPositionCompany, setQRPositionCompany] = useState('');
  const [qrSize, setQRSize] = useState<number>(128);
  const [qrErrorCorrection, setQRErrorCorrection] = useState<string>('L');
  const toast = useRef<any>(null);

  // Actualizar el contenido del QR cuando cambien los datos del formulario
  useEffect(() => {
    const content = `${qrNameAndSurName}\n${qrEmail}\n${qrAddress}\n${qrCompany}\n${qrWeb}\n${qrPositionCompany}`;
    setQRContent(content);
  }, [qrNameAndSurName, qrEmail, qrAddress, qrCompany, qrWeb, qrPositionCompany]);

  const handleGenerateQR = async (e: FormEvent) => {
    e.preventDefault(); // Evitar la recarga de la página
    if (!qrNameAndSurName || !qrEmail || !qrAddress || !qrCompany || !qrWeb || !qrPositionCompany) {
      showToast('error', 'Error', 'Todos los campos son obligatorios');
      return;
    }

    const qr: QRCard = {
      user: localStorage.getItem('user_id') || '',
      nombre: qrName, // No estoy seguro si qrName debe ser el nombre del QR, asegúrate de qué valor debe ir aquí
      tamaño: qrSize,
      redundancia: qrErrorCorrection,
      nombre_apellido: qrNameAndSurName,
      email: qrEmail,
      direccion: qrAddress,
      empresa: qrCompany,
      web: qrWeb,
      cargo: qrPositionCompany
    };

    try {
      const response = await createTarjetaQR(qr); // Utilizar la función de creación de QR para la tarjeta de presentación
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
    <div className='p-4'>
      <Fieldset>
        <Card title="Crear QR de Tarjeta de Presentación">
          <Toast ref={toast} />
          <form onSubmit={handleGenerateQR}>
            <div className="container text-center">
              <div className='row m-2 m-md-4'>
                <div className="col-12">
                  <span className="p-float-label">
                    <InputText id="nombre" value={qrName} onChange={(e) => setQRName(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="nombre">Nombre</label>
                  </span>
                </div>
              </div>
              <br />
              <div className="row m-2 m-md-4">
                <div className="col-12 col-md-6">
                  <span className="p-float-label">
                    <InputText id="nombre_apellido" value={qrNameAndSurName} onChange={(e) => setQRNameAndSurName(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="nombre_apellido">Nombre\s y Apellido\s</label>
                  </span>
                </div>
                <br />
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                  <span className="p-float-label">
                    <InputText id="email" value={qrEmail} onChange={(e) => setQREmail(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="email">Email</label>
                  </span>
                </div>
              </div>
              <br />
              <div className="row m-2 m-md-4">
                <div className="col-12 col-md-6">
                  <span className="p-float-label">
                    <InputText id="direccion" value={qrAddress} onChange={(e) => setQRAddress(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="direccion">Direccion</label>
                  </span>
                </div>
                <br />
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                  <span className="p-float-label">
                    <InputText id="empresa" value={qrCompany} onChange={(e) => setQRCompany(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="empresa">Empresa</label>
                  </span>
                </div>
              </div>
              <br />
              <div className="row m-2 m-md-4">
                <div className="col-12 col-md-6">
                  <span className="p-float-label">
                    <InputText id="web" value={qrWeb} onChange={(e) => setQRWeb(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="web">Web</label>
                  </span>
                </div>
                <br />
                <div className="col-12 col-md-6 mt-2 mt-md-0">
                  <span className="p-float-label">
                    <InputText id="cargo" value={qrPositionCompany} onChange={(e) => setQRPositionCompany(e.target.value)} style={{ width: '100%' }} />
                    <label htmlFor="cargo">Cargo</label>
                  </span>
                </div>
              </div>
              <br />

            </div>

            <div className="d-flex justify-content-center">
              {qrContent && (
                <div className="mt-3">
                  <QRCode value={qrContent} size={qrSize} level={qrErrorCorrection} />
                </div>
              )}
            </div>
            <br />
            <div className="row m-2 m-md-4">
              <div className="ccol-12 col-md-6">
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
            <div className="container text-center">
              <div className="col">
                <Button icon="pi pi-cog" label='Guardar y Administrar QR' severity="secondary" type="submit" style={{ width: '100%' }} />
              </div>
            </div>
            <br />
          </form>
          <div className="container text-center">
            <div className="col mt-2 mt-md-0">
              <Button icon="pi pi-download" label='Descargar QR' severity="help" onClick={handleDownloadQR} style={{ width: '100%' }} />
            </div>
          </div>
        </Card>
      </Fieldset>
    </div >

  );
}

