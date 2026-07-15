import { describe, it, expect } from "vitest";
import { mapNotificationRow, unreadCount } from "./notificationservice";
import type { NotificationRow } from "./notificationservice";
import type { Notification } from "../types/auth";

describe("unreadCount", () => {
  it("counts unread notifications", () => {
    const notifications: Notification[] = [
      {
        id: "1",
        userId: "u1",
        title: "A",
        message: "m",
        read: false,
        createdAt: "2024-01-01",
      },
      {
        id: "2",
        userId: "u1",
        title: "B",
        message: "m",
        read: true,
        createdAt: "2024-01-02",
      },
    ];
    expect(unreadCount(notifications)).toBe(1);
  });
});

describe("mapNotificationRow", () => {
  it("defaults a null read flag to false", () => {
    const row: NotificationRow = {
      id: "1",
      user_id: "u1",
      title: "Repair complete",
      message: "Your repair is done",
      read: null,
      created_at: "2024-01-01",
    };
    expect(mapNotificationRow(row)).toEqual({
      id: "1",
      userId: "u1",
      title: "Repair complete",
      message: "Your repair is done",
      read: false,
      createdAt: "2024-01-01",
    });
  });
});
