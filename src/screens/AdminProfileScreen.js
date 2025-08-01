import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
  Switch,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { validateEmail, formatDate } from "../utils/helpers";

export default function AdminProfileScreen({ navigation }) {
  const [adminData, setAdminData] = useState({
    name: "John Admin",
    email: "admin@safacycle.com",
    phone: "+1-555-0100",
    role: "Super Admin",
    department: "System Administration",
    joinDate: "2024-01-01",
    lastLogin: "2025-07-31T10:30:00",
    employeeId: "ADM001",
    permissions: {
      userManagement: true,
      systemSettings: true,
      dataExport: true,
      auditLogs: true,
      billing: true,
      reports: true,
    },
    preferences: {
      emailNotifications: true,
      smsAlerts: false,
      dashboardTheme: "light",
      autoLogout: 30,
      reportFrequency: "weekly",
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({ ...adminData });
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveProfile = () => {
    if (!editedData.name.trim() || !editedData.email.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!validateEmail(editedData.email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setAdminData({ ...editedData });
    setIsEditMode(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditedData({ ...adminData });
    setIsEditMode(false);
  };

  const handlePermissionToggle = (permission) => {
    setEditedData({
      ...editedData,
      permissions: {
        ...editedData.permissions,
        [permission]: !editedData.permissions[permission],
      },
    });
  };

  const handlePreferenceToggle = (preference) => {
    setEditedData({
      ...editedData,
      preferences: {
        ...editedData.preferences,
        [preference]: !editedData.preferences[preference],
      },
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      "Account Deletion",
      "Admin account deletion requires additional authorization. Please contact IT security.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const performanceMetrics = [
    { label: "System Uptime", value: "99.8%", color: COLORS.success },
    { label: "Data Accuracy", value: "98.5%", color: COLORS.success },
    { label: "User Satisfaction", value: "4.7/5", color: COLORS.warning },
    { label: "Response Time", value: "1.2s avg", color: COLORS.info },
  ];

  const recentActions = [
    {
      action: "Updated system settings",
      timestamp: "2025-07-31T10:15:00",
      type: "config",
    },
    {
      action: "Added new driver: Mike Johnson",
      timestamp: "2025-07-31T09:45:00",
      type: "user",
    },
    {
      action: "Generated monthly report",
      timestamp: "2025-07-31T08:30:00",
      type: "report",
    },
    {
      action: "Resolved system alert",
      timestamp: "2025-07-30T16:20:00",
      type: "alert",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Admin Profile</Text>
            <Text style={styles.subtitle}>Manage your administrator account</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditMode(!isEditMode)}
          >
            <Text style={styles.editButtonText}>
              {isEditMode ? "Cancel" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {adminData.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{adminData.name}</Text>
              <Text style={styles.profileRole}>{adminData.role}</Text>
              <Text style={styles.profileDepartment}>{adminData.department}</Text>
            </View>
          </View>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Availability</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Users Managed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5+</Text>
              <Text style={styles.statLabel}>Years Exp</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Performance</Text>
          <View style={styles.metricsGrid}>
            {performanceMetrics.map((metric, index) => (
              <View key={index} style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: metric.color }]}>
                  {metric.value}
                </Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.name}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, name: text })
                  }
                  placeholder="Enter full name"
                />
              ) : (
                <Text style={styles.infoValue}>{adminData.name}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.email}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, email: text })
                  }
                  placeholder="Enter email"
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{adminData.email}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              {isEditMode ? (
                <TextInput
                  style={styles.infoInput}
                  value={editedData.phone}
                  onChangeText={(text) =>
                    setEditedData({ ...editedData, phone: text })
                  }
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{adminData.phone}</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Employee ID:</Text>
              <Text style={styles.infoValue}>{adminData.employeeId}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Join Date:</Text>
              <Text style={styles.infoValue}>
                {formatDate(adminData.joinDate)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Login:</Text>
              <Text style={styles.infoValue}>
                {formatDate(adminData.lastLogin)}
              </Text>
            </View>
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Access Permissions</Text>
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => setShowPermissionsModal(true)}
            >
              <Text style={styles.manageButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.permissionsGrid}>
            {Object.entries(adminData.permissions).map(([key, value]) => (
              <View key={key} style={styles.permissionItem}>
                <Text style={styles.permissionText}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Text>
                <View style={[
                  styles.permissionBadge,
                  { backgroundColor: value ? COLORS.success + "20" : COLORS.error + "20" }
                ]}>
                  <Text style={[
                    styles.permissionBadgeText,
                    { color: value ? COLORS.success : COLORS.error }
                  ]}>
                    {value ? "✓ Enabled" : "✗ Disabled"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Admin Actions</Text>
          <View style={styles.activityContainer}>
            {recentActions.map((action, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={[
                  styles.activityIcon,
                  { backgroundColor: getActionColor(action.type) + "20" }
                ]}>
                  <Text style={styles.activityIconText}>
                    {getActionIcon(action.type)}
                  </Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityText}>{action.action}</Text>
                  <Text style={styles.activityTime}>
                    {formatDate(action.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        {isEditMode && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.dangerButtonText}>Request Account Deletion</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Permissions Modal */}
      <Modal
        visible={showPermissionsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPermissionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Manage Permissions</Text>
            <ScrollView style={styles.permissionsModal}>
              {Object.entries(editedData.permissions).map(([key, value]) => (
                <View key={key} style={styles.permissionToggle}>
                  <Text style={styles.permissionToggleText}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={() => handlePermissionToggle(key)}
                    trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
                    thumbColor={value ? COLORS.surface : COLORS.textSecondary}
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowPermissionsModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={() => {
                  setAdminData({ ...editedData });
                  setShowPermissionsModal(false);
                  Alert.alert("Success", "Permissions updated successfully!");
                }}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <Text style={styles.deleteModalTitle}>⚠️ Delete Account</Text>
            <Text style={styles.deleteModalText}>
              This action requires additional security clearance. Admin account deletion must be approved by IT security team.
            </Text>
            <View style={styles.deleteModalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteButtonText}>Request Deletion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getActionColor = (type) => {
  switch (type) {
    case "config":
      return COLORS.warning;
    case "user":
      return COLORS.primary;
    case "report":
      return COLORS.info;
    case "alert":
      return COLORS.error;
    default:
      return COLORS.textSecondary;
  }
};

const getActionIcon = (type) => {
  switch (type) {
    case "config":
      return "⚙️";
    case "user":
      return "👤";
    case "report":
      return "📊";
    case "alert":
      return "🚨";
    default:
      return "📝";
  }
};

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
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  editButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.large,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.admin + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.medium,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.admin,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: SIZES.fontMedium,
    color: COLORS.admin,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileDepartment: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
  },
  manageButton: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  manageButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    marginBottom: SIZES.small,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricValue: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  infoValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    flex: 1,
    textAlign: "right",
  },
  infoInput: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small,
    flex: 1,
    marginLeft: SIZES.small,
  },
  permissionsGrid: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  permissionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  permissionText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 1,
  },
  permissionBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
  },
  permissionBadgeText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
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
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SIZES.medium,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: SIZES.medium,
    marginBottom: SIZES.large,
  },
  actionButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  dangerZone: {
    backgroundColor: COLORS.error + "10",
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.error + "30",
  },
  dangerTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.error,
    marginBottom: SIZES.medium,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  dangerButtonText: {
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
    marginBottom: SIZES.large,
    textAlign: "center",
  },
  permissionsModal: {
    maxHeight: 300,
  },
  permissionToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  permissionToggleText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
    marginTop: SIZES.large,
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
  modalSaveButton: {
    backgroundColor: COLORS.primary,
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  modalSaveText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  deleteModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    width: "100%",
    maxWidth: 400,
  },
  deleteModalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: SIZES.medium,
    textAlign: "center",
  },
  deleteModalText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.large,
    lineHeight: 22,
  },
  deleteModalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
});
