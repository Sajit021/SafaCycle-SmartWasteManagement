import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";
import { formatDate, formatCurrency } from "../utils/helpers";

const WasteReportsScreen = ({ navigation }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Mock waste reports data
  const wasteReports = [
    {
      id: 1,
      type: "Municipal Solid Waste",
      collected: 2450,
      recycled: 980,
      disposed: 1470,
      cost: 4800,
      date: "2024-01-15",
      location: "Zone A",
      status: "completed",
    },
    {
      id: 2,
      type: "Organic Waste",
      collected: 1200,
      recycled: 1080,
      disposed: 120,
      cost: 2400,
      date: "2024-01-15",
      location: "Zone B",
      status: "completed",
    },
    {
      id: 3,
      type: "Recyclable Materials",
      collected: 800,
      recycled: 720,
      disposed: 80,
      cost: 1600,
      date: "2024-01-14",
      location: "Zone C",
      status: "processing",
    },
    {
      id: 4,
      type: "Hazardous Waste",
      collected: 150,
      recycled: 0,
      disposed: 150,
      cost: 1200,
      date: "2024-01-14",
      location: "Industrial Area",
      status: "pending",
    },
  ];

  const filterOptions = [
    { key: "all", label: "All Types" },
    { key: "municipal", label: "Municipal" },
    { key: "organic", label: "Organic" },
    { key: "recyclable", label: "Recyclable" },
    { key: "hazardous", label: "Hazardous" },
  ];

  const periodOptions = [
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "This Quarter" },
    { key: "year", label: "This Year" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return theme.COLORS.success;
      case "processing":
        return theme.COLORS.warning;
      case "pending":
        return theme.COLORS.error;
      default:
        return theme.COLORS.textSecondary;
    }
  };

  const calculateTotals = () => {
    const totals = wasteReports.reduce(
      (acc, report) => ({
        collected: acc.collected + report.collected,
        recycled: acc.recycled + report.recycled,
        disposed: acc.disposed + report.disposed,
        cost: acc.cost + report.cost,
      }),
      { collected: 0, recycled: 0, disposed: 0, cost: 0 }
    );

    const recyclingRate = ((totals.recycled / totals.collected) * 100).toFixed(
      1
    );

    return { ...totals, recyclingRate };
  };

  const totals = calculateTotals();

  const exportReport = () => {
    Alert.alert("Export Report", "Choose export format:", [
      {
        text: "PDF",
        onPress: () => Alert.alert("Success", "PDF report exported!"),
      },
      {
        text: "Excel",
        onPress: () => Alert.alert("Success", "Excel report exported!"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Waste Management Reports</Text>
          <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
            <Ionicons
              name="download-outline"
              size={20}
              color={theme.COLORS.white}
            />
            <Text style={styles.exportButtonText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {totals.collected.toLocaleString()} kg
            </Text>
            <Text style={styles.summaryLabel}>Total Collected</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text
              style={[styles.summaryValue, { color: theme.COLORS.success }]}
            >
              {totals.recyclingRate}%
            </Text>
            <Text style={styles.summaryLabel}>Recycling Rate</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>
              {formatCurrency(totals.cost)}
            </Text>
            <Text style={styles.summaryLabel}>Total Cost</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Filter by Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterOptions}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterButton,
                    selectedFilter === option.key && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedFilter(option.key)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedFilter === option.key &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterOptions}>
              {periodOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterButton,
                    selectedPeriod === option.key && styles.filterButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(option.key)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      selectedPeriod === option.key &&
                        styles.filterButtonTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Reports List */}
        <Text style={styles.sectionTitle}>Detailed Reports</Text>
        {wasteReports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportType}>{report.type}</Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(report.status) },
                ]}
              >
                <Text style={styles.statusText}>
                  {report.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.reportDetails}>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Location:</Text>
                <Text style={styles.reportValue}>{report.location}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Date:</Text>
                <Text style={styles.reportValue}>
                  {formatDate(report.date)}
                </Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Collected:</Text>
                <Text style={styles.reportValue}>{report.collected} kg</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Recycled:</Text>
                <Text
                  style={[styles.reportValue, { color: theme.COLORS.success }]}
                >
                  {report.recycled} kg (
                  {((report.recycled / report.collected) * 100).toFixed(1)}%)
                </Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Cost:</Text>
                <Text style={styles.reportValue}>
                  {formatCurrency(report.cost)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  content: {
    flex: 1,
    padding: theme.SIZES.padding,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.SIZES.padding,
  },
  title: {
    fontSize: theme.SIZES.h2,
    fontWeight: "bold",
    color: theme.COLORS.text,
    flex: 1,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.primary,
    paddingHorizontal: theme.SIZES.padding,
    paddingVertical: theme.SIZES.base,
    borderRadius: theme.SIZES.radius,
    gap: theme.SIZES.base / 2,
  },
  exportButtonText: {
    color: theme.COLORS.white,
    fontWeight: "600",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.SIZES.padding,
    gap: theme.SIZES.base,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    padding: theme.SIZES.padding,
    borderRadius: theme.SIZES.radius,
    alignItems: "center",
    ...theme.SHADOWS.light,
  },
  summaryValue: {
    fontSize: theme.SIZES.h3,
    fontWeight: "bold",
    color: theme.COLORS.primary,
    marginBottom: theme.SIZES.base / 2,
  },
  summaryLabel: {
    fontSize: theme.SIZES.caption,
    color: theme.COLORS.textSecondary,
    textAlign: "center",
  },
  filtersContainer: {
    marginBottom: theme.SIZES.padding,
  },
  sectionTitle: {
    fontSize: theme.SIZES.h4,
    fontWeight: "bold",
    color: theme.COLORS.text,
    marginBottom: theme.SIZES.base,
  },
  filterOptions: {
    flexDirection: "row",
    gap: theme.SIZES.base,
  },
  filterButton: {
    paddingHorizontal: theme.SIZES.padding,
    paddingVertical: theme.SIZES.base,
    borderRadius: theme.SIZES.radius,
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: theme.COLORS.primary,
    borderColor: theme.COLORS.primary,
  },
  filterButtonText: {
    color: theme.COLORS.text,
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: theme.COLORS.white,
  },
  reportCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.radius,
    padding: theme.SIZES.padding,
    marginBottom: theme.SIZES.base,
    ...theme.SHADOWS.light,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.SIZES.base,
  },
  reportType: {
    fontSize: theme.SIZES.h4,
    fontWeight: "bold",
    color: theme.COLORS.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.SIZES.base,
    paddingVertical: theme.SIZES.base / 2,
    borderRadius: theme.SIZES.radius / 2,
  },
  statusText: {
    color: theme.COLORS.white,
    fontSize: theme.SIZES.caption,
    fontWeight: "bold",
  },
  reportDetails: {
    gap: theme.SIZES.base / 2,
  },
  reportRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportLabel: {
    color: theme.COLORS.textSecondary,
    fontSize: theme.SIZES.body,
  },
  reportValue: {
    color: theme.COLORS.text,
    fontSize: theme.SIZES.body,
    fontWeight: "500",
  },
});

export default WasteReportsScreen;
