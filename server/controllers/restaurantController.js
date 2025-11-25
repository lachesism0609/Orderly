const { db } = require('../config/firebase');

exports.getAllRestaurants = async (req, res) => {
    try {
        const snapshot = await db.collection('restaurants')
            .where('isActive', '==', true)
            .get();

        const restaurants = [];
        snapshot.forEach(doc => {
            restaurants.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        console.error('Error getting restaurants:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurants'
        });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await db.collection('restaurants').doc(id).get();

        if (!doc.exists) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        res.json({
            success: true,
            data: {
                id: doc.id,
                ...doc.data()
            }
        });
    } catch (error) {
        console.error('Error getting restaurant:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching restaurant details'
        });
    }
};

exports.getRestaurantMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const snapshot = await db.collection('menuItems')
            .where('restaurantId', '==', id)
            .where('available', '==', true)
            .get();

        const menuItems = [];
        snapshot.forEach(doc => {
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
        console.error('Error getting menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu'
        });
    }
};
