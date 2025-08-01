import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatTime, getRelativeTime } from "../utils/helpers";

export default function DriverTrackingScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [isTracking, setIsTracking] = useState(true);

  // Mock driver data
  const [driverInfo, setDriverInfo] = useState({
    id: "DR001",
    name: "John Martinez",
    phone: "+1-555-0189",
    vehicle: "Truck #247",
    licensePlate: "ECO-247",
    rating: 4.8,
    totalCollections: 1247,
    photo: null,
    status: "active",
  });

  // Mock tracking data
  const [trackingData, setTrackingData] = useState({
    currentLocation: {
      lat: 40.7589,
      lng: -73.9851,
      address: "456 Collection Ave, Eco City",
      timestamp: new Date().toISOString(),
    },
    estimatedArrival: "10:15 AM",
    distanceAway: "0.8 km",
    stopsRemaining: 3,
    currentStop: 2,
    totalStops: 5,
    route: [
      {
        id: 1,
        address: "123 Green Street",
        customer: "Sarah Johnson",
        status: "completed",
        completedAt: "2025-01-31T09:05:00Z",
        timeSpent: "00:05:30",
      },
      {
        id: 2,
        address: "456 Collection Ave",
        customer: "Mike Chen",
        status: "in-progress",
        startedAt: "2025-01-31T09:45:00Z",
        estimatedDuration: "00:08:00",
      },
      {
        id: 3,
        address: "789 Your Street",
        customer: "You",
        status: "upcoming",
        estimatedTime: "10:15 AM",
        isCurrentUser: true,
      },
      {
        id: 4,
        address: "321 Next Road",
        customer: "Emily Davis",
        status: "upcoming",
        estimatedTime: "10:35 AM",
      },
      {
        id: 5,
        address: "654 Final Place",
        customer: "Robert Wilson",
        status: "upcoming",
        estimatedTime: "11:00 AM",
      },
    ],
    lastUpdate: new Date().toISOString(),
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Driver is approaching your location",
      timestamp: "2025-01-31T10:05:00Z",
      type: "info",
      read: false,
    },
    {
      id: 2,
      message: "Collection completed at previous stop",
      timestamp: "2025-01-31T09:50:00Z",
      type: "success",
      read: true,
    },
    {
      id: 3,
      message: "Driver started route - ETA updated",
      timestamp: "2025-01-31T09:00:00Z",
      type: "info",
      read: true,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      // Simulate location updates
      setTrackingData((prev) => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
        // Randomly adjust distance to simulate movement
        distanceAway: (Math.random() * 2 + 0.3).toFixed(1) + " km",
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isTracking]);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate network request
    setTimeout(() => {
      setTrackingData((prev) => ({
        ...prev,
        lastUpdate: new Date().toISOString(),
      }));
      setRefreshing(false);
    }, 2000);
  };

  const handleCallDriver = () => {
    Alert.alert("Call Driver", `Would you like to call ${driverInfo.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => {
          Linking.openURL(`tel:${driverInfo.phone}`);
        },
      },
    ]);
  };

  const handleMessageDriver = () => {
    Alert.alert("Message Driver", "Messaging feature coming soon!");
  };

  const handleReportIssue = () => {
    Alert.alert("Report Issue", "Issue reporting feature coming soon!");
  };

  const handleReschedule = () => {
    Alert.alert("Reschedule Collection", "Rescheduling feature coming soon!");
  };

  const getStopStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "🔄";
      case "upcoming":
        return "⏳";
      default:
        return "❓";
    }
  };

  const getStopStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "in-progress":
        return COLORS.warning;
      case "upcoming":
        return COLORS.textSecondary;
      default:
        return COLORS.textLight;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
        return "ℹ️";
      default:
        return "📱";
    }
  };

  const currentUserStop = trackingData.route.find((stop) => stop.isCurrentUser);
  const completedStops = trackingData.route.filter(
    (stop) => stop.status === "completed"
  ).length;
  const progressPercentage = (completedStops / trackingData.totalStops) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Driver Info Card */}
        <View style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverInitials}>
                {driverInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{driverInfo.name}</Text>
              <Text style={styles.driverVehicle}>{driverInfo.vehicle}</Text>
              <Text style={styles.licensePlate}>
                License: {driverInfo.licensePlate}
              </Text>
              <View style={styles.driverMeta}>
                <Text style={styles.driverRating}>⭐ {driverInfo.rating}</Text>
                <Text style={styles.driverCollections}>
                  {driverInfo.totalCollections} collections
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: COLORS.success },
              ]}
            >
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
          </View>

          <View style={styles.driverActions}>
            <TouchableOpacity
              style={[
                styles.driverActionButton,
                { backgroundColor: COLORS.primary },
              ]}
              onPress={handleCallDriver}
            >
              <Text style={styles.driverActionText}>📞 Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.driverActionButton,
                { backgroundColor: COLORS.info },
              ]}
              onPress={handleMessageDriver}
            >
              <Text style={styles.driverActionText}>💬 Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tracking Status */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Tracking Status</Text>
          <View style={styles.statusInfo}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Distance Away</Text>
              <Text style={styles.statusValue}>
                {trackingData.distanceAway}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Estimated Arrival</Text>
              <Text style={styles.statusValue}>
                {trackingData.estimatedArrival}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Stops Remaining</Text>
              <Text style={styles.statusValue}>
                {trackingData.stopsRemaining}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Route Progress</Text>
              <Text style={styles.progressText}>
                {completedStops}/{trackingData.totalStops} stops
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%` },
                ]}
              />
            </View>
          </View>

          <Text style={styles.lastUpdate}>
            Last updated: {getRelativeTime(trackingData.lastUpdate)}
          </Text>
        </View>

        {/* Your Collection Details */}
        {currentUserStop && (
          <View style={styles.collectionCard}>
            <Text style={styles.sectionTitle}>Your Collection</Text>
            <View style={styles.collectionInfo}>
              <View style={styles.collectionRow}>
                <Text style={styles.collectionLabel}>Address:</Text>
                <Text style={styles.collectionValue}>
                  {currentUserStop.address}
                </Text>
              </View>
              <View style={styles.collectionRow}>
                <Text style={styles.collectionLabel}>Estimated Time:</Text>
                <Text style={styles.collectionValue}>
                  {currentUserStop.estimatedTime}
                </Text>
              </View>
              <View style={styles.collectionRow}>
                <Text style={styles.collectionLabel}>Status:</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusIcon}>
                    {getStopStatusIcon(currentUserStop.status)}
                  </Text>
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: getStopStatusColor(currentUserStop.status) },
                    ]}
                  >
                    {currentUserStop.status.charAt(0).toUpperCase() +
                      currentUserStop.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.collectionActions}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: COLORS.warning },
                ]}
                onPress={handleReschedule}
              >
                <Text style={styles.actionButtonText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: COLORS.error }]}
                onPress={handleReportIssue}
              >
                <Text style={styles.actionButtonText}>Report Issue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Route Overview */}
        <View style={styles.routeCard}>
          <Text style={styles.sectionTitle}>Route Overview</Text>
          <View style={styles.routeList}>
            {trackingData.route.map((stop, index) => (
              <View
                key={stop.id}
                style={[
                  styles.routeStop,
                  stop.isCurrentUser && styles.currentUserStop,
                ]}
              >
                <View style={styles.stopIndicator}>
                  <View
                    style={[
                      styles.stopNumber,
                      { backgroundColor: getStopStatusColor(stop.status) },
                    ]}
                  >
                    <Text style={styles.stopNumberText}>{index + 1}</Text>
                  </View>
                  {index < trackingData.route.length - 1 && (
                    <View
                      style={[
                        styles.routeLine,
                        {
                          backgroundColor:
                            stop.status === "completed"
                              ? COLORS.success
                              : COLORS.textLight,
                        },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.stopInfo}>
                  <View style={styles.stopHeader}>
                    <Text
                      style={[
                        styles.stopCustomer,
                        stop.isCurrentUser && styles.currentUserText,
                      ]}
                    >
                      {stop.customer} {stop.isCurrentUser && "(You)"}
                    </Text>
                    <View style={styles.stopStatusContainer}>
                      <Text style={styles.stopStatusIcon}>
                        {getStopStatusIcon(stop.status)}
                      </Text>
                      <Text
                        style={[
                          styles.stopStatusText,
                          { color: getStopStatusColor(stop.status) },
                        ]}
                      >
                        {stop.status.charAt(0).toUpperCase() +
                          stop.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.stopAddress}>{stop.address}</Text>

                  <View style={styles.stopMeta}>
                    {stop.status === "completed" && stop.completedAt && (
                      <Text style={styles.stopTime}>
                        ✅ Completed at {formatTime(stop.completedAt)}
                      </Text>
                    )}
                    {stop.status === "in-progress" && stop.startedAt && (
                      <Text style={styles.stopTime}>
                        🔄 Started at {formatTime(stop.startedAt)}
                      </Text>
                    )}
                    {stop.status === "upcoming" && stop.estimatedTime && (
                      <Text style={styles.stopTime}>
                        ⏳ Estimated: {stop.estimatedTime}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={styles.notificationsCard}>
          <Text style={styles.sectionTitle}>Recent Updates</Text>
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <View
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification,
                ]}
              >
                <View style={styles.notificationIcon}>
                  <Text style={styles.notificationIconText}>
                    {getNotificationIcon(notification.type)}
                  </Text>
                </View>
                <View style={styles.notificationContent}>
                  <Text
                    style={[
                      styles.notificationMessage,
                      !notification.read && styles.unreadMessage,
                    ]}
                  >
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {getRelativeTime(notification.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapCard}>
          <Text style={styles.sectionTitle}>Live Map</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>🗺️</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Interactive map with real-time driver location
            </Text>
            <Text style={styles.mapPlaceholderNote}>
              (Map integration coming soon)
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: COLORS.info,
                alignSelf: "center",
                marginTop: SIZES.medium,
              },
            ]}
            onPress={() =>
              Alert.alert("Map View", "Full map view coming soon!")
            }
          >
            <Text style={styles.actionButtonText}>View Full Map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <CustomButton
              title="Stop Tracking"
              onPress={() => {
                setIsTracking(false);
                Alert.alert(
                  "Tracking Stopped",
                  "You will no longer receive location updates."
                );
              }}
              style={[
                styles.quickActionButton,
                { backgroundColor: COLORS.error },
              ]}
            />
            <CustomButton
              title="Share Location"
              onPress={() =>
                Alert.alert(
                  "Share Location",
                  "Location sharing feature coming soon!"
                )
              }
              style={[
                styles.quickActionButton,
                { backgroundColor: COLORS.info },
              ]}
            />
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
  driverCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.medium,
  },
  driverInitials: {
    color: COLORS.surface,
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  driverVehicle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  licensePlate: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  driverMeta: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  driverRating: {
    fontSize: SIZES.fontSmall,
    color: COLORS.warning,
    fontWeight: "500",
  },
  driverCollections: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  statusIndicator: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },
  statusText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  driverActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  driverActionButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  driverActionText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  statusInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.large,
  },
  statusItem: {
    alignItems: "center",
  },
  statusLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  progressContainer: {
    marginBottom: SIZES.medium,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  progressLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
  },
  progressText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  lastUpdate: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
  collectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    borderWidth: 2,
    borderColor: COLORS.primary + "30",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionInfo: {
    marginBottom: SIZES.medium,
  },
  collectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.small,
  },
  collectionLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  collectionValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusIcon: {
    fontSize: 14,
  },
  statusBadgeText: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  collectionActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  routeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeList: {
    gap: SIZES.medium,
  },
  routeStop: {
    flexDirection: "row",
    paddingVertical: SIZES.small,
  },
  currentUserStop: {
    backgroundColor: COLORS.primary + "10",
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.medium,
    marginHorizontal: -SIZES.medium,
  },
  stopIndicator: {
    alignItems: "center",
    marginRight: SIZES.medium,
  },
  stopNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  stopNumberText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "bold",
  },
  routeLine: {
    width: 2,
    height: 30,
    marginTop: 4,
  },
  stopInfo: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  stopCustomer: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  currentUserText: {
    color: COLORS.primary,
  },
  stopStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stopStatusIcon: {
    fontSize: 12,
  },
  stopStatusText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "500",
  },
  stopAddress: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  stopMeta: {
    marginTop: 4,
  },
  stopTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  notificationsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationsList: {
    gap: SIZES.medium,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: SIZES.small,
  },
  unreadNotification: {
    backgroundColor: COLORS.info + "10",
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.medium,
    marginHorizontal: -SIZES.medium,
  },
  notificationIcon: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.medium,
  },
  notificationIconText: {
    fontSize: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: 4,
  },
  unreadMessage: {
    fontWeight: "600",
  },
  notificationTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  mapCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.textLight,
    borderStyle: "dashed",
  },
  mapPlaceholderText: {
    fontSize: 48,
    marginBottom: SIZES.small,
  },
  mapPlaceholderSubtext: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 4,
  },
  mapPlaceholderNote: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    fontStyle: "italic",
  },
  quickActionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActions: {
    gap: SIZES.medium,
  },
  quickActionButton: {
    marginBottom: 0,
  },
});
