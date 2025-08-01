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
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatDate } from "../utils/helpers";

export default function SystemLogsScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const [systemLogs] = useState([
    {
      id: 1,
      timestamp: "2025-07-31T10:45:30",
      level: "INFO",
      category: "auth",
      user: "admin@safacycle.com",
      action: "User login successful",
      details: "User admin@safacycle.com logged in from IP 192.168.1.100",
      metadata: {
        ip: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        sessionId: "sess_abc123",
      },
    },
    {
      id: 2,
      timestamp: "2025-07-31T10:30:15",
      level: "WARN",
      category: "system",
      user: "system",
      action: "High memory usage detected",
      details: "System memory usage reached 85% threshold",
      metadata: {
        memoryUsage: "85%",
        availableMemory: "2.1GB",
        threshold: "85%",
      },
    },
    {
      id: 3,
      timestamp: "2025-07-31T10:15:45",
      level: "ERROR",
      category: "api",
      user: "api_user",
      action: "API request failed",
      details: "Failed to process API request to /api/users/bulk-update",
      metadata: {
        endpoint: "/api/users/bulk-update",
        method: "POST",
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
      },
    },
    {
      id: 4,
      timestamp: "2025-07-31T10:00:00",
      level: "INFO",
      category: "backup",
      user: "system",
      action: "Automated backup completed",
      details: "Daily system backup completed successfully",
      metadata: {
        backupSize: "1.2GB",
        duration: "15m 30s",
        location: "cloud_storage_bucket",
      },
    },
    {
      id: 5,
      timestamp: "2025-07-31T09:45:22",
      level: "DEBUG",
      category: "performance",
      user: "system",
      action: "Database query optimization",
      details: "Optimized slow query on users table",
      metadata: {
        query: "SELECT * FROM users WHERE status = 'active'",
        executionTime: "1.2s",
        optimizedTime: "0.3s",
      },
    },
    {
      id: 6,
      timestamp: "2025-07-31T09:30:10",
      level: "AUDIT",
      category: "user_management",
      user: "admin@safacycle.com",
      action: "User status changed",
      details: "Changed user status from 'active' to 'suspended' for user@example.com",
      metadata: {
        targetUser: "user@example.com",
        previousStatus: "active",
        newStatus: "suspended",
        reason: "Policy violation",
      },
    },
    {
      id: 7,
      timestamp: "2025-07-31T09:15:55",
      level: "ERROR",
      category: "security",
      user: "unknown",
      action: "Failed login attempt",
      details: "Multiple failed login attempts detected from IP 192.168.1.50",
      metadata: {
        ip: "192.168.1.50",
        attempts: 5,
        timeWindow: "5 minutes",
        action: "IP temporarily blocked",
      },
    },
    {
      id: 8,
      timestamp: "2025-07-31T09:00:33",
      level: "INFO",
      category: "data",
      user: "admin@safacycle.com",
      action: "Data export initiated",
      details: "User data export requested for compliance audit",
      metadata: {
        exportType: "user_data",
        recordCount: 156,
        format: "CSV",
        requestId: "exp_789xyz",
      },
    },
  ]);

  const filterOptions = [
    { key: "all", label: "All Categories" },
    { key: "auth", label: "Authentication" },
    { key: "system", label: "System" },
    { key: "api", label: "API" },
    { key: "backup", label: "Backup" },
    { key: "user_management", label: "User Management" },
    { key: "security", label: "Security" },
    { key: "data", label: "Data Operations" },
    { key: "performance", label: "Performance" },
  ];

  const levelOptions = [
    { key: "all", label: "All Levels" },
    { key: "DEBUG", label: "Debug" },
    { key: "INFO", label: "Info" },
    { key: "WARN", label: "Warning" },
    { key: "ERROR", label: "Error" },
    { key: "AUDIT", label: "Audit" },
  ];

  const filteredLogs = systemLogs.filter((log) => {
    let matches = true;

    if (selectedFilter !== "all") {
      matches = matches && log.category === selectedFilter;
    }

    if (selectedLevel !== "all") {
      matches = matches && log.level === selectedLevel;
    }

    if (searchQuery) {
      matches = matches && (
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return matches;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case "ERROR":
        return COLORS.error;
      case "WARN":
        return COLORS.warning;
      case "INFO":
        return COLORS.info;
      case "DEBUG":
        return COLORS.textSecondary;
      case "AUDIT":
        return COLORS.admin;
      default:
        return COLORS.textSecondary;
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "ERROR":
        return "🔴";
      case "WARN":
        return "🟡";
      case "INFO":
        return "🔵";
      case "DEBUG":
        return "⚪";
      case "AUDIT":
        return "🟣";
      default:
        return "⚪";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "auth":
        return "🔐";
      case "system":
        return "⚙️";
      case "api":
        return "🔗";
      case "backup":
        return "💾";
      case "user_management":
        return "👥";
      case "security":
        return "🛡️";
      case "data":
        return "📊";
      case "performance":
        return "⚡";
      default:
        return "📝";
    }
  };

  const handleLogSelect = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const handleExportLogs = () => {
    Alert.alert(
      "Export Logs",
      "Choose export format:",
      [
        { text: "Cancel", style: "cancel" },
        { text: "CSV", onPress: () => exportLogs("csv") },
        { text: "JSON", onPress: () => exportLogs("json") },
        { text: "PDF", onPress: () => exportLogs("pdf") },
      ]
    );
  };

  const exportLogs = (format) => {
    Alert.alert(
      "Export Started",
      `Exporting ${filteredLogs.length} log entries to ${format.toUpperCase()} format. You will receive a download link shortly.`
    );
  };

  const handleClearLogs = () => {
    Alert.alert(
      "⚠️ Clear Logs",
      "This will permanently delete all system logs. This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            Alert.alert("Success", "System logs have been cleared.");
          },
        },
      ]
    );
  };

  const logStats = {
    total: systemLogs.length,
    errors: systemLogs.filter(log => log.level === "ERROR").length,
    warnings: systemLogs.filter(log => log.level === "WARN").length,
    audits: systemLogs.filter(log => log.level === "AUDIT").length,
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
            <Text style={styles.title}>System Logs & Audit Trail</Text>
            <Text style={styles.subtitle}>Monitor system activities and security events</Text>
          </View>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExportLogs}
          >
            <Text style={styles.exportButtonText}>📊 Export</Text>
          </TouchableOpacity>
        </View>

        {/* Log Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log Overview</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: COLORS.primary + "20" }]}>
                <Text style={styles.statNumber}>{logStats.total}</Text>
                <Text style={styles.statLabel}>Total Logs</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: COLORS.error + "20" }]}>
                <Text style={[styles.statNumber, { color: COLORS.error }]}>
                  {logStats.errors}
                </Text>
                <Text style={styles.statLabel}>Errors</Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { backgroundColor: COLORS.warning + "20" }]}>
                <Text style={[styles.statNumber, { color: COLORS.warning }]}>
                  {logStats.warnings}
                </Text>
                <Text style={styles.statLabel}>Warnings</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: COLORS.admin + "20" }]}>
                <Text style={[styles.statNumber, { color: COLORS.admin }]}>
                  {logStats.audits}
                </Text>
                <Text style={styles.statLabel}>Audit Events</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filter Logs</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search logs by action, details, or user..."
              placeholderTextColor={COLORS.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Category:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterChip,
                      selectedFilter === option.key && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedFilter(option.key)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedFilter === option.key && styles.filterChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Level:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {levelOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.filterChip,
                      selectedLevel === option.key && styles.filterChipSelected,
                    ]}
                    onPress={() => setSelectedLevel(option.key)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedLevel === option.key && styles.filterChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Log Entries */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Log Entries ({filteredLogs.length})
            </Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearLogs}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logsContainer}>
            {filteredLogs.map((log) => (
              <TouchableOpacity
                key={log.id}
                style={styles.logItem}
                onPress={() => handleLogSelect(log)}
              >
                <View style={styles.logHeader}>
                  <View style={styles.logLeft}>
                    <Text style={styles.logIcon}>
                      {getLevelIcon(log.level)}
                    </Text>
                    <View style={styles.logInfo}>
                      <View style={styles.logTitleRow}>
                        <Text style={styles.logAction}>{log.action}</Text>
                        <View style={[
                          styles.levelBadge,
                          { backgroundColor: getLevelColor(log.level) + "20" }
                        ]}>
                          <Text style={[
                            styles.levelBadgeText,
                            { color: getLevelColor(log.level) }
                          ]}>
                            {log.level}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.logDetails} numberOfLines={1}>
                        {log.details}
                      </Text>
                      <View style={styles.logMeta}>
                        <Text style={styles.logUser}>
                          {getCategoryIcon(log.category)} {log.user}
                        </Text>
                        <Text style={styles.logTime}>
                          {formatDate(log.timestamp)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.logArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Refresh", "Logs refreshed!")}
          >
            <Text style={styles.actionButtonText}>🔄 Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert("Archive", "Log archiving initiated!")}
          >
            <Text style={styles.actionButtonText}>📦 Archive Old</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Log Details Modal */}
      <Modal
        visible={showLogModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLogModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedLog && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Log Details</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowLogModal(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Timestamp:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedLog.timestamp).toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Level:</Text>
                    <View style={[
                      styles.levelBadge,
                      { backgroundColor: getLevelColor(selectedLog.level) + "20" }
                    ]}>
                      <Text style={[
                        styles.levelBadgeText,
                        { color: getLevelColor(selectedLog.level) }
                      ]}>
                        {selectedLog.level}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailValue}>
                      {getCategoryIcon(selectedLog.category)} {selectedLog.category}
                    </Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>User:</Text>
                    <Text style={styles.detailValue}>{selectedLog.user}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Action:</Text>
                    <Text style={styles.detailValue}>{selectedLog.action}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Details:</Text>
                    <Text style={styles.detailValue}>{selectedLog.details}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Metadata:</Text>
                    <View style={styles.metadataContainer}>
                      {Object.entries(selectedLog.metadata).map(([key, value]) => (
                        <View key={key} style={styles.metadataItem}>
                          <Text style={styles.metadataKey}>{key}:</Text>
                          <Text style={styles.metadataValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalActionButton]}
                    onPress={() => Alert.alert("Export", "Log entry exported!")}
                  >
                    <Text style={styles.modalActionText}>Export</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalCloseButton]}
                    onPress={() => setShowLogModal(false)}
                  >
                    <Text style={styles.modalCloseText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  exportButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  exportButtonText: {
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
  clearButton: {
    backgroundColor: COLORS.error + "20",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusSmall,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  statsContainer: {
    marginBottom: SIZES.medium,
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
  searchContainer: {
    marginBottom: SIZES.medium,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtersContainer: {
    marginBottom: SIZES.medium,
  },
  filterSection: {
    marginBottom: SIZES.medium,
  },
  filterLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  filterScroll: {
    flexDirection: "row",
  },
  filterChip: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: SIZES.radiusLarge,
    marginRight: SIZES.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.text,
    fontWeight: "500",
  },
  filterChipTextSelected: {
    color: COLORS.surface,
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
    paddingVertical: SIZES.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  logIcon: {
    fontSize: 20,
    marginRight: SIZES.medium,
    marginTop: 2,
  },
  logInfo: {
    flex: 1,
  },
  logTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  logAction: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  levelBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: 2,
    borderRadius: SIZES.radiusSmall,
    marginLeft: SIZES.small,
  },
  levelBadgeText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  logDetails: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  logMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logUser: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  logTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  logArrow: {
    fontSize: 20,
    color: COLORS.textLight,
    marginLeft: SIZES.small,
  },
  actionButtons: {
    flexDirection: "row",
    gap: SIZES.medium,
    marginBottom: SIZES.large,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: COLORS.text,
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
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.textLight + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "bold",
  },
  modalBody: {
    padding: SIZES.large,
    maxHeight: 400,
  },
  detailSection: {
    marginBottom: SIZES.large,
  },
  detailLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  detailValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  metadataContainer: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.medium,
  },
  metadataItem: {
    flexDirection: "row",
    marginBottom: SIZES.small,
  },
  metadataKey: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
    color: COLORS.text,
    width: 120,
  },
  metadataValue: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: SIZES.medium,
    padding: SIZES.large,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  modalActionButton: {
    backgroundColor: COLORS.primary,
  },
  modalCloseButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  modalActionText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  modalCloseText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
});
