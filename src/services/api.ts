import axios from 'axios';
import returnServer from './returnServer';

function token() {
  return localStorage.getItem('token');
}

const api = axios.create({
  baseURL: returnServer(),
  headers: {
    Authorization: `Bearer ${token()}`
  }
});

export default api;
