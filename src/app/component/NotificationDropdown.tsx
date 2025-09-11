'use client';
import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import endPoints from '@/utils/endpoints.class';
import { supabase } from '@/utils/supabase/client';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { parseCookies } from 'nookies';

interface Notification {
  _id: string;
  title: string;
  content: string;
  read: boolean;
  createdAt: Date;
}
interface UPDATE_NOTIFICATION_DATA {
  id: string;
}
export default function NotificationDropdown() {
  const { darkMode } = useDarkMode();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get userId from cookies - fixed parseCookies usage
  useEffect(() => {
    try {
      const cookies = parseCookies(null);
      const userInfo = cookies['user-info'] ? JSON.parse(cookies['user-info']) : null;
      setUserId(userInfo?.supabase_user_id || null);
    } catch (error) {
      console.error('Failed to parse user info from cookies:', error);
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await endPoints.getNotifications();
        console.log('Fetched notifications:', notifs);
        setNotifications(notifs || []);
        setUnreadCount(notifs?.filter((n: Notification) => !n.read).length || 0);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();

    if (!userId) {
      console.warn('No userId found in cookies');
      return;
    }

    console.log('Subscribing with userId:', userId);
    const channel = supabase.channel('notifications')
      .on('broadcast', { event: 'new_notification' }, ({ payload }) => {
        console.log('Received Supabase notification:', payload);
        if (payload.userId === userId) {
          setNotifications((prev) => [payload.notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
        }
      })
      .subscribe((status) => {
        console.log('Supabase subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const markAsRead = async (id: any) => {
    try {
      await endPoints.markNotificationAsRead({ id });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell className={`w-6 h-6 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden z-50 border ${
          darkMode ? 'bg-[#070E12] border-[#101E27]' : 'bg-white border-gray-200'
        }`}>
          <div className={`px-4 py-2 border-b ${
            darkMode ? 'border-[#101E27]' : 'border-gray-200'
          } flex justify-between items-center`}>
            <h3 className={`${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'} font-semibold`}>Notifications</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close notifications"
            >
              <X className={`w-4 h-4 ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}`} />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className={`px-4 py-3 text-sm ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-500'}`}>
                No notifications yet
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-opacity-50 ${
                    darkMode 
                      ? 'border-[#101E27] hover:bg-[#101E27]' 
                      : 'border-gray-100 hover:bg-gray-50'
                  } ${!notif.read ? (darkMode ? 'bg-[#101E27]/50' : 'bg-blue-50') : ''}`}
                  onClick={() => markAsRead(notif._id)}
                >
                  <h4 className={`text-sm font-medium ${darkMode ? 'text-[#FFFFFF]' : 'text-gray-900'} mb-1`}>
                    {notif.title}
                  </h4>
                  <p className={`text-xs ${darkMode ? 'text-[#EDF3F8]' : 'text-gray-600'} mb-1`}>
                    {notif.content}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-[#EDF3F8]/70' : 'text-gray-500'}`}>
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}