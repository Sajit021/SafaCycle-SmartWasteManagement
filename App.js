import React, { useEffect } from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigatorNew";
import pushNotificationService from "./src/services/pushNotificationService";

export default function App() {
  useEffect(() => {
    // Initialize push notifications when app starts
    pushNotificationService.initialize();

    // Cleanup on app unmount
    return () => {
      pushNotificationService.cleanup();
    };
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
