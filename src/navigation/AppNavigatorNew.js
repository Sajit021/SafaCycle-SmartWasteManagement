import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import AdminDashboard from "../screens/AdminDashboard";
import DriverDashboard from "../screens/DriverDashboard";
import CustomerDashboard from "../screens/CustomerDashboard";
import SettingsScreen from "../screens/SettingsScreen";
import CameraScannerScreen from "../screens/CameraScannerScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import NotificationSettingsScreen from "../screens/NotificationSettingsScreen";
import RouteManagementScreen from "../screens/RouteManagementScreen";
import UserManagementScreen from "../screens/UserManagementScreen";
import CollectionTrackingScreen from "../screens/CollectionTrackingScreen";
import DriverTrackingScreen from "../screens/DriverTrackingScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import CollectionHistoryScreen from "../screens/CollectionHistoryScreen";
import SchedulePickupScreen from "../screens/SchedulePickupScreen";
import WasteReportsScreen from "../screens/WasteReportsScreen";
import DriverManagementScreen from "../screens/DriverManagementScreen";
import ReportIssueScreen from "../screens/ReportIssueScreen";
import CustomerInsightsScreen from "../screens/CustomerInsightsScreen";
import CustomerProfileScreen from "../screens/CustomerProfileScreen";
import DriverProfileScreen from "../screens/DriverProfileScreen";
import BreakManagementScreen from "../screens/BreakManagementScreen";
import EmergencyContactScreen from "../screens/EmergencyContactScreen";
import DriverPerformanceScreen from "../screens/DriverPerformanceScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#2E8B57", // Sea green color for smart waste theme
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }} // Hide header for welcome screen
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{
            title: "Admin Dashboard",
            headerLeft: () => null, // Disable back button
            gestureEnabled: false, // Disable swipe back gesture
          }}
        />
        <Stack.Screen
          name="DriverDashboard"
          component={DriverDashboard}
          options={{
            title: "Driver Dashboard",
            headerLeft: () => null, // Disable back button
            gestureEnabled: false, // Disable swipe back gesture
          }}
        />
        <Stack.Screen
          name="CustomerDashboard"
          component={CustomerDashboard}
          options={{
            title: "Customer Dashboard",
            headerLeft: () => null, // Disable back button
            gestureEnabled: false, // Disable swipe back gesture
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: "Settings" }}
        />
        <Stack.Screen
          name="CameraScanner"
          component={CameraScannerScreen}
          options={{ title: "Waste Scanner" }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: "Notifications" }}
        />
        <Stack.Screen
          name="RouteManagement"
          component={RouteManagementScreen}
          options={{ title: "Route Management" }}
        />
        <Stack.Screen
          name="UserManagement"
          component={UserManagementScreen}
          options={{ title: "User Management" }}
        />
        <Stack.Screen
          name="CollectionTracking"
          component={CollectionTrackingScreen}
          options={{ title: "Collection Tracking" }}
        />
        <Stack.Screen
          name="DriverTracking"
          component={DriverTrackingScreen}
          options={{ title: "Track Your Driver" }}
        />
        <Stack.Screen
          name="Analytics"
          component={AnalyticsScreen}
          options={{ title: "Analytics Dashboard" }}
        />
        <Stack.Screen
          name="CollectionHistory"
          component={CollectionHistoryScreen}
          options={{ title: "Collection History" }}
        />
        <Stack.Screen
          name="SchedulePickup"
          component={SchedulePickupScreen}
          options={{ title: "Schedule Pickup" }}
        />
        <Stack.Screen
          name="WasteReports"
          component={WasteReportsScreen}
          options={{ title: "Waste Reports" }}
        />
        <Stack.Screen
          name="DriverManagement"
          component={DriverManagementScreen}
          options={{ title: "Driver Management" }}
        />
        <Stack.Screen
          name="ReportIssue"
          component={ReportIssueScreen}
          options={{ title: "Report Issue" }}
        />
        <Stack.Screen
          name="CustomerInsights"
          component={CustomerInsightsScreen}
          options={{ title: "Your Eco Impact" }}
        />
        <Stack.Screen
          name="CustomerProfile"
          component={CustomerProfileScreen}
          options={{ title: "My Profile" }}
        />
        <Stack.Screen
          name="DriverProfile"
          component={DriverProfileScreen}
          options={{ title: "Driver Profile" }}
        />
        <Stack.Screen
          name="BreakManagement"
          component={BreakManagementScreen}
          options={{ title: "Break Management" }}
        />
        <Stack.Screen
          name="EmergencyContact"
          component={EmergencyContactScreen}
          options={{ title: "Emergency Contacts" }}
        />
        <Stack.Screen
          name="DriverPerformance"
          component={DriverPerformanceScreen}
          options={{ title: "Performance Dashboard" }}
        />
        <Stack.Screen
          name="NotificationSettings"
          component={NotificationSettingsScreen}
          options={{ title: "Notification Settings" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
