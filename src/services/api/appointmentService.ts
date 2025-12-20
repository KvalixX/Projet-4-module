import apiClient from './apiClient';
import { Appointment } from '../../types';

type CreateAppointmentPayload = Omit<Appointment, 'id' | 'status' | 'patientName' | 'dentistName'>;

export const appointmentService = {
    getAll: async (filters?: {
        patientId?: string;
        dentistId?: string;
        status?: string;
    }): Promise<Appointment[]> => {
        const response = await apiClient.get('/appointments', { params: filters });
        return response.data.data;
    },

    getById: async (id: string): Promise<Appointment> => {
        const response = await apiClient.get(`/appointments/${id}`);
        return response.data.data;
    },

    create: async (appointment: CreateAppointmentPayload): Promise<Appointment> => {
        const response = await apiClient.post('/appointments', appointment);
        return response.data.data;
    },

    update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
        const response = await apiClient.put(`/appointments/${id}`, appointment);
        return response.data.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/appointments/${id}`);
    },

    checkConflicts: async (data: {
        dentistId: string;
        date: string;
        time: string;
        duration: number;
        appointmentId?: string;
    }): Promise<{ hasConflict: boolean; message: string }> => {
        const response = await apiClient.post('/appointments/check-conflicts', data);
        return response.data;
    },
};
