import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Toast from '../components/Toast';

const Cart = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { cart, removeItem, updateQuantity, clearCart, getCartTotal } = useCart();
    const { currentUser } = useAuth();
    const [toast, setToast] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!currentUser) {
            setToast({ message: t('cart.loginRequired'), type: 'warning' });
            return;
        }

        if (cart.items.length === 0) return;

        try {
            setIsSubmitting(true);
            // Assuming all items are from the same restaurant for now
            // In a real app, we might want to group by restaurant or block mixed carts
            const restaurantId = cart.items[0].restaurantId;

            if (!restaurantId) {
                console.error('Restaurant ID missing from cart items');
                setToast({ message: t('common.error'), type: 'error' });
                setIsSubmitting(false);
                return;
            }

            const orderData = {
                items: cart.items,
                total: getCartTotal(),
                restaurantId: restaurantId
            };

            const response = await api.post('/orders', orderData);

            if (response.success) {
                setToast({ message: t('cart.checkoutSuccess') || 'Order placed successfully!', type: 'success' });
                clearCart();
                setTimeout(() => {
                    navigate('/orders');
                }, 2000);
            } else {
                setToast({ message: response.message || t('common.error'), type: 'error' });
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            const errorMessage = error.response?.data?.message || t('common.error');
            setToast({ message: errorMessage, type: 'error' });
            setIsSubmitting(false);
        }
    };

    if (cart.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {t('cart.empty')}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {t('cart.emptyDesc')}
                    </p>
                    <Link
                        to="/restaurants"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                        {t('cart.browseRestaurants')}
                    </Link>
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
                {t('cart.title')}
            </h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Cart Items */}
                <div className="divide-y divide-gray-200">
                    {cart.items.map((item) => (
                        <div key={item.id} className="p-6 flex items-center space-x-4">
                            <img
                                src={item.image || item.imageUrl || 'https://via.placeholder.com/80x80?text=Food'}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-md"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/80x80?text=Food';
                                }}
                            />

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {item.name}
                                </h3>
                                <p className="text-gray-600 mt-1">
                                    €{item.price.toFixed(2)} {t('cart.perItem')}
                                </p>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                    </svg>
                                </button>
                                <span className="w-12 text-center font-medium">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-lg font-semibold text-gray-900 w-20 text-right">
                                €{(item.price * item.quantity).toFixed(2)}
                            </div>

                            {/* Remove Button */}
                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-700 transition-colors"
                                title={t('cart.clearCart')}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Cart Summary */}
                <div className="bg-gray-50 px-6 py-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium text-gray-900">
                            {t('cart.total')}:
                        </span>
                        <span className="text-2xl font-bold text-primary-600">
                            €{getCartTotal().toFixed(2)}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={clearCart}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {t('cart.clearCart')}
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                            className={`flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors font-medium ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? t('common.processing') || 'Processing...' : t('cart.checkout')}
                        </button>
                    </div>

                    {!currentUser && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-blue-800 text-sm">
                                <Link to="/login" className="font-medium hover:underline">
                                    {t('nav.login')}
                                </Link>{' '}
                                {t('register.or')}{' '}
                                <Link to="/register" className="font-medium hover:underline">
                                    {t('nav.register')}
                                </Link>{' '}
                                {t('cart.loginToComplete')}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Suggested Items */}
            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {t('cart.youMightLike')}
                </h2>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-600">
                        {t('cart.moreOptions')}
                    </p>
                    <Link
                        to="/restaurants"
                        className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                    >
                        {t('cart.browseRestaurants')} →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;