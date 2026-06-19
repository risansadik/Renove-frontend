import { useEffect, useState, useCallback } from "react";
import { notificationService } from "../../../../services/api/notification.service.ts";
import { socketService } from "../../../../services/socket.ts";
import { NOTIFICATION_EVENTS } from "../../../../domain/model/index.ts";
import { useAuthStore, selectAuthSession } from "../../../../store/use-auth-store.ts";
import type { Notification } from "../../../../domain/model/index.ts";

export const useNotifications = () => {
  const session = useAuthStore(selectAuthSession);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useCallback(async () => {
    if (!session) return;
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data.data ?? []);
    } catch {
      // silent — bell will just show 0
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Connect socket & join notification room
  useEffect(() => {
    if (!session) return;

    fetchNotifications();

    const socket = socketService.getSocket();
    socketService.connect();

    socket.emit(NOTIFICATION_EVENTS.JOIN_ROOM, {
      userId: session.profile.id,
      role: session.role,
    });

    const handleNew = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on(NOTIFICATION_EVENTS.NEW_NOTIFICATION, handleNew);

    return () => {
      socket.off(NOTIFICATION_EVENTS.NEW_NOTIFICATION, handleNew);
      socket.emit(NOTIFICATION_EVENTS.LEAVE_ROOM, {
        userId: session.profile.id,
        role: session.role,
      });
    };
  }, [session, fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    try {
      await notificationService.markAsRead(notificationId);
    } catch {
      // revert optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: false } : n))
      );
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await notificationService.markAllAsRead();
    } catch {
      fetchNotifications();
    }
  }, [fetchNotifications]);

  const togglePanel = useCallback(() => setIsOpen((prev) => !prev), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  return {
    notifications,
    unreadCount,
    isOpen,
    isLoading,
    togglePanel,
    closePanel,
    markAsRead,
    markAllAsRead,
  };
};