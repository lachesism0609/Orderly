const { db } = require('../config/firebase');

// Get merchant's restaurant info
exports.getRestaurantInfo = async (req, res) => {
    try {
        const merchantId = req.user.uid;

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantDoc = snapshot.docs[0];
        const restaurant = {
            id: restaurantDoc.id,
            ...restaurantDoc.data()
        };

        res.json({
            success: true,
            data: restaurant
        });
    } catch (error) {
        console.error('Get restaurant info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update restaurant info
exports.updateRestaurantInfo = async (req, res) => {
    try {
        const merchantId = req.user.uid;
        const { name, description, address, phone, openingHours, cuisineType, deliveryFee, minimumOrder, image } = req.body;

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantDoc = snapshot.docs[0];
        const updateData = {
            updatedAt: new Date().toISOString()
        };

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (address) updateData.address = address;
        if (phone) updateData.phone = phone;
        if (openingHours) updateData.openingHours = openingHours;
        if (cuisineType) updateData.cuisineType = cuisineType;
        if (deliveryFee !== undefined) updateData.deliveryFee = deliveryFee;
        if (minimumOrder !== undefined) updateData.minimumOrder = minimumOrder;
        if (image) updateData.image = image;

        await restaurantDoc.ref.update(updateData);

        res.json({
            success: true,
            message: 'Restaurant info updated successfully',
            data: {
                id: restaurantDoc.id,
                ...updateData
            }
        });
    } catch (error) {
        console.error('Update restaurant info error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get menu items
exports.getMenuItems = async (req, res) => {
    try {
        const merchantId = req.user.uid;

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantId = snapshot.docs[0].id;

        // Get menu items
        const menuItemsRef = db.collection('menuItems');
        const menuSnapshot = await menuItemsRef.where('restaurantId', '==', restaurantId).get();

        const menuItems = [];
        menuSnapshot.forEach(doc => {
            menuItems.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            data: menuItems
        });
    } catch (error) {
        console.error('Get menu items error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Add menu item
exports.addMenuItem = async (req, res) => {
    try {
        const merchantId = req.user.uid;
        const { name, description, price, category, image, available } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: 'Name and price are required'
            });
        }

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantId = snapshot.docs[0].id;

        // Create menu item
        const menuItem = {
            restaurantId,
            name,
            description: description || '',
            price: parseFloat(price),
            category: category || 'Other',
            image: image || '',
            available: available !== undefined ? available : true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const menuItemRef = await db.collection('menuItems').add(menuItem);

        res.status(201).json({
            success: true,
            message: 'Menu item added successfully',
            data: {
                id: menuItemRef.id,
                ...menuItem
            }
        });
    } catch (error) {
        console.error('Add menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const merchantId = req.user.uid;
        const { itemId } = req.params;
        const { name, description, price, category, image, available } = req.body;

        // Get menu item
        const menuItemRef = db.collection('menuItems').doc(itemId);
        const menuItemDoc = await menuItemRef.get();

        if (!menuItemDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Verify ownership
        const menuItem = menuItemDoc.data();
        const restaurantRef = db.collection('restaurants').doc(menuItem.restaurantId);
        const restaurantDoc = await restaurantRef.get();

        if (!restaurantDoc.exists || restaurantDoc.data().ownerId !== merchantId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this menu item'
            });
        }

        // Update menu item
        const updateData = {
            updatedAt: new Date().toISOString()
        };

        if (name) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (price) updateData.price = parseFloat(price);
        if (category) updateData.category = category;
        if (image !== undefined) updateData.image = image;
        if (available !== undefined) updateData.available = available;

        await menuItemRef.update(updateData);

        res.json({
            success: true,
            message: 'Menu item updated successfully',
            data: {
                id: itemId,
                ...updateData
            }
        });
    } catch (error) {
        console.error('Update menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
    try {
        const merchantId = req.user.uid;
        const { itemId } = req.params;

        // Get menu item
        const menuItemRef = db.collection('menuItems').doc(itemId);
        const menuItemDoc = await menuItemRef.get();

        if (!menuItemDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Verify ownership
        const menuItem = menuItemDoc.data();
        const restaurantRef = db.collection('restaurants').doc(menuItem.restaurantId);
        const restaurantDoc = await restaurantRef.get();

        if (!restaurantDoc.exists || restaurantDoc.data().ownerId !== merchantId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this menu item'
            });
        }

        await menuItemRef.delete();

        res.json({
            success: true,
            message: 'Menu item deleted successfully'
        });
    } catch (error) {
        console.error('Delete menu item error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get merchant's orders
exports.getOrders = async (req, res) => {
    try {
        const merchantId = req.user.uid;
        const { status } = req.query;

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantId = snapshot.docs[0].id;

        // Get orders
        let ordersQuery = db.collection('orders').where('restaurantId', '==', restaurantId);

        if (status) {
            ordersQuery = ordersQuery.where('status', '==', status);
        }

        const ordersSnapshot = await ordersQuery.get();

        const orders = await Promise.all(ordersSnapshot.docs.map(async (doc) => {
            const orderData = doc.data();
            let customerName = orderData.customerName;
            let customerPhone = orderData.customerPhone;

            // If customer info is missing, try to fetch it from users collection
            if ((!customerName || !customerPhone) && orderData.userId) {
                try {
                    const userDoc = await db.collection('users').doc(orderData.userId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (!customerName) customerName = userData.displayName || userData.email;
                        if (!customerPhone) customerPhone = userData.phone || userData.phoneNumber || userData.phone_number;
                    }
                } catch (err) {
                    console.error(`Error fetching user ${orderData.userId}:`, err);
                }
            }

            return {
                id: doc.id,
                ...orderData,
                customerName: customerName || 'Anonymous',
                customerPhone: customerPhone || 'N/A',
                // Handle Firestore Timestamp conversion safely
                createdAt: orderData.createdAt && typeof orderData.createdAt.toDate === 'function'
                    ? orderData.createdAt.toDate().toISOString()
                    : (orderData.createdAt || new Date().toISOString())
            };
        }));

        // Sort in memory
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const merchantId = req.user.uid;
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Get order
        const orderRef = db.collection('orders').doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Verify ownership
        const order = orderDoc.data();
        const restaurantRef = db.collection('restaurants').doc(order.restaurantId);
        const restaurantDoc = await restaurantRef.get();

        if (!restaurantDoc.exists || restaurantDoc.data().ownerId !== merchantId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        // Update order status
        await orderRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Order status updated successfully',
            data: {
                id: orderId,
                status
            }
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get reviews for merchant's restaurant
exports.getReviews = async (req, res) => {
    try {
        const merchantId = req.user.uid;

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantId = snapshot.docs[0].id;

        // Get reviews
        const reviewsRef = db.collection('reviews');
        const reviewsSnapshot = await reviewsRef
            .where('restaurantId', '==', restaurantId)
            .orderBy('createdAt', 'desc')
            .get();

        const reviews = [];
        for (const doc of reviewsSnapshot.docs) {
            const reviewData = doc.data();

            // Get user info
            let userName = 'Anonymous';
            if (reviewData.userId) {
                try {
                    const userDoc = await db.collection('users').doc(reviewData.userId).get();
                    if (userDoc.exists) {
                        userName = userDoc.data().displayName || userDoc.data().email || 'User';
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }

            reviews.push({
                id: doc.id,
                ...reviewData,
                userName
            });
        }

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get merchant statistics
exports.getStatistics = async (req, res) => {
    try {
        const merchantId = req.user.uid;

        // Find restaurant owned by this merchant
        const restaurantsRef = db.collection('restaurants');
        const snapshot = await restaurantsRef.where('ownerId', '==', merchantId).get();

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        const restaurantDoc = snapshot.docs[0];
        const restaurantId = restaurantDoc.id;
        const restaurantData = restaurantDoc.data();

        // Get menu items count
        const menuItemsRef = db.collection('menuItems').where('restaurantId', '==', restaurantId);
        const menuSnapshot = await menuItemsRef.count().get();
        const menuItemsCount = menuSnapshot.data().count;

        // Get order statistics
        const ordersRef = db.collection('orders').where('restaurantId', '==', restaurantId);
        const allOrders = await ordersRef.get();

        let totalOrders = 0;
        let totalRevenue = 0;
        let pendingOrders = 0;
        let completedOrders = 0;
        let ordersByStatus = {};

        allOrders.forEach(doc => {
            const order = doc.data();
            totalOrders++;
            if (order.total) {
                totalRevenue += order.total;
            }

            // Count by status
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;

            // Count specific statuses
            if (order.status === 'pending') pendingOrders++;
            if (order.status === 'completed' || order.status === 'delivered') completedOrders++;
        });

        // Get reviews statistics
        const reviewsRef = db.collection('reviews').where('restaurantId', '==', restaurantId);
        const allReviews = await reviewsRef.get();

        let totalRating = 0;
        let reviewCount = 0;
        let averageRating = 0;

        if (!allReviews.empty) {
            allReviews.forEach(doc => {
                const review = doc.data();
                if (review.rating) {
                    totalRating += review.rating;
                    reviewCount++;
                }
            });
            averageRating = reviewCount > 0 ? (totalRating / reviewCount).toFixed(1) : 0;
        } else {
            // Fallback to restaurant data if no reviews exist (for demo purposes)
            averageRating = restaurantData.rating || 0;
            reviewCount = restaurantData.reviewCount || 0;
        }

        res.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                completedOrders,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                menuItems: menuItemsCount,
                ordersByStatus,
                averageRating: parseFloat(averageRating),
                reviewCount
            }
        });
    } catch (error) {
        console.error('Get statistics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
