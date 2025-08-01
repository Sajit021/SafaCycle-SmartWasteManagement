import apiService from './apiService';

class RouteService {
  // Get all routes
  async getRoutes(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.frequency) queryParams.append('frequency', filters.frequency);
      
      const url = `/routes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.request(url, {
        method: 'GET'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching routes:', error);
      throw error;
    }
  }

  // Get route by ID
  async getRouteById(routeId) {
    try {
      const response = await apiService.request(`/routes/${routeId}`, {
        method: 'GET'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching route:', error);
      throw error;
    }
  }

  // Create new route
  async createRoute(routeData) {
    try {
      const response = await apiService.request('/routes', {
        method: 'POST',
        body: JSON.stringify(routeData)
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  // Update route
  async updateRoute(routeId, updateData) {
    try {
      const response = await apiService.request(`/routes/${routeId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating route:', error);
      throw error;
    }
  }

  // Assign route to driver
  async assignRouteToDriver(routeId, driverId) {
    try {
      const response = await apiService.request(`/routes/${routeId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ driverId })
      });
      
      return response.data;
    } catch (error) {
      console.error('Error assigning route:', error);
      throw error;
    }
  }

  // Optimize route
  async optimizeRoute(routeId) {
    try {
      const response = await apiService.request(`/routes/${routeId}/optimize`, {
        method: 'POST'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error optimizing route:', error);
      throw error;
    }
  }

  // Start route collection
  async startRoute(routeId) {
    try {
      const response = await apiService.request(`/routes/${routeId}/start`, {
        method: 'POST'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error starting route:', error);
      throw error;
    }
  }

  // Complete route collection
  async completeRoute(routeId) {
    try {
      const response = await apiService.request(`/routes/${routeId}/complete`, {
        method: 'POST'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error completing route:', error);
      throw error;
    }
  }

  // Get routes scheduled for today
  async getTodaysRoutes() {
    try {
      const response = await apiService.request('/routes/scheduled/today', {
        method: 'GET'
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s routes:', error);
      throw error;
    }
  }

  // Helper methods for route management
  createRouteTemplate(name, description = '') {
    return {
      name,
      description,
      schedule: {
        frequency: 'weekly',
        days: ['monday', 'wednesday', 'friday'],
        startTime: '08:00',
        estimatedDuration: 240
      },
      locations: [],
      optimizationSettings: {
        prioritizeTime: true,
        prioritizeFuel: false,
        allowTrafficConsideration: true
      }
    };
  }

  createLocationTemplate(address, coordinates, wasteTypes = ['general']) {
    return {
      address: {
        street: address.street || '',
        area: address.area || '',
        city: address.city || 'Kathmandu',
        zipCode: address.zipCode || ''
      },
      coordinates: {
        type: 'Point',
        coordinates: coordinates // [longitude, latitude]
      },
      customerInfo: {
        name: '',
        phone: '',
        email: ''
      },
      wasteTypes,
      estimatedQuantity: 10,
      priority: 'medium',
      notes: '',
      order: 1
    };
  }

  // Utility methods
  calculateEstimatedTime(locations, startTime = '08:00') {
    const locationCount = locations.length;
    const estimatedMinutesPerLocation = 15; // 15 minutes per pickup
    const estimatedTravelTime = locationCount * 10; // 10 minutes travel between locations
    
    const totalMinutes = (locationCount * estimatedMinutesPerLocation) + estimatedTravelTime;
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(startHour, startMinute + totalMinutes, 0, 0);
    
    return {
      estimatedDuration: totalMinutes,
      estimatedEndTime: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
    };
  }

  getStatusColor(status) {
    const colors = {
      active: '#4CAF50',
      inactive: '#9E9E9E',
      in_progress: '#FF9800',
      completed: '#2196F3'
    };
    return colors[status] || '#9E9E9E';
  }

  getPriorityColor(priority) {
    const colors = {
      low: '#4CAF50',
      medium: '#FF9800',
      high: '#FF5722',
      urgent: '#F44336'
    };
    return colors[priority] || '#FF9800';
  }

  formatSchedule(schedule) {
    const { frequency, days, startTime } = schedule;
    const dayNames = {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };

    if (frequency === 'daily') {
      return `Daily at ${startTime}`;
    }

    const formattedDays = days.map(day => dayNames[day]).join(', ');
    return `${frequency.replace('_', ' ')} on ${formattedDays} at ${startTime}`;
  }
}

export default new RouteService();
