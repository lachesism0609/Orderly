import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function MerchantRoute({ children }) {
    const { t } = useTranslation();
    const { currentUser, loading } = useAuth();
    const [isMerchant, setIsMerchant] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkMerchantRole = async () => {
            if (!currentUser) {
                setChecking(false);
                return;
            }

            try {
                // 调用后端API验证用户是否为商家
                const response = await api.get('/auth/profile');
                setIsMerchant(response.user?.role === 'merchant');
            } catch (error) {
                console.error('Error checking merchant role:', error);
                setIsMerchant(false);
            } finally {
                setChecking(false);
            }
        };

        checkMerchantRole();
    }, [currentUser]);

    if (loading || checking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (!isMerchant) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('merchant.route.accessDenied')}</h1>
                    <p className="text-gray-600 mb-4">{t('merchant.route.notMerchant')}</p>
                    <a href="/" className="text-orange-500 hover:text-orange-600">{t('merchant.route.backHome')}</a>
                </div>
            </div>
        );
    }

    return children;
}

export default MerchantRoute;
