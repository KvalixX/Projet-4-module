import apiClient from './apiClient';
import { AdminNotification, Notification } from '../../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications');
    return response.data.data;
  },

  getAdmin: async (): Promise<AdminNotification[]> => {
    const response = await apiClient.get('/notifications/admin');
    return response.data.data;
  },

  markAdminAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/admin/${id}/read`);
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },

  unreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data.count;
  },
};
