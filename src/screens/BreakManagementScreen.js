import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatTime, formatDuration } from "../utils/helpers";

export default function BreakManagementScreen({ navigation }) {
  const [currentBreak, setCurrentBreak] = useState(null);
  const [breakHistory, setBreakHistory] = useState([
    {
      id: 1,
      type: "lunch",
      startTime: new Date("2025-01-31T12:00:00"),
      endTime: new Date("2025-01-31T12:30:00"),
      duration: 30,
      location: "Rest Area A",
      notes: "Lunch break",
    },
    {
      id: 2,
      type: "rest",
      startTime: new Date("2025-01-31T10:15:00"),
      endTime: new Date("2025-01-31T10:30:00"),
      duration: 15,
      location: "Route Stop 5",
      notes: "Quick rest break",
    },
    {
      id: 3,
      type: "emergency",
      startTime: new Date("2025-01-30T14:45:00"),
      endTime: new Date("2025-01-30T15:15:00"),
      duration: 30,
      location: "Green Park",
      notes: "Vehicle inspection needed",
    },
  ]);

  const [todayStats, setTodayStats] = useState({
    totalBreakTime: 45, // minutes
    breaksToday: 2,
    lastBreak: new Date("2025-01-31T12:30:00"),
    remainingBreakTime: 15, // minutes remaining for the day
  });

  const [showBreakModal, setShowBreakModal] = useState(false);
  const [selectedBreakType, setSelectedBreakType] = useState(null);

  const breakTypes = [
    {
      id: "rest",
      title: "Rest Break",
      description: "15-minute break",
      maxDuration: 15,
      icon: "☕",
      color: COLORS.info,
    },
    {
      id: "lunch",
      title: "Lunch Break",
      description: "30-60 minute meal break",
      maxDuration: 60,
      icon: "🍽️",
      color: COLORS.success,
    },
    {
      id: "emergency",
      title: "Emergency Break",
      description: "Unscheduled break",
      maxDuration: 120,
      icon: "🚨",
      color: COLORS.error,
    },
    {
      id: "maintenance",
      title: "Vehicle Check",
      description: "Vehicle inspection/maintenance",
      maxDuration: 45,
      icon: "🔧",
      color: COLORS.warning,
    },
  ];

  // Timer effect for active break
  useEffect(() => {
    let interval;
    if (currentBreak) {
      interval = setInterval(() => {
        setCurrentBreak((prev) => ({
          ...prev,
          currentDuration: Math.floor(
            (new Date() - prev.startTime) / (1000 * 60)
          ),
        }));
      }, 60000); // Update every minute
    }
    return () => clearInterval(interval);
  }, [currentBreak]);

  const startBreak = (breakType) => {
    const now = new Date();
    const newBreak = {
      id: Date.now(),
      type: breakType.id,
      startTime: now,
      maxDuration: breakType.maxDuration,
      currentDuration: 0,
      location: "Current Location", // In real app, get from GPS
    };

    setCurrentBreak(newBreak);
    setShowBreakModal(false);
    Alert.alert(
      "Break Started",
      `${breakType.title} started at ${formatTime(now)}`
    );
  };

  const endBreak = () => {
    if (!currentBreak) return;

    const endTime = new Date();
    const duration = Math.floor(
      (endTime - currentBreak.startTime) / (1000 * 60)
    );

    const completedBreak = {
      ...currentBreak,
      endTime,
      duration,
      notes: "Break completed",
    };

    // Add to history
    setBreakHistory([completedBreak, ...breakHistory]);

    // Update today's stats
    setTodayStats((prev) => ({
      ...prev,
      totalBreakTime: prev.totalBreakTime + duration,
      breaksToday: prev.breaksToday + 1,
      lastBreak: endTime,
      remainingBreakTime: Math.max(0, prev.remainingBreakTime - duration),
    }));

    setCurrentBreak(null);
    Alert.alert(
      "Break Ended",
      `Break completed. Duration: ${duration} minutes`
    );
  };

  const getBreakTypeInfo = (typeId) => {
    return breakTypes.find((type) => type.id === typeId);
  };

  const renderBreakModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showBreakModal}
      onRequestClose={() => setShowBreakModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Break Type</Text>
          {breakTypes.map((breakType) => (
            <TouchableOpacity
              key={breakType.id}
              style={[
                styles.breakTypeOption,
                { borderColor: breakType.color + "30" },
              ]}
              onPress={() => startBreak(breakType)}
            >
              <View style={styles.breakTypeHeader}>
                <Text style={styles.breakTypeIcon}>{breakType.icon}</Text>
                <View style={styles.breakTypeInfo}>
                  <Text style={styles.breakTypeTitle}>{breakType.title}</Text>
                  <Text style={styles.breakTypeDescription}>
                    {breakType.description}
                  </Text>
                </View>
                <Text style={styles.breakTypeDuration}>
                  {breakType.maxDuration}min
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          <CustomButton
            title="Cancel"
            onPress={() => setShowBreakModal(false)}
            variant="secondary"
            style={styles.cancelButton}
          />
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Break Management</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Current Break Status */}
        {currentBreak ? (
          <View style={styles.currentBreakCard}>
            <View style={styles.currentBreakHeader}>
              <View style={styles.breakIndicator}>
                <Text style={styles.breakIndicatorIcon}>
                  {getBreakTypeInfo(currentBreak.type)?.icon}
                </Text>
              </View>
              <View style={styles.currentBreakInfo}>
                <Text style={styles.currentBreakTitle}>Break in Progress</Text>
                <Text style={styles.currentBreakType}>
                  {getBreakTypeInfo(currentBreak.type)?.title}
                </Text>
                <Text style={styles.currentBreakTime}>
                  Started: {formatTime(currentBreak.startTime)}
                </Text>
              </View>
            </View>
            
            <View style={styles.currentBreakTimer}>
              <Text style={styles.timerText}>
                {currentBreak.currentDuration || 0} / {currentBreak.maxDuration} minutes
              </Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(
                        100,
                        ((currentBreak.currentDuration || 0) / currentBreak.maxDuration) * 100
                      )}%`,
                      backgroundColor:
                        (currentBreak.currentDuration || 0) > currentBreak.maxDuration
                          ? COLORS.error
                          : COLORS.success,
                    },
                  ]}
                />
              </View>
              {(currentBreak.currentDuration || 0) > currentBreak.maxDuration && (
                <Text style={styles.overtimeWarning}>
                  ⚠️ Break time exceeded
                </Text>
              )}
            </View>

            <CustomButton
              title="End Break"
              onPress={endBreak}
              style={styles.endBreakButton}
            />
          </View>
        ) : (
          <View style={styles.startBreakCard}>
            <Text style={styles.startBreakTitle}>Ready for a break?</Text>
            <Text style={styles.startBreakDescription}>
              Take the rest you need to stay safe and productive
            </Text>
            <CustomButton
              title="Start Break"
              onPress={() => setShowBreakModal(true)}
              style={styles.startBreakButton}
            />
          </View>
        )}

        {/* Today's Break Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Break Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏱️</Text>
              <Text style={styles.statValue}>{todayStats.totalBreakTime}m</Text>
              <Text style={styles.statLabel}>Total Break Time</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statValue}>{todayStats.breaksToday}</Text>
              <Text style={styles.statLabel}>Breaks Taken</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⏰</Text>
              <Text style={styles.statValue}>{todayStats.remainingBreakTime}m</Text>
              <Text style={styles.statLabel}>Time Remaining</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🕐</Text>
              <Text style={styles.statValue}>
                {formatTime(todayStats.lastBreak, "short")}
              </Text>
              <Text style={styles.statLabel}>Last Break</Text>
            </View>
          </View>
        </View>

        {/* Break History */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Recent Breaks</Text>
          {breakHistory.length > 0 ? (
            <View style={styles.historyList}>
              {breakHistory.slice(0, 5).map((breakItem) => {
                const breakTypeInfo = getBreakTypeInfo(breakItem.type);
                return (
                  <View key={breakItem.id} style={styles.historyItem}>
                    <View style={styles.historyHeader}>
                      <View style={styles.historyType}>
                        <Text style={styles.historyIcon}>
                          {breakTypeInfo?.icon}
                        </Text>
                        <View>
                          <Text style={styles.historyTitle}>
                            {breakTypeInfo?.title}
                          </Text>
                          <Text style={styles.historyDate}>
                            {formatTime(breakItem.startTime)} - {formatTime(breakItem.endTime)}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.historyDuration}>
                        <Text style={styles.durationText}>
                          {breakItem.duration}m
                        </Text>
                        <Text
                          style={[
                            styles.durationStatus,
                            {
                              color:
                                breakItem.duration > breakTypeInfo?.maxDuration
                                  ? COLORS.error
                                  : COLORS.success,
                            },
                          ]}
                        >
                          {breakItem.duration > breakTypeInfo?.maxDuration
                            ? "Over"
                            : "On time"}
                        </Text>
                      </View>
                    </View>
                    {breakItem.notes && (
                      <Text style={styles.historyNotes}>{breakItem.notes}</Text>
                    )}
                    <Text style={styles.historyLocation}>
                      📍 {breakItem.location}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyHistoryIcon}>☕</Text>
              <Text style={styles.emptyHistoryText}>No breaks taken today</Text>
              <Text style={styles.emptyHistorySubtext}>
                Take your first break to stay refreshed
              </Text>
            </View>
          )}
        </View>

        {/* Break Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.sectionTitle}>Break Guidelines</Text>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>⏰</Text>
              <Text style={styles.guidelineText}>
                Take a 15-minute break every 2 hours
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>🍽️</Text>
              <Text style={styles.guidelineText}>
                30-60 minute lunch break required
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>🚛</Text>
              <Text style={styles.guidelineText}>
                Park safely before taking breaks
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>📱</Text>
              <Text style={styles.guidelineText}>
                Log all breaks for compliance
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderBreakModal()}
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
    alignItems: "center",
    marginBottom: SIZES.large,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  currentBreakCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentBreakHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  breakIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.warning + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.medium,
  },
  breakIndicatorIcon: {
    fontSize: 24,
  },
  currentBreakInfo: {
    flex: 1,
  },
  currentBreakTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  currentBreakType: {
    fontSize: SIZES.fontMedium,
    color: COLORS.warning,
    fontWeight: "500",
    marginBottom: 4,
  },
  currentBreakTime: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  currentBreakTimer: {
    marginBottom: SIZES.large,
  },
  timerText: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.small,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: SIZES.small,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  overtimeWarning: {
    fontSize: SIZES.fontSmall,
    color: COLORS.error,
    textAlign: "center",
    fontWeight: "500",
  },
  endBreakButton: {
    backgroundColor: COLORS.error,
  },
  startBreakCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startBreakTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  startBreakDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SIZES.large,
    lineHeight: 22,
  },
  startBreakButton: {
    width: "100%",
  },
  statsContainer: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: SIZES.small,
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
    textAlign: "center",
  },
  historyContainer: {
    marginBottom: SIZES.large,
  },
  historyList: {
    gap: SIZES.medium,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  historyType: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  historyIcon: {
    fontSize: 20,
    marginRight: SIZES.medium,
  },
  historyTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  historyDate: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  historyDuration: {
    alignItems: "flex-end",
  },
  durationText: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  durationStatus: {
    fontSize: SIZES.fontSmall,
    fontWeight: "500",
  },
  historyNotes: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: SIZES.small / 2,
    fontStyle: "italic",
  },
  historyLocation: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  emptyHistory: {
    alignItems: "center",
    padding: SIZES.large,
  },
  emptyHistoryIcon: {
    fontSize: 48,
    marginBottom: SIZES.medium,
  },
  emptyHistoryText: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  emptyHistorySubtext: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  guidelinesContainer: {
    marginBottom: SIZES.large,
  },
  guidelinesList: {
    gap: SIZES.medium,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusSmall,
  },
  guidelineIcon: {
    fontSize: 20,
    marginRight: SIZES.medium,
  },
  guidelineText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 1,
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
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.large,
  },
  breakTypeOption: {
    borderWidth: 1,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  breakTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  breakTypeIcon: {
    fontSize: 24,
    marginRight: SIZES.medium,
  },
  breakTypeInfo: {
    flex: 1,
  },
  breakTypeTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  breakTypeDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  breakTypeDuration: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
    color: COLORS.primary,
  },
  cancelButton: {
    marginTop: SIZES.small,
  },
});
