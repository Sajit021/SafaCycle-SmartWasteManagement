import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatDate } from "../utils/helpers";

export default function BulkOperationsScreen({ navigation }) {
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const [users] = useState([
    { id: 1, name: "John Driver", email: "john@example.com", role: "driver", status: "active" },
    { id: 2, name: "Sarah Customer", email: "sarah@example.com", role: "customer", status: "active" },
    { id: 3, name: "Mike Admin", email: "mike@example.com", role: "admin", status: "active" },
    { id: 4, name: "Lisa Driver", email: "lisa@example.com", role: "driver", status: "inactive" },
    { id: 5, name: "Tom Customer", email: "tom@example.com", role: "customer", status: "active" },
    { id: 6, name: "Anna Customer", email: "anna@example.com", role: "customer", status: "suspended" },
    { id: 7, name: "Bob Driver", email: "bob@example.com", role: "driver", status: "active" },
    { id: 8, name: "Emma Customer", email: "emma@example.com", role: "customer", status: "active" },
  ]);

  const bulkOperations = [
    {
      id: "user_management",
      title: "User Management",
      description: "Bulk operations on user accounts",
      icon: "👥",
      actions: [
        { id: "activate", title: "Activate Users", description: "Activate selected user accounts" },
        { id: "deactivate", title: "Deactivate Users", description: "Deactivate selected user accounts" },
        { id: "suspend", title: "Suspend Users", description: "Temporarily suspend user accounts" },
        { id: "delete", title: "Delete Users", description: "Permanently delete user accounts", danger: true },
        { id: "export", title: "Export Users", description: "Export user data to CSV/Excel" },
        { id: "notify", title: "Send Notifications", description: "Send bulk notifications to users" },
      ],
    },
    {
      id: "data_management",
      title: "Data Management",
      description: "Bulk data operations and cleanup",
      icon: "📊",
      actions: [
        { id: "backup", title: "Backup Data", description: "Create backup of selected data" },
        { id: "cleanup", title: "Data Cleanup", description: "Remove old and unused data" },
        { id: "migrate", title: "Data Migration", description: "Migrate data between systems" },
        { id: "validate", title: "Data Validation", description: "Validate data integrity" },
        { id: "archive", title: "Archive Data", description: "Archive old records" },
        { id: "sync", title: "Data Sync", description: "Synchronize with external systems" },
      ],
    },
    {
      id: "system_maintenance",
      title: "System Maintenance",
      description: "System-wide maintenance operations",
      icon: "⚙️",
      actions: [
        { id: "cache_clear", title: "Clear Cache", description: "Clear system cache files" },
        { id: "log_cleanup", title: "Log Cleanup", description: "Remove old log files" },
        { id: "optimize", title: "Database Optimization", description: "Optimize database performance" },
        { id: "reindex", title: "Reindex Data", description: "Rebuild search indexes" },
        { id: "health_check", title: "System Health Check", description: "Comprehensive system check" },
        { id: "update", title: "System Update", description: "Apply system updates", danger: true },
      ],
    },
    {
      id: "reporting",
      title: "Reporting & Analytics",
      description: "Generate bulk reports and analytics",
      icon: "📈",
      actions: [
        { id: "generate_reports", title: "Generate Reports", description: "Create bulk reports" },
        { id: "export_analytics", title: "Export Analytics", description: "Export analytics data" },
        { id: "schedule_reports", title: "Schedule Reports", description: "Set up automated reports" },
        { id: "dashboard_export", title: "Dashboard Export", description: "Export dashboard data" },
        { id: "audit_report", title: "Audit Report", description: "Generate system audit report" },
        { id: "usage_analytics", title: "Usage Analytics", description: "Analyze system usage patterns" },
      ],
    },
  ];

  const [processingStatus] = useState({
    completed: 45,
    failed: 2,
    total: 50,
    currentTask: "Processing user activation...",
  });

  const handleOperationSelect = (operation) => {
    setSelectedOperation(operation);
  };

  const handleActionSelect = (action) => {
    setBulkAction(action);
    if (action.id === "activate" || action.id === "deactivate" || action.id === "suspend" || action.id === "delete") {
      // For user operations, we need to show user selection
      setShowConfirmModal(true);
    } else {
      // For other operations, show direct confirmation
      executeBulkOperation(action);
    }
  };

  const executeBulkOperation = (action) => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          Alert.alert(
            "Success",
            `${action.title} completed successfully!`,
            [{ text: "OK", onPress: () => setSelectedOperation(null) }]
          );
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.id));
    }
  };

  const handleConfirmBulkAction = () => {
    if (selectedUsers.length === 0) {
      Alert.alert("Error", "Please select at least one user.");
      return;
    }

    setShowConfirmModal(false);
    
    Alert.alert(
      "Confirm Action",
      `Are you sure you want to ${bulkAction.title.toLowerCase()} ${selectedUsers.length} user(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: bulkAction.danger ? "destructive" : "default",
          onPress: () => executeBulkOperation(bulkAction),
        },
      ]
    );
  };

  const recentOperations = [
    {
      operation: "User Export",
      count: 156,
      status: "completed",
      timestamp: "2025-07-31T10:30:00",
      duration: "2m 15s",
    },
    {
      operation: "Cache Clear",
      count: 1,
      status: "completed",
      timestamp: "2025-07-31T09:15:00",
      duration: "45s",
    },
    {
      operation: "Data Backup",
      count: 1,
      status: "completed",
      timestamp: "2025-07-31T02:00:00",
      duration: "15m 30s",
    },
    {
      operation: "Bulk Notification",
      count: 89,
      status: "failed",
      timestamp: "2025-07-30T16:45:00",
      duration: "1m 05s",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return COLORS.success;
      case "failed":
        return COLORS.error;
      case "processing":
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "failed":
        return "❌";
      case "processing":
        return "⏳";
      default:
        return "⚪";
    }
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.processingContainer}>
          <Text style={styles.processingTitle}>Processing Operation</Text>
          <Text style={styles.processingSubtitle}>{bulkAction.title}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={styles.currentTask}>{processingStatus.currentTask}</Text>
            <View style={styles.statusStats}>
              <View style={styles.statusStat}>
                <Text style={styles.statusNumber}>{processingStatus.completed}</Text>
                <Text style={styles.statusLabel}>Completed</Text>
              </View>
              <View style={styles.statusStat}>
                <Text style={[styles.statusNumber, { color: COLORS.error }]}>
                  {processingStatus.failed}
                </Text>
                <Text style={styles.statusLabel}>Failed</Text>
              </View>
              <View style={styles.statusStat}>
                <Text style={styles.statusNumber}>{processingStatus.total}</Text>
                <Text style={styles.statusLabel}>Total</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsProcessing(false);
              setProgress(0);
              Alert.alert("Cancelled", "Operation has been cancelled.");
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel Operation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Bulk Operations</Text>
            <Text style={styles.subtitle}>Perform operations on multiple items</Text>
          </View>
        </View>

        {selectedOperation ? (
          // Action Selection View
          <View>
            <View style={styles.backButton}>
              <TouchableOpacity
                style={styles.backButtonContainer}
                onPress={() => setSelectedOperation(null)}
              >
                <Text style={styles.backButtonText}>← Back to Operations</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.operationHeader}>
              <Text style={styles.operationTitle}>
                {selectedOperation.icon} {selectedOperation.title}
              </Text>
              <Text style={styles.operationDescription}>
                {selectedOperation.description}
              </Text>
            </View>

            <View style={styles.actionsContainer}>
              {selectedOperation.actions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionCard,
                    action.danger && styles.dangerActionCard,
                  ]}
                  onPress={() => handleActionSelect(action)}
                >
                  <Text style={[
                    styles.actionTitle,
                    action.danger && styles.dangerActionTitle,
                  ]}>
                    {action.title}
                  </Text>
                  <Text style={styles.actionDescription}>
                    {action.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          // Operation Categories View
          <View>
            {/* Operation Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Operation Category</Text>
              <View style={styles.operationsGrid}>
                {bulkOperations.map((operation) => (
                  <TouchableOpacity
                    key={operation.id}
                    style={styles.operationCard}
                    onPress={() => handleOperationSelect(operation)}
                  >
                    <Text style={styles.operationIcon}>{operation.icon}</Text>
                    <Text style={styles.operationName}>{operation.title}</Text>
                    <Text style={styles.operationDesc}>{operation.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Operations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Operations</Text>
              <View style={styles.recentContainer}>
                {recentOperations.map((operation, index) => (
                  <View key={index} style={styles.recentItem}>
                    <View style={styles.recentLeft}>
                      <Text style={styles.recentIcon}>
                        {getStatusIcon(operation.status)}
                      </Text>
                      <View style={styles.recentInfo}>
                        <Text style={styles.recentOperation}>
                          {operation.operation}
                        </Text>
                        <Text style={styles.recentDetails}>
                          {operation.count} items • {operation.duration}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.recentRight}>
                      <Text style={[
                        styles.recentStatus,
                        { color: getStatusColor(operation.status) }
                      ]}>
                        {operation.status.toUpperCase()}
                      </Text>
                      <Text style={styles.recentTime}>
                        {formatDate(operation.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => Alert.alert("Export", "Data export started!")}
                >
                  <Text style={styles.quickActionIcon}>📊</Text>
                  <Text style={styles.quickActionText}>Export All Data</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => Alert.alert("Backup", "System backup initiated!")}
                >
                  <Text style={styles.quickActionIcon}>💾</Text>
                  <Text style={styles.quickActionText}>System Backup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => Alert.alert("Cleanup", "System cleanup started!")}
                >
                  <Text style={styles.quickActionIcon}>🧹</Text>
                  <Text style={styles.quickActionText}>System Cleanup</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* User Selection Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Users</Text>
            <Text style={styles.modalSubtitle}>
              Choose users for: {bulkAction.title}
            </Text>

            <View style={styles.selectAllContainer}>
              <TouchableOpacity
                style={styles.selectAllButton}
                onPress={handleSelectAll}
              >
                <Text style={styles.selectAllText}>
                  {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.selectedCount}>
                {selectedUsers.length} of {users.length} selected
              </Text>
            </View>

            <ScrollView style={styles.usersList}>
              {users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userItem,
                    selectedUsers.includes(user.id) && styles.userItemSelected,
                  ]}
                  onPress={() => handleUserToggle(user.id)}
                >
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userDetails}>
                      {user.role} • {user.status}
                    </Text>
                  </View>
                  <View style={[
                    styles.checkbox,
                    selectedUsers.includes(user.id) && styles.checkboxSelected,
                  ]}>
                    {selectedUsers.includes(user.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  bulkAction.danger ? styles.modalDangerButton : styles.modalConfirmButton,
                ]}
                onPress={handleConfirmBulkAction}
              >
                <Text style={[
                  styles.modalConfirmText,
                  bulkAction.danger && styles.modalDangerText,
                ]}>
                  {bulkAction.title}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: SIZES.large,
  },
  title: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginTop: 4,
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
  operationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  operationCard: {
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
  operationIcon: {
    fontSize: 32,
    marginBottom: SIZES.medium,
  },
  operationName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.small,
  },
  operationDesc: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  backButton: {
    marginBottom: SIZES.large,
  },
  backButtonContainer: {
    alignSelf: "flex-start",
  },
  backButtonText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
  operationHeader: {
    marginBottom: SIZES.large,
  },
  operationTitle: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  operationDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    marginBottom: SIZES.large,
  },
  actionCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerActionCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },
  actionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  dangerActionTitle: {
    color: COLORS.error,
  },
  actionDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  recentContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  recentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recentIcon: {
    fontSize: 20,
    marginRight: SIZES.medium,
  },
  recentInfo: {
    flex: 1,
  },
  recentOperation: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  recentDetails: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  recentRight: {
    alignItems: "flex-end",
  },
  recentStatus: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
    marginBottom: 2,
  },
  recentTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: SIZES.small,
  },
  quickActionText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  processingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.large,
  },
  processingTitle: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  processingSubtitle: {
    fontSize: SIZES.fontLarge,
    color: COLORS.textSecondary,
    marginBottom: SIZES.large,
  },
  progressContainer: {
    width: "100%",
    marginBottom: SIZES.large,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    marginBottom: SIZES.small,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    textAlign: "center",
  },
  statusContainer: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },
  currentTask: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.medium,
  },
  statusStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusStat: {
    alignItems: "center",
  },
  statusNumber: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.success,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  cancelButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
  },
  cancelButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.large,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.small,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.large,
    textAlign: "center",
  },
  selectAllContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  selectAllButton: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  selectAllText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  selectedCount: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  usersList: {
    maxHeight: 300,
    marginBottom: SIZES.large,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.small,
  },
  userItemSelected: {
    backgroundColor: COLORS.primary + "10",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  userDetails: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  modalConfirmButton: {
    backgroundColor: COLORS.primary,
  },
  modalDangerButton: {
    backgroundColor: COLORS.error,
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  modalConfirmText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  modalDangerText: {
    color: COLORS.surface,
  },
});
