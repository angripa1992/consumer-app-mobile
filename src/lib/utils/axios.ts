import axios from 'axios';

export const BASE_URL = "https://consumer.klikit.io";

const axiosInstance = axios.create({
	baseURL: BASE_URL,
});

export const api = axiosInstance;
