import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const client = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;