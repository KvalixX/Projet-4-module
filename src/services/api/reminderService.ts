import apiClient from './apiClient';
import { Reminder } from '../../types';

export const reminderService = {
  getAll: async (patientId?: string, status?: string): Promise<Reminder[]> => {
    const params: Record<string, string> = {};
    if (patientId) params.patientId = patientId;
    if (status) params.status = status;

    const response = await apiClient.get('/reminders', { params });
    return response.data.data;
  },

  getById: async (id: string): Promise<Reminder> => {
    const response = await apiClient.get(`/reminders/${id}`);
    return response.data.data;
  },

  create: async (reminder: Omit<Reminder, 'id'>): Promise<Reminder> => {
    const response = await apiClient.post('/reminders', reminder);
    return response.data.data;
  },

  update: async (id: string, reminder: Partial<Reminder>): Promise<Reminder> => {
    const response = await apiClient.put(`/reminders/${id}`, reminder);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/reminders/${id}`);
  },
};
