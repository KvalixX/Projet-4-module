import apiClient from './apiClient';
import { User } from '../../types';

export interface LoginResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        email: string;
        role: string;
        firstName: string;
        lastName: string;
        patientId?: string;
        staffId?: string;
    };
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password_confirmation: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    bloodType?: string;
    allergies?: string[];
    medicalHistory?: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    register: async (data: RegisterData): Promise<LoginResponse> => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        try {
            await apiClient.post('/auth/logout');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
        }
    },

    me: async (): Promise<User> => {
        const response = await apiClient.get('/auth/me');
        return response.data.user;
    },

    refreshToken: async (): Promise<string> => {
        const response = await apiClient.post('/auth/refresh');
        return response.data.token;
    },
};
