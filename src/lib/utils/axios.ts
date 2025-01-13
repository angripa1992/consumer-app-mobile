import axios from 'axios';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({
	baseURL: BASE_URL,
});

export const api = axiosInstance;
