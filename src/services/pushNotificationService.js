import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

class PushNotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.expoPushToken = null;
  }

  async initialize() {
    try {
      console.log('Initializing push notifications...');
      
      // Configure notifications behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Check if we're in a supported environment
      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return false;
      }

      // Request permissions and get token
      const permissionsGranted = await this.requestPermissions();
      if (!permissionsGranted) {
        console.log('Push notification permissions not granted');
        return false;
      }

      const token = await this.getExpoPushToken();
      if (!token) {
        console.log('Could not get push token - this is expected in Expo Go');
        console.log('Local notifications will still work for testing');
      }
      
      // Set up listeners (these work in all environments)
      this.setupNotificationListeners();

      console.log('Push notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      console.log('Continuing with limited notification functionality...');
      return false;
    }
  }

  async requestPermissions() {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async getExpoPushToken() {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications only work on physical devices');
        return null;
      }

      // Check if running in Expo Go (which has limitations)
      const isExpoGo = __DEV__ && !Device.isDevice;
      if (isExpoGo) {
        console.log('Push notifications have limitations in Expo Go. Use development build for full functionality.');
        return null;
      }

      try {
        // Try to get push token with projectId if available
        const projectId = process.env.EXPO_PROJECT_ID || 'your-project-id'; // Replace with actual project ID
        
        const tokenResponse = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        
        const token = tokenResponse.data;
        this.expoPushToken = token;
        
        // Store token locally
        await AsyncStorage.setItem('expoPushToken', token);
        
        // Send token to backend
        try {
          await apiService.updatePushToken(token);
          console.log('Push token registered with backend:', token);
        } catch (error) {
          console.error('Error registering push token with backend:', error);
        }

        return token;
      } catch (tokenError) {
        console.log('Unable to get push token in current environment:', tokenError.message);
        console.log('This is expected in Expo Go. For full push notification support, use a development build.');
        return null;
      }
    } catch (error) {
      console.error('Error getting Expo push token:', error);
      return null;
    }
  }

  setupNotificationListeners() {
    // Listener for notifications received while app is running
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listener for notification responses (when user taps notification)
    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      this.handleNotificationResponse(response);
    });
  }

  handleNotificationReceived(notification) {
    const { title, body, data } = notification.request.content;
    
    // Handle different notification types
    switch (data?.type) {
      case 'collection_reminder':
        // Show in-app notification or update collection status
        break;
      case 'driver_update':
        // Update driver location or status
        break;
      case 'collection_complete':
        // Show completion notification
        break;
      default:
        console.log('Received notification:', title, body);
    }
  }

  handleNotificationResponse(response) {
    const { data } = response.notification.request.content;
    
    // Navigate to specific screen based on notification type
    switch (data?.type) {
      case 'collection_reminder':
        // Navigate to upcoming collections
        if (data.collectionId) {
          // Use navigation service to navigate
          this.navigateToCollection(data.collectionId);
        }
        break;
      case 'driver_update':
        // Navigate to tracking screen
        if (data.collectionId) {
          this.navigateToTracking(data.collectionId);
        }
        break;
      case 'new_notification':
        // Navigate to notifications screen
        this.navigateToNotifications();
        break;
      default:
        console.log('Notification tapped:', data);
    }
  }

  navigateToCollection(collectionId) {
    // This would need to be implemented with your navigation service
    console.log('Navigate to collection:', collectionId);
  }

  navigateToTracking(collectionId) {
    console.log('Navigate to tracking:', collectionId);
  }

  navigateToNotifications() {
    console.log('Navigate to notifications');
  }

  async scheduleLocalNotification(title, body, data = {}, trigger = null) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: trigger || null, // null means show immediately
      });

      console.log('Local notification scheduled:', notificationId);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling local notification:', error);
      return null;
    }
  }

  async scheduleCollectionReminder(collection) {
    try {
      const scheduledDate = new Date(collection.scheduledDate);
      const reminderTime = new Date(scheduledDate.getTime() - 60 * 60 * 1000); // 1 hour before

      if (reminderTime > new Date()) {
        const notificationId = await this.scheduleLocalNotification(
          'Collection Reminder',
          `Your waste collection is scheduled for ${scheduledDate.toLocaleTimeString()}`,
          {
            type: 'collection_reminder',
            collectionId: collection._id,
          },
          reminderTime
        );

        return notificationId;
      }
    } catch (error) {
      console.error('Error scheduling collection reminder:', error);
    }
  }

  async cancelNotification(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Notification cancelled:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  }

  async clearBadge() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // Test notification for development
  async sendTestNotification() {
    try {
      // Always use local notifications for testing (works in all environments)
      const notificationId = await this.scheduleLocalNotification(
        'Test Notification',
        'This is a test notification from SafaCycle. Local notifications are working!',
        { type: 'test' }
      );
      
      if (notificationId) {
        console.log('Test notification scheduled successfully');
        return true;
      } else {
        console.log('Failed to schedule test notification');
        return false;
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  // Check if push notifications are fully supported
  isPushNotificationsSupported() {
    return Device.isDevice && this.expoPushToken !== null;
  }

  // Check if local notifications are supported
  isLocalNotificationsSupported() {
    return true; // Local notifications work in all environments
  }

  // Get notification capability status
  getNotificationStatus() {
    return {
      deviceSupported: Device.isDevice,
      pushTokenAvailable: this.expoPushToken !== null,
      localNotificationsSupported: this.isLocalNotificationsSupported(),
      pushNotificationsSupported: this.isPushNotificationsSupported(),
      environment: __DEV__ ? 'development' : 'production',
    };
  }
}

// Export singleton instance
export default new PushNotificationService();
