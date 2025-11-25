const { db } = require('../config/firebase');

// Create user profile in Firestore
exports.register = async (req, res) => {
    try {
        const { uid, email, firstName, lastName, role } = req.body;

        if (!uid || !email) {
            return res.status(400).json({
                success: false,
                message: 'UID and email are required'
            });
        }

        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const userData = {
            email,
            firstName: firstName || '',
            lastName: lastName || '',
            displayName: `${firstName || ''} ${lastName || ''}`.trim(),
            role: role || 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await userRef.set(userData);

        res.status(201).json({
            success: true,
            message: 'User profile created successfully',
            user: {
                uid,
                ...userData
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                uid,
                ...userDoc.data()
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
