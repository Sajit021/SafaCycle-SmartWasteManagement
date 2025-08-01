import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import CustomButton from "../components/CustomButton";

export default function EmergencyContactScreen({ navigation }) {
  const [emergencyContacts] = useState([
    {
      id: 1,
      title: "Dispatch Center",
      subtitle: "24/7 Operations Control",
      phone: "+1-555-DISPATCH",
      type: "dispatch",
      priority: "high",
      icon: "📡",
      description: "Main dispatch for route coordination and immediate assistance",
    },
    {
      id: 2,
      title: "Emergency Services",
      subtitle: "Fire, Police, Medical",
      phone: "911",
      type: "emergency",
      priority: "critical",
      icon: "🚨",
      description: "For life-threatening emergencies and immediate danger",
    },
    {
      id: 3,
      title: "Roadside Assistance",
      subtitle: "Vehicle Breakdown Support",
      phone: "+1-555-ROADSIDE",
      type: "roadside",
      priority: "medium",
      icon: "🔧",
      description: "For vehicle breakdowns, flat tires, and mechanical issues",
    },
    {
      id: 4,
      title: "Safety Hotline",
      subtitle: "Report Safety Concerns",
      phone: "+1-555-SAFETY",
      type: "safety",
      priority: "medium",
      icon: "🛡️",
      description: "Anonymous safety reporting and workplace hazards",
    },
    {
      id: 5,
      title: "Medical Support",
      subtitle: "Occupational Health",
      phone: "+1-555-MEDICAL",
      type: "medical",
      priority: "high",
      icon: "🏥",
      description: "Work-related injuries and health concerns",
    },
    {
      id: 6,
      title: "HR Department",
      subtitle: "Human Resources",
      phone: "+1-555-HR-DEPT",
      type: "hr",
      priority: "low",
      icon: "👥",
      description: "Employment issues, benefits, and general support",
    },
  ]);

  const [quickActions] = useState([
    {
      id: 1,
      title: "Report Emergency",
      description: "Immediate emergency assistance",
      icon: "🚨",
      action: "emergency",
      color: COLORS.error,
    },
    {
      id: 2,
      title: "Vehicle Problem",
      description: "Breakdown or mechanical issue",
      icon: "🚛",
      action: "vehicle",
      color: COLORS.warning,
    },
    {
      id: 3,
      title: "Safety Concern",
      description: "Report unsafe conditions",
      icon: "⚠️",
      action: "safety",
      color: COLORS.info,
    },
    {
      id: 4,
      title: "Medical Incident",
      description: "Work-related injury",
      icon: "🏥",
      action: "medical",
      color: COLORS.success,
    },
  ]);

  const handleCall = (contact) => {
    Alert.alert(
      `Call ${contact.title}`,
      `Are you sure you want to call ${contact.title}?\n\n${contact.description}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call Now",
          onPress: () => {
            Linking.openURL(`tel:${contact.phone}`);
          },
        },
      ]
    );
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "emergency":
        Alert.alert(
          "Emergency Contact",
          "This will call 911 for immediate emergency assistance.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Call 911",
              style: "destructive",
              onPress: () => Linking.openURL("tel:911"),
            },
          ]
        );
        break;
      case "vehicle":
        Alert.alert(
          "Vehicle Problem",
          "Call roadside assistance for vehicle issues?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Call Roadside",
              onPress: () => Linking.openURL("tel:+1-555-ROADSIDE"),
            },
          ]
        );
        break;
      case "safety":
        Alert.alert(
          "Safety Concern",
          "Report safety issues to the safety hotline?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Call Safety",
              onPress: () => Linking.openURL("tel:+1-555-SAFETY"),
            },
          ]
        );
        break;
      case "medical":
        Alert.alert(
          "Medical Incident",
          "Contact medical support for work-related injuries?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Call Medical",
              onPress: () => Linking.openURL("tel:+1-555-MEDICAL"),
            },
          ]
        );
        break;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return COLORS.error;
      case "high":
        return COLORS.warning;
      case "medium":
        return COLORS.info;
      case "low":
        return COLORS.success;
      default:
        return COLORS.textSecondary;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "critical":
        return "CRITICAL";
      case "high":
        return "HIGH";
      case "medium":
        return "MEDIUM";
      case "low":
        return "LOW";
      default:
        return "NORMAL";
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Contacts</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <View style={styles.emergencyContent}>
            <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
            <Text style={styles.emergencySubtitle}>
              For life-threatening emergencies, call 911 immediately
            </Text>
          </View>
          <TouchableOpacity
            style={styles.emergency911Button}
            onPress={() => handleQuickAction("emergency")}
          >
            <Text style={styles.emergency911Text}>911</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  { borderColor: action.color + "30" },
                ]}
                onPress={() => handleQuickAction(action.action)}
              >
                <Text style={styles.quickActionIcon}>{action.icon}</Text>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* All Emergency Contacts */}
        <View style={styles.contactsContainer}>
          <Text style={styles.sectionTitle}>All Emergency Contacts</Text>
          <View style={styles.contactsList}>
            {emergencyContacts.map((contact) => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactHeader}>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactTitleRow}>
                      <Text style={styles.contactIcon}>{contact.icon}</Text>
                      <View style={styles.contactTitleInfo}>
                        <Text style={styles.contactTitle}>{contact.title}</Text>
                        <Text style={styles.contactSubtitle}>
                          {contact.subtitle}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(contact.priority) + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: getPriorityColor(contact.priority) },
                        ]}
                      >
                        {getPriorityText(contact.priority)}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.contactDescription}>
                  {contact.description}
                </Text>

                <View style={styles.contactActions}>
                  <View style={styles.phoneContainer}>
                    <Text style={styles.phoneLabel}>Phone:</Text>
                    <Text style={styles.phoneNumber}>{contact.phone}</Text>
                  </View>
                  <CustomButton
                    title="Call Now"
                    onPress={() => handleCall(contact)}
                    style={[
                      styles.callButton,
                      {
                        backgroundColor:
                          contact.priority === "critical"
                            ? COLORS.error
                            : COLORS.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Safety Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.sectionTitle}>Emergency Guidelines</Text>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>🚨</Text>
              <Text style={styles.guidelineText}>
                Call 911 for life-threatening emergencies
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>📞</Text>
              <Text style={styles.guidelineText}>
                Contact dispatch for route-related issues
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>🚛</Text>
              <Text style={styles.guidelineText}>
                Pull over safely before making calls
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>📍</Text>
              <Text style={styles.guidelineText}>
                Know your location when calling for help
              </Text>
            </View>
            <View style={styles.guidelineItem}>
              <Text style={styles.guidelineIcon}>🛡️</Text>
              <Text style={styles.guidelineText}>
                Report all incidents, no matter how small
              </Text>
            </View>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationContainer}>
          <Text style={styles.sectionTitle}>Your Current Information</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Driver ID:</Text>
              <Text style={styles.locationValue}>DR001 - John Martinez</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Vehicle:</Text>
              <Text style={styles.locationValue}>Truck #247</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Zone:</Text>
              <Text style={styles.locationValue}>Zone A</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Current Location:</Text>
              <Text style={styles.locationValue}>
                📍 Updating... (GPS required)
              </Text>
            </View>
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
  emergencyBanner: {
    backgroundColor: COLORS.error + "10",
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.error + "30",
  },
  emergencyIcon: {
    fontSize: 32,
    marginRight: SIZES.medium,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.error,
    marginBottom: 4,
  },
  emergencySubtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    lineHeight: 20,
  },
  emergency911Button: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  emergency911Text: {
    fontSize: SIZES.fontLarge,
    fontWeight: "bold",
    color: COLORS.surface,
  },
  quickActionsContainer: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    alignItems: "center",
    marginBottom: SIZES.medium,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: SIZES.small,
  },
  quickActionTitle: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: SIZES.small / 2,
  },
  quickActionDescription: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 16,
  },
  contactsContainer: {
    marginBottom: SIZES.large,
  },
  contactsList: {
    gap: SIZES.medium,
  },
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactHeader: {
    marginBottom: SIZES.medium,
  },
  contactInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  contactTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactIcon: {
    fontSize: 24,
    marginRight: SIZES.medium,
  },
  contactTitleInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  priorityBadge: {
    paddingHorizontal: SIZES.small,
    paddingVertical: SIZES.small / 2,
    borderRadius: SIZES.radiusSmall,
  },
  priorityText: {
    fontSize: SIZES.fontSmall,
    fontWeight: "bold",
  },
  contactDescription: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SIZES.large,
  },
  contactActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  phoneContainer: {
    flex: 1,
  },
  phoneLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  phoneNumber: {
    fontSize: SIZES.fontMedium,
    fontWeight: "600",
    color: COLORS.primary,
  },
  callButton: {
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    minWidth: 100,
  },
  guidelinesContainer: {
    marginBottom: SIZES.large,
  },
  guidelinesList: {
    gap: SIZES.small,
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
    lineHeight: 20,
  },
  locationContainer: {
    marginBottom: SIZES.large,
  },
  locationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.large,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SIZES.medium,
  },
  locationLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
  },
  locationValue: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
});
