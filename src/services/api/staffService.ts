import apiClient from './apiClient';
import { Staff } from '../../types';

export const staffService = {
    getAll: async (): Promise<Staff[]> => {
        const response = await apiClient.get('/staff');
        return response.data.data;
    },

    getById: async (id: string): Promise<Staff> => {
        const response = await apiClient.get(`/staff/${id}`);
        return response.data.data;
    },

    create: async (staff: Omit<Staff, 'id'>): Promise<Staff> => {
        const response = await apiClient.post('/staff', staff);
        return response.data.data;
    },

    update: async (id: string, staff: Partial<Staff>): Promise<Staff> => {
        const response = await apiClient.put(`/staff/${id}`, staff);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/staff/${id}`);
    },
};
