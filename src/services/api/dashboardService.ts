import apiClient from './apiClient';

export interface DashboardStats {
    totalPatients: number;
    todayAppointments: number;
    weekRevenue: number;
    completionRate: number;
    appointmentsByDay: Array<{ day: string; count: number }>;
    treatmentTypes: Array<{ type: string; count: number }>;
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await apiClient.get('/dashboard/stats');
        return response.data.data;
    },

    getUpcomingAppointments: async () => {
        const response = await apiClient.get('/dashboard/upcoming-appointments');
        return response.data.data;
    },

    getPendingReminders: async () => {
        const response = await apiClient.get('/dashboard/pending-reminders');
        return response.data.data;
    },
};
