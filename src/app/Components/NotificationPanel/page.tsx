import React, { useRef, useState, useEffect } from "react";
import { Bell, RefreshCw, CheckCircle, Trash2 } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  type: "problem" | "language";
  createdBy: "user" | "admin";
  createdAt: string;
  user: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  isNotificationOpen: boolean;
  toggleNotifications: () => void;
  isNotificationLoading: boolean;
  notificationError: string | null;
  hoveredNotification: string | null;
  setHoveredNotification: (id: string | null) => void;
  fetchNotifications: () => void;
  markAsReadAndDelete: (id: string) => void;
  markAllAsReadAndDelete: () => void;
  formatDate: (dateString: string) => string;
  notificationRef: React.RefObject<HTMLDivElement>;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications,
  isNotificationOpen,
  toggleNotifications,
  isNotificationLoading,
  notificationError,
  hoveredNotification,
  setHoveredNotification,
  fetchNotifications,
  markAsReadAndDelete,
  markAllAsReadAndDelete,
  formatDate,
  notificationRef,
}) => {
  return (
    <div className="relative">
      <Bell
        className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={toggleNotifications}
      />
      {notifications.some((n) => !n.isRead) && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
      )}
      {isNotificationOpen && (
        <div
          ref={notificationRef}
          className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-10"
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={fetchNotifications}
                  className="text-gray-500 hover:text-green-600 flex items-center"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-1 ${
                      isNotificationLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </button>
              </div>
            </div>
            {isNotificationLoading ? (
              <p className="text-gray-600 text-sm">Loading...</p>
            ) : notificationError ? (
              <p className="text-red-600 text-sm">{notificationError}</p>
            ) : notifications.length === 0 ? (
              <p className="text-gray-600 text-sm">
                No notifications available.
              </p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="py-3 px-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                    onMouseEnter={() =>
                      setHoveredNotification(notification._id)
                    }
                    onMouseLeave={() => setHoveredNotification(null)}
                  >
                    <div>
                      <p
                        className={`text-sm ${
                          notification.isRead
                            ? "text-gray-600"
                            : "font-medium text-gray-800"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {hoveredNotification === notification._id &&
                      !notification.isRead && (
                        <button
                          onClick={() => markAsReadAndDelete(notification._id)}
                          className="text-gray-500 hover:text-green-600"
                          title="Mark as read and delete"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                ))}
                {notifications.some((n) => !n.isRead) && (
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={markAllAsReadAndDelete}
                      className="w-full text-left text-sm text-red-600 hover:text-red-800 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Mark All as Read
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
