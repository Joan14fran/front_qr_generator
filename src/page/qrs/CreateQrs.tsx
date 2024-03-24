import React, { useState, useRef } from 'react';
import { SidebarComp } from '../../components/SidebarComp';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; // Importar Toast
import { createURLQR } from '../../api/qrs.api';
import QRCode from 'qrcode.react';

export function CreateQrs() {
    const [qrContent, setQRContent] = useState('');
    const [qrName, setQRName] = useState('');
    const [qrSize, setQRSize] = useState(128);
    const [qrErrorCorrection, setQRErrorCorrection] = useState('L');
    const toast = useRef(null); // Ref para el componente Toast

    const handleGenerateQR = async () => {
        if (!qrName || !qrContent) {
            // Mostrar mensaje de error si el nombre o la URL están vacíos
            showToast('error', 'Error', 'El nombre y la URL son obligatorios');
            return;
        }

        const qr = {
            user: localStorage.getItem('user_id'),
            nombre: qrName,
            tamaño: qrSize,
            redundancia: qrErrorCorrection,
            contenido: qrContent
        };

        try {
            const response = await createURLQR(qr);
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

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail });
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
            <SidebarComp />
            <br />
            <Fieldset>
                <Card title="Crear QRs">
                    <Toast ref={toast} /> {/* Componente Toast */}
                    <div className="row m-4">
                        <div className="col">
                            <div className="p-inputgroup ">
                                <span className="p-inputgroup-addon">
                                    Nombre:
                                </span>
                                <InputText value={qrName} onChange={(e) => setQRName(e.target.value)} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-inputgroup ">
                                <span className="p-inputgroup-addon">
                                    URL:
                                </span>
                                <InputText value={qrContent} onChange={(e) => setQRContent(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-auto">
                            <Button label="Generar QR" icon="pi pi-cog" severity="secondary" onClick={handleGenerateQR} />
                        </div>
                        <div className="col col-lg-2">
                            <div className="p-inputgroup ">
                                <span className="p-inputgroup-addon">
                                    Descargar QR
                                </span>
                                <Button icon="pi pi-download" severity="help" onClick={handleDownloadQR} />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        {qrContent && (
                            <div className="mt-3">
                                <QRCode value={qrContent} size={qrSize} level={qrErrorCorrection} />
                            </div>
                        )}
                    </div>
                    <div className="row m-4">
                        <div className="col">
                            <div className="p-inputgroup ">
                                <span className="p-inputgroup-addon">
                                    Tamaño
                                </span>
                                <Dropdown value={qrSize} options={sizeOptions} onChange={(e) => setQRSize(e.value)} />
                            </div>
                        </div>
                        <div className="col">
                            <div className="p-inputgroup ">
                                <span className="p-inputgroup-addon">
                                    Redundancia
                                </span>
                                <Dropdown value={qrErrorCorrection} options={errorCorrectionOptions} onChange={(e) => setQRErrorCorrection(e.value)} />
                            </div>
                        </div>
                    </div>
                </Card>
            </Fieldset>
        </div >
    );
}
