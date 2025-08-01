import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS, SIZES } from "../utils/theme";
import {
  validateEmail,
  validatePhone,
  validatePassword,
} from "../utils/helpers";
import CustomButton from "../components/CustomButton";
import { useAuth } from "../context/AuthContext";

export default function SignupScreen({ navigation }) {
  const { register, loading: authLoading, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    selectedRole: "customer",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const roles = [
    {
      id: "admin",
      title: "Admin",
      description: "System management",
      icon: "👑",
    },
    {
      id: "driver",
      title: "Driver",
      description: "Collection routes",
      icon: "🚛",
    },
    {
      id: "customer",
      title: "Customer",
      description: "Waste pickup",
      icon: "🏠",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    // Clear any previous auth errors
    clearError();
    setLoading(true);

    try {
      const userData = {
        name: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.selectedRole,
      };

      const result = await register(userData);

      if (result.success) {
        const user = result.user;
        
        Alert.alert(
          "Account Created Successfully!",
          `Welcome ${user.name}!\nRole: ${user.role}\nEmail: ${user.email}`,
          [
            {
              text: "Continue",
              onPress: () => {
                // Navigate to role-based dashboard
                const dashboardMap = {
                  admin: "AdminDashboard",
                  driver: "DriverDashboard",
                  customer: "CustomerDashboard",
                };

                const dashboardScreen = dashboardMap[user.role];
                if (dashboardScreen) {
                  navigation.replace(dashboardScreen);
                } else {
                  navigation.navigate("Login");
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Signup Failed", 
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Signup Failed", "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate("Login");
  };

  const handleTermsPress = () => {
    Alert.alert(
      "Terms & Conditions",
      "Terms and conditions content will be implemented soon!"
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Smart Waste Manager today</Text>
          </View>

          {/* Role Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Your Role</Text>
            <View style={styles.roleContainer}>
              {roles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  style={[
                    styles.roleCard,
                    formData.selectedRole === role.id &&
                      styles.roleCardSelected,
                  ]}
                  onPress={() => handleInputChange("selectedRole", role.id)}
                >
                  <Text style={styles.roleIcon}>{role.icon}</Text>
                  <Text
                    style={[
                      styles.roleTitle,
                      formData.selectedRole === role.id &&
                        styles.roleTextSelected,
                    ]}
                  >
                    {role.title}
                  </Text>
                  <Text
                    style={[
                      styles.roleDescription,
                      formData.selectedRole === role.id &&
                        styles.roleTextSelected,
                    ]}
                  >
                    {role.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.textLight}
                value={formData.fullName}
                onChangeText={(value) => handleInputChange("fullName", value)}
                autoCapitalize="words"
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor={COLORS.textLight}
                value={formData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="Enter your phone number"
                placeholderTextColor={COLORS.textLight}
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Create a password"
                placeholderTextColor={COLORS.textLight}
                value={formData.password}
                onChangeText={(value) => handleInputChange("password", value)}
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm your password"
                placeholderTextColor={COLORS.textLight}
                value={formData.confirmPassword}
                onChangeText={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                secureTextEntry
                autoCapitalize="none"
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() =>
                handleInputChange("agreeToTerms", !formData.agreeToTerms)
              }
            >
              <View
                style={[
                  styles.checkboxInner,
                  formData.agreeToTerms && styles.checkboxChecked,
                ]}
              >
                {formData.agreeToTerms && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text style={styles.termsLink} onPress={handleTermsPress}>
                  Terms and Conditions
                </Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}
          </View>

          {/* Signup Button */}
          <CustomButton
            title={loading ? "Creating Account..." : "Create Account"}
            onPress={handleSignup}
            style={styles.signupButton}
            disabled={loading}
          />

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginNavigation}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  header: {
    marginBottom: SIZES.large,
    alignItems: "center",
  },
  title: {
    fontSize: SIZES.fontHeader,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: SIZES.large,
  },
  sectionTitle: {
    fontSize: SIZES.fontLarge,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SIZES.medium,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SIZES.small,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight + "20",
  },
  roleIcon: {
    fontSize: 20,
    marginBottom: SIZES.small / 2,
  },
  roleTitle: {
    fontSize: SIZES.fontSmall,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 2,
    textAlign: "center",
  },
  roleDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  roleTextSelected: {
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: SIZES.medium,
  },
  inputLabel: {
    fontSize: SIZES.fontMedium,
    fontWeight: "500",
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: SIZES.radiusMedium,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.medium,
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: SIZES.fontSmall,
    color: COLORS.error,
    marginTop: 4,
  },
  termsContainer: {
    marginBottom: SIZES.large,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 4,
    marginRight: SIZES.medium,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.surface,
    fontSize: 14,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  signupButton: {
    marginBottom: SIZES.large,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SIZES.large,
  },
  loginText: {
    fontSize: SIZES.fontMedium,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontSize: SIZES.fontMedium,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
