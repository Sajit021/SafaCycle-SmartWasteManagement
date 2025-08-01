import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services';

// Initial state for the app
const initialState = {
  user: null,
  isAuthenticated: false,
  userRole: null, // 'admin', 'driver', 'customer'
  loading: true, // Start with loading true for initial token check
  error: null,
  token: null,
};

// Action types
export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  LOGOUT: "LOGOUT",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOAD_USER_START: "LOAD_USER_START",
  LOAD_USER_SUCCESS: "LOAD_USER_SUCCESS",
  LOAD_USER_FAILURE: "LOAD_USER_FAILURE",
  UPDATE_PROFILE_SUCCESS: "UPDATE_PROFILE_SUCCESS",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
    case AUTH_ACTIONS.LOAD_USER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        userRole: action.payload.user?.role,
        token: action.payload.token,
        error: null,
      };
    case AUTH_ACTIONS.LOAD_USER_SUCCESS:
    case AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        userRole: action.payload.user?.role,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
    case AUTH_ACTIONS.LOAD_USER_FAILURE:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        userRole: null,
        token: null,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Storage keys
const STORAGE_KEY = 'safacycle_auth_token';
const USER_KEY = 'safacycle_user_data';

// Context provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user data from storage on app start
  useEffect(() => {
    loadStoredAuth();
  }, []);

  // Load stored authentication data
  const loadStoredAuth = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.LOAD_USER_START });

      const token = await AsyncStorage.getItem(STORAGE_KEY);
      const userData = await AsyncStorage.getItem(USER_KEY);

      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Set token in auth service
        authService.setAuthToken(token);
        
        // Verify token is still valid by fetching profile
        const response = await authService.getProfile();
        
        if (response.success) {
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_SUCCESS,
            payload: { user: response.data.user }
          });
        } else {
          // Token is invalid, clear storage
          await clearStoredAuth();
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER_FAILURE,
            payload: 'Session expired'
          });
        }
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOAD_USER_FAILURE,
          payload: null
        });
      }
    } catch (error) {
      console.error('Load stored auth error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOAD_USER_FAILURE,
        payload: 'Failed to load stored authentication'
      });
    }
  };

  // Store authentication data
  const storeAuth = async (token, user) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Store auth error:', error);
    }
  };

  // Clear stored authentication data
  const clearStoredAuth = async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, USER_KEY]);
    } catch (error) {
      console.error('Clear stored auth error:', error);
    }
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        const { user, token } = response.data;
        
        // Store authentication data
        await storeAuth(token, user);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token }
        });
        
        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: response.message || 'Login failed'
        });
        
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection.';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      
      return { success: false, message: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await authService.register(userData);

      if (response.success) {
        const { user, token } = response.data;
        
        // Store authentication data
        await storeAuth(token, user);
        
        dispatch({
          type: AUTH_ACTIONS.REGISTER_SUCCESS,
          payload: { user, token }
        });
        
        return { success: true, user };
      } else {
        dispatch({
          type: AUTH_ACTIONS.REGISTER_FAILURE,
          payload: response.message || 'Registration failed'
        });
        
        return { success: false, message: response.message, errors: response.errors };
      }
    } catch (error) {
      const errorMessage = 'Network error. Please check your connection.';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });
      
      return { success: false, message: errorMessage };
    }
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);

      if (response.success) {
        const { user } = response.data;
        
        // Update stored user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_PROFILE_SUCCESS,
          payload: { user }
        });
        
        return { success: true, user };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await authService.changePassword(passwordData);
      return response;
    } catch (error) {
      return { success: false, message: 'Network error. Please check your connection.' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local data
      await clearStoredAuth();
      authService.removeAuthToken();
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Get user role helper
  const getUserRole = () => {
    return state.user?.role || null;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is driver
  const isDriver = () => {
    return hasRole('driver');
  };

  // Check if user is customer
  const isCustomer = () => {
    return hasRole('customer');
  };

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    
    // Helpers
    getUserRole,
    hasRole,
    isAdmin,
    isDriver,
    isCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
