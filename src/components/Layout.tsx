import { ReactNode, useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  UserCog,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { User } from '../types';
import { DataService } from '../services/dataService';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  user?: User;
  onLogout?: () => void;
}

export default function Layout({ children, currentPage, onNavigate, user, onLogout }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (user && (user.role === 'personnelAdministratif' || user.role === 'docteur')) {
      const notifications = DataService.getAdminNotifications();
      setAdminNotifications(notifications);
      
      const interval = setInterval(() => {
        const updatedNotifications = DataService.getAdminNotifications();
        setAdminNotifications(updatedNotifications);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = adminNotifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    DataService.markAdminNotificationAsRead(notificationId);
    const updatedNotifications = DataService.getAdminNotifications();
    setAdminNotifications(updatedNotifications);
  };

  // Définir tous les menus disponibles
  const allMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
    { id: 'treatments', label: 'Traitements', icon: ClipboardList },
    { id: 'staff', label: 'Personnel', icon: UserCog },
    { id: 'reminders', label: 'Rappels', icon: Bell }
  ];

  // Filtrer les menus selon le rôle de l'utilisateur
  const getMenuItems = () => {
    if (!user) return [];
    
    // Personnel administratif : accès à patients, rendez-vous, rappels (mais PAS traitements ni personnel)
    if (user.role === 'personnelAdministratif') {
      return allMenuItems.filter(item => item.id !== 'treatments' && item.id !== 'staff');
    }
    
    // Docteur : accès complet à tous les menus
    if (user.role === 'docteur') {
      return allMenuItems;
    }
    
    // Par défaut, retourner tous les menus
    return allMenuItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex items-center ml-2 lg:ml-0">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ClipboardList className="text-white" size={24} />
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">Cabinet Dentaire</h1>
                  <p className="text-xs text-gray-500">Système de gestion</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  {(user.role === 'personnelAdministratif' || user.role === 'docteur') && (
                    <div className="relative">
                      <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Notifications"
                      >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </button>
                      {showNotifications && (
                        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-96 overflow-y-auto z-50">
                          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications Administratives</h3>
                            <button
                              onClick={() => setShowNotifications(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          <div className="p-2">
                            {adminNotifications.slice(0, 10).map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-3 rounded-lg mb-2 cursor-pointer ${
                                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                                }`}
                                onClick={() => {
                                  if (!notification.read) {
                                    handleMarkAsRead(notification.id);
                                  }
                                }}
                              >
                                <div className="flex items-start gap-2">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(notification.createdAt).toLocaleString('fr-FR')}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {adminNotifications.length === 0 && (
                              <div className="text-center py-8">
                                <Bell className="mx-auto text-gray-300 mb-2" size={32} />
                                <p className="text-sm text-gray-500">Aucune notification</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role === 'docteur' ? 'Docteur' : user.role === 'personnelAdministratif' ? 'Personnel Administratif' : 'Utilisateur'}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                </>
              )}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Déconnexion"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out pt-16 lg:pt-0`}
        >
          <nav className="mt-5 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
