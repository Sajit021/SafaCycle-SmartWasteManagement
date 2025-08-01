import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import { formatDate, formatTime } from "../utils/helpers";
import apiService from "../services/apiService";

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNotifications();
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
      Alert.alert("Error", "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      Alert.alert("Success", "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      Alert.alert("Error", "Failed to mark all notifications as read");
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
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "#10B981";
      case "warning":
        return "#F59E0B";
      case "error":
        return "#EF4444";
      case "info":
      default:
        return "#3B82F6";
    }
  };

  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification._id);
    }
    
    Alert.alert(
      notification.title,
      `${notification.message}\n\nReceived: ${formatDate(
        new Date(notification.createdAt)
      )} at ${formatTime(new Date(notification.createdAt))}`,
      [
        { text: "OK", style: "default" },
      ]
    );
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.notificationIcon}>
            {getNotificationIcon(item.type)}
          </Text>
        </View>
        <View style={styles.notificationContent}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.notificationTitle,
              !item.read && styles.unreadTitle
            ]}>
              {item.title}
            </Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {formatDate(new Date(item.createdAt))} at {formatTime(new Date(item.createdAt))}
          </Text>
        </View>
      </View>
      <View style={[
        styles.typeBorder,
        { backgroundColor: getNotificationColor(item.type) }
      ]} />
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate("NotificationSettings")}
        >
          <Text style={styles.settingsButtonText}>⚙️</Text>
        </TouchableOpacity>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Mark All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item._id || item.id}
        style={styles.notificationsList}
        contentContainerStyle={styles.notificationsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
              You'll see important updates and reminders here
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.text,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  headerTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  unreadBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 24,
    alignItems: "center",
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  markAllButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  settingsButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
  },
  settingsButtonText: {
    fontSize: 18,
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    padding: SIZES.padding,
  },
  notificationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}05`,
  },
  notificationHeader: {
    flexDirection: "row",
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: "700",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  typeBorder: {
    height: 3,
    width: "100%",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 60,
    paddingTop: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});