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

// Landing Page Component (matches the screenshot design)
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Auctions</h1>
            <p className="text-gray-600">({auctionCars.length} vehicles)</p>
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
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
            <p className="text-xl mb-6">Join thousands of buyers and dealers in the ultimate car auction experience</p>
            <div className="space-x-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Simple Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome to AutoBid Pro</h1>
              <p className="text-gray-600">Hello, {user?.name}!</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">🎉 Successfully Logged In!</h2>
            <p className="text-lg">You now have access to the AutoBid Pro reverse auction platform.</p>
            <p className="mt-2">Start bidding on your dream cars or create auction requests!</p>
          </div>
        </div>
      </div>
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

// Register Component
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
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

    const success = await register(formData);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Join AutoBid Pro</h2>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="buyer">Buyer</option>
                <option value="dealer">Dealer</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
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