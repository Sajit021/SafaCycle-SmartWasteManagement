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
  Switch,
  TextInput,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";

export default function SystemConfigScreen({ navigation }) {
  const [systemSettings, setSystemSettings] = useState({
    general: {
      appName: "SafaCycle",
      version: "1.0.0",
      maintenanceMode: false,
      debugMode: false,
      autoBackup: true,
      maxUsers: 1000,
      sessionTimeout: 30,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      alertThreshold: 85,
      batchSize: 50,
      retryAttempts: 3,
    },
    security: {
      passwordComplexity: true,
      twoFactorAuth: false,
      autoLockout: true,
      maxLoginAttempts: 5,
      auditLogging: true,
      dataEncryption: true,
    },
    performance: {
      cacheEnabled: true,
      compressionEnabled: true,
      maxFileSize: 10, // MB
      apiRateLimit: 1000,
      connectionTimeout: 30,
      queryOptimization: true,
    },
    integration: {
      apiEnabled: true,
      webhooksEnabled: true,
      externalAuth: false,
      dataSync: true,
      thirdPartyServices: true,
      analyticsTracking: true,
    },
  });

  const [backupSettings, setBackupSettings] = useState({
    frequency: "daily",
    retention: 30,
    location: "cloud",
    compression: true,
    encryption: true,
    lastBackup: "2025-07-31T02:00:00",
  });

  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSettingToggle = (category, setting) => {
    setSystemSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting],
      },
    }));
  };

  const handleValueChange = (category, setting, value) => {
    setSystemSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "System settings have been updated successfully!");
    }, 1500);
  };

  const handleManualBackup = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setBackupSettings(prev => ({
        ...prev,
        lastBackup: new Date().toISOString(),
      }));
      Alert.alert("Success", "System backup completed successfully!");
    }, 3000);
  };

  const handleSystemReset = () => {
    Alert.alert(
      "⚠️ System Reset",
      "This will reset all system settings to default values. This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "System settings have been reset to defaults.");
          },
        },
      ]
    );
  };

  const handleMaintenanceMode = () => {
    if (systemSettings.general.maintenanceMode) {
      Alert.alert(
        "Disable Maintenance Mode",
        "This will make the system available to all users.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Disable",
            onPress: () => {
              handleSettingToggle("general", "maintenanceMode");
              setShowMaintenanceModal(false);
            },
          },
        ]
      );
    } else {
      setShowMaintenanceModal(true);
    }
  };

  const systemStats = [
    { label: "CPU Usage", value: "34%", color: COLORS.success },
    { label: "Memory", value: "67%", color: COLORS.warning },
    { label: "Storage", value: "45%", color: COLORS.info },
    { label: "Network", value: "12%", color: COLORS.success },
  ];

  const recentLogs = [
    {
      level: "INFO",
      message: "System backup completed successfully",
      timestamp: "2025-07-31T02:00:15",
    },
    {
      level: "WARN",
      message: "High memory usage detected (67%)",
      timestamp: "2025-07-31T01:45:30",
    },
    {
      level: "INFO",
      message: "User session cleanup completed",
      timestamp: "2025-07-31T01:30:00",
    },
    {
      level: "ERROR",
      message: "Failed API request from external service",
      timestamp: "2025-07-31T01:15:45",
    },
  ];

  const renderSettingSection = (title, category, settings) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.settingsContainer}>
        {Object.entries(settings).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Text>
              <Text style={styles.settingDescription}>
                {getSettingDescription(key)}
              </Text>
            </View>
            {typeof value === "boolean" ? (
              <Switch
                value={value}
                onValueChange={() => handleSettingToggle(category, key)}
                trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
                thumbColor={value ? COLORS.surface : COLORS.textSecondary}
              />
            ) : (
              <TextInput
                style={styles.settingInput}
                value={value.toString()}
                onChangeText={(text) => {
                  const numValue = isNaN(text) ? text : Number(text);
                  handleValueChange(category, key, numValue);
                }}
                keyboardType={typeof value === "number" ? "numeric" : "default"}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const getSettingDescription = (key) => {
    const descriptions = {
      appName: "Application display name",
      version: "Current system version",
      maintenanceMode: "Restrict access for maintenance",
      debugMode: "Enable debug logging",
      autoBackup: "Automatic daily backups",
      maxUsers: "Maximum concurrent users",
      sessionTimeout: "Session timeout in minutes",
      emailEnabled: "Enable email notifications",
      smsEnabled: "Enable SMS alerts",
      pushEnabled: "Enable push notifications",
      alertThreshold: "System alert threshold (%)",
      batchSize: "Notification batch size",
      retryAttempts: "Failed notification retries",
      passwordComplexity: "Enforce strong passwords",
      twoFactorAuth: "Require 2FA for admins",
      autoLockout: "Auto-lockout after failed attempts",
      maxLoginAttempts: "Maximum login attempts",
      auditLogging: "Log all admin actions",
      dataEncryption: "Encrypt sensitive data",
      cacheEnabled: "Enable system caching",
      compressionEnabled: "Compress data transfers",
      maxFileSize: "Maximum file upload size (MB)",
      apiRateLimit: "API requests per hour",
      connectionTimeout: "Connection timeout (seconds)",
      queryOptimization: "Optimize database queries",
      apiEnabled: "Enable external API access",
      webhooksEnabled: "Enable webhook notifications",
      externalAuth: "Allow external authentication",
      dataSync: "Enable data synchronization",
      thirdPartyServices: "Allow third-party integrations",
      analyticsTracking: "Track system analytics",
    };
    return descriptions[key] || "System configuration option";
  };

  const getLogColor = (level) => {
    switch (level) {
      case "ERROR":
        return COLORS.error;
      case "WARN":
        return COLORS.warning;
      case "INFO":
        return COLORS.info;
      default:
        return COLORS.textSecondary;
    }
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
            <Text style={styles.title}>System Configuration</Text>
            <Text style={styles.subtitle}>Manage system settings and preferences</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.maintenanceButton,
              {
                backgroundColor: systemSettings.general.maintenanceMode
                  ? COLORS.error
                  : COLORS.warning,
              },
            ]}
            onPress={handleMaintenanceMode}
          >
            <Text style={styles.maintenanceButtonText}>
              {systemSettings.general.maintenanceMode ? "🔧 MAINTENANCE" : "🔧 Maintenance"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <View style={styles.statusContainer}>
            <View style={styles.statusGrid}>
              {systemStats.map((stat, index) => (
                <View key={index} style={styles.statusCard}>
                  <Text style={[styles.statusValue, { color: stat.color }]}>
                    {stat.value}
                  </Text>
                  <Text style={styles.statusLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statusActions}>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => Alert.alert("System Monitor", "Detailed monitoring coming soon!")}
              >
                <Text style={styles.statusButtonText}>📊 View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => Alert.alert("Performance", "Performance optimization coming soon!")}
              >
                <Text style={styles.statusButtonText}>⚡ Optimize</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Backup Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Backup Management</Text>
            <TouchableOpacity
              style={styles.backupButton}
              onPress={() => setShowBackupModal(true)}
            >
              <Text style={styles.backupButtonText}>⚙️ Configure</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.backupContainer}>
            <View style={styles.backupInfo}>
              <Text style={styles.backupLabel}>Last Backup:</Text>
              <Text style={styles.backupValue}>
                {new Date(backupSettings.lastBackup).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.backupInfo}>
              <Text style={styles.backupLabel}>Frequency:</Text>
              <Text style={styles.backupValue}>{backupSettings.frequency}</Text>
            </View>
            <TouchableOpacity
              style={styles.manualBackupButton}
              onPress={handleManualBackup}
              disabled={isLoading}
            >
              <Text style={styles.manualBackupText}>
                {isLoading ? "⏳ Backing up..." : "💾 Manual Backup"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Configuration Sections */}
        {renderSettingSection("General Settings", "general", systemSettings.general)}
        {renderSettingSection("Notifications", "notifications", systemSettings.notifications)}
        {renderSettingSection("Security", "security", systemSettings.security)}
        {renderSettingSection("Performance", "performance", systemSettings.performance)}
        {renderSettingSection("Integration", "integration", systemSettings.integration)}

        {/* System Logs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent System Logs</Text>
          <View style={styles.logsContainer}>
            {recentLogs.map((log, index) => (
              <View key={index} style={styles.logItem}>
                <View style={[
                  styles.logLevel,
                  { backgroundColor: getLogColor(log.level) + "20" }
                ]}>
                  <Text style={[styles.logLevelText, { color: getLogColor(log.level) }]}>
                    {log.level}
                  </Text>
                </View>
                <View style={styles.logContent}>
                  <Text style={styles.logMessage}>{log.message}</Text>
                  <Text style={styles.logTime}>
                    {new Date(log.timestamp).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.saveButton]}
            onPress={handleSaveSettings}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? "⏳ Saving..." : "💾 Save Settings"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleSystemReset}
          >
            <Text style={styles.resetButtonText}>🔄 Reset to Defaults</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Backup Configuration Modal */}
      <Modal
        visible={showBackupModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBackupModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Backup Configuration</Text>
            <View style={styles.backupOptions}>
              <Text style={styles.optionLabel}>Frequency:</Text>
              <View style={styles.frequencyOptions}>
                {["hourly", "daily", "weekly"].map((freq) => (
                  <TouchableOpacity
                    key={freq}
                    style={[
                      styles.frequencyButton,
                      backupSettings.frequency === freq && styles.frequencyButtonSelected,
                    ]}
                    onPress={() => setBackupSettings(prev => ({ ...prev, frequency: freq }))}
                  >
                    <Text style={[
                      styles.frequencyButtonText,
                      backupSettings.frequency === freq && styles.frequencyButtonTextSelected,
                    ]}>
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowBackupModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={() => {
                  setShowBackupModal(false);
                  Alert.alert("Success", "Backup settings updated!");
                }}
              >
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Maintenance Mode Modal */}
      <Modal
        visible={showMaintenanceModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMaintenanceModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.maintenanceModalContent}>
            <Text style={styles.maintenanceModalTitle}>🔧 Enable Maintenance Mode</Text>
            <Text style={styles.maintenanceModalText}>
              This will restrict system access to administrators only. All users will be logged out and prevented from accessing the system.
            </Text>
            <View style={styles.maintenanceModalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowMaintenanceModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.maintenanceEnableButton]}
                onPress={() => {
                  handleSettingToggle("general", "maintenanceMode");
                  setShowMaintenanceModal(false);
                  Alert.alert("Maintenance Mode", "System is now in maintenance mode.");
                }}
              >
                <Text style={styles.maintenanceEnableText}>Enable</Text>
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
  maintenanceButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  maintenanceButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
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
  statusContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.medium,
  },
  statusCard: {
    alignItems: "center",
    flex: 1,
  },
  statusValue: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  statusActions: {
    flexDirection: "row",
    gap: SIZES.small,
  },
  statusButton: {
    flex: 1,
    backgroundColor: COLORS.primary + "20",
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
    alignItems: "center",
  },
  statusButtonText: {
    color: COLORS.primary,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  backupButton: {
    backgroundColor: COLORS.info + "20",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  backupButtonText: {
    color: COLORS.info,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  backupContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backupInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SIZES.small,
  },
  backupLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  backupValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  manualBackupButton: {
    backgroundColor: COLORS.success,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusSmall,
    alignItems: "center",
    marginTop: SIZES.medium,
  },
  manualBackupText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  settingsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  settingLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  settingInput: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small,
    minWidth: 80,
    textAlign: "center",
  },
  logsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logLevel: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: SIZES.radiusSmall,
    marginRight: SIZES.medium,
    minWidth: 60,
    alignItems: "center",
  },
  logLevelText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  logContent: {
    flex: 1,
  },
  logMessage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginBottom: 2,
  },
  logTime: {
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
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  resetButton: {
    backgroundColor: COLORS.error,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  resetButtonText: {
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
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SIZES.large,
    textAlign: "center",
  },
  backupOptions: {
    marginBottom: SIZES.large,
  },
  optionLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  frequencyOptions: {
    flexDirection: "row",
    gap: SIZES.small,
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.background,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  frequencyButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  frequencyButtonText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: "600",
  },
  frequencyButtonTextSelected: {
    color: COLORS.surface,
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
  maintenanceModalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    width: "100%",
    maxWidth: 400,
  },
  maintenanceModalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.warning,
    marginBottom: SIZES.medium,
    textAlign: "center",
  },
  maintenanceModalText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.large,
    lineHeight: 22,
  },
  maintenanceModalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  maintenanceEnableButton: {
    backgroundColor: COLORS.warning,
  },
  maintenanceEnableText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
});
