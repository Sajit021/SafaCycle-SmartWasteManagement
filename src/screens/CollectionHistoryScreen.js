import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatDate, formatTime, getStatusColor } from "../utils/helpers";
import apiService from "../services/apiService";

export default function CollectionHistoryScreen({ navigation }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statuses = ["all", "completed", "cancelled", "in_progress"];

  useEffect(() => {
    loadCollectionHistory();
  }, []);

  useEffect(() => {
    filterCollections(searchQuery, selectedStatus);
  }, [collections]);

  const loadCollectionHistory = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCollectionHistory();
      setCollections(response.collections || []);
    } catch (error) {
      console.error("Error loading collection history:", error);
      Alert.alert("Error", "Failed to load collection history");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollectionHistory();
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterCollections(query, selectedStatus);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    filterCollections(searchQuery, status);
  };

  const filterCollections = (query, status) => {
    let filtered = collections;

    if (status !== "all") {
      filtered = filtered.filter((collection) => collection.status === status);
    }

    if (query) {
      filtered = filtered.filter(
        (collection) =>
          collection.driver?.toLowerCase().includes(query.toLowerCase()) ||
          collection.wasteTypes?.join(", ").toLowerCase().includes(query.toLowerCase()) ||
          formatDate(collection.scheduledDate)
            .toLowerCase()
            .includes(query.toLowerCase())
      );
    }

    setFilteredCollections(filtered);
  };

  const openDetailsModal = (collection) => {
    setSelectedCollection(collection);
    setShowDetailsModal(true);
  };

  const renderCollectionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.collectionCard}
      onPress={() => openDetailsModal(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{formatDate(item.scheduledDate)}</Text>
          <Text style={styles.timeText}>{formatTime(item.scheduledTime)}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.wasteTypeText}>
          Waste: {Array.isArray(item.wasteTypes) ? item.wasteTypes.join(", ") : item.wasteTypes}
        </Text>
        {item.driver && (
          <Text style={styles.driverText}>Driver: {item.driver}</Text>
        )}
        {item.weight && (
          <Text style={styles.weightText}>Weight: {item.weight} kg</Text>
        )}
        {item.cost && (
          <Text style={styles.costText}>Cost: ${item.cost}</Text>
        )}
      </View>

      {item.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDetailsModal = () => (
    <Modal
      visible={showDetailsModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Collection Details</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDetailsModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {selectedCollection && (
            <View style={styles.detailsContainer}>
              {/* Collection Info */}
              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Collection Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedCollection.scheduledDate)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(selectedCollection.scheduledTime)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedCollection.status) }]}>
                    <Text style={styles.statusText}>{selectedCollection.status.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Waste Type:</Text>
                  <Text style={styles.detailValue}>
                    {Array.isArray(selectedCollection.wasteTypes) 
                      ? selectedCollection.wasteTypes.join(", ") 
                      : selectedCollection.wasteTypes}
                  </Text>
                </View>
                {selectedCollection.address && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Address:</Text>
                    <Text style={styles.detailValue}>{selectedCollection.address}</Text>
                  </View>
                )}
              </View>

              {/* Service Details */}
              {(selectedCollection.driver || selectedCollection.weight || selectedCollection.cost) && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Service Details</Text>
                  {selectedCollection.driver && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Driver:</Text>
                      <Text style={styles.detailValue}>{selectedCollection.driver}</Text>
                    </View>
                  )}
                  {selectedCollection.weight && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Weight:</Text>
                      <Text style={styles.detailValue}>{selectedCollection.weight} kg</Text>
                    </View>
                  )}
                  {selectedCollection.cost && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Cost:</Text>
                      <Text style={styles.detailValue}>${selectedCollection.cost}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Notes */}
              {selectedCollection.notes && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>Notes</Text>
                  <Text style={styles.notesDetailText}>{selectedCollection.notes}</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading collection history...</Text>
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
        <Text style={styles.title}>Collection History</Text>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search collections..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                selectedStatus === status && styles.activeFilterButton,
              ]}
              onPress={() => handleStatusFilter(status)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedStatus === status && styles.activeFilterButtonText,
                ]}
              >
                {status === "all" ? "All" : status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Collections List */}
      <FlatList
        data={filteredCollections}
        renderItem={renderCollectionItem}
        keyExtractor={(item) => item._id || item.id}
        style={styles.collectionsList}
        contentContainerStyle={styles.collectionsContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery || selectedStatus !== "all"
                ? "No collections match your search"
                : "No collections found"}
            </Text>
          </View>
        }
      />

      {renderDetailsModal()}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  searchSection: {
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.background,
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  collectionsList: {
    flex: 1,
  },
  collectionsContent: {
    padding: SIZES.padding,
  },
  collectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateSection: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  timeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
  },
  cardBody: {
    marginBottom: 8,
  },
  wasteTypeText: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  driverText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  weightText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  costText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  notesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  notesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SIZES.padding,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
  modalContent: {
    flex: 1,
  },
  detailsContainer: {
    padding: SIZES.padding,
  },
  detailSection: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    flex: 2,
    textAlign: "right",
  },
  notesDetailText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});