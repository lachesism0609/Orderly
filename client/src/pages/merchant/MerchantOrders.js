import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

function MerchantOrders() {
    const { t, i18n } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const orderStatuses = {
        pending: { label: t('orders.status.pending'), color: 'bg-yellow-100 text-yellow-800' },
        confirmed: { label: t('orders.status.confirmed'), color: 'bg-blue-100 text-blue-800' },
        preparing: { label: t('orders.status.preparing'), color: 'bg-orange-100 text-orange-800' },
        ready: { label: t('orders.status.ready'), color: 'bg-purple-100 text-purple-800' },
        delivered: { label: t('orders.status.delivered'), color: 'bg-green-100 text-green-800' },
        cancelled: { label: t('orders.status.cancelled'), color: 'bg-red-100 text-red-800' }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/merchant/orders');
            // Ensure response.data is an array
            setOrders(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/merchant/orders/${orderId}/status`, { status: newStatus });
            await fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert(t('common.error'));
        }
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(order => order.status === filterStatus);

    const formatPrice = (price) => {
        return `€${parseFloat(price).toFixed(2)}`;
    };

    const formatDateTime = (timestamp) => {
        return new Date(timestamp).toLocaleString(i18n.language === 'zh' ? 'zh-CN' : 'en-US');
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('merchant.orders.title')}</h1>
                    <button
                        onClick={fetchOrders}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
                    >
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t('merchant.orders.refresh')}
                    </button>
                </div>

                {/* 状态筛选 */}
                <div className="mb-6 bg-white rounded-lg shadow p-4">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === 'all'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {t('merchant.orders.allOrders')}
                        </button>
                        {Object.entries(orderStatuses).map(([status, config]) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg transition-colors ${filterStatus === status
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {config.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 订单列表 */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="mt-4 text-lg text-gray-600">{t('merchant.orders.noOrders')}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {t('orders.orderNumber')} #{order.id?.slice(-8) || 'N/A'}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[order.status]?.color}`}>
                                                    {orderStatuses[order.status]?.label}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p><span className="font-medium">{t('merchant.orders.customer')}{t('common.labelSeparator')}</span>{order.customerName || t('merchant.reviews.anonymous')}</p>
                                                <p><span className="font-medium">{t('merchant.orders.orderTime')}{t('common.labelSeparator')}</span>{formatDateTime(order.createdAt)}</p>
                                                <p><span className="font-medium">{t('merchant.orders.total')}{t('common.labelSeparator')}</span>{formatPrice(order.total)}</p>
                                                <p><span className="font-medium">{t('merchant.orders.items')}{t('common.labelSeparator')}</span>{order.items?.length || 0}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 ml-6">
                                            <button
                                                onClick={() => viewOrderDetails(order)}
                                                className="text-orange-600 hover:text-orange-700 font-medium"
                                            >
                                                {t('merchant.orders.actions.viewDetails')}
                                            </button>
                                            {order.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'confirmed')}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                                    >
                                                        {t('merchant.orders.actions.confirm')}
                                                    </button>
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        {t('merchant.orders.actions.cancel')}
                                                    </button>
                                                </>
                                            )}
                                            {order.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                                                >
                                                    {t('merchant.orders.actions.startPreparing')}
                                                </button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'ready')}
                                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                                                >
                                                    {t('merchant.orders.actions.finishPreparing')}
                                                </button>
                                            )}
                                            {order.status === 'ready' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                                >
                                                    {t('merchant.orders.actions.complete')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 订单详情模态框 */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {t('merchant.orders.details.title')} #{selectedOrder.id?.slice(-8) || 'N/A'}
                            </h2>
                            <button
                                onClick={() => setShowOrderDetails(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* 订单信息 */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">{t('merchant.orders.details.info')}</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                    <p><span className="font-medium">{t('merchant.orders.details.status')}{t('common.labelSeparator')}</span>
                                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[selectedOrder.status]?.color}`}>
                                            {orderStatuses[selectedOrder.status]?.label}
                                        </span>
                                    </p>
                                    <p><span className="font-medium">{t('merchant.orders.details.customerName')}{t('common.labelSeparator')}</span>{selectedOrder.customerName || t('merchant.reviews.anonymous')}</p>
                                    <p><span className="font-medium">{t('merchant.orders.details.phone')}{t('common.labelSeparator')}</span>{selectedOrder.customerPhone || 'N/A'}</p>
                                    <p><span className="font-medium">{t('merchant.orders.orderTime')}{t('common.labelSeparator')}</span>{formatDateTime(selectedOrder.createdAt)}</p>
                                    <p><span className="font-medium">{t('merchant.orders.details.notes')}{t('common.labelSeparator')}</span>{selectedOrder.notes || t('common.none')}</p>
                                </div>
                            </div>

                            {/* 订单商品 */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">{t('merchant.orders.details.products')}</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">{item.description}</p>
                                                    <p className="text-sm text-gray-600">{t('merchant.orders.details.quantity')}{t('common.labelSeparator')}{item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{formatPrice(item.price)}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {t('merchant.orders.details.subtotal')}{t('common.labelSeparator')}{formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 价格汇总 */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center text-lg font-semibold">
                                    <span>{t('merchant.orders.total')}{t('common.labelSeparator')}</span>
                                    <span className="text-orange-600">{formatPrice(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MerchantOrders;