import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const Restaurants = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('All');
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const response = await api.get('/restaurants');
                if (response.success) {
                    setRestaurants(response.data);
                }
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Get unique cuisine types
    const cuisineTypes = ['All', ...new Set(restaurants.map(r => r.cuisineType))];

    const filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCuisine = selectedCuisine === 'All' || restaurant.cuisineType === selectedCuisine;
        return matchesSearch && matchesCuisine;
    });

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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('restaurants.title')}</h1>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={t('restaurants.searchPlaceholder')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                                value={selectedCuisine}
                                onChange={(e) => setSelectedCuisine(e.target.value)}
                            >
                                {cuisineTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Restaurant Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRestaurants.map((restaurant) => (
                        <Link
                            key={restaurant.id}
                            to={`/restaurants/${restaurant.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
                        >
                            <div className="relative h-48">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-lg shadow text-sm font-semibold flex items-center">
                                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {restaurant.rating}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                                    <span className="text-sm text-gray-500">{restaurant.deliveryTime}</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>{restaurant.cuisineType}</span>
                                    <span>{t('restaurants.minOrder')} €{restaurant.minOrder}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredRestaurants.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">{t('restaurants.noResults')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Restaurants;