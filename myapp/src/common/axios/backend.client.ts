import axios from 'axios';

export const pythonBackend = axios.create({
  baseURL: 'python backend url',
});
