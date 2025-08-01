import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";

export default function AdminDashboard({ navigation }) {
  const [stats] = useState({
    totalUsers: 156,
    activeDrivers: 12,
    completedCollections: 89,
    pendingReports: 7,
  });

    const quickActions = [
    {
      id: 1,
      title: "Manage Users",
      description: "View and manage users",
      icon: "👥",
      action: "users",
    },
    {
      id: 2,
      title: "Driver Management",
      description: "Assign & track drivers",
      icon: "🚛",
      action: "drivers",
    },
    {
      id: 3,
      title: "Route Planning",
      description: "Optimize collection routes",
      icon: "🗺️",
      action: "routes",
    },
    {
      id: 4,
      title: "Analytics",
      description: "View performance metrics",
      icon: "📊",
      action: "analytics",
    },
    {
      id: 5,
      title: "Waste Reports",
      description: "Monitor waste collection",
      icon: "📋",
      action: "reports",
    },
    {
      id: 6,
      title: "Track Collections",
      description: "Real-time tracking",
      icon: "📍",
      action: "tracking",
    },
    {
      id: 7,
      title: "System Logs",
      description: "View system activity",
      icon: "📝",
      action: "logs",
    },
    {
      id: 8,
      title: "Notifications",
      description: "System alerts",
      icon: "🔔",
      action: "notifications",
    },
    {
      id: 9,
      title: "Admin Profile",
      description: "Manage admin settings",
      icon: "�",
      action: "profile",
    },
    {
      id: 10,
      title: "System Config",
      description: "Configure system",
      icon: "⚙️",
      action: "config",
    },
    {
      id: 11,
      title: "Bulk Operations",
      description: "Mass data operations",
      icon: "🔄",
      action: "bulk",
    },
  ];

  const handleQuickAction = (action) => {
    switch (action) {
      case "users":
        navigation.navigate("UserManagement");
        break;
      case "drivers":
        navigation.navigate("DriverManagement");
        break;
      case "routes":
        navigation.navigate("RouteManagement");
        break;
      case "analytics":
        navigation.navigate("Analytics");
        break;
      case "reports":
        navigation.navigate("WasteReports");
        break;
      case "tracking":
        navigation.navigate("CollectionTracking");
        break;
      case "logs":
        navigation.navigate("SystemLogs");
        break;
      case "notifications":
        navigation.navigate("Notifications");
        break;
      case "profile":
        navigation.navigate("AdminProfile");
        break;
      case "config":
        navigation.navigate("SystemConfig");
        break;
      case "bulk":
        navigation.navigate("BulkOperations");
        break;
      default:
        Alert.alert(
          "Feature Coming Soon",
          `${action} feature will be implemented in the next phase!`
        );
    }
  };

  const handleStatClick = (statType) => {
    switch (statType) {
      case "users":
        navigation.navigate("UserManagement");
        break;
      case "drivers":
        navigation.navigate("DriverManagement");
        break;
      case "collections":
        navigation.navigate("CollectionTracking");
        break;
      case "reports":
        navigation.navigate("WasteReports");
        break;
      default:
        navigation.navigate("Analytics");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => navigation.navigate("Welcome"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome Admin! 👑</Text>
            <Text style={styles.subtitle}>Manage your smart waste system</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Access Toolbar */}
        <View style={styles.quickToolbar}>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => handleQuickAction("analytics")}
          >
            <Text style={styles.toolbarIcon}>📊</Text>
            <Text style={styles.toolbarLabel}>Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => handleQuickAction("tracking")}
          >
            <Text style={styles.toolbarIcon}>📍</Text>
            <Text style={styles.toolbarLabel}>Live Tracking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => handleQuickAction("reports")}
          >
            <Text style={styles.toolbarIcon}>📋</Text>
            <Text style={styles.toolbarLabel}>Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={() => handleQuickAction("notifications")}
          >
            <Text style={styles.toolbarIcon}>🔔</Text>
            <Text style={styles.toolbarLabel}>Alerts</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={[
                styles.statCard,
                { backgroundColor: COLORS.admin + "20" },
              ]}
              onPress={() => handleStatClick("users")}
            >
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statCard,
                { backgroundColor: COLORS.driver + "20" },
              ]}
              onPress={() => handleStatClick("drivers")}
            >
              <Text style={styles.statNumber}>{stats.activeDrivers}</Text>
              <Text style={styles.statLabel}>Active Drivers</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={[
                styles.statCard,
                { backgroundColor: COLORS.success + "20" },
              ]}
              onPress={() => handleStatClick("collections")}
            >
              <Text style={styles.statNumber}>
                {stats.completedCollections}
              </Text>
              <Text style={styles.statLabel}>Collections Today</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statCard,
                { backgroundColor: COLORS.warning + "20" },
              ]}
              onPress={() => handleStatClick("reports")}
            >
              <Text style={styles.statNumber}>{stats.pendingReports}</Text>
              <Text style={styles.statLabel}>Pending Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(action.action)}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityDot,
                  { backgroundColor: COLORS.success },
                ]}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Driver John completed Route A
                </Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View
                style={[styles.activityDot, { backgroundColor: COLORS.info }]}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  New customer Sarah registered
                </Text>
                <Text style={styles.activityTime}>15 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View
                style={[
                  styles.activityDot,
                  { backgroundColor: COLORS.warning },
                ]}
              />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Report submitted for Route B
                </Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.large,
  },
  greeting: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  logoutText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  statsContainer: {
    marginBottom: SIZES.large,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    marginHorizontal: SIZES.small / 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: SIZES.fontHeader,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.medium,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SIZES.medium,
  },
  actionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.small,
  },
  actionDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  activityContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SIZES.medium,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: SIZES.medium,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  quickToolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolbarButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.radiusSmall,
    minWidth: 60,
  },
  toolbarIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  toolbarLabel: {
    fontSize: SIZES.fontSmall - 1,
    color: COLORS.text,
    fontWeight: "500",
    textAlign: "center",
  },
});
