import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface QR {
  id: number;
  user: number;
  nombre: string;
  descripcion?: string;
  contenido: string;
  imagen_qr: File; // Cambiado a tipo File
  tamaño: number;
  redundancia: number;
}

const qrApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/qrs/api/',
});

qrApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    } else {
      window.location.href = '/login'; // Redirigir a la página de inicio de sesión si no hay token
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const createURLQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('url-qrs/', qr);
export const getQRsUrl = (): Promise<AxiosResponse<QR[]>> => qrApi.get<QR[]>('url-qrs/');
export const updateQRUrl = (qrId: number, updatedQR: QR): Promise<AxiosResponse<QR>> => qrApi.put<QR>(`url-qrs/${qrId}/`, updatedQR);
export const deleteQRUrl = (qrId: number): Promise<AxiosResponse<void>> => qrApi.delete<void>(`url-qrs/${qrId}/`);

export const createTextoQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('texto-qrs/', qr);
export const getQRsText = (): Promise<AxiosResponse<QR[]>> => qrApi.get<QR[]>('texto-qrs/');
export const updateQRText = (qrId: number, updatedQR: QR): Promise<AxiosResponse<QR>> => qrApi.put<QR>(`texto-qrs/${qrId}/`, updatedQR);
export const deleteQRText = (qrId: number): Promise<AxiosResponse<void>> => qrApi.delete<void>(`texto-qrs/${qrId}/`);

export const createEmailQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('email-qrs/', qr);
export const getQRsEmail = (): Promise<AxiosResponse<QR[]>> => qrApi.get<QR[]>('email-qrs/');
export const updateQREmail = (qrId: number, updatedQR: QR): Promise<AxiosResponse<QR>> => qrApi.put<QR>(`email-qrs/${qrId}/`, updatedQR);
export const deleteQREmail = (qrId: number): Promise<AxiosResponse<void>> => qrApi.delete<void>(`email-qrs/${qrId}/`);

export const createTarjetaQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('tarjeta-qrs/', qr);
export const getQRsCard = (): Promise<AxiosResponse<QR[]>> => qrApi.get<QR[]>('tarjeta-qrs/');
export const updateQRCard = (qrId: number, updatedQR: QR): Promise<AxiosResponse<QR>> => qrApi.put<QR>(`tarjeta-qrs/${qrId}/`, updatedQR);
export const deleteQRCard = (qrId: number): Promise<AxiosResponse<void>> => qrApi.delete<void>(`tarjeta-qrs/${qrId}/`);

export const getQR = (qrId: number): Promise<AxiosResponse<QR>> => qrApi.get<QR>(`qrs/${qrId}/`);