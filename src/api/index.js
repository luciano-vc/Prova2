import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fakestoreapi.com',
});

export const fetchProducts = () => api.get('/products');
export const fetchCategories = () => api.get('/products/categories');
export const fetchProductsByCategory = (categoryId) => {
    return api.get(`/products/category/${categoryId}`);
};
export const fetchCarts = () => api.get('/carts');
export const fetchUsers = () => api.get('/users');
export const login = (credentials) => api.post('/auth/login', credentials);

// Adicione outras funções conforme necessário