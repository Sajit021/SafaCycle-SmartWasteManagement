import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  const handleLearnMore = () => {
    // Placeholder for Learn More functionality
    console.log("Learn More pressed");
    // Could navigate to an info screen or open a modal
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E5631" />

      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {/* Placeholder for app logo */}
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🗂️</Text>
          </View>
          <Text style={styles.appName}>Smart Waste Manager</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Smart Waste Management</Text>
        <Text style={styles.subtitle}>
          Efficiently manage waste collection with our smart tracking system.
          Perfect for administrators, drivers, and customers.
        </Text>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureText}>
              Role-based access for all users
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚛</Text>
            <Text style={styles.featureText}>Real-time driver tracking</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>
              Smart analytics and reporting
            </Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔔</Text>
            <Text style={styles.featureText}>
              Automated reminders and notifications
            </Text>
          </View>
        </View>
      </View>

      {/* Buttons Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleLearnMore}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8f5", // Light green background
  },
  header: {
    backgroundColor: "#2E8B57", // Sea green
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E5631",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresContainer: {
    marginVertical: 20,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#2E8B57",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#2E8B57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2E8B57",
  },
  secondaryButtonText: {
    color: "#2E8B57",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
