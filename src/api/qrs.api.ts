import axios, { AxiosResponse } from 'axios';

interface QR {
  id: number;
  user: number; // Cambiar a number si el id del usuario es numérico
  nombre: string;
  descripcion: string;
  contenido: string;
}

const qrApi = axios.create({
  baseURL: 'http://localhost:8000/qrs/api/qrs/',
});

export const createQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post('/', qr);

export const getQRs = (): Promise<AxiosResponse<QR[]>> => qrApi.get('/');

export const getQR = (qrId: number): Promise<AxiosResponse<QR>> => qrApi.get(`/${qrId}/`);

export const updateQR = (qrId: number, updatedQR: QR): Promise<AxiosResponse<QR>> => qrApi.put(`/${qrId}/`, updatedQR);

export const deleteQR = (qrId: number): Promise<AxiosResponse<void>> => qrApi.delete(`/${qrId}/`);
