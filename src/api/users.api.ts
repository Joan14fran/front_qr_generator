import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
}

const userApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/users/api/users/',
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  } else {
    throw new Error('No se encontró el token de autenticación');
  }
  return config;
});

// Crear un hook para redirigir al login
const useRedirectToLogin = () => {
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate('/login');
  };

  return redirectToLogin;
};

export const createUser = (user: User): Promise<AxiosResponse<User>> => userApi.post<User>('/', user);
export const getUsers = (): Promise<AxiosResponse<User[]>> => userApi.get<User[]>('/');
export const getUser = (userId: number): Promise<AxiosResponse<User>> => userApi.get<User>(`/${userId}/`);
export const updateUser = (userId: number, updatedUser: User): Promise<AxiosResponse<User>> => userApi.put<User>(`/${userId}/`, updatedUser);
export const deleteUser = (userId: number): Promise<AxiosResponse<void>> => userApi.delete<void>(`/${userId}/`);

const authApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/users/api/',
});

export const loginUser = (username: string, password: string): Promise<AxiosResponse<{ token: string }>> => {
  const data = { username, password };
  return authApi.post<{ token: string }>('login/', data);
};

export const logoutUser = (): Promise<AxiosResponse<void>> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  const headers = { Authorization: `Token ${token}` };
  return authApi.post<void>('logout/', null, { headers });
};

// Interceptar errores de solicitud para redirigir al usuario al login si no tiene un token
userApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      const redirectToLogin = useRedirectToLogin();
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
