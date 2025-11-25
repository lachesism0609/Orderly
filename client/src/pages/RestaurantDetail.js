import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const RestaurantDetail = () => {
    const { t } = useTranslation();
    const { restaurantId } = useParams();
    const { addItem } = useCart();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                setLoading(true);
                const [restaurantRes, menuRes] = await Promise.all([
                    api.get(`/restaurants/${restaurantId}`),
                    api.get(`/restaurants/${restaurantId}/menu`)
                ]);

                if (restaurantRes.success) {
                    setRestaurant(restaurantRes.data);
                }

                if (menuRes.success) {
                    setMenuItems(menuRes.data);
                }
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (restaurantId) {
            fetchRestaurantData();
        }
    }, [restaurantId]);

    // Get all categories
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];

    // Filter menu items
    const filteredItems = selectedCategory === 'All'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory);

    const handleAddToCart = (item) => {
        addItem({
            id: item.id,
            name: item.name || item.title, // Handle both naming conventions
            price: item.price,
            image: item.image || item.imageUrl, // Handle both image properties, prioritize image
            restaurantId: restaurant.id,
            restaurantName: restaurant.name
        });
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

    if (!restaurant) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Restaurant not found</p>
                    <Link to="/restaurants" className="text-primary-600 hover:underline mt-4 block">
                        {t('restaurantDetail.backToRestaurants')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back button */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link
                        to="/restaurants"
                        className="inline-flex items-center text-primary-600 hover:text-primary-700"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('restaurantDetail.backToRestaurants')}
                    </Link>
                </div>
            </div>

            {/* Restaurant header info */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full md:w-64 h-48 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
                            <p className="text-gray-600 mb-4">{restaurant.description}</p>

                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="font-semibold">{restaurant.rating}</span>
                                    <span className="text-gray-500 ml-1">({restaurant.reviewCount} {t('restaurants.reviews')})</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {restaurant.deliveryTime}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {restaurant.minOrder} {t('restaurants.minOrder')}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <div>
                                        <div className="font-semibold">{t('restaurantDetail.address')}</div>
                                        <div className="text-gray-600">{restaurant.address}</div>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <div className="font-semibold">{t('restaurantDetail.hours')}</div>
                                        <div className="text-gray-600">{typeof restaurant.hours === 'object' ? restaurant.hours.en : restaurant.hours}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('restaurantDetail.menu')}</h2>

                {/* Category filter */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${selectedCategory === category
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Menu items grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                                <img
                                    src={item.image || item.imageUrl}
                                    alt={item.name || item.title}
                                    className="w-full h-48 object-cover"
                                />
                                {item.isSpecial && (
                                    <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                        {t('restaurantDetail.special')}
                                    </span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{item.name || item.title}</h3>
                                    <span className="text-lg font-bold text-primary-600">€{item.price}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                                {/* Dietary flags */}
                                {item.dietaryFlags && item.dietaryFlags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {item.dietaryFlags.map((flag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded"
                                            >
                                                {flag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Ingredients */}
                                {item.ingredients && item.ingredients.length > 0 && (
                                    <div className="text-xs text-gray-500 mb-3">
                                        <span className="font-semibold">{t('restaurantDetail.ingredients')}:</span> {item.ingredients.join(', ')}
                                    </div>
                                )}

                                <button
                                    onClick={() => handleAddToCart(item)}
                                    disabled={item.available === false}
                                    className={`w-full py-2 rounded-lg font-semibold transition-colors ${item.available !== false
                                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {item.available !== false ? t('menu.addToCart') : t('menu.outOfStock')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetail;