const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { db } = require('../config/firebase');
const admin = require('firebase-admin'); // Ensure admin is imported for serverTimestamp

// Get all orders for authenticated user
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const ordersRef = db.collection('orders');
        const snapshot = await ordersRef
            .where('userId', '==', userId)
            .get();

        const orders = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            orders.push({
                id: doc.id,
                ...data,
                // Convert timestamps to dates if needed, or let frontend handle ISO strings
                date: data.createdAt && typeof data.createdAt.toDate === 'function'
                    ? data.createdAt.toDate().toISOString()
                    : (data.createdAt || new Date().toISOString())
            });
        });

        // Sort in memory to avoid Firestore index requirements
        orders.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            message: 'Get user orders',
            data: orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get order by ID
router.get('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Get order with ID: ${id}`,
        data: {}
    });
});

// Create new order
router.post('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const { items, total, restaurantId } = req.body;
        const customerName = req.user.displayName || req.user.email || 'Anonymous';
        // Try multiple properties for phone number as it varies by provider
        const customerPhone = req.user.phone || req.user.phoneNumber || req.user.phone_number || 'N/A';

        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No items in order'
            });
        }

        if (!restaurantId) {
            return res.status(400).json({
                success: false,
                message: 'Restaurant ID is required'
            });
        }

        const order = {
            userId,
            customerName,
            customerPhone,
            restaurantId,
            items,
            total,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(), // Use server timestamp
            updatedAt: new Date().toISOString(),
            customerName, // Explicitly include customerName
            customerPhone // Explicitly include customerPhone
        };

        // Add restaurant name if available in items (optional, but good for display)
        if (items[0] && items[0].restaurant) {
            order.restaurantName = items[0].restaurant;
        }

        const orderRef = await db.collection('orders').add(order);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                id: orderRef.id,
                ...order
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update order status (admin only)
router.put('/:id/status', verifyToken, async (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Order ${id} status updated successfully`,
        data: req.body
    });
});

// Get all orders (admin only)
router.get('/admin/all', verifyToken, async (req, res) => {
    res.json({
        success: true,
        message: 'Get all orders for admin',
        data: []
    });
});

module.exports = router;