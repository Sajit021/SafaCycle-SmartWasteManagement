import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import { formatDate, formatCurrency } from "../utils/helpers";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("collections");

  // Mock analytics data
  const analyticsData = {
    week: {
      collections: {
        total: 1847,
        completed: 1702,
        missed: 145,
        growth: "+12.5%",
      },
      revenue: {
        total: 47350,
        average: 25.65,
        growth: "+8.3%",
      },
      efficiency: {
        onTime: 92.1,
        fuelSaved: 847,
        co2Reduced: 2.3,
      },
    },
    month: {
      collections: {
        total: 7892,
        completed: 7234,
        missed: 658,
        growth: "+15.2%",
      },
      revenue: {
        total: 198750,
        average: 25.18,
        growth: "+11.7%",
      },
      efficiency: {
        onTime: 89.7,
        fuelSaved: 3621,
        co2Reduced: 9.8,
      },
    },
    year: {
      collections: {
        total: 94680,
        completed: 86759,
        missed: 7921,
        growth: "+18.9%",
      },
      revenue: {
        total: 2387450,
        average: 25.22,
        growth: "+14.5%",
      },
      efficiency: {
        onTime: 91.6,
        fuelSaved: 43567,
        co2Reduced: 118.5,
      },
    },
  };

  const [wasteTypeData] = useState([
    { type: "Household", amount: 45.2, color: COLORS.primary },
    { type: "Recyclable", amount: 28.7, color: COLORS.success },
    { type: "Organic", amount: 18.4, color: COLORS.warning },
    { type: "Hazardous", amount: 7.7, color: COLORS.error },
  ]);

  const [performanceData] = useState([
    {
      driver: "John Martinez",
      collections: 245,
      efficiency: 96.5,
      rating: 4.9,
    },
    {
      driver: "Sarah Johnson",
      collections: 238,
      efficiency: 94.2,
      rating: 4.8,
    },
    { driver: "Mike Chen", collections: 231, efficiency: 92.8, rating: 4.7 },
    { driver: "Lisa Davis", collections: 227, efficiency: 91.4, rating: 4.6 },
    { driver: "Bob Wilson", collections: 223, efficiency: 89.7, rating: 4.5 },
  ]);

  const [routeAnalytics] = useState([
    {
      route: "Route A - Residential",
      avgTime: "2h 45m",
      fuelEff: "8.2L/100km",
      satisfaction: 4.8,
    },
    {
      route: "Route B - Commercial",
      avgTime: "3h 15m",
      fuelEff: "9.1L/100km",
      satisfaction: 4.6,
    },
    {
      route: "Route C - Industrial",
      avgTime: "4h 30m",
      fuelEff: "11.3L/100km",
      satisfaction: 4.4,
    },
    {
      route: "Route D - Mixed",
      avgTime: "3h 50m",
      fuelEff: "9.8L/100km",
      satisfaction: 4.7,
    },
  ]);

  const currentData = analyticsData[selectedPeriod];

  const periods = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "year", label: "This Year" },
  ];

  const getGrowthColor = (growth) => {
    return growth.startsWith("+") ? COLORS.success : COLORS.error;
  };

  const renderChart = () => {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Waste Collection by Type</Text>
        <View style={styles.chart}>
          {wasteTypeData.map((item, index) => (
            <View key={index} style={styles.chartItem}>
              <View style={styles.chartBar}>
                <View
                  style={[
                    styles.chartFill,
                    {
                      width: `${item.amount}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <View style={styles.chartLabel}>
                <Text style={styles.chartType}>{item.type}</Text>
                <Text style={styles.chartPercentage}>{item.amount}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Filter */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Time Period</Text>
          <View style={styles.periodFilter}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.key && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period.key)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    selectedPeriod === period.key &&
                      styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>

          {/* Collections Stats */}
          <View style={styles.metricsGrid}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: COLORS.primary + "20" },
              ]}
            >
              <Text style={styles.metricNumber}>
                {currentData.collections.total.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Total Collections</Text>
              <Text
                style={[
                  styles.metricGrowth,
                  { color: getGrowthColor(currentData.collections.growth) },
                ]}
              >
                {currentData.collections.growth}
              </Text>
            </View>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: COLORS.success + "20" },
              ]}
            >
              <Text style={styles.metricNumber}>
                {currentData.collections.completed.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Completed</Text>
              <Text style={styles.metricSubtext}>
                {(
                  (currentData.collections.completed /
                    currentData.collections.total) *
                  100
                ).toFixed(1)}
                % success rate
              </Text>
            </View>
          </View>

          {/* Revenue Stats */}
          <View style={styles.metricsGrid}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: COLORS.warning + "20" },
              ]}
            >
              <Text style={styles.metricNumber}>
                {formatCurrency(currentData.revenue.total)}
              </Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
              <Text
                style={[
                  styles.metricGrowth,
                  { color: getGrowthColor(currentData.revenue.growth) },
                ]}
              >
                {currentData.revenue.growth}
              </Text>
            </View>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: COLORS.info + "20" },
              ]}
            >
              <Text style={styles.metricNumber}>
                {formatCurrency(currentData.revenue.average)}
              </Text>
              <Text style={styles.metricLabel}>Avg per Collection</Text>
              <Text style={styles.metricSubtext}>Per pickup value</Text>
            </View>
          </View>

          {/* Efficiency Stats */}
          <View style={styles.metricsGrid}>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: COLORS.success + "20" },
              ]}
            >
              <Text style={styles.metricNumber}>
                {currentData.efficiency.onTime}%
              </Text>
              <Text style={styles.metricLabel}>On-Time Rate</Text>
              <Text style={styles.metricSubtext}>Punctuality score</Text>
            </View>
            <View
              style={[
                styles.metricCard,
                { backgroundColor: COLORS.admin + "20" },
              ]}
            >
              <Text style={styles.metricNumber}>
                {currentData.efficiency.co2Reduced} tons
              </Text>
              <Text style={styles.metricLabel}>CO₂ Reduced</Text>
              <Text style={styles.metricSubtext}>Environmental impact</Text>
            </View>
          </View>
        </View>

        {/* Waste Type Chart */}
        {renderChart()}

        {/* Driver Performance */}
        <View style={styles.performanceContainer}>
          <Text style={styles.sectionTitle}>Driver Performance</Text>
          <View style={styles.performanceList}>
            {performanceData.map((driver, index) => (
              <View key={index} style={styles.performanceItem}>
                <View style={styles.performanceRank}>
                  <Text style={styles.rankNumber}>#{index + 1}</Text>
                </View>
                <View style={styles.performanceInfo}>
                  <Text style={styles.driverName}>{driver.driver}</Text>
                  <Text style={styles.driverStats}>
                    {driver.collections} collections • {driver.efficiency}%
                    efficiency
                  </Text>
                </View>
                <View style={styles.performanceRating}>
                  <Text style={styles.ratingText}>⭐ {driver.rating}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Route Analytics */}
        <View style={styles.routeContainer}>
          <Text style={styles.sectionTitle}>Route Analytics</Text>
          <View style={styles.routeList}>
            {routeAnalytics.map((route, index) => (
              <View key={index} style={styles.routeItem}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeName}>{route.route}</Text>
                  <Text style={styles.routeSatisfaction}>
                    ⭐ {route.satisfaction}
                  </Text>
                </View>
                <View style={styles.routeStats}>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatLabel}>Avg Time</Text>
                    <Text style={styles.routeStatValue}>{route.avgTime}</Text>
                  </View>
                  <View style={styles.routeStat}>
                    <Text style={styles.routeStatLabel}>Fuel Efficiency</Text>
                    <Text style={styles.routeStatValue}>{route.fuelEff}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.exportContainer}>
          <Text style={styles.sectionTitle}>Export Reports</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={[styles.exportButton, { backgroundColor: COLORS.primary }]}
            >
              <Text style={styles.exportButtonText}>📊 Export Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.exportButton,
                { backgroundColor: COLORS.secondary },
              ]}
            >
              <Text style={styles.exportButtonText}>📄 Export PDF</Text>
            </TouchableOpacity>
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
  filterContainer: {
    marginBottom: SIZES.large,
  },
  filterTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  periodFilter: {
    flexDirection: "row",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: SIZES.small,
    alignItems: "center",
    borderRadius: SIZES.radiusMedium,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  periodButtonTextActive: {
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
    gap: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricNumber: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metricGrowth: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
  },
  metricSubtext: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  chart: {
    gap: SIZES.medium,
  },
  chartItem: {
    gap: SIZES.small,
  },
  chartBar: {
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  chartFill: {
    height: "100%",
    borderRadius: 4,
  },
  chartLabel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartType: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "500",
  },
  chartPercentage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  performanceContainer: {
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
  performanceList: {
    gap: SIZES.medium,
  },
  performanceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.small,
  },
  performanceRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: SIZES.medium,
  },
  rankNumber: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  performanceInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  driverStats: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
  },
  performanceRating: {
    alignItems: "flex-end",
  },
  ratingText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.warning,
    fontWeight: "600",
  },
  routeContainer: {
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
  routeItem: {
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  routeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.small,
  },
  routeName: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    flex: 1,
  },
  routeSatisfaction: {
    fontSize: SIZES.fontMedium,
    color: COLORS.warning,
    fontWeight: "600",
  },
  routeStats: {
    flexDirection: "row",
    gap: SIZES.large,
  },
  routeStat: {
    alignItems: "center",
  },
  routeStatLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  routeStatValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    fontWeight: "600",
  },
  exportContainer: {
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
  exportButtons: {
    flexDirection: "row",
    gap: SIZES.medium,
  },
  exportButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  exportButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
});
