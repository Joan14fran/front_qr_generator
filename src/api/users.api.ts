import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
}

// Este cliente Axios se utilizará para las solicitudes de creación de usuarios
const createUserApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/users/api/users/',
});

export const createUser = (user: User): Promise<AxiosResponse<User>> => createUserApi.post<User>('/', user);

// El resto de tus funciones se mantienen igual

const userApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/users/api/users/',
});

userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    } else {
      window.location.href = '/login';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
