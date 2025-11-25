const express = require('express');
const router = express.Router();
const { verifyToken, requireMerchant } = require('../middleware/auth');
const merchantController = require('../controllers/merchantController');

// All routes require authentication and merchant role
router.use(verifyToken);
router.use(requireMerchant);

// Restaurant info routes
router.get('/restaurant', merchantController.getRestaurantInfo);
router.put('/restaurant', merchantController.updateRestaurantInfo);

// Menu management routes
router.get('/menu', merchantController.getMenuItems);
router.post('/menu', merchantController.addMenuItem);
router.put('/menu/:itemId', merchantController.updateMenuItem);
router.delete('/menu/:itemId', merchantController.deleteMenuItem);

// Order management routes
router.get('/orders', merchantController.getOrders);
router.put('/orders/:orderId/status', merchantController.updateOrderStatus);

// Reviews routes
router.get('/reviews', merchantController.getReviews);

// Statistics routes
router.get('/stats', merchantController.getStatistics);

module.exports = router;
