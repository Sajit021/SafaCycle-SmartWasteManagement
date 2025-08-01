import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomButton({
  title,
  onPress,
  variant = "primary",
  style = {},
  disabled = false,
}) {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  const textStyle =
    variant === "primary"
      ? styles.primaryButtonText
      : styles.secondaryButtonText;

  return (
    <TouchableOpacity
      style={[buttonStyle, style, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={[textStyle, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: "#2E8B57",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: "#2E8B57",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2E8B57",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButtonText: {
    color: "#2E8B57",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.6,
  },
});
