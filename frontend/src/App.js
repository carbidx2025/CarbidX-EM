import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Car, 
  Gavel, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  Shield, 
  TrendingDown,
  TrendingUp,
  User,
  LogOut,
  Plus,
  Eye,
  Timer,
  Award,
  Search,
  Filter,
  Bell,
  Activity,
  Home,
  Heart,
  Settings,
  ChevronRight,
  Play,
  BarChart3,
  Zap,
  Grid,
  List,
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  RefreshCw,
  FileText,
  TrendingDown as BidIcon,
  Users as UsersIcon,
  ShoppingCart,
  Database
} from 'lucide-react';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API}/login`, credentials);
      const { access_token } = response.data;
      
      setToken(access_token);
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API}/register`, userData);
      const { access_token } = response.data;
      
      setToken(access_token);
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUser();
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();

  const handleAnyClick = () => {
    navigate('/login');
  };

  const auctionCars = [
    {
      id: 1,
      title: 'Mercedes-Benz C-Class AMG',
      year: '2022',
      location: 'Abu Dhabi, UAE',
      mileage: '22,000 km',
      fuelType: 'Gasoline',
      currentBid: 49000,
      startingPrice: 45000,
      condition: 'Good',
      timeRemaining: '2h 50m',
      bidCount: 15,
      viewCount: 15,
      priceIncrease: 8.9,
      features: ['AMG Package', 'Sport Suspension', '+2 more'],
      hasVideo: true,
      isHot: false,
      isFavorite: false,
      bidProgress: 60,
      image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: 'BMW X5 M Competition',
      year: '2023',
      location: 'Dubai, UAE',
      mileage: '15,000 km',
      fuelType: 'Gasoline',
      currentBid: 87500,
      startingPrice: 75000,
      condition: 'Excellent',
      timeRemaining: '4h 50m',
      bidCount: 28,
      viewCount: 28,
      priceIncrease: 16.7,
      features: ['Panoramic Sunroof', 'Navigation System', '+3 more'],
      hasVideo: true,
      isHot: true,
      isFavorite: true,
      bidProgress: 85,
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Audi A4 Quattro',
      year: '2023',
      location: 'Sharjah, UAE',
      mileage: '8,500 km',
      fuelType: 'Gasoline',
      currentBid: 60000,
      startingPrice: 55000,
      condition: 'Excellent',
      timeRemaining: '7h 50m',
      bidCount: 22,
      viewCount: 22,
      priceIncrease: 9.1,
      features: ['Quattro AWD', 'Virtual Cockpit', '+2 more'],
      hasVideo: true,
      isHot: false,
      isFavorite: false,
      bidProgress: 70,
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">CarBidX</h1>
              <p className="text-gray-600">Live Auctions ({auctionCars.length} vehicles)</p>
            </div>
          </div>
          <button 
            onClick={handleAnyClick}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Auctions
          </button>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctionCars.map((car) => (
            <div 
              key={car.id}
              onClick={handleAnyClick}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              {/* Car Image */}
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.title}
                  className="w-full h-64 object-cover"
                />
                
                {/* Overlays */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  {car.hasVideo && (
                    <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                      <Play className="h-3 w-3" />
                      <span>Video</span>
                    </div>
                  )}
                </div>
                
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-sm font-medium text-white ${
                    car.condition === 'Excellent' ? 'bg-green-500' : 
                    car.condition === 'Good' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}>
                    {car.condition}
                  </div>
                  <button className="bg-white rounded-full p-1.5 hover:bg-gray-100">
                    <Heart className={`h-4 w-4 ${car.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                </div>

                {car.isHot && (
                  <div className="absolute top-12 right-3">
                    <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center space-x-1">
                      <span>🔥</span>
                      <span>HOT</span>
                    </div>
                  </div>
                )}

                {/* Timer */}
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded text-sm flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{car.timeRemaining}</span>
                  </div>
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <div className="w-2 h-2 bg-white rounded-full opacity-70"></div>
                  </div>
                </div>
              </div>

              {/* Car Details */}
              <div className="p-6">
                {/* Title and Year */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{car.title}</h3>
                  <span className="text-gray-500 text-sm">{car.year}</span>
                </div>

                {/* Location and Details */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{car.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Gauge className="h-4 w-4" />
                    <span>{car.mileage}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Fuel className="h-4 w-4" />
                    <span>{car.fuelType}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Bid</span>
                    <span className="text-2xl font-bold text-blue-600">${car.currentBid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Starting Price</span>
                    <span className="text-gray-900">${car.startingPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        car.bidProgress > 80 ? 'bg-red-500' : 
                        car.bidProgress > 60 ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}
                      style={{ width: `${car.bidProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>+{car.priceIncrease}%</span>
                    <span>{car.bidCount} bids</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    {car.features.map((feature, index) => (
                      <span key={index}>{feature}</span>
                    ))}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    <span>{car.viewCount} bids</span>
                  </div>
                  <button 
                    onClick={handleAnyClick}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Bid Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
            <p className="text-xl mb-6">Join CarBidX - The ultimate reverse car auction platform</p>
            <div className="space-x-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Sidebar Component for Dashboard
const Sidebar = ({ user, logout, activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  const getBuyerMenuItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'live-auctions', label: 'Live Auctions', icon: Gavel },
    { id: 'my-requests', label: 'My Requests', icon: FileText },
    { id: 'create-request', label: 'Create Request', icon: Plus },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getDealerMenuItems = () => [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-auctions', label: 'My Auctions', icon: Gavel },
    { id: 'my-bids', label: 'My Bids', icon: BidIcon },
    { id: 'active-bids', label: 'Active Bids', icon: Activity },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getAdminMenuItems = () => [
    { id: 'dashboard', label: 'Admin Dashboard', icon: Home },
    { id: 'all-auctions', label: 'All Auctions', icon: Gavel },
    { id: 'all-users', label: 'All Users', icon: UsersIcon },
    { id: 'all-bids', label: 'All Bids', icon: BidIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'system', label: 'System', icon: Database },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'buyer':
        return getBuyerMenuItems();
      case 'dealer':
        return getDealerMenuItems();
      case 'admin':
        return getAdminMenuItems();
      default:
        return [];
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'buyer':
        return 'bg-green-500';
      case 'dealer':
        return 'bg-blue-500';
      case 'admin':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">CarBidX</span>
        </div>
        <div className="mt-2">
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor()}`}>
            {user?.role?.toUpperCase()} PANEL
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {getMenuItems().map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRoleColor()}`}>
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-2 text-sm text-red-600 hover:text-red-700 py-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// Buyer Dashboard Component
const BuyerDashboard = ({ activeSection }) => {
  const sampleRequests = [
    { id: 1, title: 'BMW X5 2023', status: 'Active', bids: 12, endTime: '2h 30m', maxBudget: 80000 },
    { id: 2, title: 'Mercedes C-Class 2022', status: 'Closed', bids: 8, endTime: 'Ended', maxBudget: 50000 },
  ];

  const liveAuctions = [
    { id: 1, title: 'Mercedes-Benz C-Class AMG', currentBid: 49000, timeLeft: '2h 50m', bids: 15 },
    { id: 2, title: 'BMW X5 M Competition', currentBid: 87500, timeLeft: '4h 50m', bids: 28 },
    { id: 3, title: 'Audi A4 Quattro', currentBid: 60000, timeLeft: '7h 50m', bids: 22 },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">👋 Welcome Back, Buyer!</h2>
              <p className="text-lg">Find your dream car through reverse auctions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Requests</p>
                    <p className="text-2xl font-bold text-green-600">3</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bids Received</p>
                    <p className="text-2xl font-bold text-blue-600">47</p>
                  </div>
                  <Gavel className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Favorites</p>
                    <p className="text-2xl font-bold text-purple-600">8</p>
                  </div>
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'live-auctions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Live Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAuctions.map((auction) => (
                <div key={auction.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Bid:</span>
                      <span className="font-bold text-blue-600">${auction.currentBid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Time Left:</span>
                      <span className="text-orange-600">{auction.timeLeft}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bids:</span>
                      <span>{auction.bids}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'my-requests':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Car Requests</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                Create New Request
              </button>
            </div>
            <div className="space-y-4">
              {sampleRequests.map((request) => (
                <div key={request.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600">Max Budget: ${request.maxBudget.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{request.bids} bids</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      View Bids
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                      Edit Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Section under development</div>;
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

// Dealer Dashboard Component
const DealerDashboard = ({ activeSection }) => {
  const myAuctions = [
    { id: 1, title: 'Mercedes-Benz C-Class AMG', myBid: 48500, currentBid: 49000, status: 'Outbid', timeLeft: '2h 50m' },
    { id: 2, title: 'BMW X5 M Competition', myBid: 87500, currentBid: 87500, status: 'Winning', timeLeft: '4h 50m' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">🚗 Dealer Dashboard</h2>
              <p className="text-lg">Manage your bids and win more auctions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Bids</p>
                    <p className="text-2xl font-bold text-blue-600">5</p>
                  </div>
                  <BidIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Winning Bids</p>
                    <p className="text-2xl font-bold text-green-600">2</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bids</p>
                    <p className="text-2xl font-bold text-purple-600">23</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Won Auctions</p>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'my-auctions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Active Auctions</h2>
            <div className="space-y-4">
              {myAuctions.map((auction) => (
                <div key={auction.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{auction.title}</h3>
                      <p className="text-sm text-gray-600">My Bid: ${auction.myBid.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Current Bid: ${auction.currentBid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        auction.status === 'Winning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {auction.status}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{auction.timeLeft} left</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Update Bid
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Section under development</div>;
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = ({ activeSection }) => {
  const adminStats = {
    totalUsers: 1247,
    totalAuctions: 156,
    activeAuctions: 23,
    totalBids: 892,
    totalRevenue: 125000
  };

  const allAuctions = [
    { id: 1, title: 'Mercedes-Benz C-Class AMG', buyer: 'John Doe', currentBid: 49000, bids: 15, status: 'Active' },
    { id: 2, title: 'BMW X5 M Competition', buyer: 'Jane Smith', currentBid: 87500, bids: 28, status: 'Active' },
    { id: 3, title: 'Audi A4 Quattro', buyer: 'Mike Johnson', currentBid: 60000, bids: 22, status: 'Active' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">🔧 Admin Control Center</h2>
              <p className="text-lg">Monitor and manage the entire CarBidX platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-blue-600">{adminStats.totalUsers}</p>
                  </div>
                  <UsersIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Auctions</p>
                    <p className="text-2xl font-bold text-green-600">{adminStats.totalAuctions}</p>
                  </div>
                  <Gavel className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Auctions</p>
                    <p className="text-2xl font-bold text-orange-600">{adminStats.activeAuctions}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bids</p>
                    <p className="text-2xl font-bold text-purple-600">{adminStats.totalBids}</p>
                  </div>
                  <BidIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">${adminStats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        );

      case 'all-auctions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">All Live Auctions</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Bid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allAuctions.map((auction) => (
                    <tr key={auction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{auction.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.buyer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">${auction.currentBid.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{auction.bids}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {auction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                        <button className="text-red-600 hover:text-red-900">Manage</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Section under development</div>;
    }
  };

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      {renderContent()}
    </div>
  );
};

// Main Dashboard Router
const Dashboard = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderDashboard = () => {
    switch (user?.role) {
      case 'buyer':
        return <BuyerDashboard activeSection={activeSection} />;
      case 'dealer':
        return <DealerDashboard activeSection={activeSection} />;
      case 'admin':
        return <AdminDashboard activeSection={activeSection} />;
      default:
        return <div className="text-center text-gray-500">Invalid user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        user={user} 
        logout={useAuth().logout} 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      {renderDashboard()}
    </div>
  );
};

// Login Component
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const success = await login(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    setError('');
    
    const credentials = {
      buyer: { email: 'test@test.com', password: '123456' },
      dealer: { email: 'dealer@test.com', password: '123456' },
      admin: { email: 'admin@autobidpro.com', password: 'admin123' }
    };

    const success = await login(credentials[role]);
    if (success) {
      navigate('/dashboard');
    } else {
      setError(`${role} login failed`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome to CarBidX</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <p className="text-center text-sm text-gray-600 mb-3">Quick Demo Login:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickLogin('buyer')}
                disabled={loading}
                className="bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
              >
                👤 Buyer
              </button>
              <button
                onClick={() => handleQuickLogin('dealer')}
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                🚗 Dealer
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                🔧 Admin
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Component
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    dealer_tier: 'standard',
    phone: '',
    location: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const dataToSubmit = { ...formData };
    if (formData.role === 'buyer') {
      delete dataToSubmit.dealer_tier;
    }

    const success = await register(dataToSubmit);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Join CarBidX</h2>
            <p className="text-gray-600 mt-2">Create your account today</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="buyer">Car Buyer</option>
                <option value="dealer">Car Dealer</option>
              </select>
            </div>

            {formData.role === 'dealer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dealer Tier
                </label>
                <select
                  value={formData.dealer_tier}
                  onChange={(e) => setFormData({ ...formData, dealer_tier: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard ($250/month)</option>
                  <option value="premium">Premium ($350/month)</option>
                  <option value="gold">Gold ($500/month)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;