import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Snackbar, Alert, AlertColor, Portal } from "@mui/material";
import { Notification, NotifyFunction, NotificationType } from "./types";

interface NotificationContextProps {
  notify: NotifyFunction;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify: NotifyFunction = useCallback(
    ({ type, message, duration = 3000 }) => {
      console.log("Notification triggered:", { type, message, duration }); // debug log
      const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      setNotifications((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const handleClose = (id: string) => {
    console.log("Notification closed:", id); // debug log
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const mapTypeToColor = (type: NotificationType): AlertColor => {
    switch (type) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "loading":
        return "info";
      default:
        return "info";
    }
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications.map(({ id, type, message, duration }) => (
        <Portal>
          <Snackbar
            key={id}
            open={true}
            autoHideDuration={duration}
            onClose={() => handleClose(id)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert
              onClose={() => handleClose(id)}
              severity={mapTypeToColor(type)}
              variant="filled"
            >
              {message}
            </Alert>
          </Snackbar>
        </Portal>
      ))}
    </NotificationContext.Provider>
  );
}
