const mongoose = require('mongoose');

const customerAnalyticsSchema = new mongoose.Schema({
  // Customer Reference
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  
  // Collection Analytics
  collections: {
    total: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    rescheduled: { type: Number, default: 0 },
    
    // Monthly breakdown
    monthly: [{
      year: Number,
      month: Number, // 1-12
      count: { type: Number, default: 0 },
      weight: { type: Number, default: 0 }
    }],
    
    // Weekly breakdown (last 12 weeks)
    weekly: [{
      weekStart: Date,
      count: { type: Number, default: 0 },
      weight: { type: Number, default: 0 }
    }],
    
    // Success rate
    completionRate: { type: Number, default: 0 }, // percentage
    averageRating: { type: Number, default: 0 }
  },
  
  // Waste Analytics
  waste: {
    // Total weight collected
    totalWeight: { type: Number, default: 0 }, // in kg
    
    // Weight by category
    byCategory: [{
      category: String,
      weight: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    }],
    
    // Monthly weight trends
    monthlyWeight: [{
      year: Number,
      month: Number,
      weight: { type: Number, default: 0 }
    }],
    
    // Environmental impact
    environmental: {
      carbonSaved: { type: Number, default: 0 }, // kg CO2
      treesEquivalent: { type: Number, default: 0 },
      energySaved: { type: Number, default: 0 }, // kWh
      waterSaved: { type: Number, default: 0 } // liters
    },
    
    // Recycling metrics
    recycling: {
      totalRecycled: { type: Number, default: 0 },
      recyclingRate: { type: Number, default: 0 }, // percentage
      topRecycledCategory: String
    }
  },
  
  // Behavior Analytics
  behavior: {
    // Pickup preferences
    preferredDays: [Number], // 0-6 (Sunday-Saturday)
    preferredTimes: [String], // ['morning', 'afternoon', 'evening']
    averageRequestAdvance: { type: Number, default: 0 }, // days in advance
    
    // Frequency patterns
    averageFrequency: { type: Number, default: 0 }, // days between pickups
    isRegularCustomer: { type: Boolean, default: false },
    consistencyScore: { type: Number, default: 0 }, // 0-100
    
    // App usage
    loginFrequency: { type: Number, default: 0 }, // logins per month
    featureUsage: [{
      feature: String,
      count: { type: Number, default: 0 },
      lastUsed: Date
    }],
    
    // Communication preferences
    notificationPreferences: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  
  // Financial Analytics
  financial: {
    totalSpent: { type: Number, default: 0 },
    averagePerCollection: { type: Number, default: 0 },
    monthlySpending: [{
      year: Number,
      month: Number,
      amount: { type: Number, default: 0 }
    }],
    
    // Payment behavior
    paymentMethods: [{
      method: String,
      count: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 }
    }],
    
    outstandingBalance: { type: Number, default: 0 },
    creditScore: { type: Number, default: 100 } // 0-100
  },
  
  // Service Quality Metrics
  service: {
    // Issues and complaints
    totalIssues: { type: Number, default: 0 },
    resolvedIssues: { type: Number, default: 0 },
    issueResolutionRate: { type: Number, default: 0 }, // percentage
    averageResolutionTime: { type: Number, default: 0 }, // hours
    
    // Satisfaction
    averageSatisfaction: { type: Number, default: 0 }, // 1-5
    npsScore: { type: Number, default: 0 }, // Net Promoter Score
    
    // Service reliability
    onTimePickups: { type: Number, default: 0 },
    latePickups: { type: Number, default: 0 },
    onTimeRate: { type: Number, default: 0 } // percentage
  },
  
  // Engagement Analytics
  engagement: {
    // Loyalty metrics
    customerLifetime: { type: Number, default: 0 }, // days since first collection
    loyaltyTier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze'
    },
    
    // Points and rewards
    totalPoints: { type: Number, default: 0 },
    pointsRedeemed: { type: Number, default: 0 },
    availablePoints: { type: Number, default: 0 },
    
    // Referrals
    referralsSent: { type: Number, default: 0 },
    referralsSuccessful: { type: Number, default: 0 },
    
    // Social impact
    communityRank: { type: Number, default: 0 },
    achievements: [String]
  },
  
  // Predictive Analytics
  predictions: {
    // Churn risk
    churnRisk: {
      score: { type: Number, default: 0 }, // 0-100
      factors: [String],
      lastCalculated: Date
    },
    
    // Next collection prediction
    nextCollectionPrediction: {
      date: Date,
      confidence: { type: Number, default: 0 }, // 0-100
      wasteTypes: [String]
    },
    
    // Lifetime value
    predictedLifetimeValue: {
      amount: { type: Number, default: 0 },
      confidence: { type: Number, default: 0 }
    }
  },
  
  // Goals and Targets
  goals: {
    // Waste reduction goals
    wasteReductionTarget: { type: Number, default: 0 }, // percentage
    wasteReductionAchieved: { type: Number, default: 0 },
    
    // Recycling goals
    recyclingTarget: { type: Number, default: 0 }, // percentage
    recyclingAchieved: { type: Number, default: 0 },
    
    // Carbon footprint goals
    carbonReductionTarget: { type: Number, default: 0 },
    carbonReductionAchieved: { type: Number, default: 0 }
  },
  
  // Comparison Metrics
  benchmarks: {
    // Compared to similar customers
    wasteReductionPercentile: { type: Number, default: 50 },
    recyclingPercentile: { type: Number, default: 50 },
    engagementPercentile: { type: Number, default: 50 },
    
    // Compared to neighborhood
    neighborhoodRank: { type: Number, default: 0 },
    neighborhoodTotal: { type: Number, default: 0 }
  },
  
  // Timestamps
  lastCalculated: {
    type: Date,
    default: Date.now
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
customerAnalyticsSchema.index({ customer: 1 });
customerAnalyticsSchema.index({ lastCalculated: 1 });
customerAnalyticsSchema.index({ 'engagement.loyaltyTier': 1 });
customerAnalyticsSchema.index({ 'predictions.churnRisk.score': -1 });

// Virtual for customer lifetime in months
customerAnalyticsSchema.virtual('customerLifetimeMonths').get(function() {
  return Math.floor(this.engagement.customerLifetime / 30);
});

// Virtual for waste reduction achievement percentage
customerAnalyticsSchema.virtual('wasteReductionProgress').get(function() {
  if (this.goals.wasteReductionTarget === 0) return 0;
  return Math.round((this.goals.wasteReductionAchieved / this.goals.wasteReductionTarget) * 100);
});

// Virtual for recycling progress
customerAnalyticsSchema.virtual('recyclingProgress').get(function() {
  if (this.goals.recyclingTarget === 0) return 0;
  return Math.round((this.goals.recyclingAchieved / this.goals.recyclingTarget) * 100);
});

// Virtual for environmental impact summary
customerAnalyticsSchema.virtual('environmentalImpact').get(function() {
  return {
    totalWeight: this.waste.totalWeight,
    carbonSaved: this.waste.environmental.carbonSaved,
    treesEquivalent: this.waste.environmental.treesEquivalent,
    recyclingRate: this.waste.recycling.recyclingRate
  };
});

// Pre-save middleware
customerAnalyticsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.lastCalculated = new Date();
  
  // Calculate completion rate
  if (this.collections.total > 0) {
    this.collections.completionRate = Math.round(
      (this.collections.completed / this.collections.total) * 100
    );
  }
  
  // Calculate on-time rate
  const totalPickups = this.service.onTimePickups + this.service.latePickups;
  if (totalPickups > 0) {
    this.service.onTimeRate = Math.round(
      (this.service.onTimePickups / totalPickups) * 100
    );
  }
  
  // Calculate issue resolution rate
  if (this.service.totalIssues > 0) {
    this.service.issueResolutionRate = Math.round(
      (this.service.resolvedIssues / this.service.totalIssues) * 100
    );
  }
  
  // Calculate recycling rate
  if (this.waste.totalWeight > 0) {
    this.waste.recycling.recyclingRate = Math.round(
      (this.waste.recycling.totalRecycled / this.waste.totalWeight) * 100
    );
  }
  
  // Calculate available points
  this.engagement.availablePoints = this.engagement.totalPoints - this.engagement.pointsRedeemed;
  
  next();
});

