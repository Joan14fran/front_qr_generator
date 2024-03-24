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
export const createTextoQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('texto-qrs/', qr);
export const createEmailQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('email-qrs/', qr);
export const createTarjetaQR = (qr: QR): Promise<AxiosResponse<QR>> => qrApi.post<QR>('tarjeta-qrs/', qr);

export const getQRs = (): Promise<AxiosResponse<QR[]>> => qrApi.get<QR[]>('qrs/');
export const getQR = (qrId: number): Promise<AxiosResponse<QR>> => qrApi.get<QR>(`qrs/${qrId}/`);
export const updateQR = (qrId: number, updatedQR: QR): Promise<AxiosResponse<QR>> => qrApi.put<QR>(`qrs/${qrId}/`, updatedQR);
export const deleteQR = (qrId: number): Promise<AxiosResponse<void>> => qrApi.delete<void>(`qrs/${qrId}/`);
