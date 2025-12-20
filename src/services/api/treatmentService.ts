import apiClient from './apiClient';
import { Treatment } from '../../types';

type CreateTreatmentPayload = Omit<Treatment, 'id' | 'patientName' | 'dentistName'>;

export const treatmentService = {
    getAll: async (patientId?: string): Promise<Treatment[]> => {
        const params = patientId ? { patientId } : {};
        const response = await apiClient.get('/treatments', { params });
        return response.data.data;
    },

    getById: async (id: string): Promise<Treatment> => {
        const response = await apiClient.get(`/treatments/${id}`);
        return response.data.data;
    },

    create: async (treatment: CreateTreatmentPayload): Promise<Treatment> => {
        const response = await apiClient.post('/treatments', treatment);
        return response.data.data;
    },

    update: async (id: string, treatment: Partial<Treatment>): Promise<Treatment> => {
        const response = await apiClient.put(`/treatments/${id}`, treatment);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/treatments/${id}`);
    },
};
