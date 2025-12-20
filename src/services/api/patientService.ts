import apiClient from './apiClient';
import { Patient } from '../../types';

export const patientService = {
    getAll: async (): Promise<Patient[]> => {
        const response = await apiClient.get('/patients');
        return response.data.data;
    },

    getById: async (id: string): Promise<Patient> => {
        const response = await apiClient.get(`/patients/${id}`);
        return response.data.data;
    },

    create: async (patient: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> => {
        const response = await apiClient.post('/patients', patient);
        return response.data.data;
    },

    update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
        const response = await apiClient.put(`/patients/${id}`, patient);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/patients/${id}`);
    },
};
