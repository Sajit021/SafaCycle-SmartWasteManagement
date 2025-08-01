const { body, validationResult } = require('express-validator');

// Validation helper function
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// User registration validation
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['customer', 'driver', 'admin'])
    .withMessage('Role must be either customer, driver, or admin'),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Update user validation
const validateUserUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['customer', 'driver', 'admin'])
    .withMessage('Role must be either customer, driver, or admin'),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended'])
    .withMessage('Status must be either active, inactive, or suspended'),
  
  body('profile.phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('profile.address.zipCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Please provide a valid zip code'),
  
  handleValidationErrors
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Password reset request validation
const validatePasswordResetRequest = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Driver info validation
const validateDriverInfo = [
  body('licenseNumber')
    .notEmpty()
    .withMessage('License number is required for drivers')
    .isLength({ min: 5, max: 20 })
    .withMessage('License number must be between 5 and 20 characters'),
  
  body('workingHours.start')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),
  
  body('workingHours.end')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),
  
  body('emergencyContact.phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid emergency contact phone number'),
  
  handleValidationErrors
];

// Customer info validation
const validateCustomerInfo = [
  body('wasteCategories')
    .optional()
    .isArray()
    .withMessage('Waste categories must be an array'),
  
  body('wasteCategories.*')
    .optional()
    .isIn(['organic', 'recyclable', 'hazardous', 'electronic', 'general'])
    .withMessage('Invalid waste category'),
  
  body('preferredPickupTime')
    .optional()
    .isIn(['morning', 'afternoon', 'evening'])
    .withMessage('Preferred pickup time must be morning, afternoon, or evening'),
  
  body('subscriptionPlan')
    .optional()
    .isIn(['basic', 'premium', 'enterprise'])
    .withMessage('Subscription plan must be basic, premium, or enterprise'),
  
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateUserUpdate,
  validatePasswordChange,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateDriverInfo,
  validateCustomerInfo,
  handleValidationErrors
};
