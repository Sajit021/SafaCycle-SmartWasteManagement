const express = require('express');
const router = express.Router();
const IssueReport = require('../models/IssueReport');
const User = require('../models/User');
const CollectionRequest = require('../models/CollectionRequest');
const Notification = require('../models/Notification');
const { auth, authorize } = require('../middleware/auth');
const { body, param, validationResult } = require('express-validator');

// Validation middleware for issue reports
const validateIssueReport = [
  body('title')
    .notEmpty()
    .withMessage('Issue title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Issue description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('category')
    .isIn([
      'missed-pickup',
      'vehicle-issue',
      'driver-behavior',
      'billing',
      'service-quality',
      'environmental-concern',
      'scheduling',
      'app-technical',
      'waste-sorting',
      'other'
    ])
    .withMessage('Invalid issue category'),
  
  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid severity level'),
  
  body('location.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates must be [longitude, latitude]'),
  
  body('relatedCollectionRequest')
    .optional()
    .isMongoId()
    .withMessage('Invalid collection request ID'),
  
  body('relatedDriver')
    .optional()
    .isMongoId()
    .withMessage('Invalid driver ID'),
  
  body('photos')
    .optional()
    .isArray()
    .withMessage('Photos must be an array of URLs')
];

// @route   POST /api/issues
// @desc    Create new issue report
// @access  Private (Customer)
router.post('/', [auth, authorize('customer'), ...validateIssueReport], async (req, res) => {
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

    // Verify related collection request belongs to customer
    if (req.body.relatedCollectionRequest) {
      const collection = await CollectionRequest.findOne({
        _id: req.body.relatedCollectionRequest,
        customer: req.user._id
      });
      
      if (!collection) {
        return res.status(400).json({
          success: false,
          message: 'Invalid collection request reference'
        });
      }
    }

    // Create issue report
    const issueReport = new IssueReport({
      ...req.body,
      reporter: req.user._id
    });

    await issueReport.save();

    // Create notification for admin
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
      await Notification.create({
        recipient: adminUser._id,
        recipientType: 'admin',
        title: 'New Issue Report',
        message: `${req.user.name} has reported an issue: ${issueReport.title}`,
        type: 'issue-update',
        category: issueReport.severity === 'critical' ? 'error' : 'warning',
        priority: issueReport.severity === 'critical' ? 'urgent' : 'normal',
        relatedIssue: issueReport._id,
        relatedUser: req.user._id,
        actionUrl: `/admin/issues/${issueReport._id}`,
        actionLabel: 'Review Issue'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Issue report created successfully',
      data: { issueReport }
    });

  } catch (error) {
    console.error('Create issue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating issue report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/issues
// @desc    Get issue reports (customer: own issues, admin: all)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      category,
      severity,
      page = 1,
      limit = 10,
      sortBy = '-reportedAt'
    } = req.query;

    let filter = { isDeleted: false };
    
    // Role-based filtering
    if (req.user.role === 'customer') {
      filter.reporter = req.user._id;
    } else if (req.user.role === 'driver') {
      // Drivers can see issues related to them
      filter.$or = [
        { relatedDriver: req.user._id },
        { assignedTo: req.user._id }
      ];
    }

    // Additional filters
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (severity) filter.severity = severity;

    const issues = await IssueReport.find(filter)
      .populate('reporter', 'name email profile.phone')
      .populate('assignedTo', 'name email')
      .populate('relatedCollectionRequest', 'requestId requestedDate')
      .populate('relatedDriver', 'name email')
      .populate('relatedVehicle', 'plateNumber type')
      .populate('comments.user', 'name')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await IssueReport.countDocuments(filter);

    res.json({
      success: true,
      data: {
        issues,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalItems: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get issue reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue reports',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/issues/stats
// @desc    Get issue statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const customerId = req.user.role === 'customer' ? req.user._id : null;
    const stats = await IssueReport.getIssueStats(customerId);

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get issue stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/issues/categories
// @desc    Get issue category statistics (Admin only)
// @access  Private (Admin)
router.get('/categories', [auth, authorize('admin')], async (req, res) => {
  try {
    const categoryStats = await IssueReport.getCategoryStats();

    res.json({
      success: true,
      data: { categoryStats }
    });

  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/issues/:id
// @desc    Get single issue report
// @access  Private
router.get('/:id', [
  auth,
  param('id').isMongoId().withMessage('Valid issue ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    })
      .populate('reporter', 'name email profile.phone')
      .populate('assignedTo', 'name email')
      .populate('relatedCollectionRequest', 'requestId requestedDate')
      .populate('relatedDriver', 'name email')
      .populate('relatedVehicle', 'plateNumber type')
      .populate('comments.user', 'name')
      .populate('resolution.resolvedBy', 'name');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'customer' && issue.reporter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own issue reports.'
      });
    }

    if (req.user.role === 'driver' && 
        (!issue.relatedDriver || issue.relatedDriver._id.toString() !== req.user._id.toString()) &&
        (!issue.assignedTo || issue.assignedTo._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view issues related to you.'
      });
    }

    res.json({
      success: true,
      data: { issue }
    });

  } catch (error) {
    console.error('Get issue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching issue report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/issues/:id
// @desc    Update issue report
// @access  Private (Reporter can update basic info, Admin can update all)
router.put('/:id', [
  auth,
  param('id').isMongoId().withMessage('Valid issue ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    // Check permissions
    if (req.user.role === 'customer') {
      if (issue.reporter.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only update your own issue reports.'
        });
      }

      if (!issue.canBeModified()) {
        return res.status(400).json({
          success: false,
          message: 'Issue report cannot be modified in current status'
        });
      }
    }

    // Update allowed fields based on role
    const allowedFields = req.user.role === 'admin' 
      ? Object.keys(req.body)
      : ['description', 'severity', 'photos', 'customerNotes'];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    Object.assign(issue, updateData);
    await issue.save();

    res.json({
      success: true,
      message: 'Issue report updated successfully',
      data: { issue }
    });

  } catch (error) {
    console.error('Update issue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating issue report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/issues/:id/comments
// @desc    Add comment to issue report
// @access  Private
router.post('/:id/comments', [
  auth,
  param('id').isMongoId().withMessage('Valid issue ID is required'),
  body('message')
    .notEmpty()
    .withMessage('Comment message is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('isInternal')
    .optional()
    .isBoolean()
    .withMessage('isInternal must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      issue.reporter.toString() === req.user._id.toString() ||
      (issue.assignedTo && issue.assignedTo.toString() === req.user._id.toString()) ||
      (issue.relatedDriver && issue.relatedDriver.toString() === req.user._id.toString());

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot comment on this issue.'
      });
    }

    const { message, isInternal = false, attachments = [] } = req.body;

    // Only admin can add internal comments
    const isInternalComment = req.user.role === 'admin' ? isInternal : false;

    await issue.addComment(req.user._id, message, isInternalComment, attachments);

    // Send notification to relevant parties
    const notificationRecipients = [];
    
    if (!isInternalComment) {
      // Notify reporter if not the commenter
      if (issue.reporter.toString() !== req.user._id.toString()) {
        notificationRecipients.push({
          recipient: issue.reporter,
          recipientType: 'customer'
        });
      }
      
      // Notify assigned user if not the commenter
      if (issue.assignedTo && issue.assignedTo.toString() !== req.user._id.toString()) {
        notificationRecipients.push({
          recipient: issue.assignedTo,
          recipientType: 'admin'
        });
      }
    }

    // Create notifications
    for (const notif of notificationRecipients) {
      await Notification.create({
        recipient: notif.recipient,
        recipientType: notif.recipientType,
        title: 'New Comment on Issue',
        message: `${req.user.name} commented on issue: ${issue.title}`,
        type: 'issue-update',
        category: 'info',
        relatedIssue: issue._id,
        relatedUser: req.user._id,
        actionUrl: `/issues/${issue._id}`,
        actionLabel: 'View Issue'
      });
    }

    const updatedIssue = await IssueReport.findById(issue._id)
      .populate('comments.user', 'name');

    res.json({
      success: true,
      message: 'Comment added successfully',
      data: { issue: updatedIssue }
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/issues/:id/assign
// @desc    Assign issue to user (Admin only)
// @access  Private (Admin)
router.post('/:id/assign', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('Valid issue ID is required'),
  body('assignedTo').isMongoId().withMessage('Valid user ID is required'),
  body('department')
    .optional()
    .isIn(['customer-service', 'operations', 'technical', 'billing', 'management'])
    .withMessage('Invalid department')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    const { assignedTo, department = 'customer-service' } = req.body;

    // Verify the assigned user exists
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID for assignment'
      });
    }

    await issue.assignTo(assignedTo, department);

    // Send notification to assigned user
    await Notification.create({
      recipient: assignedTo,
      recipientType: assignedUser.role,
      title: 'Issue Assigned',
      message: `You have been assigned issue: ${issue.title}`,
      type: 'issue-update',
      category: 'info',
      priority: issue.severity === 'critical' ? 'urgent' : 'normal',
      relatedIssue: issue._id,
      actionUrl: `/issues/${issue._id}`,
      actionLabel: 'View Issue'
    });

    const updatedIssue = await IssueReport.findById(issue._id)
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Issue assigned successfully',
      data: { issue: updatedIssue }
    });

  } catch (error) {
    console.error('Assign issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/issues/:id/resolve
// @desc    Resolve issue (Admin/Assigned user)
// @access  Private (Admin/Assigned)
router.post('/:id/resolve', [
  auth,
  param('id').isMongoId().withMessage('Valid issue ID is required'),
  body('summary').notEmpty().withMessage('Resolution summary is required'),
  body('details').optional().isString(),
  body('actionsTaken').optional().isArray(),
  body('preventiveMeasures').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    // Check permissions
    const canResolve = 
      req.user.role === 'admin' ||
      (issue.assignedTo && issue.assignedTo.toString() === req.user._id.toString());

    if (!canResolve) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot resolve this issue.'
      });
    }

    await issue.resolve(req.body, req.user._id);

    // Send notification to reporter
    await Notification.create({
      recipient: issue.reporter,
      recipientType: 'customer',
      title: 'Issue Resolved',
      message: `Your issue "${issue.title}" has been resolved`,
      type: 'issue-update',
      category: 'success',
      relatedIssue: issue._id,
      actionUrl: `/issues/${issue._id}`,
      actionLabel: 'View Resolution'
    });

    const updatedIssue = await IssueReport.findById(issue._id)
      .populate('resolution.resolvedBy', 'name');

    res.json({
      success: true,
      message: 'Issue resolved successfully',
      data: { issue: updatedIssue }
    });

  } catch (error) {
    console.error('Resolve issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/issues/:id/close
// @desc    Close issue (Customer can provide feedback)
// @access  Private
router.post('/:id/close', [
  auth,
  param('id').isMongoId().withMessage('Valid issue ID is required'),
  body('satisfied').optional().isBoolean(),
  body('feedback').optional().isString().isLength({ max: 1000 }),
  body('additionalConcerns').optional().isString().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    // Check permissions
    const canClose = 
      req.user.role === 'admin' ||
      issue.reporter.toString() === req.user._id.toString();

    if (!canClose) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You cannot close this issue.'
      });
    }

    if (issue.status !== 'resolved' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Issue must be resolved before it can be closed'
      });
    }

    await issue.close(req.body);

    res.json({
      success: true,
      message: 'Issue closed successfully',
      data: { issue }
    });

  } catch (error) {
    console.error('Close issue error:', error);
    res.status(500).json({
      success: false,
      message: 'Error closing issue',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/issues/:id
// @desc    Delete issue report (Soft delete)
// @access  Private (Admin only)
router.delete('/:id', [
  auth,
  authorize('admin'),
  param('id').isMongoId().withMessage('Valid issue ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const issue = await IssueReport.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue report not found'
      });
    }

    await issue.softDelete();

    res.json({
      success: true,
      message: 'Issue report deleted successfully'
    });

  } catch (error) {
    console.error('Delete issue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting issue report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
