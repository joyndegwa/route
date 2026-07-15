import { supabase } from "../supabase/client";
import type { Notification } from "../types/auth";

export interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean | null;
  created_at: string;
}

const NOTIFICATIONS_TABLE = "notifications";

export function mapNotificationRow(row: NotificationRow): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    read: row.read ?? false,
    createdAt: row.created_at,
  };
}

/** Count unread notifications. Pure helper. */
export function unreadCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length;
}

export const notificationService = {
  unreadCount,

  listForUser: async (userId: string): Promise<Notification[]> => {
    const { data, error } = await supabase
      .from(NOTIFICATIONS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => mapNotificationRow(row as NotificationRow));
  },

  markAsRead: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from(NOTIFICATIONS_TABLE)
      .update({ read: true })
      .eq("id", id);
    if (error) throw error;
  },
};
