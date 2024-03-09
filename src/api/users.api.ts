import axios, { AxiosResponse } from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
}

const userApi = axios.create({
  baseURL: 'http://localhost:8000/users/api/users/',
});

const authApi = axios.create({
  baseURL: 'http://localhost:8000/users/api/',
});

export const createUser = (user: User): Promise<AxiosResponse<User>> => userApi.post('/', user);

export const loginUser = (username: string, password: string): Promise<AxiosResponse<{ token: string }>> => {
  const data = {
    username,
    password,
  };
  return authApi.post('login/', data);
};

