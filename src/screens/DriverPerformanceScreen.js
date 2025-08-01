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
import { formatDate } from "../utils/helpers";

export default function DriverPerformanceScreen({ navigation }) {
  const [performanceData, setPerformanceData] = useState({
    overall: {
      rating: 4.8,
      rank: 3,
      totalDrivers: 24,
      improvementTrend: "+0.2", // compared to last month
    },
    monthlyStats: {
      collections: 245,
      target: 220,
      efficiency: 96.5,
      onTimeRate: 94.2,
      customerRating: 4.9,
      completionRate: 98.8,
    },
    yearlyStats: {
      collections: 2156,
      target: 2000,
      totalDistance: "12,456 km",
      workDays: 248,
      perfectDays: 198, // days with no issues
    },
    recentAchievements: [
      {
        id: 1,
        title: "Perfect Week",
        description: "Completed all routes on time for 7 consecutive days",
        date: new Date("2025-01-25"),
        badge: "🏆",
        points: 50,
      },
      {
        id: 2,
        title: "Customer Favorite",
        description: "Received 5-star rating from 20+ customers this month",
        date: new Date("2025-01-20"),
        badge: "⭐",
        points: 30,
      },
      {
        id: 3,
        title: "Efficiency Expert",
        description: "Maintained 95%+ efficiency for 30 days",
        date: new Date("2025-01-15"),
        badge: "⚡",
        points: 40,
      },
      {
        id: 4,
        title: "Safety Champion",
        description: "No safety incidents for 6 months",
        date: new Date("2025-01-01"),
        badge: "🛡️",
        points: 100,
      },
    ],
    weeklyTrends: [
      { week: "Week 1", collections: 58, efficiency: 95.2, rating: 4.7 },
      { week: "Week 2", collections: 62, efficiency: 96.1, rating: 4.8 },
      { week: "Week 3", collections: 61, efficiency: 97.2, rating: 4.9 },
      { week: "Week 4", collections: 64, efficiency: 96.8, rating: 4.9 },
    ],
    areas: {
      strengths: [
        "Excellent customer service",
        "Consistent on-time performance",
        "High route efficiency",
        "Safety compliance",
      ],
      improvements: [
        "Vehicle maintenance reporting",
        "Digital documentation",
        "Route optimization suggestions",
      ],
    },
  });

  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const periods = [
    { id: "weekly", title: "This Week" },
    { id: "monthly", title: "This Month" },
    { id: "yearly", title: "This Year" },
  ];

  const getCurrentStats = () => {
    switch (selectedPeriod) {
      case "weekly":
        return {
          collections: 64,
          efficiency: 96.8,
          onTimeRate: 95.5,
          customerRating: 4.9,
        };
      case "yearly":
        return performanceData.yearlyStats;
      default:
        return performanceData.monthlyStats;
    }
  };

  const handleViewDetailedReport = () => {
    Alert.alert(
      "Detailed Report",
      "A comprehensive performance report will be generated and sent to your email."
    );
  };

  const handleGoalSetting = () => {
    Alert.alert(
      "Set Goals",
      "Goal setting feature will help you track and improve your performance metrics."
    );
  };

  const getPerformanceColor = (value, threshold = 90) => {
    if (value >= threshold) return COLORS.success;
    if (value >= threshold - 10) return COLORS.warning;
    return COLORS.error;
  };

  const getRankSuffix = (rank) => {
    const lastDigit = rank % 10;
    const lastTwoDigits = rank % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";
    
    switch (lastDigit) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const currentStats = getCurrentStats();

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
          <Text style={styles.headerTitle}>Performance</Text>
          <TouchableOpacity
            onPress={handleViewDetailedReport}
            style={styles.reportButton}
          >
            <Text style={styles.reportIcon}>📊</Text>
          </TouchableOpacity>
        </View>

        {/* Overall Performance Card */}
        <View style={styles.overallCard}>
          <View style={styles.overallHeader}>
            <View style={styles.ratingContainer}>
              <Text style={styles.overallRating}>
                {performanceData.overall.rating}
              </Text>
              <View style={styles.starsContainer}>
                <Text style={styles.starsText}>⭐⭐⭐⭐⭐</Text>
              </View>
              <Text style={styles.ratingTrend}>
                {performanceData.overall.improvementTrend} vs last month
              </Text>
            </View>
            <View style={styles.rankContainer}>
              <Text style={styles.rankNumber}>
                #{performanceData.overall.rank}
              </Text>
              <Text style={styles.rankText}>
                {performanceData.overall.rank}
                {getRankSuffix(performanceData.overall.rank)} out of{" "}
                {performanceData.overall.totalDrivers}
              </Text>
            </View>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>📋</Text>
              <Text style={styles.metricValue}>
                {currentStats.collections?.toLocaleString() || "N/A"}
              </Text>
              <Text style={styles.metricLabel}>Collections</Text>
              {selectedPeriod === "monthly" && (
                <Text style={styles.metricTarget}>
                  Target: {performanceData.monthlyStats.target}
                </Text>
              )}
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⚡</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: getPerformanceColor(currentStats.efficiency) },
                ]}
              >
                {currentStats.efficiency?.toFixed(1)}%
              </Text>
              <Text style={styles.metricLabel}>Efficiency</Text>
              <Text style={styles.metricSubtext}>Route optimization</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⏰</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: getPerformanceColor(currentStats.onTimeRate) },
                ]}
              >
                {currentStats.onTimeRate?.toFixed(1)}%
              </Text>
              <Text style={styles.metricLabel}>On-Time Rate</Text>
              <Text style={styles.metricSubtext}>Punctuality score</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricIcon}>⭐</Text>
              <Text
                style={[
                  styles.metricValue,
                  { color: COLORS.warning },
                ]}
              >
                {currentStats.customerRating?.toFixed(1)}
              </Text>
              <Text style={styles.metricLabel}>Customer Rating</Text>
              <Text style={styles.metricSubtext}>Service quality</Text>
            </View>
          </View>
        </View>

        {/* Recent Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievementsList}>
            {performanceData.recentAchievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementHeader}>
                  <Text style={styles.achievementBadge}>
                    {achievement.badge}
                  </Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                    <Text style={styles.achievementDate}>
                      {formatDate(achievement.date)}
                    </Text>
                  </View>
                  <View style={styles.achievementPoints}>
                    <Text style={styles.pointsText}>+{achievement.points}</Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Trends */}
        {selectedPeriod === "monthly" && (
          <View style={styles.trendsContainer}>
            <Text style={styles.sectionTitle}>Weekly Trends</Text>
            <View style={styles.trendsList}>
              {performanceData.weeklyTrends.map((week, index) => (
                <View key={index} style={styles.trendItem}>
                  <Text style={styles.trendWeek}>{week.week}</Text>
                  <View style={styles.trendMetrics}>
                    <View style={styles.trendMetric}>
                      <Text style={styles.trendValue}>{week.collections}</Text>
                      <Text style={styles.trendLabel}>Collections</Text>
                    </View>
                    <View style={styles.trendMetric}>
                      <Text style={styles.trendValue}>{week.efficiency}%</Text>
                      <Text style={styles.trendLabel}>Efficiency</Text>
                    </View>
                    <View style={styles.trendMetric}>
                      <Text style={styles.trendValue}>⭐{week.rating}</Text>
                      <Text style={styles.trendLabel}>Rating</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Strengths & Improvements */}
        <View style={styles.feedbackContainer}>
          <Text style={styles.sectionTitle}>Performance Feedback</Text>
          
          <View style={styles.strengthsCard}>
            <Text style={styles.feedbackTitle}>🌟 Strengths</Text>
            {performanceData.areas.strengths.map((strength, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.feedbackBullet}>•</Text>
                <Text style={styles.feedbackText}>{strength}</Text>
              </View>
            ))}
          </View>

          <View style={styles.improvementsCard}>
            <Text style={styles.feedbackTitle}>📈 Areas for Improvement</Text>
            {performanceData.areas.improvements.map((improvement, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.feedbackBullet}>•</Text>
                <Text style={styles.feedbackText}>{improvement}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton
            title="Set Performance Goals"
            onPress={handleGoalSetting}
            style={styles.actionButton}
          />
          <CustomButton
            title="View Detailed Report"
            onPress={handleViewDetailedReport}
            variant="secondary"
            style={styles.actionButton}
          />
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
  reportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  reportIcon: {
    fontSize: 20,
  },
  overallCard: {
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
  overallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    alignItems: "center",
    flex: 1,
  },
  overallRating: {
    fontSize: 48,
    fontWeight: "bold",
    color: COLORS.warning,
    marginBottom: SIZES.small,
  },
  starsContainer: {
    marginBottom: SIZES.small / 2,
  },
  starsText: {
    fontSize: 20,
  },
  ratingTrend: {
    fontSize: SIZES.fontSmall,
    color: COLORS.success,
    fontWeight: "500",
  },
  rankContainer: {
    alignItems: "center",
    flex: 1,
  },
  rankNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  rankText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.small,
    marginBottom: SIZES.large,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    alignItems: "center",
    borderRadius: SIZES.radiusSmall,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  periodTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  metricsContainer: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  metricCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    alignItems: "center",
    marginBottom: SIZES.medium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIcon: {
    fontSize: 28,
    marginBottom: SIZES.small,
  },
  metricValue: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  metricTarget: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  metricSubtext: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    textAlign: "center",
  },
  achievementsContainer: {
    marginBottom: SIZES.large,
  },
  achievementsList: {
    gap: SIZES.medium,
  },
  achievementCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  achievementBadge: {
    fontSize: 32,
    marginRight: SIZES.medium,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  achievementPoints: {
    alignItems: "center",
  },
  pointsText: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.success,
  },
  pointsLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  trendsContainer: {
    marginBottom: SIZES.large,
  },
  trendsList: {
    gap: SIZES.small,
  },
  trendItem: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSmall,
    padding: SIZES.medium,
    flexDirection: "row",
    alignItems: "center",
  },
  trendWeek: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    width: 80,
  },
  trendMetrics: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  trendMetric: {
    alignItems: "center",
  },
  trendValue: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  trendLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  feedbackContainer: {
    marginBottom: SIZES.large,
  },
  strengthsCard: {
    backgroundColor: COLORS.success + "10",
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.success + "20",
  },
  improvementsCard: {
    backgroundColor: COLORS.info + "10",
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.info + "20",
  },
  feedbackTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  feedbackItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SIZES.small,
  },
  feedbackBullet: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    marginRight: SIZES.small,
    lineHeight: 20,
  },
  feedbackText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: SIZES.large,
  },
  actionButton: {
    marginBottom: SIZES.medium,
  },
});