// Instance methods
customerAnalyticsSchema.methods.addCollection = function(collectionData) {
  this.collections.total += 1;
  
  if (collectionData.status === 'completed') {
    this.collections.completed += 1;
    
    if (collectionData.weight) {
      this.waste.totalWeight += collectionData.weight;
      
      // Add to monthly weight
      const now = new Date();
      const currentMonth = this.waste.monthlyWeight.find(
        m => m.year === now.getFullYear() && m.month === now.getMonth() + 1
      );
      
      if (currentMonth) {
        currentMonth.weight += collectionData.weight;
      } else {
        this.waste.monthlyWeight.push({
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          weight: collectionData.weight
        });
      }
    }
    
    if (collectionData.rating) {
      const totalRated = this.collections.completed;
      const currentAvg = this.collections.averageRating;
      this.collections.averageRating = 
        ((currentAvg * (totalRated - 1)) + collectionData.rating) / totalRated;
    }
  } else if (collectionData.status === 'cancelled') {
    this.collections.cancelled += 1;
  } else if (collectionData.status === 'rescheduled') {
    this.collections.rescheduled += 1;
  }
  
  return this.save();
};

customerAnalyticsSchema.methods.addWasteCategory = function(category, weight) {
  const existingCategory = this.waste.byCategory.find(c => c.category === category);
  
  if (existingCategory) {
    existingCategory.weight += weight;
    existingCategory.count += 1;
  } else {
    this.waste.byCategory.push({
      category,
      weight,
      count: 1
    });
  }
  
  // Recalculate percentages
  const totalWeight = this.waste.totalWeight;
  this.waste.byCategory.forEach(cat => {
    cat.percentage = totalWeight > 0 ? Math.round((cat.weight / totalWeight) * 100) : 0;
  });
  
  return this.save();
};

