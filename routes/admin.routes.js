const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/admin.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// Get admin dashboard stats
router.get('/stats', verifyToken, isAdmin, getDashboardStats);

module.exports = router;
