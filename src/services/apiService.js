// API Configuration
const API_BASE_URL = 'http://192.168.1.198:5003/api';

// API Response interface for better error handling
class ApiResponse {
  constructor(success, data = null, message = '', errors = []) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errors = errors;
  }
}

// API Service class for handling all backend communication
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  // Set authentication token
  setAuthToken(token) {
    this.token = token;
  }

  // Remove authentication token
  removeAuthToken() {
    this.token = null;
  }

  // Get default headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getHeaders(),
        ...options,
      };

      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status}`, data);
        return new ApiResponse(false, null, data.message || 'Request failed', data.errors || []);
      }

      console.log(`✅ API Success: ${config.method || 'GET'} ${url}`);
      return new ApiResponse(true, data.data || data, data.message || 'Success');

    } catch (error) {
      console.error('🔥 Network Error:', error);
      return new ApiResponse(false, null, 'Network error occurred', []);
    }
  }

  // GET request
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      const data = await response.json();
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // ===== AUTHENTICATION METHODS =====
  
  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    return response;
  }

  async logout() {
    this.removeAuthToken();
    return new ApiResponse(true, null, 'Logged out successfully');
  }

  // ===== COLLECTION METHODS =====
  
  async getCollections(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/collections?${queryParams}` : '/collections';
    return this.get(endpoint);
  }

  async createCollection(collectionData) {
    return this.post('/collections', collectionData);
  }

  async getCollectionById(id) {
    return this.get(`/collections/${id}`);
  }

  async updateCollection(id, updateData) {
    return this.put(`/collections/${id}`, updateData);
  }

  async cancelCollection(id, reason) {
    return this.put(`/collections/${id}/cancel`, { reason });
  }

  async rescheduleCollection(id, newDate, newTime) {
    return this.put(`/collections/${id}/reschedule`, { 
      requestedDate: newDate, 
      requestedTime: newTime 
    });
  }

  async getUpcomingCollections() {
    return this.get('/collections/upcoming');
  }

  async getCollectionStats() {
    return this.get('/collections/stats');
  }

  // ===== ISSUE REPORTING METHODS =====
  
  async getIssues(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/issues?${queryParams}` : '/issues';
    return this.get(endpoint);
  }

  async createIssue(issueData) {
    return this.post('/issues', issueData);
  }

  async getIssueById(id) {
    return this.get(`/issues/${id}`);
  }

  async addIssueComment(id, comment) {
    return this.post(`/issues/${id}/comments`, { text: comment });
  }

  async uploadIssuePhoto(id, photoData) {
    // This will be implemented when we add file upload functionality
    return this.post(`/issues/${id}/photos`, photoData);
  }

  // ===== NOTIFICATION METHODS =====
  
  async getNotifications(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/notifications?${queryParams}` : '/notifications';
    return this.get(endpoint);
  }

  async markNotificationAsRead(id) {
    return this.put(`/notifications/${id}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.put('/notifications/mark-all-read');
  }

  async getUnreadNotificationCount() {
    return this.get('/notifications/unread-count');
  }

  // ===== ANALYTICS METHODS =====
  
  async getCustomerDashboard() {
    return this.get('/analytics/dashboard');
  }

  async getEnvironmentalImpact() {
    return this.get('/analytics/environmental-impact');
  }

  async getCollectionHistory() {
    return this.get('/analytics/collection-history');
  }

  async getRewardsData() {
    return this.get('/analytics/rewards');
  }

  async getPersonalizedInsights() {
    return this.get('/analytics/insights');
  }

  // ===== USER PROFILE METHODS =====
  
  async getUserProfile() {
    return this.get('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.put('/users/profile', profileData);
  }

  async changePassword(passwordData) {
    return this.put('/users/change-password', passwordData);
  }

  // ===== PUSH NOTIFICATION METHODS =====
  
  async updatePushToken(token) {
    return this.post('/users/push-token', { pushToken: token });
  }

  async removePushToken() {
    return this.delete('/users/push-token');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
export { ApiResponse };
