import axios from 'axios';

export const BASE_URL = 'http://10.0.2.2:5001';

const axiosInstance = axios.create({
	baseURL: BASE_URL,
});

export const api = axiosInstance;
