import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';

const Orders = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    // Toast State
    const [toast, setToast] = useState(null);

    // Details Modal State
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get('/orders');
            setOrders(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser, fetchOrders]);

    const getStatusText = (status) => {
        return t(`orders.status.${status}`);
    };

    const getStatusColor = (status) => {
        const colorMap = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-green-100 text-green-800',
            delivered: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colorMap[status] || 'bg-gray-100 text-gray-800';
    };

    const openDetailsModal = (order) => {
        setSelectedOrderForDetails(order);
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOrderForDetails(null);
    };

    const openReviewModal = (order) => {
        setSelectedOrderForReview(order);
        setReviewRating(5);
        setReviewComment('');
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedOrderForReview(null);
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!selectedOrderForReview) return;

        try {
            setSubmittingReview(true);

            const reviewData = {
                orderId: selectedOrderForReview.id,
                rating: reviewRating,
                comment: reviewComment,
                restaurantId: selectedOrderForReview.restaurantId || 'fresh-fusion' // Fallback if missing
            };

            await api.post('/reviews', reviewData);
            // Refresh orders to get updated status
            fetchOrders();

            setToast({
                message: t('orders.reviewModal.success'),
                type: 'success'
            });
            closeReviewModal();
        } catch (error) {
            console.error('Error submitting review:', error);
            setToast({
                message: t('common.error'),
                type: 'error'
            });
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {t('orders.title')}
            </h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('orders.noOrders')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('orders.noOrdersDesc')}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-3">
                                        {order.restaurantImage && (
                                            <img
                                                src={order.restaurantImage}
                                                alt={order.restaurantName}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                        )}
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {order.restaurantName || 'Restaurant'}
                                        </h3>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusText(order.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500 ml-13 pl-13">
                                    <span>{t('orders.orderNumber')} #{order.id}</span>
                                    <span>{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-2">
                                            <div className="flex items-center flex-1">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-16 h-16 rounded-md object-cover mr-4 border border-gray-100"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-gray-500 text-sm">x{item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-semibold text-gray-900">
                                            {t('cart.total')}:
                                        </span>
                                        <span className="text-xl font-bold text-primary-600">
                                            €{order.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="flex gap-3 mt-4">
                                    <button
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                        onClick={() => openDetailsModal(order)}
                                    >
                                        {t('orders.viewDetails')}
                                    </button>
                                    {order.status === 'delivered' && (
                                        <>
                                            <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
                                                {t('orders.orderAgain')}
                                            </button>
                                            {order.isReviewed ? (
                                                <button
                                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed"
                                                    disabled
                                                >
                                                    {t('orders.reviewed')}
                                                </button>
                                            ) : (
                                                <button
                                                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                                                    onClick={() => openReviewModal(order)}
                                                >
                                                    {t('orders.writeReview')}
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {(order.status === 'pending' || order.status === 'confirmed') && (
                                        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                                            {t('orders.cancelOrder')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {t('orders.reviewModal.title')}
                            </h3>
                            <button
                                onClick={closeReviewModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={submitReview}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('orders.reviewModal.rating')}
                                </label>
                                <div className="flex space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            className={`focus:outline-none transition-colors ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('orders.reviewModal.comment')}
                                </label>
                                <textarea
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                                    placeholder={t('orders.reviewModal.placeholder')}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={closeReviewModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    disabled={submittingReview}
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50"
                                    disabled={submittingReview}
                                >
                                    {submittingReview ? t('common.loading') : t('orders.reviewModal.submit')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {showDetailsModal && selectedOrderForDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">
                                {t('orders.viewDetails')} - #{selectedOrderForDetails.id}
                            </h3>
                            <button
                                onClick={closeDetailsModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Restaurant Info */}
                            <div className="flex items-center space-x-4 pb-6 border-b">
                                {selectedOrderForDetails.restaurantImage && (
                                    <img
                                        src={selectedOrderForDetails.restaurantImage}
                                        alt={selectedOrderForDetails.restaurantName}
                                        className="w-16 h-16 rounded-full object-cover border border-gray-200"
                                    />
                                )}
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{selectedOrderForDetails.restaurantName}</h4>
                                    <p className="text-gray-500">{new Date(selectedOrderForDetails.date).toLocaleString()}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrderForDetails.status)}`}>
                                        {getStatusText(selectedOrderForDetails.status)}
                                    </span>
                                </div>
                            </div>

                            {/* Items List */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-4">{t('cart.title')}</h4>
                                <div className="space-y-4">
                                    {selectedOrderForDetails.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center flex-1">
                                                {item.image && (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-12 h-12 rounded-md object-cover mr-4 border border-gray-100"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-gray-500 text-sm">€{item.price.toFixed(2)} x {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('merchant.orders.details.subtotal')}</span>
                                    <span>€{selectedOrderForDetails.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{t('merchant.settings.form.deliveryFee')}</span>
                                    <span>€0.00</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                                    <span>{t('cart.total')}</span>
                                    <span>€{selectedOrderForDetails.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 flex justify-end">
                            <button
                                onClick={closeDetailsModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                {t('common.close') || 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;