customerAnalyticsSchema.methods.addPoints = function(points, reason) {
  this.engagement.totalPoints += points;
  this.engagement.availablePoints += points;
  
  // Update loyalty tier based on total points
  if (this.engagement.totalPoints >= 5000) {
    this.engagement.loyaltyTier = 'platinum';
  } else if (this.engagement.totalPoints >= 2000) {
    this.engagement.loyaltyTier = 'gold';
  } else if (this.engagement.totalPoints >= 500) {
    this.engagement.loyaltyTier = 'silver';
  }
  
  return this.save();
};

customerAnalyticsSchema.methods.calculateEnvironmentalImpact = function() {
  const totalWeight = this.waste.totalWeight;
  
  // Carbon savings calculation (approximate)
  this.waste.environmental.carbonSaved = Math.round(totalWeight * 0.5); // 0.5 kg CO2 per kg waste
  
  // Trees equivalent calculation
  this.waste.environmental.treesEquivalent = Math.round(totalWeight * 0.02); // 1 tree per 50kg
  
  // Energy savings calculation
  this.waste.environmental.energySaved = Math.round(totalWeight * 2); // 2 kWh per kg
  
  // Water savings calculation
  this.waste.environmental.waterSaved = Math.round(totalWeight * 10); // 10L per kg
  
  return this.save();
};

customerAnalyticsSchema.methods.calculateChurnRisk = function() {
  let riskScore = 0;
  const factors = [];
  
  // Recent activity (last 30 days)
  const recentCollections = this.collections.monthly
    .filter(m => {
      const monthDate = new Date(m.year, m.month - 1);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return monthDate >= thirtyDaysAgo;
    })
    .reduce((sum, m) => sum + m.count, 0);
  
  if (recentCollections === 0) {
    riskScore += 40;
    factors.push('No recent collections');
  } else if (recentCollections < 2) {
    riskScore += 20;
    factors.push('Low collection frequency');
  }
  
  // Service issues
  if (this.service.issueResolutionRate < 80) {
    riskScore += 25;
    factors.push('Poor issue resolution');
  }
  
  // Satisfaction
  if (this.service.averageSatisfaction < 3) {
    riskScore += 20;
    factors.push('Low satisfaction scores');
  }
  
  // Payment issues
  if (this.financial.outstandingBalance > 0) {
    riskScore += 15;
    factors.push('Outstanding payments');
  }
  
  this.predictions.churnRisk = {
    score: Math.min(riskScore, 100),
    factors,
    lastCalculated: new Date()
  };
  
  return this.save();
};

// Static methods
customerAnalyticsSchema.statics.getOrCreate = async function(customerId) {
  let analytics = await this.findOne({ customer: customerId });
  
  if (!analytics) {
    analytics = new this({ customer: customerId });
    await analytics.save();
  }
  
  return analytics;
};

customerAnalyticsSchema.statics.getTopCustomers = function(metric = 'totalWeight', limit = 10) {
  const sortField = `waste.${metric}`;
  return this.find({})
    .populate('customer', 'name email profile')
    .sort({ [sortField]: -1 })
    .limit(limit);
};

customerAnalyticsSchema.statics.getCustomerRankings = async function(customerId) {
  const customer = await this.findOne({ customer: customerId });
  if (!customer) return null;
  
  // Get rankings for different metrics
  const wasteRank = await this.countDocuments({
    'waste.totalWeight': { $gt: customer.waste.totalWeight }
  }) + 1;
  
  const recyclingRank = await this.countDocuments({
    'waste.recycling.recyclingRate': { $gt: customer.waste.recycling.recyclingRate }
  }) + 1;
  
  const pointsRank = await this.countDocuments({
    'engagement.totalPoints': { $gt: customer.engagement.totalPoints }
  }) + 1;
  
  const totalCustomers = await this.countDocuments({});
  
  return {
    wasteReduction: { rank: wasteRank, total: totalCustomers },
    recycling: { rank: recyclingRank, total: totalCustomers },
    points: { rank: pointsRank, total: totalCustomers }
  };
};

customerAnalyticsSchema.statics.getAggregateStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        totalWaste: { $sum: '$waste.totalWeight' },
        totalCollections: { $sum: '$collections.total' },
        totalPoints: { $sum: '$engagement.totalPoints' },
        avgSatisfaction: { $avg: '$service.averageSatisfaction' },
        avgCompletionRate: { $avg: '$collections.completionRate' }
      }
    }
  ]);
  
  return stats[0] || {};
};

module.exports = mongoose.model('CustomerAnalytics', customerAnalyticsSchema);
