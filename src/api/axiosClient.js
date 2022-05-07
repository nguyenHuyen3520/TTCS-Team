import axios from 'axios';
import queryString from 'query-string';

const axiosClient = axios.create({
    baseURL: 'http://localhost:4000/api',
    headers: {
        'content-type': 'application/json',
    },
    paramsSerializer: params => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
    const customHeaders = {};

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        customHeaders.Authorization = accessToken;
    }

    return {
        ...config,
        headers: {
            ...customHeaders,  // auto attach token
            ...config.headers, // but you can override for some requests
        }
    };
});
axiosClient.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    // Handle errors
    throw error;
});
export default axiosClient;