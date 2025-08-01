const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^[A-Z0-9\s-]+$/, 'Invalid plate number format']
  },
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Vehicle brand is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required'],
    min: [1990, 'Year must be 1990 or later'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },
  type: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: {
      values: ['truck', 'van', 'compactor', 'pickup', 'other'],
      message: 'Vehicle type must be truck, van, compactor, pickup, or other'
    }
  },
  capacity: {
    volume: {
      type: Number,
      required: [true, 'Vehicle volume capacity is required'],
      min: [0, 'Capacity must be positive'],
      // Volume in cubic meters
    },
    weight: {
      type: Number,
      required: [true, 'Vehicle weight capacity is required'],
      min: [0, 'Weight capacity must be positive'],
      // Weight in kilograms
    }
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'maintenance', 'out_of_service', 'retired'],
      message: 'Status must be active, maintenance, out_of_service, or retired'
    },
    default: 'active'
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    validate: {
      validator: async function(driverId) {
        if (!driverId) return true;
        const User = mongoose.model('User');
        const driver = await User.findById(driverId);
        return driver && driver.role === 'driver';
      },
      message: 'Assigned user must be a driver'
    }
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [85.3240, 27.7172] // Default to Kathmandu coordinates
    }
  },
  specifications: {
    fuelType: {
      type: String,
      enum: {
        values: ['diesel', 'petrol', 'electric', 'hybrid', 'cng'],
        message: 'Fuel type must be diesel, petrol, electric, hybrid, or cng'
      },
      default: 'diesel'
    },
    emissions: {
      type: String,
      enum: {
        values: ['euro_3', 'euro_4', 'euro_5', 'euro_6', 'bs_4', 'bs_6'],
        message: 'Invalid emission standard'
      }
    },
    mileage: {
      type: Number,
      min: [0, 'Mileage must be positive'],
      // Km per liter
    }
  },
  maintenance: {
    lastService: {
      type: Date,
      default: null
    },
    nextService: {
      type: Date,
      default: null
    },
    totalMileage: {
      type: Number,
      default: 0,
      min: [0, 'Total mileage must be positive']
    },
    serviceHistory: [{
      date: {
        type: Date,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ['routine', 'repair', 'inspection', 'other']
      },
      description: {
        type: String,
        required: true,
        trim: true
      },
      cost: {
        type: Number,
        min: [0, 'Cost must be positive']
      },
      serviceProvider: {
        type: String,
        trim: true
      }
    }]
  },
  insurance: {
    provider: {
      type: String,
      trim: true
    },
    policyNumber: {
      type: String,
      trim: true
    },
    expiryDate: {
      type: Date
    },
    coverage: {
      type: String,
      trim: true
    }
  },
  documents: {
    registration: {
      number: {
        type: String,
        trim: true
      },
      expiryDate: {
        type: Date
      }
    },
    permit: {
      number: {
        type: String,
        trim: true
      },
      expiryDate: {
        type: Date
      }
    },
    pollution: {
      certificateNumber: {
        type: String,
        trim: true
      },
      expiryDate: {
        type: Date
      }
    }
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
vehicleSchema.index({ plateNumber: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ assignedDriver: 1 });
vehicleSchema.index({ currentLocation: '2dsphere' });
vehicleSchema.index({ isDeleted: 1 });

// Virtual for assigned driver info
vehicleSchema.virtual('driverInfo', {
  ref: 'User',
  localField: 'assignedDriver',
  foreignField: '_id',
  justOne: true
});

// Virtual to check if vehicle is available
vehicleSchema.virtual('isAvailable').get(function() {
  return this.status === 'active' && !this.assignedDriver;
});

// Virtual for next service due status
vehicleSchema.virtual('serviceDue').get(function() {
  if (!this.maintenance.nextService) return null;
  const today = new Date();
  const nextService = new Date(this.maintenance.nextService);
  const daysUntilService = Math.ceil((nextService - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilService < 0) return 'overdue';
  if (daysUntilService <= 7) return 'due_soon';
  if (daysUntilService <= 30) return 'due_this_month';
  return 'not_due';
});

// Pre-save middleware
vehicleSchema.pre('save', function(next) {
  // Auto-calculate next service date if not provided
  if (this.maintenance.lastService && !this.maintenance.nextService) {
    const lastService = new Date(this.maintenance.lastService);
    const nextService = new Date(lastService);
    nextService.setMonth(nextService.getMonth() + 6); // 6 months default
    this.maintenance.nextService = nextService;
  }
  next();
});

// Static methods
vehicleSchema.statics.findAvailable = function() {
  return this.find({
    status: 'active',
    assignedDriver: null,
    isDeleted: false
  });
};

vehicleSchema.statics.findByDriver = function(driverId) {
  return this.findOne({
    assignedDriver: driverId,
    isDeleted: false
  });
};

vehicleSchema.statics.findNearLocation = function(longitude, latitude, maxDistance = 5000) {
  return this.find({
    currentLocation: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance
      }
    },
    isDeleted: false
  });
};

// Instance methods
vehicleSchema.methods.assignToDriver = async function(driverId) {
  const User = mongoose.model('User');
  const driver = await User.findById(driverId);
  
  if (!driver || driver.role !== 'driver') {
    throw new Error('Invalid driver ID');
  }
  
  if (driver.driverInfo.vehicleAssigned) {
    throw new Error('Driver is already assigned to another vehicle');
  }
  
  // Update vehicle
  this.assignedDriver = driverId;
  await this.save();
  
  // Update driver
  driver.driverInfo.vehicleAssigned = this._id;
  await driver.save();
  
  return this;
};

vehicleSchema.methods.unassignDriver = async function() {
  if (this.assignedDriver) {
    const User = mongoose.model('User');
    const driver = await User.findById(this.assignedDriver);
    
    if (driver) {
      driver.driverInfo.vehicleAssigned = null;
      await driver.save();
    }
    
    this.assignedDriver = null;
    await this.save();
  }
  
  return this;
};

vehicleSchema.methods.updateLocation = function(longitude, latitude) {
  this.currentLocation = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };
  return this.save();
};

vehicleSchema.methods.addServiceRecord = function(serviceData) {
  this.maintenance.serviceHistory.push(serviceData);
  this.maintenance.lastService = serviceData.date;
  
  // Calculate next service date (6 months from last service)
  const nextService = new Date(serviceData.date);
  nextService.setMonth(nextService.getMonth() + 6);
  this.maintenance.nextService = nextService;
  
  return this.save();
};

module.exports = mongoose.model('Vehicle', vehicleSchema);
