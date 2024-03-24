import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  fecha_nacimiento: Date; // Opcional
  numero_celular: string; // Opcional
  genero: string; // Opcional
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

export const getUserData = async (): Promise<AxiosResponse<User>> => {
  const userId = localStorage.getItem('user_id');
  return userApi.get<User>(`${userId}/`);
}



const authApi: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/users/api/',
});



export const loginUser = async (username: string, password: string): Promise<AxiosResponse<{ token: string, user_id: number }>> => {
  const data = { username, password };
  const response = await authApi.post<{ token: string, user_id: number }>('login/', data);

  // Almacenar token y ID del usuario en el almacenamiento local
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user_id', response.data.user_id.toString()); // Convertir a string

  return response;
}

export const logoutUser = async (): Promise<AxiosResponse<void>> => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  if (!token || !userId) {
    throw new Error('No se encontró el token de autenticación o el ID de usuario');
  }

  const headers = { Authorization: `Token ${token}` };
  localStorage.removeItem('token'); // Eliminar el token del almacenamiento local
  localStorage.removeItem('user_id'); // Eliminar el ID del usuario del almacenamiento local
  return authApi.post<void>('logout/', null, { headers });
}

