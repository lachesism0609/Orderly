import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import api from '../services/api';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isMerchant, setIsMerchant] = useState(false);

    // Fetch user profile and role from backend
    const fetchUserProfile = async (token) => {
        try {
            const response = await api.get('/auth/profile');
            if (response.success && response.user) {
                setUserRole(response.user.role);
                setIsMerchant(response.user.role === 'merchant' || response.user.role === 'admin');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            // If error, assume regular user
            setUserRole('customer');
            setIsMerchant(false);
        }
    };

    const signup = async (email, password, firstName, lastName, role = 'customer') => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user profile in backend
        try {
            await api.post('/auth/register', {
                uid: user.uid,
                email: user.email,
                firstName,
                lastName,
                role: role
            });
        } catch (error) {
            console.error('Error creating user profile:', error);
            // Don't throw here to allow the signup to "succeed" from Firebase perspective,
            // but ideally we should handle this better (e.g., delete firebase user or retry)
        }

        return userCredential;
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Get the ID token
                const token = await user.getIdToken();
                localStorage.setItem('authToken', token);
                setAuthToken(token);
                setCurrentUser(user);

                // Fetch user role from backend
                await fetchUserProfile(token);
            } else {
                localStorage.removeItem('authToken');
                setAuthToken(null);
                setCurrentUser(null);
                setUserRole(null);
                setIsMerchant(false);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        authToken,
        userRole,
        isMerchant,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;