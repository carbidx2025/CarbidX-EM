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
  RefreshCw
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

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Sidebar Navigation Component
const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'auctions', label: 'Live Auctions', icon: Gavel, path: '/auctions' },
    { id: 'bids', label: 'My Bids', icon: TrendingDown, path: '/my-bids' },
    { id: 'favourites', label: 'Favourites', icon: Heart, path: '/favourites' },
    { id: 'results', label: 'Results', icon: BarChart3, path: '/results' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  if (user?.role === 'buyer') {
    menuItems.splice(2, 0, { id: 'create', label: 'Create Request', icon: Plus, path: '/create-request' });
  }

  const handleNavigation = (item) => {
    setActiveItem(item.id);
    if (item.path === '/dashboard') {
      navigate('/dashboard');
    } else {
      // For now, stay on dashboard but show that item is selected
      console.log(`Navigating to ${item.label}`);
    }
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Car className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">AutoBid Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeItem === item.id
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
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {user?.role === 'buyer' && (
            <button
              onClick={() => console.log('Switch to dealer')}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Switch to Dealer</span>
            </button>
          )}
          
          <button
            onClick={logout}
            className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Top Header Component
const TopHeader = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 p-4 ml-64">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for make, model, or year..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-600">USD</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Car Card Component
const CarCard = ({ car, onViewDetails }) => {
  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
      onClick={() => onViewDetails(car)}
    >
      <div className="relative">
        <img
          src={car.image}
          alt={car.title}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white ${
          car.condition === 'Excellent' ? 'bg-green-500' : 
          car.condition === 'Good' ? 'bg-blue-500' : 'bg-yellow-500'
        }`}>
          {car.condition}
        </div>
        <button className="absolute top-2 right-2 bg-white rounded-full p-1 hover:bg-gray-100">
          <Heart className={`h-4 w-4 ${car.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
        </button>
        {car.isHot && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            🔥 HOT
          </div>
        )}
        {car.hasVideo && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            📹 Video
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{car.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{car.details}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-blue-600 font-bold">${car.currentBid.toLocaleString()}</span>
          <span className="text-sm text-gray-500">Starting: ${car.startingPrice.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full ${car.bidProgress > 80 ? 'bg-red-500' : car.bidProgress > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${car.bidProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>{car.totalBids} bids</span>
          <span>+{car.priceIncrease}%</span>
        </div>
        {car.features && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            {car.features.slice(0, 2).map((feature, index) => (
              <span key={index}>{feature}</span>
            ))}
            {car.features.length > 2 && <span>+{car.features.length - 2} more</span>}
          </div>
        )}
      </div>
    </div>
  );
};

// Car Details Modal
const CarDetailsModal = ({ car, isOpen, onClose }) => {
  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{car.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <img src={car.image} alt={car.title} className="w-full h-64 object-cover rounded-lg mb-4" />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Current Bid</p>
              <p className="text-2xl font-bold text-blue-600">${car.currentBid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Starting Price</p>
              <p className="text-lg text-gray-900">${car.startingPrice.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Details</p>
            <p className="text-gray-900">{car.details}</p>
          </div>
          
          {car.features && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Features</p>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">{feature}</span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Place Bid
            </button>
            <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50">
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showCarModal, setShowCarModal] = useState(false);

  const sampleCars = [
    {
      id: 1,
      title: 'Mercedes C-Class AMG',
      details: '2022 • 22,000 km • ⛽ Gasoline',
      currentBid: 49000,
      startingPrice: 45000,
      condition: 'Good',
      bidProgress: 60,
      totalBids: 15,
      priceIncrease: 18.7,
      isFavorite: false,
      isHot: false,
      hasVideo: true,
      features: ['Air Suspension', 'Navigation System', 'Leather Seats'],
      image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      title: 'BMW X5 M Competition',
      details: '2023 • 📍 Dubai, UAE • 15,000 km • ⛽ Gasoline',
      currentBid: 87500,
      startingPrice: 75000,
      condition: 'Excellent',
      bidProgress: 85,
      totalBids: 28,
      priceIncrease: 16.7,
      isFavorite: true,
      isHot: true,
      hasVideo: true,
      features: ['Panoramic Sunroof', 'Navigation System', 'M Performance Package', 'Premium Sound'],
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Audi A4 Quattro',
      details: '2023 • 📍 Sharjah, UAE • 8,500 km • ⛽ Gasoline',
      currentBid: 60000,
      startingPrice: 55000,
      condition: 'Excellent',
      bidProgress: 70,
      totalBids: 22,
      priceIncrease: 9.1,
      isFavorite: false,
      isHot: false,
      hasVideo: true,
      features: ['Quattro AWD', 'Virtual Cockpit', 'Premium Interior'],
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleViewCarDetails = (car) => {
    setSelectedCar(car);
    setShowCarModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-64">
        <TopHeader />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 m-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <p className="text-purple-100 text-lg">
                {user?.role === 'buyer' ? 'Ready to find your next dream car?' : 'Ready to place some winning bids?'}
              </p>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>1,247 Active Bidders</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5" />
                  <span>3 Ending Soon</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Zap className="h-16 w-16 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Favourites</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+8.7%</span>
                </div>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Highest Bid</p>
                  <p className="text-2xl font-bold text-gray-900">$87,500</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+12.5%</span>
                </div>
                <p className="text-xs text-gray-500">vs last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Gavel className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Recent Bid</p>
                  <p className="text-2xl font-bold text-gray-900">$87,500</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+5.3%</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">vs last month</p>
                <p className="text-xs text-gray-400">Rank #1 of 26 bids</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Auctions */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Auctions</h2>
                  <p className="text-sm text-gray-600">Click on any car to view details and place bids</p>
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Ending Soon</option>
                    <option>Recently Added</option>
                    <option>Highest Bid</option>
                  </select>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Grid className="h-4 w-4" />
                  </button>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleCars.map((car) => (
                  <CarCard 
                    key={car.id} 
                    car={car} 
                    onViewDetails={handleViewCarDetails}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sidebar />
      
      <CarDetailsModal 
        car={selectedCar}
        isOpen={showCarModal}
        onClose={() => setShowCarModal(false)}
      />
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
      setError('Invalid credentials. Try: test@test.com / 123456');
    }
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    
    const success = await login({ email: 'test@test.com', password: '123456' });
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Demo login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to AutoBid Pro</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
            >
              🚀 Quick Demo Login
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign Up
            </Link>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: test@test.com</p>
            <p>Password: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Component (simplified)
const Register = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // For now, just redirect to login
    navigate('/login');
  }, [navigate]);

  return null;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;