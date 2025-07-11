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
    
    // Redirect to landing page after logout
    window.location.href = '/';
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
      category: 'luxury',
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
      category: 'suv',
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
      category: 'luxury',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 4,
      title: 'Porsche 911 Turbo S',
      year: '2024',
      location: 'Miami, FL',
      mileage: '5,200 km',
      fuelType: 'Gasoline',
      currentBid: 195000,
      startingPrice: 180000,
      condition: 'Excellent',
      timeRemaining: '1h 15m',
      bidCount: 42,
      viewCount: 42,
      priceIncrease: 8.3,
      features: ['Turbo S Package', 'Carbon Fiber', '+4 more'],
      hasVideo: true,
      isHot: true,
      isFavorite: false,
      bidProgress: 95,
      category: 'luxury',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 5,
      title: 'Ford F-150 Raptor',
      year: '2023',
      location: 'Houston, TX',
      mileage: '12,000 miles',
      fuelType: 'Gasoline',
      currentBid: 68000,
      startingPrice: 65000,
      condition: 'Good',
      timeRemaining: '5h 30m',
      bidCount: 18,
      viewCount: 18,
      priceIncrease: 4.6,
      features: ['Raptor Package', '4WD', '+3 more'],
      hasVideo: true,
      isHot: false,
      isFavorite: true,
      bidProgress: 55,
      category: 'truck',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 6,
      title: 'Cadillac Escalade ESV',
      year: '2023',
      location: 'Los Angeles, CA',
      mileage: '18,500 miles',
      fuelType: 'Gasoline',
      currentBid: 82000,
      startingPrice: 78000,
      condition: 'Excellent',
      timeRemaining: '3h 45m',
      bidCount: 31,
      viewCount: 31,
      priceIncrease: 5.1,
      features: ['Premium Luxury', 'Captain Chairs', '+5 more'],
      hasVideo: true,
      isHot: false,
      isFavorite: false,
      bidProgress: 75,
      category: 'suv',
      image: 'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
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
    <div className="w-48 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
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
  const [myRequests, setMyRequests] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBidsModal, setShowBidsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bidsData, setBidsData] = useState([]);

  useEffect(() => {
    fetchBuyerData();
  }, [activeSection]);

  const fetchBuyerData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeSection === 'my-requests' || activeSection === 'dashboard') {
        const requestsRes = await axios.get(`${API}/car-requests`);
        setMyRequests(requestsRes.data);
      }
      
      if (activeSection === 'live-auctions' || activeSection === 'dashboard') {
        // For live auctions, we'll fetch all active requests from all users
        const allRequestsRes = await axios.get(`${API}/car-requests`);
        setLiveAuctions(allRequestsRes.data.filter(req => req.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching buyer data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (formData) => {
    try {
      await axios.post(`${API}/car-requests`, formData);
      setShowCreateForm(false);
      fetchBuyerData();
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Failed to create request. Please try again.');
    }
  };

  const handleViewBids = async (requestId) => {
    try {
      const response = await axios.get(`${API}/bids/${requestId}`);
      setBidsData(response.data);
      setSelectedRequest(requestId);
      setShowBidsModal(true);
    } catch (error) {
      console.error('Error fetching bids:', error);
      setError('Failed to load bids. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button 
                  onClick={() => {setError(null); fetchBuyerData();}}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

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
                    <p className="text-2xl font-bold text-green-600">
                      {myRequests.filter(req => req.status === 'active').length}
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="text-2xl font-bold text-blue-600">{myRequests.length}</p>
                  </div>
                  <Gavel className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Live Auctions</p>
                    <p className="text-2xl font-bold text-purple-600">{liveAuctions.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Requests</h3>
              {myRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No requests yet. Create your first request!</p>
              ) : (
                <div className="space-y-4">
                  {myRequests.slice(0, 3).map((request) => (
                    <div key={request.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.title}</h4>
                        <p className="text-sm text-gray-600">Max Budget: {formatCurrency(request.max_budget)}</p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{calculateTimeLeft(request.ends_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'live-auctions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Live Auctions</h2>
            {liveAuctions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No live auctions at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveAuctions.map((auction) => (
                  <div key={auction.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Budget:</span>
                        <span className="font-bold text-blue-600">{formatCurrency(auction.max_budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Time Left:</span>
                        <span className="text-orange-600">{calculateTimeLeft(auction.ends_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Make & Model:</span>
                        <span>{auction.make} {auction.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Year:</span>
                        <span>{auction.year}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleViewBids(auction.id)}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      View Bids
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'my-requests':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Car Requests</h2>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Create New Request
              </button>
            </div>
            
            {myRequests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't created any car requests yet.</p>
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Create Your First Request
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div key={request.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{request.title}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Make & Model:</span> {request.make} {request.model}
                          </div>
                          <div>
                            <span className="font-medium">Year:</span> {request.year}
                          </div>
                          <div>
                            <span className="font-medium">Max Budget:</span> {formatCurrency(request.max_budget)}
                          </div>
                          <div>
                            <span className="font-medium">Ends:</span> {calculateTimeLeft(request.ends_at)}
                          </div>
                        </div>
                        {request.description && (
                          <p className="text-sm text-gray-600 mt-2">{request.description}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          request.status === 'active' ? 'bg-green-100 text-green-800' : 
                          request.status === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status.toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Created: {formatDate(request.created_at)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button 
                        onClick={() => handleViewBids(request.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        View Bids
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                        Edit Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'create-request':
        return <CreateRequestForm onSubmit={handleCreateRequest} onCancel={() => setShowCreateForm(false)} />;

      case 'settings':
        return <UserSettings />;

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">This section is being developed.</p>
          </div>
        );
    }
  };

  return (
    <div className="ml-48 p-8 bg-gray-50 min-h-screen">
      {renderContent()}
      
      {/* Bids Modal */}
      {showBidsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Bids for Request</h3>
              <button 
                onClick={() => setShowBidsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {bidsData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bids yet for this request.</p>
            ) : (
              <div className="space-y-4">
                {bidsData.map((bid) => (
                  <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-900">{bid.dealer_name}</h4>
                        <p className="text-sm text-gray-600">Tier: {bid.dealer_tier}</p>
                        {bid.message && <p className="text-sm text-gray-600 mt-2">{bid.message}</p>}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{formatCurrency(bid.price)}</div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bid.status === 'winning' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(bid.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Request Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CreateRequestForm 
              onSubmit={handleCreateRequest} 
              onCancel={() => setShowCreateForm(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Dealer Dashboard Component
const DealerDashboard = ({ activeSection }) => {
  const [myBids, setMyBids] = useState([]);
  const [availableAuctions, setAvailableAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  useEffect(() => {
    fetchDealerData();
  }, [activeSection]);

  const fetchDealerData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeSection === 'my-bids' || activeSection === 'dashboard') {
        const bidsRes = await axios.get(`${API}/my-bids`);
        setMyBids(bidsRes.data);
      }
      
      if (activeSection === 'my-auctions' || activeSection === 'dashboard') {
        const auctionsRes = await axios.get(`${API}/car-requests`);
        setAvailableAuctions(auctionsRes.data.filter(auction => auction.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching dealer data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (bidData) => {
    try {
      await axios.post(`${API}/bids`, bidData);
      setShowBidModal(false);
      fetchDealerData();
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error.response?.data?.detail || 'Failed to place bid. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculateTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getMyStats = () => {
    const activeBids = myBids.filter(bid => bid.status === 'winning' || bid.status === 'active').length;
    const winningBids = myBids.filter(bid => bid.status === 'winning').length;
    const totalBids = myBids.length;
    const lostBids = myBids.filter(bid => bid.status === 'lost').length;
    
    return { activeBids, winningBids, totalBids, lostBids };
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-4">
                <button 
                  onClick={() => {setError(null); fetchDealerData();}}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const stats = getMyStats();

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
                    <p className="text-2xl font-bold text-blue-600">{stats.activeBids}</p>
                  </div>
                  <BidIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Winning Bids</p>
                    <p className="text-2xl font-bold text-green-600">{stats.winningBids}</p>
                  </div>
                  <Award className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bids</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalBids}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Lost Bids</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.lostBids}</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Recent Bids */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Bids</h3>
              {myBids.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bids yet. Start bidding on auctions!</p>
              ) : (
                <div className="space-y-4">
                  {myBids.slice(0, 3).map((bid) => (
                    <div key={bid.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">Auction: {bid.auction_id}</h4>
                        <p className="text-sm text-gray-600">Bid Amount: {formatCurrency(bid.price)}</p>
                        {bid.message && <p className="text-sm text-gray-500">{bid.message}</p>}
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bid.status === 'winning' ? 'bg-green-100 text-green-800' : 
                          bid.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(bid.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'my-auctions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Auctions</h2>
            {availableAuctions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No active auctions available.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableAuctions.map((auction) => (
                  <div key={auction.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{auction.title}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max Budget:</span>
                        <span className="font-bold text-green-600">{formatCurrency(auction.max_budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Time Left:</span>
                        <span className="text-orange-600">{calculateTimeLeft(auction.ends_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Make & Model:</span>
                        <span>{auction.make} {auction.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Year:</span>
                        <span>{auction.year}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {setSelectedAuction(auction); setShowBidModal(true);}}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                      Place Bid
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'my-bids':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
            {myBids.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You haven't placed any bids yet.</p>
                <button 
                  onClick={() => setActiveSection('my-auctions')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Browse Auctions
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid) => (
                  <div key={bid.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">Auction: {bid.auction_id}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">My Bid:</span> {formatCurrency(bid.price)}
                          </div>
                          <div>
                            <span className="font-medium">Placed:</span> {formatDate(bid.created_at)}
                          </div>
                        </div>
                        {bid.message && (
                          <p className="text-sm text-gray-600 mt-2">{bid.message}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          bid.status === 'winning' ? 'bg-green-100 text-green-800' : 
                          bid.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return <UserSettings />;

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">This section is being developed.</p>
          </div>
        );
    }
  };

  return (
    <div className="ml-48 p-8 bg-gray-50 min-h-screen">
      {renderContent()}
      
      {/* Bid Modal */}
      {showBidModal && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <BidForm 
              auction={selectedAuction}
              onSubmit={handlePlaceBid} 
              onCancel={() => setShowBidModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Bid Form Component
const BidForm = ({ auction, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    auction_id: auction.id,
    price: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      await onSubmit(submitData);
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to place bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Place Bid</h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Auction Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">{auction.title}</h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div><span className="font-medium">Make & Model:</span> {auction.make} {auction.model}</div>
          <div><span className="font-medium">Year:</span> {auction.year}</div>
          <div><span className="font-medium">Max Budget:</span> ${auction.max_budget.toLocaleString()}</div>
          <div><span className="font-medium">Time Left:</span> {(() => {
            const now = new Date();
            const end = new Date(auction.ends_at);
            const diff = end - now;
            if (diff <= 0) return 'Ended';
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return `${hours}h ${minutes}m`;
          })()}</div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bid Amount (USD)
          </label>
          <input
            type="number"
            required
            min="1"
            step="1"
            max={auction.max_budget}
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your bid amount"
          />
          <p className="text-sm text-gray-500 mt-1">
            Must be less than the maximum budget of ${auction.max_budget.toLocaleString()}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (Optional)
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Any additional information or comments..."
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Placing Bid...' : 'Place Bid'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

// Admin Dashboard Component
const AdminDashboard = ({ activeSection }) => {
  const [adminStats, setAdminStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [allAuctions, setAllAuctions] = useState([]);
  const [allBids, setAllBids] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, [activeSection]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await axios.get(`${API}/dashboard/stats`);
      setAdminStats(statsRes.data);

      // Fetch data based on active section
      switch (activeSection) {
        case 'all-users':
          const usersRes = await axios.get(`${API}/admin/users`);
          setAllUsers(usersRes.data);
          break;
        case 'all-auctions':
          const auctionsRes = await axios.get(`${API}/admin/auctions`);
          setAllAuctions(auctionsRes.data);
          break;
        case 'all-bids':
          const bidsRes = await axios.get(`${API}/admin/bids`);
          setAllBids(bidsRes.data);
          break;
        case 'analytics':
          const analyticsRes = await axios.get(`${API}/admin/analytics`);
          setAnalytics(analyticsRes.data);
          break;
        case 'system':
          const healthRes = await axios.get(`${API}/admin/system/health`);
          setSystemHealth(healthRes.data);
          break;
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API}/admin/users/${userId}`);
        setAllUsers(allUsers.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleUpdateAuctionStatus = async (auctionId, newStatus) => {
    try {
      await axios.put(`${API}/admin/auctions/${auctionId}/status`, { status: newStatus });
      // Refresh auctions
      const auctionsRes = await axios.get(`${API}/admin/auctions`);
      setAllAuctions(auctionsRes.data);
    } catch (error) {
      console.error('Error updating auction status:', error);
      alert('Failed to update auction status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">🔧 Admin Control Center</h2>
              <p className="text-lg">Monitor and manage the entire CarBidX platform</p>
            </div>
            
            {adminStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">{adminStats.total_users}</p>
                      <p className="text-xs text-gray-500">Buyers: {adminStats.total_buyers} | Dealers: {adminStats.total_dealers}</p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Auctions</p>
                      <p className="text-2xl font-bold text-green-600">{adminStats.total_auctions}</p>
                      <p className="text-xs text-gray-500">Active: {adminStats.active_auctions}</p>
                    </div>
                    <Gavel className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Bids</p>
                      <p className="text-2xl font-bold text-purple-600">{adminStats.total_bids}</p>
                    </div>
                    <BidIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(adminStats.monthly_revenue)}</p>
                      <p className="text-xs text-gray-500">Subscriptions</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(adminStats.total_revenue)}</p>
                      <p className="text-xs text-gray-500">All sources</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <UsersIcon className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm font-medium">Manage Users</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <Gavel className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <span className="text-sm font-medium">View Auctions</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <BarChart3 className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm font-medium">Analytics</span>
                </button>
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <Database className="h-6 w-6 mx-auto mb-2 text-red-600" />
                  <span className="text-sm font-medium">System Health</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'all-users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
              <div className="text-sm text-gray-600">
                Total: {allUsers.length} users
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                            user.role === 'buyer' ? 'bg-green-500' : 
                            user.role === 'dealer' ? 'bg-blue-500' : 'bg-red-500'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'buyer' ? 'bg-green-100 text-green-800' :
                          user.role === 'dealer' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                        {user.dealer_tier && (
                          <div className="text-xs text-gray-500 mt-1">{user.dealer_tier}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{user.phone || 'N/A'}</div>
                        <div>{user.location || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => {setSelectedUser(user); setShowUserModal(true);}}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'all-auctions':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Auctions</h2>
              <div className="text-sm text-gray-600">
                Total: {allAuctions.length} auctions
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bids</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allAuctions.map((auction) => (
                    <tr key={auction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{auction.title}</div>
                        <div className="text-sm text-gray-500">{auction.year} {auction.make} {auction.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{auction.buyer?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{auction.buyer?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(auction.max_budget)}</div>
                        {auction.lowest_bid && (
                          <div className="text-sm text-green-600">Low: {formatCurrency(auction.lowest_bid)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {auction.bid_count || 0} bids
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          auction.status === 'active' ? 'bg-green-100 text-green-800' :
                          auction.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {auction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(auction.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select 
                          value={auction.status}
                          onChange={(e) => handleUpdateAuctionStatus(auction.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="active">Active</option>
                          <option value="closed">Closed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'all-bids':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Bids</h2>
              <div className="text-sm text-gray-600">
                Total: {allBids.length} bids
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placed</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allBids.map((bid) => (
                    <tr key={bid.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bid.auction?.title || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{bid.auction?.make} {bid.auction?.model}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bid.dealer?.name || bid.dealer_name}</div>
                        <div className="text-sm text-gray-500">{bid.dealer_tier}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">{formatCurrency(bid.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bid.status === 'winning' ? 'bg-green-100 text-green-800' :
                          bid.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {bid.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bid.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Platform Analytics</h2>
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Auctions Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Auctions (Last 30 days)</h3>
                  <div className="space-y-2">
                    {analytics.daily_auctions.slice(-7).map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{day._id}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(day.count / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{day.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Daily Bids Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Bids (Last 30 days)</h3>
                  <div className="space-y-2">
                    {analytics.daily_bids.slice(-7).map((day, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{day._id}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(day.count / 20) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{day.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Auctions */}
                <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Auctions</h3>
                  <div className="space-y-3">
                    {analytics.top_auctions.slice(0, 5).map((auction, index) => (
                      <div key={auction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{auction.title}</div>
                          <div className="text-sm text-gray-500">{auction.make} {auction.model}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{auction.bid_count} bids</div>
                          {auction.lowest_bid && (
                            <div className="text-sm text-gray-500">Low: {formatCurrency(auction.lowest_bid)}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">System Health</h2>
            {systemHealth && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Database Status</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      systemHealth.database === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-sm text-gray-600">{systemHealth.database}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">WebSocket Connections</h3>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{systemHealth.websocket_connections}</p>
                  <p className="text-sm text-gray-600">Active connections</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-sm text-gray-600">{systemHealth.status}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Last Check</h3>
                  </div>
                  <p className="text-sm text-gray-600">{formatDate(systemHealth.timestamp)}</p>
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button 
                  onClick={fetchAdminData}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                >
                  <RefreshCw className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                  <span className="text-sm">Refresh Data</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <Database className="h-5 w-5 mx-auto mb-2 text-green-600" />
                  <span className="text-sm">Backup DB</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <Activity className="h-5 w-5 mx-auto mb-2 text-purple-600" />
                  <span className="text-sm">View Logs</span>
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center">
                  <Settings className="h-5 w-5 mx-auto mb-2 text-gray-600" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Section under development</div>;
    }
  };

  return (
    <div className="ml-48 p-8 bg-gray-50 min-h-screen">
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