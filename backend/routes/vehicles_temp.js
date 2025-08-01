const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateVehicle = [
  body('plateNumber')
    .notEmpty()
    .withMessage('Plate number is required')
    .isLength({ min: 3, max: 15 })
    .withMessage('Plate number must be between 3 and 15 characters'),
  
  body('model')
    .notEmpty()
    .withMessage('Vehicle model is required'),
  
  body('brand')
    .notEmpty()
    .withMessage('Vehicle brand is required'),
  
  body('year')
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage('Year must be between 1990 and current year'),
  
  body('type')
    .isIn(['truck', 'van', 'compactor', 'pickup', 'other'])
    .withMessage('Vehicle type must be truck, van, compactor, pickup, or other'),
  
  body('capacity.volume')
    .isFloat({ min: 0.1 })
    .withMessage('Volume capacity must be greater than 0'),
  
  body('capacity.weight')
    .isFloat({ min: 50 })
    .withMessage('Weight capacity must be at least 50 kg')
];

// @route   GET /api/vehicles
// @desc    Get all vehicles
// @access  Private (Admin/Driver)
router.get('/', auth, async (req, res) => {
  try {
    // Check authorization
    if (req.user.role !== 'admin' && req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin or Driver role required.'
      });
    }

    let filter = { isDeleted: false };
    
    // For drivers, only show their assigned vehicle
    if (req.user.role === 'driver') {
      filter.assignedDriver = req.user._id;
    }

    const vehicles = await Vehicle.find(filter)
      .populate('assignedDriver', 'name email profile.phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { vehicles }
    });

  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vehicles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/vehicles
// @desc    Create new vehicle
// @access  Private (Admin only)
router.post('/', [auth, ...validateVehicle], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check authorization
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Check if plate number already exists
    const existingVehicle = await Vehicle.findOne({
      plateNumber: req.body.plateNumber.toUpperCase(),
      isDeleted: false
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this plate number already exists'
      });
    }

    const vehicle = new Vehicle({
      ...req.body,
      plateNumber: req.body.plateNumber.toUpperCase()
    });

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: { vehicle }
    });

  } catch (error) {
    console.error('Create vehicle error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating vehicle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/vehicles/:id/assign
// @desc    Assign vehicle to driver
// @access  Private (Admin only)
router.post('/:id/assign', [
  auth,
  body('driverId').isMongoId().withMessage('Valid driver ID is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check authorization
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found'
      });
    }

    await vehicle.assignToDriver(req.body.driverId);

    const updatedVehicle = await Vehicle.findById(vehicle._id)
      .populate('assignedDriver', 'name email profile.phone');

    res.json({
      success: true,
      message: 'Vehicle assigned to driver successfully',
      data: { vehicle: updatedVehicle }
    });

  } catch (error) {
    console.error('Assign vehicle error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning vehicle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
