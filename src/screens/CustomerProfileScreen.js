import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
  Alert,
  Modal,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";

export default function CustomerProfileScreen({ navigation }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "John Customer",
    email: "john.customer@email.com",
    phone: "+1-555-0123",
    address: "789 Your Street, Eco City",
    notifications: {
      pickupReminders: true,
      driverUpdates: true,
      ecoTips: true,
      promotions: false,
    },
    preferences: {
      preferredPickupTime: "morning",
      wasteTypes: ["household", "recyclable"],
      frequencyPreference: "weekly",
    },
  });

  const [editedData, setEditedData] = useState({ ...profileData });

  const handleSaveProfile = () => {
    // Validate required fields
    if (!editedData.name.trim() || !editedData.email.trim()) {
      Alert.alert("Error", "Name and email are required fields");
      return;
    }

    // Update profile data
    setProfileData({ ...editedData });
    setIsEditMode(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditedData({ ...profileData });
    setIsEditMode(false);
  };

  const handleNotificationToggle = (key) => {
    setEditedData({
      ...editedData,
      notifications: {
        ...editedData.notifications,
        [key]: !editedData.notifications[key],
      },
    });
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      "Account Deleted",
      "Your account has been scheduled for deletion. You will receive a confirmation email.",
      [
        {
          text: "OK",
          onPress: () => navigation.navigate("Welcome"),
        },
      ]
    );
  };

  const preferredTimeOptions = [
    { value: "morning", label: "Morning (8 AM - 12 PM)" },
    { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
    { value: "evening", label: "Evening (5 PM - 8 PM)" },
  ];

  const frequencyOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const renderDeleteModal = () => (
    <Modal visible={showDeleteModal} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Delete Account</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete your account? This action cannot be undone.
            {"\n\n"}
            Your data will be permanently removed within 30 days.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
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
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (isEditMode) {
                handleSaveProfile();
              } else {
                setIsEditMode(true);
              }
            }}
          >
            <Text style={styles.editButtonText}>
              {isEditMode ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profileData.name.split(" ").map(n => n[0]).join("")}
            </Text>
          </View>
          <Text style={styles.customerName}>{profileData.name}</Text>
          <Text style={styles.customerEmail}>{profileData.email}</Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={isEditMode ? editedData.name : profileData.name}
              onChangeText={(text) =>
                setEditedData({ ...editedData, name: text })
              }
              editable={isEditMode}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={isEditMode ? editedData.email : profileData.email}
              onChangeText={(text) =>
                setEditedData({ ...editedData, email: text })
              }
              editable={isEditMode}
              placeholder="Enter your email"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={isEditMode ? editedData.phone : profileData.phone}
              onChangeText={(text) =>
                setEditedData({ ...editedData, phone: text })
              }
              editable={isEditMode}
              placeholder="Enter your phone number"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Address</Text>
            <TextInput
              style={[styles.input, !isEditMode && styles.inputDisabled]}
              value={isEditMode ? editedData.address : profileData.address}
              onChangeText={(text) =>
                setEditedData({ ...editedData, address: text })
              }
              editable={isEditMode}
              placeholder="Enter your service address"
              placeholderTextColor={COLORS.textSecondary}
              multiline
            />
          </View>
        </View>

        {/* Notification Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>
          
          {Object.entries(editedData.notifications).map(([key, value]) => (
            <View key={key} style={styles.switchRow}>
              <View style={styles.switchInfo}>
                <Text style={styles.switchLabel}>
                  {key === "pickupReminders" && "Pickup Reminders"}
                  {key === "driverUpdates" && "Driver Updates"}
                  {key === "ecoTips" && "Eco Tips"}
                  {key === "promotions" && "Promotions & Offers"}
                </Text>
                <Text style={styles.switchDescription}>
                  {key === "pickupReminders" && "Get notified about upcoming pickups"}
                  {key === "driverUpdates" && "Receive driver location updates"}
                  {key === "ecoTips" && "Get personalized eco-friendly tips"}
                  {key === "promotions" && "Receive special offers and promotions"}
                </Text>
              </View>
              <Switch
                value={value}
                onValueChange={() => handleNotificationToggle(key)}
                trackColor={{
                  false: COLORS.border,
                  true: COLORS.primary + "60",
                }}
                thumbColor={value ? COLORS.primary : COLORS.textSecondary}
              />
            </View>
          ))}
        </View>

        {/* Service Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Preferences</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Preferred Pickup Time</Text>
            <View style={styles.radioGroup}>
              {preferredTimeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() =>
                    setEditedData({
                      ...editedData,
                      preferences: {
                        ...editedData.preferences,
                        preferredPickupTime: option.value,
                      },
                    })
                  }
                  disabled={!isEditMode}
                >
                  <View style={styles.radioButton}>
                    {editedData.preferences.preferredPickupTime === option.value && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Collection Frequency</Text>
            <View style={styles.radioGroup}>
              {frequencyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.radioOption}
                  onPress={() =>
                    setEditedData({
                      ...editedData,
                      preferences: {
                        ...editedData.preferences,
                        frequencyPreference: option.value,
                      },
                    })
                  }
                  disabled={!isEditMode}
                >
                  <View style={styles.radioButton}>
                    {editedData.preferences.frequencyPreference === option.value && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioLabel}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {isEditMode ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={handleCancelEdit}
              >
                <Text style={styles.cancelEditButtonText}>Cancel</Text>
              </TouchableOpacity>
              <CustomButton
                title="Save Changes"
                onPress={handleSaveProfile}
                style={styles.saveButton}
              />
            </View>
          ) : (
            <>
              <CustomButton
                title="Change Password"
                onPress={() => Alert.alert("Change Password", "Password change feature coming soon!")}
                variant="secondary"
                style={styles.actionButton}
              />
              <CustomButton
                title="Download Data"
                onPress={() => Alert.alert("Download Data", "Your data export will be sent to your email.")}
                variant="secondary"
                style={styles.actionButton}
              />
              <TouchableOpacity
                style={styles.deleteAccountButton}
                onPress={() => setShowDeleteModal(true)}
              >
                <Text style={styles.deleteAccountText}>Delete Account</Text>
              </TouchableOpacity>
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
  title: {
    fontSize: SIZES.fontHeader,
    fontWeight: "bold",
    color: COLORS.text,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
  },
  editButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: SIZES.extraLarge,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  avatarText: {
    fontSize: SIZES.fontExtraLarge,
    fontWeight: "bold",
    color: COLORS.surface,
  },
  customerName: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.small / 2,
  },
  customerEmail: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SIZES.extraLarge,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.large,
  },
  inputGroup: {
    marginBottom: SIZES.large,
  },
  inputLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    color: COLORS.textSecondary,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  switchInfo: {
    flex: 1,
    marginRight: SIZES.medium,
  },
  switchLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SIZES.small / 2,
  },
  switchDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  radioGroup: {
    gap: SIZES.medium,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SIZES.small,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginRight: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  actionContainer: {
    marginTop: SIZES.large,
    marginBottom: SIZES.extraLarge,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.medium,
  },
  cancelEditButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    paddingVertical: SIZES.large,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  cancelEditButtonText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
  },
  actionButton: {
    marginBottom: SIZES.medium,
  },
  deleteAccountButton: {
    alignSelf: "center",
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.large,
  },
  deleteAccountText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.error,
    textAlign: "center",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SIZES.large,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.extraLarge,
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
  modalMessage: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: SIZES.extraLarge,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.medium,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SIZES.large,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
  },
  cancelButtonText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  deleteButtonText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.surface,
    fontWeight: "600",
  },
});
