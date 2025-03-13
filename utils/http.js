import axios from 'axios';

const service = axios.create({
  baseURL: 'http://1.117.70.79:8090/api/',
  timeout: 5000
});

// 请求拦截器（用于添加token）
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 新增响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default service;