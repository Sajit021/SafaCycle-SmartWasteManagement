import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../utils/theme";
import { formatDate } from "../utils/helpers";

const DriverManagementScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Mock drivers data
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@wastemanagement.com",
      phone: "+1-555-0123",
      status: "active",
      vehicle: "Truck-001",
      zone: "Zone A",
      rating: 4.8,
      completedRoutes: 145,
      lastActive: "2024-01-15T10:30:00",
      joinDate: "2023-06-15",
      license: "CDL-A",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@wastemanagement.com",
      phone: "+1-555-0124",
      status: "active",
      vehicle: "Truck-002",
      zone: "Zone B",
      rating: 4.9,
      completedRoutes: 132,
      lastActive: "2024-01-15T11:15:00",
      joinDate: "2023-08-20",
      license: "CDL-B",
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@wastemanagement.com",
      phone: "+1-555-0125",
      status: "offline",
      vehicle: "Truck-003",
      zone: "Zone C",
      rating: 4.6,
      completedRoutes: 89,
      lastActive: "2024-01-14T16:45:00",
      joinDate: "2023-10-10",
      license: "CDL-A",
    },
    {
      id: 4,
      name: "Emma Davis",
      email: "emma.davis@wastemanagement.com",
      phone: "+1-555-0126",
      status: "on_route",
      vehicle: "Truck-004",
      zone: "Zone A",
      rating: 4.7,
      completedRoutes: 67,
      lastActive: "2024-01-15T09:00:00",
      joinDate: "2023-12-01",
      license: "CDL-B",
    },
  ]);

  const filterOptions = [
    { key: "all", label: "All Drivers" },
    { key: "active", label: "Active" },
    { key: "on_route", label: "On Route" },
    { key: "offline", label: "Offline" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return theme.COLORS.success;
      case "on_route":
        return theme.COLORS.warning;
      case "offline":
        return theme.COLORS.textSecondary;
      default:
        return theme.COLORS.textSecondary;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Available";
      case "on_route":
        return "On Route";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || driver.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleDriverAction = (driver, action) => {
    switch (action) {
      case "view":
        setSelectedDriver(driver);
        setShowDriverModal(true);
        break;
      case "assign_route":
        Alert.alert("Assign Route", `Assign new route to ${driver.name}?`, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Assign",
            onPress: () =>
              Alert.alert("Success", "Route assigned successfully!"),
          },
        ]);
        break;
      case "contact":
        Alert.alert("Contact Driver", `Contact ${driver.name}:`, [
          {
            text: "Call",
            onPress: () => Alert.alert("Calling", `Calling ${driver.phone}`),
          },
          {
            text: "Message",
            onPress: () => Alert.alert("Message", "Opening messaging app..."),
          },
          { text: "Cancel", style: "cancel" },
        ]);
        break;
      case "suspend":
        Alert.alert("Suspend Driver", `Suspend ${driver.name}?`, [
          { text: "Cancel", style: "cancel" },
          {
            text: "Suspend",
            style: "destructive",
            onPress: () => {
              const updatedDrivers = drivers.map((d) =>
                d.id === driver.id ? { ...d, status: "offline" } : d
              );
              setDrivers(updatedDrivers);
              Alert.alert("Success", "Driver suspended successfully!");
            },
          },
        ]);
        break;
    }
  };

  const addNewDriver = () => {
    Alert.alert(
      "Add New Driver",
      "This will open the driver registration form."
    );
  };

  const renderDriverCard = (driver) => (
    <View key={driver.id} style={styles.driverCard}>
      <View style={styles.driverHeader}>
        <View style={styles.driverInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.driverName}>{driver.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(driver.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(driver.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.driverEmail}>{driver.email}</Text>
          <Text style={styles.driverDetails}>
            {driver.vehicle} • {driver.zone} • License: {driver.license}
          </Text>
        </View>
      </View>

      <View style={styles.driverStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{driver.rating}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{driver.completedRoutes}</Text>
          <Text style={styles.statLabel}>Routes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {formatDate(driver.lastActive, "time")}
          </Text>
          <Text style={styles.statLabel}>Last Active</Text>
        </View>
      </View>

      <View style={styles.driverActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleDriverAction(driver, "view")}
        >
          <Ionicons
            name="person-outline"
            size={16}
            color={theme.COLORS.primary}
          />
          <Text
            style={[styles.actionButtonText, { color: theme.COLORS.primary }]}
          >
            View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.assignButton]}
          onPress={() => handleDriverAction(driver, "assign_route")}
        >
          <Ionicons name="map-outline" size={16} color={theme.COLORS.success} />
          <Text
            style={[styles.actionButtonText, { color: theme.COLORS.success }]}
          >
            Assign
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.contactButton]}
          onPress={() => handleDriverAction(driver, "contact")}
        >
          <Ionicons
            name="call-outline"
            size={16}
            color={theme.COLORS.warning}
          />
          <Text
            style={[styles.actionButtonText, { color: theme.COLORS.warning }]}
          >
            Contact
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.suspendButton]}
          onPress={() => handleDriverAction(driver, "suspend")}
        >
          <Ionicons
            name="stop-circle-outline"
            size={16}
            color={theme.COLORS.error}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Management</Text>
        <TouchableOpacity style={styles.addButton} onPress={addNewDriver}>
          <Ionicons name="add" size={24} color={theme.COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color={theme.COLORS.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search drivers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
      >
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

      {/* Drivers List */}
      <ScrollView style={styles.driversList}>
        {filteredDrivers.map(renderDriverCard)}
      </ScrollView>

      {/* Driver Detail Modal */}
      <Modal
        visible={showDriverModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDriverModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Driver Details</Text>
            <TouchableOpacity onPress={() => setShowDriverModal(false)}>
              <Ionicons name="close" size={24} color={theme.COLORS.text} />
            </TouchableOpacity>
          </View>

          {selectedDriver && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Text style={styles.detailRow}>
                  Name: {selectedDriver.name}
                </Text>
                <Text style={styles.detailRow}>
                  Email: {selectedDriver.email}
                </Text>
                <Text style={styles.detailRow}>
                  Phone: {selectedDriver.phone}
                </Text>
                <Text style={styles.detailRow}>
                  License: {selectedDriver.license}
                </Text>
                <Text style={styles.detailRow}>
                  Join Date: {formatDate(selectedDriver.joinDate)}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Work Information</Text>
                <Text style={styles.detailRow}>
                  Vehicle: {selectedDriver.vehicle}
                </Text>
                <Text style={styles.detailRow}>
                  Zone: {selectedDriver.zone}
                </Text>
                <Text style={styles.detailRow}>
                  Status: {getStatusText(selectedDriver.status)}
                </Text>
                <Text style={styles.detailRow}>
                  Rating: {selectedDriver.rating}/5.0
                </Text>
                <Text style={styles.detailRow}>
                  Completed Routes: {selectedDriver.completedRoutes}
                </Text>
                <Text style={styles.detailRow}>
                  Last Active: {formatDate(selectedDriver.lastActive)}
                </Text>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.SIZES.padding,
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.border,
  },
  title: {
    fontSize: theme.SIZES.h2,
    fontWeight: "bold",
    color: theme.COLORS.text,
  },
  addButton: {
    backgroundColor: theme.COLORS.primary,
    borderRadius: theme.SIZES.radius,
    padding: theme.SIZES.base,
  },
  searchContainer: {
    padding: theme.SIZES.padding,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.radius,
    paddingHorizontal: theme.SIZES.padding,
    paddingVertical: theme.SIZES.base,
    gap: theme.SIZES.base,
    ...theme.SHADOWS.light,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.SIZES.body,
    color: theme.COLORS.text,
  },
  filtersScroll: {
    maxHeight: 60,
  },
  filterOptions: {
    flexDirection: "row",
    paddingHorizontal: theme.SIZES.padding,
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
  driversList: {
    flex: 1,
    padding: theme.SIZES.padding,
  },
  driverCard: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.radius,
    padding: theme.SIZES.padding,
    marginBottom: theme.SIZES.base,
    ...theme.SHADOWS.light,
  },
  driverHeader: {
    marginBottom: theme.SIZES.base,
  },
  driverInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.SIZES.base / 2,
  },
  driverName: {
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
  driverEmail: {
    fontSize: theme.SIZES.body,
    color: theme.COLORS.textSecondary,
    marginBottom: theme.SIZES.base / 2,
  },
  driverDetails: {
    fontSize: theme.SIZES.caption,
    color: theme.COLORS.textSecondary,
  },
  driverStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: theme.SIZES.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.COLORS.border,
    marginBottom: theme.SIZES.base,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: theme.SIZES.h4,
    fontWeight: "bold",
    color: theme.COLORS.primary,
  },
  statLabel: {
    fontSize: theme.SIZES.caption,
    color: theme.COLORS.textSecondary,
    marginTop: theme.SIZES.base / 4,
  },
  driverActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.SIZES.base,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.SIZES.base,
    paddingHorizontal: theme.SIZES.base,
    borderRadius: theme.SIZES.radius / 2,
    borderWidth: 1,
    gap: theme.SIZES.base / 2,
  },
  viewButton: {
    borderColor: theme.COLORS.primary,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  assignButton: {
    borderColor: theme.COLORS.success,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  contactButton: {
    borderColor: theme.COLORS.warning,
    backgroundColor: "rgba(255, 193, 7, 0.1)",
  },
  suspendButton: {
    borderColor: theme.COLORS.error,
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    flex: 0,
    paddingHorizontal: theme.SIZES.base,
  },
  actionButtonText: {
    fontSize: theme.SIZES.caption,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.SIZES.padding,
    backgroundColor: theme.COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.COLORS.border,
  },
  modalTitle: {
    fontSize: theme.SIZES.h3,
    fontWeight: "bold",
    color: theme.COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: theme.SIZES.padding,
  },
  detailSection: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.radius,
    padding: theme.SIZES.padding,
    marginBottom: theme.SIZES.base,
    ...theme.SHADOWS.light,
  },
  sectionTitle: {
    fontSize: theme.SIZES.h4,
    fontWeight: "bold",
    color: theme.COLORS.text,
    marginBottom: theme.SIZES.base,
  },
  detailRow: {
    fontSize: theme.SIZES.body,
    color: theme.COLORS.text,
    marginBottom: theme.SIZES.base / 2,
  },
});

export default DriverManagementScreen;
