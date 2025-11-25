import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import MerchantRoute from './components/MerchantRoute';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import MerchantMenu from './pages/merchant/MerchantMenu';
import MerchantOrders from './pages/merchant/MerchantOrders';
import MerchantReviews from './pages/merchant/MerchantReviews';
import MerchantSettings from './pages/merchant/MerchantSettings';
import './utils/i18n';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Navbar />
            <main className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurants/:restaurantId" element={<RestaurantDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <Orders />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                {/* Merchant Routes */}
                <Route
                  path="/merchant/dashboard"
                  element={
                    <MerchantRoute>
                      <MerchantDashboard />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/menu"
                  element={
                    <MerchantRoute>
                      <MerchantMenu />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/orders"
                  element={
                    <MerchantRoute>
                      <MerchantOrders />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/reviews"
                  element={
                    <MerchantRoute>
                      <MerchantReviews />
                    </MerchantRoute>
                  }
                />
                <Route
                  path="/merchant/settings"
                  element={
                    <MerchantRoute>
                      <MerchantSettings />
                    </MerchantRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
