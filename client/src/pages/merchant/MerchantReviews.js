import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function MerchantReviews() {
    const { t, i18n } = useTranslation();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const response = await api.get('/merchant/reviews');
            // Ensure response.data is an array
            setReviews(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('merchant.reviews.title')}</h1>
                </div>

                {reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p className="mt-4 text-lg text-gray-600">{t('merchant.reviews.noReviews')}</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xl">
                                            {review.userName ? review.userName.charAt(0).toUpperCase() : 'A'}
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {review.userName || t('merchant.reviews.anonymous')}
                                            </h3>
                                            <div className="flex items-center mt-1">
                                                {renderStars(review.rating)}
                                                <span className="ml-2 text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString(i18n.language === 'zh' ? 'zh-CN' : 'en-US')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {review.orderId && (
                                        <span className="text-sm text-gray-500">
                                            {t('orders.orderNumber')} #{review.orderId.slice(-8)}
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                                {review.reply && (
                                    <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-900">{t('merchant.reviews.reply')}{t('common.labelSeparator')}</p>
                                        <p className="mt-1 text-sm text-gray-600">{review.reply}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MerchantReviews;
