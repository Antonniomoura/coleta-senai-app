import axios from 'axios';
import returnServer from './returnServer';
const api = axios.create({
  baseURL: returnServer()
});

export default api;
