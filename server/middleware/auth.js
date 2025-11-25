const { auth, db } = require('../config/firebase');

// Verify Firebase ID token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify the token with Firebase Admin
        const decodedToken = await auth.verifyIdToken(token);

        // Fetch user role from Firestore
        try {
            const userDoc = await db.collection('users').doc(decodedToken.uid).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                req.user = {
                    ...decodedToken,
                    role: userData.role || 'customer',
                    displayName: userData.displayName || decodedToken.name,
                    email: userData.email || decodedToken.email,
                    phone: userData.phone || userData.phoneNumber || decodedToken.phone_number || ''
                };
            } else {
                // User document doesn't exist, use default role
                req.user = {
                    ...decodedToken,
                    role: 'customer',
                    phone: decodedToken.phone_number || ''
                };
            }
        } catch (firestoreError) {
            console.error('Error fetching user from Firestore:', firestoreError);
            // If Firestore fetch fails, use decoded token only
            req.user = {
                ...decodedToken,
                role: 'customer',
                phone: decodedToken.phone_number || ''
            };
        }

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Check if user is admin (you can customize this logic)
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user has admin role (you can store this in user's custom claims)
        if (!req.user.admin && !req.user.role === 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Check if user is merchant
const requireMerchant = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user has merchant role
        if (req.user.role !== 'merchant' && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Merchant access required'
            });
        }

        next();
    } catch (error) {
        console.error('Merchant check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    verifyToken,
    requireAdmin,
    requireMerchant
};