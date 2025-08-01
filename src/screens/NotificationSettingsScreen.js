import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../utils/theme';
import pushNotificationService from '../services/pushNotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationSettingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [notificationStatus, setNotificationStatus] = useState(null);
  const [settings, setSettings] = useState({
    pushNotifications: true,
    collectionReminders: true,
    driverUpdates: true,
    promotionalOffers: false,
    systemUpdates: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  useEffect(() => {
    loadSettings();
    checkNotificationCapabilities();
  }, []);

  const checkNotificationCapabilities = async () => {
    try {
      const status = pushNotificationService.getNotificationStatus();
      setNotificationStatus(status);
    } catch (error) {
      console.error('Error checking notification capabilities:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const handleToggle = async (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    
    // If turning off push notifications, show warning
    if (key === 'pushNotifications' && settings.pushNotifications) {
      Alert.alert(
        'Disable Push Notifications',
        'You will no longer receive important updates about your waste collections. Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Disable', 
            style: 'destructive',
            onPress: () => saveSettings(newSettings)
          }
        ]
      );
      return;
    }

    await saveSettings(newSettings);
  };

  const testNotifications = async () => {
    try {
      const status = pushNotificationService.getNotificationStatus();
      
      let alertTitle = 'Test Notification';
      let alertMessage = '';
      
      if (!status.deviceSupported) {
        alertMessage = 'Notifications require a physical device. Testing is limited in simulators.';
      } else if (!status.pushNotificationsSupported) {
        alertMessage = 'Push notifications are limited in Expo Go. A local test notification will be sent instead.\n\nFor full push notification support, use a development build.';
      } else {
        alertMessage = 'A test notification will be sent now.';
      }

      Alert.alert(
        alertTitle,
        alertMessage,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send Test', 
            onPress: async () => {
              const success = await pushNotificationService.sendTestNotification();
              if (success) {
                Alert.alert('Success', 'Test notification sent! Check your notification panel.');
              } else {
                Alert.alert('Error', 'Failed to send test notification. Check console for details.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error testing notifications:', error);
      Alert.alert('Error', 'Failed to test notifications.');
    }
  };

  const clearBadge = async () => {
    await pushNotificationService.clearBadge();
    Alert.alert('Success', 'App badge cleared!');
  };

  const SettingItem = ({ title, subtitle, value, onToggle, icon }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Ionicons name={icon} size={24} color={COLORS.primary} style={styles.settingIcon} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        thumbColor={value ? COLORS.primary : '#f4f3f4'}
        trackColor={{ false: '#767577', true: COLORS.primaryLight }}
        style={styles.switch}
      />
    </View>
  );

  const ActionButton = ({ title, onPress, icon, color = COLORS.primary }) => (
    <TouchableOpacity style={[styles.actionButton, { borderColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.actionButtonText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <View style={styles.content}>
        {notificationStatus && (
          <View style={styles.statusSection}>
            <Text style={styles.sectionTitle}>📱 Notification Status</Text>
            <View style={styles.statusCard}>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Environment:</Text>
                <Text style={styles.statusValue}>
                  {notificationStatus.environment === 'development' ? 'Development (Expo Go)' : 'Production'}
                </Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Local Notifications:</Text>
                <Text style={[styles.statusValue, { color: COLORS.success }]}>✅ Supported</Text>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusLabel}>Push Notifications:</Text>
                <Text style={[
                  styles.statusValue, 
                  { color: notificationStatus.pushNotificationsSupported ? COLORS.success : COLORS.warning }
                ]}>
                  {notificationStatus.pushNotificationsSupported ? '✅ Supported' : '⚠️ Limited (Expo Go)'}
                </Text>
              </View>
              {!notificationStatus.pushNotificationsSupported && (
                <Text style={styles.statusNote}>
                  💡 For full push notification support, use a development build instead of Expo Go
                </Text>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <Text style={styles.sectionDescription}>
            Manage how you receive notifications on your device
          </Text>

          <SettingItem
            title="Push Notifications"
            subtitle="Enable or disable all push notifications"
            value={settings.pushNotifications}
            onToggle={() => handleToggle('pushNotifications')}
            icon="notifications"
          />

          <SettingItem
            title="Collection Reminders"
            subtitle="Get notified before scheduled collections"
            value={settings.collectionReminders}
            onToggle={() => handleToggle('collectionReminders')}
            icon="time"
          />

          <SettingItem
            title="Driver Updates"
            subtitle="Real-time updates on driver location and status"
            value={settings.driverUpdates}
            onToggle={() => handleToggle('driverUpdates')}
            icon="car"
          />

          <SettingItem
            title="System Updates"
            subtitle="Important app updates and announcements"
            value={settings.systemUpdates}
            onToggle={() => handleToggle('systemUpdates')}
            icon="information-circle"
          />

          <SettingItem
            title="Promotional Offers"
            subtitle="Special offers and promotional content"
            value={settings.promotionalOffers}
            onToggle={() => handleToggle('promotionalOffers')}
            icon="pricetag"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Notifications</Text>
          
          <SettingItem
            title="Email Notifications"
            subtitle="Receive notifications via email"
            value={settings.emailNotifications}
            onToggle={() => handleToggle('emailNotifications')}
            icon="mail"
          />

          <SettingItem
            title="SMS Notifications"
            subtitle="Receive notifications via text message"
            value={settings.smsNotifications}
            onToggle={() => handleToggle('smsNotifications')}
            icon="chatbubble"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <ActionButton
            title="Send Test Notification"
            onPress={testNotifications}
            icon="send"
          />

          <ActionButton
            title="Clear App Badge"
            onPress={clearBadge}
            icon="refresh"
          />
        </View>

        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle" size={20} color={COLORS.textSecondary} />
          <Text style={styles.noticeText}>
            You can change notification permissions in your device settings at any time.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SIZES.medium,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
    paddingBottom: SIZES.medium,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SIZES.small,
    marginRight: SIZES.medium,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  content: {
    padding: SIZES.large,
  },
  statusSection: {
    marginBottom: SIZES.extraLarge,
  },
  statusCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  statusLabel: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SIZES.small,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  section: {
    marginBottom: SIZES.extraLarge,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  sectionDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SIZES.large,
    lineHeight: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: 8,
    marginBottom: SIZES.medium,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: SIZES.medium,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  switch: {
    marginLeft: SIZES.medium,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SIZES.small,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderRadius: 8,
    marginTop: SIZES.large,
  },
  noticeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SIZES.small,
    flex: 1,
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;
