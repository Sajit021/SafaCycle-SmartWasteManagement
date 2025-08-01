import apiService from './apiService';

// Auth Service for handling authentication-related API calls
class AuthService {
  // User Registration
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.success && response.data?.token) {
        // Store token for future requests
        apiService.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed',
        data: null
      };
    }
  }

  // User Login
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.success && response.data?.token) {
        // Store token for future requests
        apiService.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed',
        data: null
      };
    }
  }

  // Get Current User Profile
  async getProfile() {
    try {
      return await apiService.get('/auth/me');
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        message: 'Failed to fetch profile',
        data: null
      };
    }
  }

  // Update Profile
  async updateProfile(profileData) {
    try {
      return await apiService.put('/auth/profile', profileData);
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: 'Failed to update profile',
        data: null
      };
    }
  }

  // Change Password
  async changePassword(passwordData) {
    try {
      return await apiService.put('/auth/change-password', passwordData);
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Failed to change password',
        data: null
      };
    }
  }

  // Forgot Password
  async forgotPassword(email) {
    try {
      return await apiService.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        message: 'Failed to send reset email',
        data: null
      };
    }
  }

  // Reset Password
  async resetPassword(resetData) {
    try {
      return await apiService.post('/auth/reset-password', resetData);
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: 'Failed to reset password',
        data: null
      };
    }
  }

  // Logout
  async logout() {
    try {
      const response = await apiService.post('/auth/logout');
      
      // Always remove token, even if request fails
      apiService.removeAuthToken();
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove token on error
      apiService.removeAuthToken();
      return {
        success: true, // Consider logout successful even on error
        message: 'Logged out',
        data: null
      };
    }
  }

  // Delete Account
  async deleteAccount() {
    try {
      const response = await apiService.delete('/auth/account');
      
      if (response.success) {
        apiService.removeAuthToken();
      }
      
      return response;
    } catch (error) {
      console.error('Delete account error:', error);
      return {
        success: false,
        message: 'Failed to delete account',
        data: null
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return apiService.token !== null;
  }

  // Set authentication token manually (for app initialization)
  setAuthToken(token) {
    apiService.setAuthToken(token);
  }

  // Remove authentication token manually
  removeAuthToken() {
    apiService.removeAuthToken();
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;
