"use client";

import type React from "react";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { User } from "../../../lib/auth";
import type { CarListing } from "../../../lib/data-store";

interface AppState {
  user: User | null;
  listings: CarListing[];
  notifications: Notification[];
  isLoading: boolean;
}

interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  timestamp: number;
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LISTINGS"; payload: CarListing[] }
  | { type: "UPDATE_LISTING"; payload: CarListing }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "timestamp">;
    }
  | { type: "REMOVE_NOTIFICATION"; payload: string };

const initialState: AppState = {
  user: null,
  listings: [],
  notifications: [],
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_LISTINGS":
      return { ...state, listings: action.payload };
    case "UPDATE_LISTING":
      return {
        ...state,
        listings: state.listings.map((listing) =>
          listing.id === action.payload.id ? action.payload : listing
        ),
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          },
        ],
      };
    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export function useNotifications() {
  const { state, dispatch } = useApp();

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp">
  ) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      const notificationId = state.notifications.find(
        (n) => n.message === notification.message
      )?.id;
      if (notificationId) {
        dispatch({ type: "REMOVE_NOTIFICATION", payload: notificationId });
      }
    }, 5000);
  };

  const removeNotification = (id: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: id });
  };

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification,
  };
}
