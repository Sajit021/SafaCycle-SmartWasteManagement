const mongoose = require('mongoose');

const collectionRequestSchema = new mongoose.Schema({
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Request Details
  requestId: {
    type: String,
    unique: true,
    required: false // Let pre-save middleware generate it
  },
  
  // Scheduling Information
  requestedDate: {
    type: Date,
    required: true
  },
  
  requestedTime: {
    type: String,
    required: true,
    enum: ['morning', 'afternoon', 'evening'] // Time slots
  },
  
  preferredTimeRange: {
    start: {
      type: String, // "08:00"
      required: true
    },
    end: {
      type: String, // "10:00"
      required: true
    }
  },
  
  // Collection Details
  wasteTypes: [{
    category: {
      type: String,
      required: true,
      enum: ['organic', 'recyclable', 'electronic', 'hazardous', 'general', 'plastic', 'paper', 'glass', 'metal']
    },
    estimatedWeight: {
      type: Number, // in kg
      min: 0
    },
    description: String
  }],
  
  totalEstimatedWeight: {
    type: Number,
    min: 0
  },
  
  // Location Information
  pickupLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      index: '2dsphere'
    }
  },
  
  address: {
    street: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'Nepal' },
    landmark: String,
    specialInstructions: String
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending',
    index: true
  },
  
  // Assignment Information
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  assignedVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  },
  
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  
  // Collection Execution
  actualCollectionTime: Date,
  
  actualWasteCollected: [{
    category: String,
    weight: Number,
    notes: String
  }],
  
  totalWeightCollected: {
    type: Number,
    min: 0
  },
  
  // Pricing Information
  estimatedCost: {
    type: Number,
    min: 0
  },
  
  actualCost: {
    type: Number,
    min: 0
  },
  
  // Priority and Special Handling
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  isRecurring: {
    type: Boolean,
    default: false
  },
  
  recurringSchedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'biweekly', 'monthly']
    },
    dayOfWeek: [Number], // 0-6 (Sunday-Saturday)
    dayOfMonth: Number,
    endDate: Date
  },
  
  // Communication
  customerNotes: String,
  driverNotes: String,
  adminNotes: String,
  
  // Photo Documentation
  beforePhotos: [String], // URLs
  afterPhotos: [String], // URLs
  
  // Feedback and Rating
  customerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  
  customerFeedback: String,
  
  // Cancellation/Rescheduling
  cancellationReason: String,
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectionRequest'
  },
  rescheduledTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CollectionRequest'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  scheduledAt: Date,
  confirmedAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
collectionRequestSchema.index({ customer: 1, status: 1 });
collectionRequestSchema.index({ requestedDate: 1, status: 1 });
collectionRequestSchema.index({ assignedDriver: 1, status: 1 });
collectionRequestSchema.index({ 'pickupLocation': '2dsphere' });
collectionRequestSchema.index({ createdAt: -1 });

// Virtual for full address
collectionRequestSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  let addressParts = [addr.street];
  if (addr.apartment) addressParts.push(addr.apartment);
  addressParts.push(addr.city, addr.state, addr.zipCode);
  if (addr.country && addr.country !== 'Nepal') addressParts.push(addr.country);
  return addressParts.join(', ');
});

// Virtual for time until pickup
collectionRequestSchema.virtual('timeUntilPickup').get(function() {
  if (!this.requestedDate) return null;
  const now = new Date();
  const pickup = new Date(this.requestedDate);
  const diffMs = pickup - now;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return diffHours;
});

// Virtual for collection status description
collectionRequestSchema.virtual('statusDescription').get(function() {
  const descriptions = {
    'pending': 'Waiting for confirmation',
    'confirmed': 'Confirmed by admin',
    'assigned': 'Assigned to driver',
    'in-progress': 'Collection in progress',
    'completed': 'Collection completed',
    'cancelled': 'Collection cancelled',
    'rescheduled': 'Rescheduled to new date'
  };
  return descriptions[this.status] || this.status;
});

