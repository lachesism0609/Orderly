const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { db, admin } = require('../config/firebase');

// Get all reviews for a specific menu item
router.get('/item/:itemId', async (req, res) => {
    const { itemId } = req.params;
    res.json({
        success: true,
        message: `Get reviews for menu item: ${itemId}`,
        data: []
    });
});

// Get all reviews by authenticated user
router.get('/user', verifyToken, async (req, res) => {
    res.json({
        success: true,
        message: 'Get user reviews',
        data: []
    });
});

// Create new review
router.post('/', verifyToken, async (req, res) => {
    try {
        const { orderId, restaurantId, rating, comment } = req.body;
        const userId = req.user.uid;
        const userName = req.user.displayName || 'Anonymous';

        if (!orderId || !restaurantId || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create review document
        const reviewData = {
            orderId,
            restaurantId,
            userId,
            userName,
            rating,
            comment,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            reply: null
        };

        const reviewRef = await db.collection('reviews').add(reviewData);

        // Update order to mark as reviewed
        await db.collection('orders').doc(orderId).update({
            isReviewed: true
        });

        // Update restaurant stats (optional but recommended)
        // This could be done via a Cloud Function trigger ideally, but here's a simple version
        /*
        const restaurantRef = db.collection('restaurants').doc(restaurantId);
        await db.runTransaction(async (t) => {
            const doc = await t.get(restaurantRef);
            if (!doc.exists) return;
            const data = doc.data();
            const newCount = (data.reviewCount || 0) + 1;
            const oldTotal = (data.rating || 0) * (data.reviewCount || 0);
            const newRating = (oldTotal + rating) / newCount;
            t.update(restaurantRef, {
                rating: newRating,
                reviewCount: newCount
            });
        });
        */

        res.json({
            success: true,
            message: 'Review created successfully',
            data: {
                id: reviewRef.id,
                ...reviewData
            }
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update review
router.put('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Review ${id} updated successfully`,
        data: req.body
    });
});

// Delete review
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    res.json({
        success: true,
        message: `Review ${id} deleted successfully`
    });
});

module.exports = router;