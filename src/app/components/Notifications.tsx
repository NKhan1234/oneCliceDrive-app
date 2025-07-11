"use client";

import { X } from "lucide-react";
import { useNotifications } from "../contexts/AppContext";

export function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`w-96 shadow-lg rounded-lg border px-4 py-3 ${
            notification.type === "error"
              ? "bg-red-100 border-red-300 text-red-800"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 p-1 rounded hover:bg-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