// Pre-save middleware
collectionRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Generate request ID if not exists
  if (!this.requestId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.requestId = `CR-${timestamp}-${random}`.toUpperCase();
  }
  
  // Calculate total estimated weight
  if (this.wasteTypes && this.wasteTypes.length > 0) {
    this.totalEstimatedWeight = this.wasteTypes.reduce((total, waste) => {
      return total + (waste.estimatedWeight || 0);
    }, 0);
  }
  
  // Set status timestamps
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'confirmed':
        if (!this.confirmedAt) this.confirmedAt = now;
        break;
      case 'assigned':
        if (!this.scheduledAt) this.scheduledAt = now;
        break;
      case 'completed':
        if (!this.completedAt) this.completedAt = now;
        break;
      case 'cancelled':
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
    }
  }
  
  next();
});

// Instance methods
collectionRequestSchema.methods.canBeModified = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

collectionRequestSchema.methods.canBeCancelled = function() {
  return ['pending', 'confirmed', 'assigned'].includes(this.status);
};

collectionRequestSchema.methods.reschedule = async function(newDate, newTime) {
  if (!this.canBeModified()) {
    throw new Error('Collection request cannot be rescheduled in current status');
  }
  
  // Create new rescheduled request
  const rescheduledRequest = new this.constructor({
    ...this.toObject(),
    _id: undefined,
    requestId: undefined,
    requestedDate: newDate,
    requestedTime: newTime,
    status: 'pending',
    rescheduledFrom: this._id,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  await rescheduledRequest.save();
  
  // Update current request
  this.status = 'rescheduled';
  this.rescheduledTo = rescheduledRequest._id;
  await this.save();
  
  return rescheduledRequest;
};

collectionRequestSchema.methods.assignToDriver = async function(driverId, vehicleId) {
  if (this.status !== 'confirmed') {
    throw new Error('Collection request must be confirmed before assignment');
  }
  
  this.assignedDriver = driverId;
  this.assignedVehicle = vehicleId;
  this.status = 'assigned';
  await this.save();
  
  return this;
};

collectionRequestSchema.methods.markCompleted = async function(collectionData) {
  if (this.status !== 'in-progress') {
    throw new Error('Collection request must be in progress to mark as completed');
  }
  
  this.status = 'completed';
  this.actualCollectionTime = new Date();
  
  if (collectionData) {
    this.actualWasteCollected = collectionData.wasteCollected || [];
    this.totalWeightCollected = collectionData.totalWeight || 0;
    this.actualCost = collectionData.cost || 0;
    this.driverNotes = collectionData.notes || '';
    this.afterPhotos = collectionData.photos || [];
  }
  
  await this.save();
  return this;
};

// Static methods
collectionRequestSchema.statics.getCustomerRequests = function(customerId, options = {}) {
  const {
    status,
    limit = 10,
    page = 1,
    sortBy = '-requestedDate'
  } = options;
  
  const query = { customer: customerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('assignedDriver', 'name profile.phone')
    .populate('assignedVehicle', 'plateNumber type')
    .sort(sortBy)
    .limit(limit)
    .skip((page - 1) * limit);
};

collectionRequestSchema.statics.getUpcomingPickups = function(customerId) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return this.find({
    customer: customerId,
    status: { $in: ['confirmed', 'assigned', 'in-progress'] },
    requestedDate: { $gte: tomorrow }
  })
  .populate('assignedDriver', 'name profile.phone')
  .populate('assignedVehicle', 'plateNumber type')
  .sort('requestedDate');
};

collectionRequestSchema.statics.getCustomerStats = async function(customerId) {
  const stats = await this.aggregate([
    { $match: { customer: mongoose.Types.ObjectId(customerId) } },
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 },
        completedRequests: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        totalWasteCollected: {
          $sum: '$totalWeightCollected'
        },
        avgRating: { $avg: '$customerRating' }
      }
    }
  ]);
  
  return stats[0] || {
    totalRequests: 0,
    completedRequests: 0,
    totalWasteCollected: 0,
    avgRating: 0
  };
};

module.exports = mongoose.model('CollectionRequest', collectionRequestSchema);
