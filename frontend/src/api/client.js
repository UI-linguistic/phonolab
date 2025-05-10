import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:5001/api',
    headers: { 'Content-Type': 'application/json' },
});
