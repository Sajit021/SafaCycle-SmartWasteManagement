import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { formatDate } from "../utils/helpers";

export default function DriverProfileScreen({ navigation }) {
  const [driverProfile, setDriverProfile] = useState({
    id: "DR001",
    name: "John Martinez",
    email: "john.martinez@wastemanagement.com",
    phone: "+1-555-0189",
    employeeId: "EMP-789",
    licenseNumber: "CDL-A-123456",
    licenseExpiry: new Date("2025-12-31"),
    joinDate: new Date("2023-06-15"),
    vehicleAssigned: "Truck #247",
    zone: "Zone A",
    emergencyContact: {
      name: "Maria Martinez",
      relationship: "Spouse",
      phone: "+1-555-0190",
    },
    address: {
      street: "456 Driver Lane",
      city: "Eco City",
      zipCode: "12345",
    },
    rating: 4.8,
    totalCollections: 1247,
    yearlyCollections: 856,
    efficiency: 94.5,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({ ...driverProfile });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSaveProfile = () => {
    setDriverProfile({ ...editableProfile });
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditableProfile({ ...driverProfile });
    setIsEditing(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      "Account Deletion Requested",
      "Your account deletion request has been submitted to HR. You will be contacted within 24 hours."
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "You will receive a password reset link via email."
    );
  };

  const performanceMetrics = [
    {
      title: "Total Collections",
      value: driverProfile.totalCollections.toLocaleString(),
      icon: "📋",
      color: COLORS.success,
    },
    {
      title: "This Year",
      value: driverProfile.yearlyCollections.toLocaleString(),
      icon: "📅",
      color: COLORS.info,
    },
    {
      title: "Efficiency Rate",
      value: `${driverProfile.efficiency}%`,
      icon: "⚡",
      color: COLORS.warning,
    },
    {
      title: "Driver Rating",
      value: `⭐ ${driverProfile.rating}`,
      icon: "🏆",
      color: COLORS.driver,
    },
  ];

  const renderDeleteModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDeleteModal}
      onRequestClose={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Account</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to request account deletion? This action will:
          </Text>
          <View style={styles.deleteWarnings}>
            <Text style={styles.warningItem}>• Remove access to your driver account</Text>
            <Text style={styles.warningItem}>• Clear all personal data after 30 days</Text>
            <Text style={styles.warningItem}>• Require HR approval to complete</Text>
            <Text style={styles.warningItem}>• Cannot be undone once processed</Text>
          </View>
          <View style={styles.modalActions}>
            <CustomButton
              title="Cancel"
              onPress={() => setShowDeleteModal(false)}
              variant="secondary"
              style={{ flex: 1, marginRight: SIZES.small }}
            />
            <CustomButton
              title="Request Deletion"
              onPress={handleDeleteAccount}
              style={{
                flex: 1,
                backgroundColor: COLORS.error,
                marginLeft: SIZES.small,
              }}
            />
          </View>
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
          <Text style={styles.headerTitle}>Driver Profile</Text>
          <TouchableOpacity
            onPress={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
            style={styles.editButton}
          >
            <Text style={styles.editIcon}>{isEditing ? "✕" : "✏️"}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture & Basic Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {driverProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.basicInfo}>
            <Text style={styles.driverName}>{driverProfile.name}</Text>
            <Text style={styles.employeeId}>ID: {driverProfile.employeeId}</Text>
            <Text style={styles.joinDate}>
              Driver since {formatDate(driverProfile.joinDate, "month")}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Active Driver</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Performance Overview</Text>
          <View style={styles.metricsGrid}>
            {performanceMetrics.map((metric, index) => (
              <View
                key={index}
                style={[
                  styles.metricCard,
                  { backgroundColor: metric.color + "20" },
                ]}
              >
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricTitle}>{metric.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editableProfile.email}
                  onChangeText={(text) =>
                    setEditableProfile({ ...editableProfile, email: text })
                  }
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{driverProfile.email}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editableProfile.phone}
                  onChangeText={(text) =>
                    setEditableProfile({ ...editableProfile, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{driverProfile.phone}</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={`${editableProfile.address.street}, ${editableProfile.address.city}, ${editableProfile.address.zipCode}`}
                  onChangeText={(text) => {
                    const parts = text.split(", ");
                    setEditableProfile({
                      ...editableProfile,
                      address: {
                        street: parts[0] || "",
                        city: parts[1] || "",
                        zipCode: parts[2] || "",
                      },
                    });
                  }}
                  multiline
                />
              ) : (
                <Text style={styles.infoValue}>
                  {`${driverProfile.address.street}, ${driverProfile.address.city}, ${driverProfile.address.zipCode}`}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Work Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Assigned Vehicle:</Text>
              <Text style={styles.infoValue}>{driverProfile.vehicleAssigned}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Zone:</Text>
              <Text style={styles.infoValue}>{driverProfile.zone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CDL License:</Text>
              <Text style={styles.infoValue}>{driverProfile.licenseNumber}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>License Expiry:</Text>
              <Text
                style={[
                  styles.infoValue,
                  {
                    color:
                      new Date(driverProfile.licenseExpiry) < new Date()
                        ? COLORS.error
                        : COLORS.text,
                  },
                ]}
              >
                {formatDate(driverProfile.licenseExpiry)}
              </Text>
            </View>
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editableProfile.emergencyContact.name}
                  onChangeText={(text) =>
                    setEditableProfile({
                      ...editableProfile,
                      emergencyContact: {
                        ...editableProfile.emergencyContact,
                        name: text,
                      },
                    })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>
                  {driverProfile.emergencyContact.name}
                </Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Relationship:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editableProfile.emergencyContact.relationship}
                  onChangeText={(text) =>
                    setEditableProfile({
                      ...editableProfile,
                      emergencyContact: {
                        ...editableProfile.emergencyContact,
                        relationship: text,
                      },
                    })
                  }
                />
              ) : (
                <Text style={styles.infoValue}>
                  {driverProfile.emergencyContact.relationship}
                </Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={editableProfile.emergencyContact.phone}
                  onChangeText={(text) =>
                    setEditableProfile({
                      ...editableProfile,
                      emergencyContact: {
                        ...editableProfile.emergencyContact,
                        phone: text,
                      },
                    })
                  }
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>
                  {driverProfile.emergencyContact.phone}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {isEditing ? (
            <View style={styles.editActions}>
              <CustomButton
                title="Cancel"
                onPress={handleCancelEdit}
                variant="secondary"
                style={{ flex: 1, marginRight: SIZES.small }}
              />
              <CustomButton
                title="Save Changes"
                onPress={handleSaveProfile}
                style={{ flex: 1, marginLeft: SIZES.small }}
              />
            </View>
          ) : (
            <>
              <CustomButton
                title="Change Password"
                onPress={handleChangePassword}
                variant="secondary"
                style={styles.actionButton}
              />
              <CustomButton
                title="Request Account Deletion"
                onPress={() => setShowDeleteModal(true)}
                style={[styles.actionButton, { backgroundColor: COLORS.error }]}
              />
            </>
          )}
        </View>
      </ScrollView>
      {renderDeleteModal()}
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: {
    fontSize: 16,
  },
  profileCard: {
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
  avatarContainer: {
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.driver,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SIZES.small,
  },
  avatarText: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.surface,
  },
  changePhotoButton: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    backgroundColor: COLORS.primary + "20",
    borderRadius: SIZES.radiusSmall,
  },
  changePhotoText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.primary,
    fontWeight: "600",
  },
  basicInfo: {
    alignItems: "center",
  },
  driverName: {
    fontSize: SIZES.fontTitle,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  employeeId: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    marginBottom: SIZES.small,
  },
  statusBadge: {
    backgroundColor: COLORS.success + "20",
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.radiusLarge,
  },
  statusText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.success,
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
    padding: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: SIZES.small,
  },
  metricValue: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: SIZES.large,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SIZES.medium,
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
    flex: 2,
    textAlign: "right",
  },
  infoInput: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 2,
    textAlign: "right",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary + "30",
    paddingBottom: 4,
  },
  actionsContainer: {
    marginTop: SIZES.medium,
    marginBottom: SIZES.large,
  },
  editActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginBottom: SIZES.medium,
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
    color: COLORS.error,
    textAlign: "center",
    marginBottom: SIZES.medium,
  },
  modalMessage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.medium,
    lineHeight: 22,
  },
  deleteWarnings: {
    marginBottom: SIZES.large,
  },
  warningItem: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.small / 2,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: "row",
  },
});
