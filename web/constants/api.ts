// app/constants/api.ts
export const API_BASE_URL = 'http://localhost:1789/health-service';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login-admin`,
        REGISTER: `${API_BASE_URL}/auth/register`,
        PROFILE: `${API_BASE_URL}/auth/profile`,
    },
    CATEGORIES: {
        BASE: `${API_BASE_URL}/products/categories`,
        ADMIN: `${API_BASE_URL}/admin/categories`
    },
    MEALS: {
        BASE: `${API_BASE_URL}/meals`,
        ADMIN: `${API_BASE_URL}/admin/meals`
    },
    USERS: {
        BASE: `${API_BASE_URL}/admin/users`,
    },
    ORDERS: {
        BASE: `${API_BASE_URL}/admin/orders`,
    },
    STATISTICS: {
        DASHBOARD: `${API_BASE_URL}/statistics/dashboard`,
        SALES: `${API_BASE_URL}/statistics/sales`,
    },
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
    }
};
