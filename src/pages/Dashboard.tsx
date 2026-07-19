import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BHOLA_AREAS } from '../data/staticConfig';
import { ProductCard } from '../components/ProductCard';
import { PushNotificationManager } from '../components/PushNotificationManager';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  ShoppingBag, 
  Clock, 
  Compass, 
  CheckCircle, 
  UserCheck, 
  ChevronRight,
  LogOut,
  Sparkles,
  Package,
  Activity,
  Download,
  Heart,
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Bike,
  Plus,
  Trash2,
  Shield,
  Layers,
  Map,
  PlusCircle,
  Search,
  Bell,
  Volume2
} from 'lucide-react';
import { downloadInvoiceFile, downloadAllOrdersBackup } from '../utils/downloadHelper';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  VISITOR_INSIGHTS_DATA,
  REVENUE_DATA,
  SATISFACTION_DATA,
  TARGET_REALITY_DATA,
  VOLUME_SERVICE_DATA,
  TOP_PRODUCTS,
  HUB_DENSITIES,
} from '../utils/chartData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md p-3 border border-gray-150 rounded-2xl shadow-xl text-xs font-semibold">
        <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-wider">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-black text-gray-900">
              {typeof entry.value === 'number' && entry.value > 1000 ? `৳${entry.value.toLocaleString()}` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const { currentUser, orders, updateProfile, logout, wishlist, updateOrderStatus, updateProductsList, products, systemUsers: fetchedSystemUsers } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const getDefaultTab = (role: string) => {
    if (role === 'admin') return 'admin_overview';
    if (role === 'sub-admin') return 'subadmin_overview';
    if (role === 'deliveryman') return 'delivery_portal';
    return 'profile';
  };

  const adminTabs = ['admin_overview', 'admin_orders', 'admin_users', 'admin_foods', 'profile', 'wishlist'];
  const subadminTabs = ['subadmin_overview', 'subadmin_orders', 'profile', 'wishlist'];
  const deliverymanTabs = ['delivery_portal', 'delivery_history', 'profile', 'wishlist'];
  const userTabs = ['profile', 'orders', 'tracking', 'addresses', 'wishlist'];

  const isValidTabForRole = (tab: string, role: string) => {
    if (role === 'admin') return adminTabs.includes(tab);
    if (role === 'sub-admin') return subadminTabs.includes(tab);
    if (role === 'deliveryman') return deliverymanTabs.includes(tab);
    return userTabs.includes(tab);
  };

  // Safe fallback resolver for active tab
  const activeTab = (searchParams.get('tab') && currentUser && isValidTabForRole(searchParams.get('tab') || '', currentUser.role))
    ? (searchParams.get('tab') || 'profile')
    : (currentUser ? getDefaultTab(currentUser.role) : 'profile');

  // Selection state for actively tracking order
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | null>(null);

  // Profile Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(BHOLA_AREAS[0]);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Load user data into form
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      if (currentUser.area) setArea(currentUser.area);
    }
  }, [currentUser]);

  // If there are orders, default the tracking to the most recent one
  useEffect(() => {
    if (orders.length > 0 && !selectedTrackingOrderId) {
      setSelectedTrackingOrderId(orders[0].id);
    }
  }, [orders, selectedTrackingOrderId]);

  // Function to play a sweet Messenger-style double beep sound with Web Audio API for testing
  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      // Note 1 (Messenger sweet pop sound)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.12);

      // Note 2 (Delayed high sweet tone)
      setTimeout(() => {
        if (ctx.state === 'suspended') return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, ctx.currentTime); // A5
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.22);
      }, 75);
    } catch (e) {
      console.error('Audio context error:', e);
    }
  };

  // Barrier: Request login if not authenticated
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center">
        <div className="h-16 w-16 rounded-2xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center mb-4 shadow-xs">
          <UserIcon className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Access Denied</h2>
        <p className="text-xs text-gray-400 max-w-md mb-8 leading-relaxed font-semibold">
          You need to be signed in to view your profile, order history, and track active deliveries in Bhola.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/signin')}
            className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 shadow-xs transition-colors cursor-pointer"
          >
            Sign In Now
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-extrabold text-xs px-6 py-3 shadow-xs transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    setProfileError(null);

    if (!name.trim()) return setProfileError('Name cannot be empty.');
    if (!email.trim()) return setProfileError('Email cannot be empty.');
    if (!phone.trim()) return setProfileError('Phone cannot be empty.');
    if (phone.length < 11) return setProfileError('Please specify a valid 11-digit mobile number.');

    Promise.resolve(updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      area
    })).then(() => {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }).catch((err) => {
      console.error(err);
      setProfileError('Failed to update profile. Please try again.');
    });
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  // Find currently selected tracking order details
  const activeTrackingOrder = orders.find((o) => o.id === selectedTrackingOrderId);

  // Local states for Admin actions
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [foodsList, setFoodsList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [foodSearch, setFoodSearch] = useState('');
  
  // Add Food form states
  const [showAddFoodForm, setShowAddFoodForm] = useState(false);
  const [newFoodName, setNewFoodName] = useState('');
  const [newFoodPrice, setNewFoodPrice] = useState('');
  const [newFoodCategory, setNewFoodCategory] = useState('curries');
  const [newFoodPrep, setNewFoodPrep] = useState('15-20 min');
  const [newFoodRestaurant, setNewFoodRestaurant] = useState('Bhola Garden Restaurant');
  const [newFoodDesc, setNewFoodDesc] = useState('');
  const [newFoodImage, setNewFoodImage] = useState('');
  const [extraFoodImages, setExtraFoodImages] = useState<string[]>(['', '', '']);

  const [isSyncingDb, setIsSyncingDb] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleResetDbSeed = async () => {
    setIsSyncingDb(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/seed', {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncMessage(`Success: ${data.message}`);
        // Reload products from server if possible
        const productsRes = await fetch('/api/products');
        if (productsRes.ok) {
          const freshProducts = await productsRes.json();
          setFoodsList(freshProducts);
          localStorage.setItem('bhola_online_products', JSON.stringify(freshProducts));
        }
      } else {
        setSyncMessage(`Error: ${data.error || 'Failed to seed database'}`);
      }
    } catch (err: any) {
      console.error(err);
      setSyncMessage(`Error: Could not connect to API server.`);
    } finally {
      setIsSyncingDb(false);
      setTimeout(() => setSyncMessage(null), 7000);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (index === 0) {
          setNewFoodImage(base64String);
        } else {
          setExtraFoodImages(prev => {
            const updated = [...prev];
            updated[index - 1] = base64String;
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Rider mock simulator checkpoints
  const [riderCheckpoint, setRiderCheckpoint] = useState(0);

  // Load system users on mount & sync with TanStack Query systemUsers
  useEffect(() => {
    if (fetchedSystemUsers && fetchedSystemUsers.length > 0) {
      setSystemUsers(fetchedSystemUsers);
    } else {
      const usersStr = localStorage.getItem('bhola_online_users');
      if (usersStr) {
        setSystemUsers(JSON.parse(usersStr));
      }
    }
  }, [fetchedSystemUsers, currentUser]);

  // Sync foodsList with live products from TanStack Query
  useEffect(() => {
    setFoodsList(products || []);
  }, [products]);

  // Handle user role change
  const handleUserRoleChange = async (userId: string, newRole: 'user' | 'admin' | 'sub-admin' | 'deliveryman') => {
    const userToUpdate = (systemUsers || []).find(u => u.id === userId);

    const updated = (systemUsers || []).map(u => u.id === userId ? { ...u, role: newRole } : u);
    setSystemUsers(updated);
    localStorage.setItem('bhola_online_users', JSON.stringify(updated));
    
    if (userToUpdate) {
      try {
        await fetch('/api/users/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            name: userToUpdate.name,
            email: userToUpdate.email,
            phone: userToUpdate.phone,
            address: userToUpdate.address || '',
            area: userToUpdate.area || '',
            role: newRole
          })
        });
        console.log("Successfully updated user role in MongoDB");
      } catch (err) {
        console.error("Failed to update user role in MongoDB:", err);
      }
    }

    // If Admin is changing their own role, update current user in local session
    if (userId === currentUser.id) {
      updateProfile({
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        address: currentUser.address,
        area: currentUser.area,
        role: newRole
      } as any);
    }
  };

  // Handle Adding Food
  const handleAddFoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodName || !newFoodPrice) return;

    const filteredExtraImages = extraFoodImages.filter(img => img.trim() !== '');

    const newFoodItem = {
      id: `food-${Date.now()}`,
      name: newFoodName,
      price: Number(newFoodPrice),
      category: newFoodCategory,
      prepTime: newFoodPrep,
      restaurantName: newFoodRestaurant,
      description: newFoodDesc || `${newFoodName} is a delicious premium food from Bhola.`,
      image: newFoodImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      images: filteredExtraImages.length > 0 ? filteredExtraImages : undefined,
      rating: 4.8,
      reviewsCount: 1,
      isFeatured: false,
      isPopular: true
    };

    const updated = [newFoodItem, ...foodsList];
    setFoodsList(updated);
    updateProductsList(updated);

    // Reset form
    setNewFoodName('');
    setNewFoodPrice('');
    setNewFoodDesc('');
    setNewFoodImage('');
    setExtraFoodImages(['', '', '']);
    setShowAddFoodForm(false);
  };

  // Toggle Featured Status
  const toggleFoodFeatured = (id: string) => {
    const updated = foodsList.map(f => f.id === id ? { ...f, isFeatured: !f.isFeatured } : f);
    setFoodsList(updated);
    updateProductsList(updated);
  };

  // Toggle Stock Status
  const toggleFoodStock = (id: string) => {
    const updated = foodsList.map(f => f.id === id ? { ...f, isOutOfStock: !f.isOutOfStock } : f);
    setFoodsList(updated);
    updateProductsList(updated);
  };

  // Delete Delicacy
  const handleDeleteFood = (id: string) => {
    const updated = foodsList.filter(f => f.id !== id);
    setFoodsList(updated);
    updateProductsList(updated);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">System Admin (এডমিন)</span>;
      case 'sub-admin':
        return <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Sub-Admin (সহকারী এডমিন)</span>;
      case 'deliveryman':
        return <span className="bg-green-50 text-green-600 border border-green-100 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Delivery Rider (ডেলিভারিম্যান)</span>;
      default:
        return <span className="bg-orange-50 text-orange-600 border border-orange-100/50 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Verified Customer (গ্রাহক)</span>;
    }
  };

  // Status visual colors mapper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 text-[9px] font-black rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-wider">Pending</span>;
      case 'Processing':
        return <span className="px-2.5 py-1 text-[9px] font-black rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">Preparing</span>;
      case 'Delivered':
        return <span className="px-2.5 py-1 text-[9px] font-black rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider">Delivered</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-1 text-[9px] font-black rounded-full bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-[9px] font-black rounded-full bg-gray-55 text-gray-750">{status}</span>;
    }
  };

  // Dynamic Overview Metrics from live MongoDB collections
  const realSales = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);
  const realOrders = orders.length;
  const realProductsSold = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0), 0);
  const realSystemUsers = systemUsers.length;

  // 24 Hours Metrics Calculation for live dashboard cards
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const last24hOrdersList = orders.filter(o => {
    const orderDate = new Date(o.date);
    return !isNaN(orderDate.getTime()) && orderDate >= oneDayAgo;
  });

  const last24hSales = last24hOrdersList.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.total, 0);
  const last24hOrders = last24hOrdersList.length;
  const last24hProductsSold = last24hOrdersList.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.items ? o.items.reduce((itemSum, item) => itemSum + item.quantity, 0) : 0), 0);

  const last24hNewUsers = systemUsers.filter(u => {
    if (u.id && u.id.startsWith('user-')) {
      const ts = parseInt(u.id.replace('user-', ''), 10);
      if (!isNaN(ts)) {
        return ts >= oneDayAgo.getTime();
      }
    }
    return false;
  }).length;

  // Dynamic Bestsellers calculation
  const getDynamicTopProducts = () => {
    const productSales: { [key: string]: { name: string; quantity: number } } = {};
    let totalItemsSold = 0;
    
    orders.forEach(o => {
      if (o.status === 'Delivered' && Array.isArray(o.items)) {
        o.items.forEach(item => {
          const name = item.product?.name || 'Unknown Item';
          if (!productSales[name]) {
            productSales[name] = { name, quantity: 0 };
          }
          productSales[name].quantity += item.quantity;
          totalItemsSold += item.quantity;
        });
      }
    });

    const sorted = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
    
    if (sorted.length > 0) {
      const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
      return sorted.slice(0, 4).map((item, index) => {
        const popularity = Math.round((item.quantity / sorted[0].quantity) * 100);
        const salesPercentage = totalItemsSold > 0 ? Math.round((item.quantity / totalItemsSold) * 100) : 0;
        return {
          id: `0${index + 1}`,
          name: item.name,
          popularity,
          salesPercentage,
          color: colors[index % colors.length]
        };
      });
    }

    return TOP_PRODUCTS;
  };

  const dynamicTopProducts = getDynamicTopProducts();

  // Dynamic Hub densities calculated with registered riders in MongoDB
  const getDynamicHubDensities = () => {
    const counts: { [key: string]: number } = {
      'Sadar Road Hub': 0,
      'Charfassion Link': 0,
      'Lalmohan Station': 0,
      'Tazumuddin Bazar': 0
    };

    orders.forEach(o => {
      if (o.area) {
        const areaLower = o.area.toLowerCase();
        if (areaLower.includes('sadar') || areaLower.includes('safar')) counts['Sadar Road Hub']++;
        else if (areaLower.includes('charfassion') || areaLower.includes('fassion')) counts['Charfassion Link']++;
        else if (areaLower.includes('lalmohan')) counts['Lalmohan Station']++;
        else counts['Tazumuddin Bazar']++;
      }
    });

    const activeRiders = systemUsers.filter(u => u.role === 'deliveryman').length || 4;

    return HUB_DENSITIES.map(hub => {
      const hubOrders = counts[hub.name] || 0;
      const ordersCount = hubOrders > 0 ? hubOrders : hub.orders;
      const ridersCount = hubOrders > 0 ? Math.max(1, Math.min(activeRiders, Math.floor(activeRiders / 2))) : hub.riders;

      return {
        ...hub,
        orders: ordersCount,
        riders: ridersCount
      };
    });
  };

  const dynamicHubDensities = getDynamicHubDensities();

  // Dynamic Revenue Chart mapping
  const getDynamicRevenueData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueByDay: { [key: string]: { online: number, offline: number } } = {
      'Mon': { online: 0, offline: 0 },
      'Tue': { online: 0, offline: 0 },
      'Wed': { online: 0, offline: 0 },
      'Thu': { online: 0, offline: 0 },
      'Fri': { online: 0, offline: 0 },
      'Sat': { online: 0, offline: 0 },
      'Sun': { online: 0, offline: 0 }
    };

    orders.forEach(o => {
      if (o.status === 'Delivered') {
        const dateObj = new Date(o.date);
        const dayName = days[isNaN(dateObj.getTime()) ? new Date().getDay() : dateObj.getDay()];
        if (revenueByDay[dayName]) {
          if (o.paymentMethod === 'Cash on Delivery') {
            revenueByDay[dayName].offline += o.total;
          } else {
            revenueByDay[dayName].online += o.total;
          }
        }
      }
    });

    const hasRealDeliveredRevenue = Object.values(revenueByDay).some(d => d.online > 0 || d.offline > 0);
    if (hasRealDeliveredRevenue) {
      return Object.entries(revenueByDay).map(([name, val]) => ({
        name,
        online: val.online,
        offline: val.offline
      }));
    }

    return REVENUE_DATA;
  };

  const dynamicRevenueData = getDynamicRevenueData();

  return (
    <div id="dashboard-page" className="bg-[#F9FAFB] min-h-screen pb-16 font-sans text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Push Notifications Configuration */}
        <PushNotificationManager />

        {/* User Hero Panel */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-5 justify-between mb-8">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="h-16 w-16 rounded-2xl bg-orange-600 text-white font-black text-2xl uppercase flex items-center justify-center shadow-xs">
              {(currentUser?.name || currentUser?.email || 'U').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                <h1 className="text-xl font-black text-gray-900 tracking-tight">{currentUser?.name || currentUser?.email || 'User'}</h1>
                {getRoleBadge(currentUser.role)}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 font-bold">Joined Bhola Online • Sadar, Bhola</p>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-1.5 border border-red-100 text-red-600 hover:bg-red-50 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 flex flex-col gap-1.5 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm self-start">
            
            {/* 1. Admin Sidebar Items */}
            {currentUser.role === 'admin' && (
              <>
                <div className="text-[10px] font-black uppercase tracking-widest text-red-500 px-4 py-2 border-b border-red-50 mb-1">
                  Admin Controls
                </div>
                <button
                  onClick={() => handleTabChange('admin_overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'admin_overview' 
                      ? 'bg-red-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4.5 w-4.5 text-red-500 group-hover:text-white" />
                    Overview
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('admin_orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'admin_orders' 
                      ? 'bg-red-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5" />
                    Manage Orders
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('admin_users')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'admin_users' 
                      ? 'bg-red-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Users className="h-4.5 w-4.5" />
                    Manage Users
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('admin_foods')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'admin_foods' 
                      ? 'bg-red-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-4.5 w-4.5" />
                    Manage Foods
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* 2. Sub-Admin Sidebar Items */}
            {currentUser.role === 'sub-admin' && (
              <>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 px-4 py-2 border-b border-indigo-50 mb-1">
                  Manager Workspace
                </div>
                <button
                  onClick={() => handleTabChange('subadmin_overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'subadmin_overview' 
                      ? 'bg-indigo-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="h-4.5 w-4.5" />
                    Manager Overview
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('subadmin_orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'subadmin_orders' 
                      ? 'bg-indigo-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5" />
                    Regional Orders
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* 3. Deliveryman Sidebar Items */}
            {currentUser.role === 'deliveryman' && (
              <>
                <div className="text-[10px] font-black uppercase tracking-widest text-green-600 px-4 py-2 border-b border-green-50 mb-1">
                  Rider Dashboard
                </div>
                <button
                  onClick={() => handleTabChange('delivery_portal')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'delivery_portal' 
                      ? 'bg-green-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Bike className="h-4.5 w-4.5" />
                    My Active Runs
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('delivery_history')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'delivery_history' 
                      ? 'bg-green-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5" />
                    Delivery History
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* 4. Common/User Sidebar Items */}
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-4 py-2 border-b border-gray-50 mt-2 mb-1">
              Personal Area
            </div>
            
            <button
              onClick={() => handleTabChange('profile')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'profile' 
                  ? 'bg-orange-600 text-white shadow-xs font-black' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <UserIcon className="h-4.5 w-4.5" />
                My Profile
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>

            {currentUser.role === 'user' && (
              <>
                <button
                  onClick={() => handleTabChange('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'orders' 
                      ? 'bg-orange-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-4.5 w-4.5" />
                    Order History
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('tracking')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'tracking' 
                      ? 'bg-orange-600 text-white shadow-xs font-black' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5" />
                    Track Order
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleTabChange('addresses')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'addresses' 
                      ? 'bg-orange-600 text-white shadow-xs' 
                      : 'text-gray-600 hover:bg-gray-50 font-black'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4.5 w-4.5" />
                    Saved Addresses
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            <button
              onClick={() => handleTabChange('wishlist')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'wishlist' 
                  ? 'bg-orange-600 text-white shadow-xs font-black' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4.5 w-4.5" />
                My Wishlist
              </span>
              {wishlist.length > 0 && (
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  activeTab === 'wishlist' ? 'bg-white text-orange-600' : 'bg-red-50 text-red-500'
                }`}>
                  {wishlist.length}
                </span>
              )}
            </button>
          </aside>

          {/* Active Workspace Viewport */}
          <main className="lg:col-span-3">

            {/* Admin Overview Tab View */}
            {activeTab === 'admin_overview' && (
              <div className="space-y-6">
                {/* Header with Export */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Today's Sales Summary</h2>
                    <p className="text-xs text-gray-450 font-bold flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span>Comprehensive real-time insights for Bhola Delivery Network</span>
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Polling Active (প্রতি ৫ সেকেন্ডে আপডেট)
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={() => playNotificationSound()}
                      className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-150 text-orange-700 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                      title="Test the Messenger-style notification chime"
                    >
                      <Volume2 className="h-4 w-4" />
                      <span>Test Sound</span>
                    </button>
                    <button 
                      onClick={() => downloadAllOrdersBackup(orders)}
                      className="flex items-center gap-2 bg-[#F8F9FA] hover:bg-[#E9ECEF] border border-[#DEE2E6] text-gray-700 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs"
                    >
                      <Download className="h-4 w-4 text-gray-600" />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* Mockup 4 Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Pink Card: Last 24 Hours Sales */}
                  <div className="bg-[#FFE2E5] p-5 rounded-3xl border border-[#FFD2D7] shadow-xs flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-red-500 text-white rounded-2xl shadow-xs"><DollarSign className="h-5 w-5" /></div>
                      <span className="text-[10px] font-black text-red-700 bg-white/50 px-2 py-0.5 rounded-md uppercase tracking-wider">24 Hours</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">৳{last24hSales.toLocaleString()}</h3>
                      <p className="text-[11px] text-gray-850 font-extrabold mt-1">Sales (Last 24h)</p>
                      <p className="text-[9px] text-red-600 font-bold mt-0.5">Live database statistics</p>
                    </div>
                  </div>

                  {/* Orange Card: Last 24 Hours Orders */}
                  <div className="bg-[#FFF4DE] p-5 rounded-3xl border border-[#FFE2B8] shadow-xs flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xs"><ShoppingBag className="h-5 w-5" /></div>
                      <span className="text-[10px] font-black text-amber-700 bg-white/50 px-2 py-0.5 rounded-md uppercase tracking-wider">24 Hours</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{last24hOrders}</h3>
                      <p className="text-[11px] text-gray-850 font-extrabold mt-1">Orders (Last 24h)</p>
                      <p className="text-[9px] text-amber-600 font-bold mt-0.5">Live order dispatches</p>
                    </div>
                  </div>

                  {/* Green Card: Last 24 Hours Products Sold */}
                  <div className="bg-[#DCFCE7] p-5 rounded-3xl border border-[#BBF7D0] shadow-xs flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-xs"><Layers className="h-5 w-5" /></div>
                      <span className="text-[10px] font-black text-emerald-700 bg-white/50 px-2 py-0.5 rounded-md uppercase tracking-wider">24 Hours</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{last24hProductsSold} Items</h3>
                      <p className="text-[11px] text-gray-850 font-extrabold mt-1">Items Sold (Last 24h)</p>
                      <p className="text-[9px] text-emerald-700 font-bold mt-0.5">Quantity delivered</p>
                    </div>
                  </div>

                  {/* Purple Card: Last 24 Hours New Users */}
                  <div className="bg-[#F3E8FF] p-5 rounded-3xl border border-[#E9D5FF] shadow-xs flex flex-col justify-between h-40 transition-transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="p-3 bg-purple-500 text-white rounded-2xl shadow-xs"><Users className="h-5 w-5" /></div>
                      <span className="text-[10px] font-black text-purple-700 bg-white/50 px-2 py-0.5 rounded-md uppercase tracking-wider">24 Hours</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">{last24hNewUsers}</h3>
                      <p className="text-[11px] text-gray-850 font-extrabold mt-1">New Users (Last 24h)</p>
                      <p className="text-[9px] text-purple-700 font-bold mt-0.5">Signed up in 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Row 1: Visitor Insights (Line Chart) & Total Revenue (Bar Chart) */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Visitor Insights Line Chart - width 3/5 on large screens */}
                  <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">Visitor Insights</h3>
                      <p className="text-[11px] text-gray-400 font-bold mb-4">Traffic analysis including Loyal, New and Unique visitors</p>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={VISITOR_INSIGHTS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                          <Line type="monotone" dataKey="loyal" name="Loyal Customers" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="newCustomers" name="New Customers" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="unique" name="Unique Customers" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Total Revenue Bar Chart - width 2/5 on large screens */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">Total Revenue</h3>
                      <p className="text-[11px] text-gray-400 font-bold mb-4">Comparison of Online and Offline orders</p>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dynamicRevenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                          <Bar dataKey="online" name="Online Sales" fill="#00D8C6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="offline" name="Offline Sales" fill="#10B981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Row 2: Customer Satisfaction (Area Chart), Target vs Reality (Bar Chart), Volume vs Service (Bar) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Customer Satisfaction Area Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">Customer Satisfaction</h3>
                      <p className="text-[11px] text-gray-400 font-bold mb-4">Comparative index for Last Month vs This Month</p>
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={SATISFACTION_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorLast" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorThis" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={8} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="lastMonth" name="Last Month" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorLast)" />
                          <Area type="monotone" dataKey="thisMonth" name="This Month" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorThis)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-around border-t border-gray-50 pt-3 mt-3 text-[10px] font-bold">
                      <div className="text-center">
                        <span className="text-gray-400">Last Month</span>
                        <p className="text-xs font-black text-gray-900">৳17,800</p>
                      </div>
                      <div className="text-center">
                        <span className="text-emerald-500">This Month</span>
                        <p className="text-xs font-black text-gray-900">৳22,900</p>
                      </div>
                    </div>
                  </div>

                  {/* Target vs Reality Bar Chart */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">Target vs Reality</h3>
                      <p className="text-[11px] text-gray-400 font-bold mb-4">Targeted sales benchmarks vs actual performance</p>
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={TARGET_REALITY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={8} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="target" name="Target Sales" fill="#FBBF24" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="reality" name="Reality Sales" fill="#10B981" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-around border-t border-gray-50 pt-3 mt-3 text-[10px] font-bold">
                      <div className="text-center">
                        <span className="text-[#FBBF24]">Target Sales</span>
                        <p className="text-xs font-black text-gray-900">৳12,122</p>
                      </div>
                      <div className="text-center">
                        <span className="text-emerald-500">Reality Sales</span>
                        <p className="text-xs font-black text-gray-900">৳8,823</p>
                      </div>
                    </div>
                  </div>

                  {/* Volume vs Service Level */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-1">Volume vs Service Level</h3>
                      <p className="text-[11px] text-gray-400 font-bold mb-4">Total Hub throughput matched with completed SLAs</p>
                    </div>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={VOLUME_SERVICE_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                          <XAxis dataKey="name" stroke="#9CA3AF" fontSize={8} tickLine={false} axisLine={false} />
                          <YAxis stroke="#9CA3AF" fontSize={8} tickLine={false} axisLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="volume" name="Volume" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                          <Bar dataKey="services" name="Services" fill="#00D8C6" radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-around border-t border-gray-50 pt-3 mt-3 text-[10px] font-bold">
                      <div className="text-center">
                        <span className="text-[#3B82F6]">Volume</span>
                        <p className="text-xs font-black text-gray-900">1,135</p>
                      </div>
                      <div className="text-center">
                        <span className="text-cyan-500">Services</span>
                        <p className="text-xs font-black text-gray-900">635</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Top Products & Hub Active Mapping */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Top Products */}
                  <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                    <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Top Products (জনপ্রিয় খাবারসমূহ)
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-gray-500 border-collapse">
                        <thead>
                          <tr className="text-gray-400 font-extrabold border-b border-gray-50 text-[10px] uppercase tracking-wider">
                            <th className="py-2.5">#</th>
                            <th className="py-2.5">Name</th>
                            <th className="py-2.5">Popularity</th>
                            <th className="py-2.5 text-right">Sales Share</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dynamicTopProducts.map((prod) => (
                            <tr key={prod.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 font-mono font-black text-gray-400">{prod.id}</td>
                              <td className="py-3 font-bold text-gray-900">{prod.name}</td>
                              <td className="py-3 w-1/3">
                                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prod.popularity}%`, backgroundColor: prod.color }} />
                                </div>
                              </td>
                              <td className="py-3 text-right">
                                <span className="px-2.5 py-1 text-[10px] font-black rounded-lg border" style={{ color: prod.color, borderColor: `${prod.color}30`, backgroundColor: `${prod.color}10` }}>
                                  {prod.salesPercentage}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bhola Regional Hub Density Card (Replacing Country map to make it relevant to Bhola Food Delivery app!) */}
                  <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                        <Map className="h-5 w-5 text-red-600" />
                        Bhola Hub Density & Riders
                      </h3>
                      <div className="space-y-4">
                        {dynamicHubDensities.map((hub, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100/75 rounded-2xl border border-gray-100/50 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-2.5 h-2.5 rounded-full ${hub.color}`} />
                              <div>
                                <p className="text-xs font-black text-gray-900">{hub.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold">{hub.density}</p>
                              </div>
                            </div>
                            <div className="text-right text-[11px] font-bold">
                              <p className="text-gray-900">{hub.orders} Orders</p>
                              <p className="text-red-600 text-[10px]">{hub.riders} Riders Active</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3.5 bg-green-50 border border-green-100 rounded-2xl text-[11px] text-green-800 font-semibold mt-4">
                      💡 <strong>Active Network status:</strong> All 4 hubs are linked. Deliveries are performing within the optimal target rate (24-minute average dispatch).
                    </div>
                  </div>
                </div>

                {/* Lifetime Grand Totals Section */}
                <div className="mt-8 pt-6 border-t border-gray-150">
                  <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Lifetime Grand Totals (আজ পর্যন্ত সর্বমোট হিসাব)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Indigo Card: Lifetime Sales */}
                    <div className="bg-[#E0E7FF]/40 p-4 rounded-2xl border border-indigo-100 shadow-xs flex items-center gap-4 transition-transform hover:scale-[1.01]">
                      <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs"><DollarSign className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Lifetime Sales</p>
                        <h4 className="text-xl font-black text-gray-900">৳{realSales.toLocaleString()}</h4>
                      </div>
                    </div>

                    {/* Orange Card: Lifetime Orders */}
                    <div className="bg-[#FFF4DE]/40 p-4 rounded-2xl border border-amber-100 shadow-xs flex items-center gap-4 transition-transform hover:scale-[1.01]">
                      <div className="p-3 bg-amber-600 text-white rounded-xl shadow-xs"><ShoppingBag className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Lifetime Orders</p>
                        <h4 className="text-xl font-black text-gray-900">{realOrders}</h4>
                      </div>
                    </div>

                    {/* Green Card: Lifetime Product Sold */}
                    <div className="bg-[#DCFCE7]/40 p-4 rounded-2xl border border-emerald-100 shadow-xs flex items-center gap-4 transition-transform hover:scale-[1.01]">
                      <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs"><Layers className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Total Items Sold</p>
                        <h4 className="text-xl font-black text-gray-900">{realProductsSold} Items</h4>
                      </div>
                    </div>

                    {/* Purple Card: Lifetime System Users */}
                    <div className="bg-[#F3E8FF]/40 p-4 rounded-2xl border border-purple-100 shadow-xs flex items-center gap-4 transition-transform hover:scale-[1.01]">
                      <div className="p-3 bg-purple-600 text-white rounded-xl shadow-xs"><Users className="h-5 w-5" /></div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Lifetime Users</p>
                        <h4 className="text-xl font-black text-gray-900">{realSystemUsers}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Orders Tab View */}
            {activeTab === 'admin_orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-5 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingBag className="h-5 w-5 text-red-600" />
                  Global Order Dispatcher (সকল অর্ডারের তালিকা)
                </h3>

                <p className="text-xs text-gray-400 mb-6 font-semibold leading-relaxed">
                  As a System Administrator, you can monitor, dispatch, or change status for any active customer orders in Bhola. Updates will render in the customer's live tracking view.
                </p>

                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-500 border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFB] text-gray-700 font-extrabold border-b border-gray-100">
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Order ID</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Customer</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Location</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Total</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Status</th>
                          <th className="py-3 px-4 text-right uppercase tracking-wider text-[10px]">Actions (স্ট্যাটাস পরিবর্তন)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{order.id}</td>
                            <td className="py-3.5 px-4 font-bold">
                              <div>{order.name}</div>
                              <div className="text-[10px] text-gray-400 font-mono font-medium">{order.phone}</div>
                            </td>
                            <td className="py-3.5 px-4 truncate max-w-[150px] font-semibold">{order.area}</td>
                            <td className="py-3.5 px-4 font-black text-gray-900">৳{order.total}</td>
                            <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Processing', 1)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Change to Preparing"
                                >
                                  Prepare
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Processing', 2)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Change to Out For Delivery"
                                >
                                  Ship Rider
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Delivered', 3)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Mark as Delivered"
                                >
                                  Deliver
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Cancelled', 0)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Cancel Order"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xs text-gray-400 font-semibold">No active system orders found.</p>
                  </div>
                )}
              </div>
            )}

            {/* Admin Users Tab View */}
            {activeTab === 'admin_users' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-50 pb-3 mb-5 gap-3">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Users className="h-5 w-5 text-red-600" />
                    Manage System Users & Roles (ইউজার রোল পরিবর্তন)
                  </h3>
                  <div className="relative w-full sm:w-64">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <Search className="h-3.5 w-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search accounts..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200 py-1.5 pl-8 pr-3 text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-6 font-semibold leading-relaxed">
                  Modify registered user roles instantly. You can upgrade any User to an Admin, Sub-Admin, or Delivery Rider to test their specialized interfaces.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-500 border-collapse">
                    <thead>
                      <tr className="bg-[#F9FAFB] text-gray-700 font-extrabold border-b border-gray-100">
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">User Details</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Email Address</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Mobile Phone</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Current Role</th>
                        <th className="py-3 px-4 text-right uppercase tracking-wider text-[10px]">Change Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {systemUsers
                        .filter(u => 
                          u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone.includes(userSearch)
                        )
                        .map((user) => (
                          <tr key={user.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                              <div className="h-7 w-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs uppercase">
                                {user.name.charAt(0)}
                              </div>
                              <span>{user.name}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-650">{user.email}</td>
                            <td className="py-3.5 px-4 font-mono font-semibold">{user.phone}</td>
                            <td className="py-3.5 px-4">{getRoleBadge(user.role)}</td>
                            <td className="py-3.5 px-4 text-right">
                              <select
                                value={user.role}
                                onChange={(e) => handleUserRoleChange(user.id, e.target.value as any)}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 focus:outline-none cursor-pointer focus:border-red-500"
                              >
                                <option value="user">Regular Customer (গ্রাহক)</option>
                                <option value="admin">System Admin (এডমিন)</option>
                                <option value="sub-admin">Sub-Admin (সহকারী এডমিন)</option>
                                <option value="deliveryman">Delivery Rider (ডেলিভারিম্যান)</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Admin Foods Tab View */}
            {activeTab === 'admin_foods' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-50 pb-3 mb-5 gap-3">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers className="h-5 w-5 text-red-600" />
                      Manage Delicacies Directory (খাবারের তালিকা ব্যবস্থাপনা)
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetDbSeed}
                      disabled={isSyncingDb}
                      className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                      title="Uploads all current food items, kitchens, and reviews to MongoDB database"
                    >
                      <Download className={`h-4 w-4 ${isSyncingDb ? 'animate-spin' : 'animate-bounce'}`} />
                      <span>{isSyncingDb ? 'Syncing...' : 'Upload/Reset MongoDB Foods (ডাটাবেজে আপলোড)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddFoodForm(!showAddFoodForm)}
                      className="flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add New Food</span>
                    </button>
                  </div>
                </div>

                {syncMessage && (
                  <div className={`mb-4 p-3.5 rounded-xl border text-xs font-bold animate-fade-in ${
                    syncMessage.startsWith('Error') 
                      ? 'bg-red-50 text-red-600 border-red-150' 
                      : 'bg-green-55 text-green-700 border-green-200'
                  }`}>
                    {syncMessage}
                  </div>
                )}

                {showAddFoodForm && (
                  <form onSubmit={handleAddFoodSubmit} className="bg-gray-50 rounded-2xl p-5 border border-gray-150 mb-6 space-y-4 animate-fade-in">
                    <h4 className="text-[11px] font-black text-red-600 uppercase tracking-widest border-b border-gray-200 pb-2">Create New Delicacy Listing</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Food Name *</label>
                        <input
                          type="text"
                          required
                          value={newFoodName}
                          onChange={(e) => setNewFoodName(e.target.value)}
                          placeholder="e.g. Special Bhola Rosgolla"
                          className="w-full bg-white rounded-xl border border-gray-200 py-2.5 px-3.5 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Price (৳) *</label>
                        <input
                          type="number"
                          required
                          value={newFoodPrice}
                          onChange={(e) => setNewFoodPrice(e.target.value)}
                          placeholder="e.g. 250"
                          className="w-full bg-white rounded-xl border border-gray-200 py-2.5 px-3.5 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Category</label>
                        <select
                          value={newFoodCategory}
                          onChange={(e) => setNewFoodCategory(e.target.value)}
                          className="w-full bg-white rounded-xl border border-gray-200 py-2.5 px-3 focus:border-red-500 focus:outline-none cursor-pointer"
                        >
                          <option value="sweetmeats">Sweets & Dessert (মিষ্টি)</option>
                          <option value="curries">Traditional Curries (তরকারি)</option>
                          <option value="snacks">Quick Snacks (নাস্তা)</option>
                          <option value="streetfood">Street Food (স্ট্রিট ফুড)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Prep Time</label>
                        <input
                          type="text"
                          value={newFoodPrep}
                          onChange={(e) => setNewFoodPrep(e.target.value)}
                          placeholder="e.g. 15-20 min"
                          className="w-full bg-white rounded-xl border border-gray-200 py-2.5 px-3.5 focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={newFoodDesc}
                          onChange={(e) => setNewFoodDesc(e.target.value)}
                          placeholder="Describe the savory or sweet taste of this Bhola item..."
                          className="w-full bg-white rounded-xl border border-gray-200 py-2.5 px-3.5 focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      {/* Product Images Upload Section (Up to 4 Images) */}
                      <div className="sm:col-span-2 border-t border-gray-150 pt-4 mt-2">
                        <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-2">
                          Product Images (খাবারের ছবিসমূহ - সর্বোচ্চ ৪টি)
                        </label>
                        <p className="text-[11px] text-gray-400 mb-4 font-semibold leading-relaxed">
                          You can upload up to 4 images (1 Main Image and 3 Gallery Images). Click any box to select a local image file or type/paste an image URL directly!
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          {/* Slot 1: Main Image */}
                          <div className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs relative">
                            <span className="absolute top-2 left-2 z-10 bg-orange-600 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full shadow-xs">
                              Main Image
                            </span>
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-150 flex flex-col items-center justify-center group h-32 sm:h-28">
                              {newFoodImage ? (
                                <>
                                  <img 
                                    src={newFoodImage} 
                                    alt="Main food item" 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover animate-fade-in" 
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setNewFoodImage('')}
                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                                  >
                                    Remove (মুছুন)
                                  </button>
                                </>
                              ) : (
                                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors p-4 text-center">
                                  <PlusCircle className="h-6 w-6 text-gray-400 mb-1" />
                                  <span className="text-[10px] text-gray-500 font-extrabold">Upload File</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageFileChange(e, 0)}
                                    className="hidden" 
                                  />
                                </label>
                              )}
                            </div>
                            <input
                              type="text"
                              value={newFoodImage}
                              onChange={(e) => setNewFoodImage(e.target.value)}
                              placeholder="Or paste image URL..."
                              className="w-full bg-gray-50 rounded-lg border border-gray-200 py-1 px-2 text-[10px] font-mono focus:border-red-500 focus:outline-none"
                            />
                          </div>

                          {/* Extra Slots 2, 3, 4 */}
                          {[1, 2, 3].map((num) => {
                            const imgVal = extraFoodImages[num - 1] || '';
                            return (
                              <div key={num} className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-gray-200 shadow-xs relative">
                                <span className="absolute top-2 left-2 z-10 bg-gray-500 text-white font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full shadow-xs">
                                  Gallery {num}
                                </span>
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-150 flex flex-col items-center justify-center group h-32 sm:h-28">
                                  {imgVal ? (
                                    <>
                                      <img 
                                        src={imgVal} 
                                        alt={`Gallery food ${num}`} 
                                        referrerPolicy="no-referrer"
                                        className="w-full h-full object-cover animate-fade-in" 
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setExtraFoodImages(prev => {
                                            const updated = [...prev];
                                            updated[num - 1] = '';
                                            return updated;
                                          });
                                        }}
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold cursor-pointer"
                                      >
                                        Remove (মুছুন)
                                      </button>
                                    </>
                                  ) : (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors p-4 text-center">
                                      <PlusCircle className="h-6 w-6 text-gray-400 mb-1" />
                                      <span className="text-[10px] text-gray-500 font-extrabold">Upload File</span>
                                      <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => handleImageFileChange(e, num)}
                                        className="hidden" 
                                      />
                                    </label>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  value={imgVal}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setExtraFoodImages(prev => {
                                      const updated = [...prev];
                                      updated[num - 1] = val;
                                      return updated;
                                    });
                                  }}
                                  placeholder={`Or paste URL ${num}...`}
                                  className="w-full bg-gray-50 rounded-lg border border-gray-200 py-1 px-2 text-[10px] font-mono focus:border-red-500 focus:outline-none"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddFoodForm(false)}
                        className="rounded-xl bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 font-extrabold text-xs px-5 py-2.5 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 transition-colors shadow-xs cursor-pointer"
                      >
                        Publish Delicacy
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-500 border-collapse">
                    <thead>
                      <tr className="bg-[#F9FAFB] text-gray-700 font-extrabold border-b border-gray-100">
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Food Item</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Category</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Price</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Prep Time</th>
                        <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Featured</th>
                        <th className="py-3 px-4 text-right uppercase tracking-wider text-[10px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foodsList.map((food) => (
                        <tr key={food.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2">
                            <img referrerPolicy="no-referrer" src={food.image} alt={food.name} className="h-9 w-12 object-cover rounded-lg border border-gray-100 animate-fade-in" />
                            <span>{food.name}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold uppercase text-[10px] text-gray-400">{food.category}</td>
                          <td className="py-3.5 px-4 font-black text-gray-900">৳{food.price}</td>
                          <td className="py-3.5 px-4 font-medium text-gray-650">{food.prepTime}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleFoodFeatured(food.id)}
                              className={`px-2.5 py-1 text-[9px] font-black rounded-md uppercase tracking-wider border cursor-pointer transition-all ${
                                food.isFeatured
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {food.isFeatured ? '★ Featured' : 'Normal'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleFoodStock(food.id)}
                                className={`px-2.5 py-1.5 text-[9px] font-black rounded-lg uppercase tracking-wider border cursor-pointer transition-all ${
                                  food.isOutOfStock
                                    ? 'bg-red-50 text-red-600 border-red-200'
                                    : 'bg-green-55 text-green-700 border-green-200 hover:bg-green-100/80'
                                }`}
                                title={food.isOutOfStock ? "Change status to In Stock (স্টকে আছে)" : "Mark as Stock Out (স্টক শেষ)"}
                              >
                                {food.isOutOfStock ? '● Stock Out' : 'In Stock'}
                              </button>
                              <button
                                onClick={() => handleDeleteFood(food.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors cursor-pointer"
                                title="Delete food item (ডিলিট করুন)"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-Admin Overview Tab View */}
            {activeTab === 'subadmin_overview' && (
              <div className="space-y-6">
                <div className="bg-[#4F46E5] text-white p-6 rounded-3xl relative overflow-hidden shadow-xs">
                  <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600')` }} />
                  <div className="relative z-10 max-w-xl">
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white">Manager Portal</span>
                    <h3 className="text-xl font-black mt-2">Welcome to your Sub-Admin Workspace</h3>
                    <p className="text-xs text-indigo-100 mt-1 font-semibold leading-relaxed">
                      You are in charge of coordinating food preparations and assigning riders to respective areas in Bhola region. Use the Regional Orders tab to manage orders in Sadar, Charfassion, or Lalmohan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Assigned Deliveries</h4>
                    <h3 className="text-2xl font-black text-indigo-600">{orders.filter(o => o.status === 'Processing').length}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Pending riders match</p>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs">
                    <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Delivered Total</h4>
                    <h3 className="text-2xl font-black text-green-600">{orders.filter(o => o.status === 'Delivered').length}</h3>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">Safar road active deliveries</p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Admin Orders Tab View */}
            {activeTab === 'subadmin_orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-5 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                  Regional Area Delivery Dispatch (আঞ্চলিক অর্ডার ট্র্যাকার)
                </h3>
                
                <p className="text-xs text-gray-400 mb-6 font-semibold">
                  Update customer meal status for regional orders and matches.
                </p>

                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-500 border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFB] text-gray-700 font-extrabold border-b border-gray-100">
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Order ID</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Location</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Status</th>
                          <th className="py-3 px-4 text-right uppercase tracking-wider text-[10px]">Quick Assign & Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{order.id}</td>
                            <td className="py-3.5 px-4 truncate max-w-[150px] font-semibold">{order.area}</td>
                            <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Processing', 1)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="px-2 py-1 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  Kitchen Cook
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Processing', 2)}
                                  disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                  className="px-2 py-1 text-[10px] font-bold rounded-lg bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  Match Rider
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-xs text-gray-400 font-semibold">No regional orders currently active.</p>
                  </div>
                )}
              </div>
            )}

            {/* Deliveryman Portal Tab View */}
            {activeTab === 'delivery_portal' && (
              <div className="space-y-6">
                <div className="bg-[#10B981] text-white p-6 rounded-3xl relative overflow-hidden shadow-xs animate-fade-in">
                  <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600')` }} />
                  <div className="relative z-10 max-w-xl">
                    <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white">Rider Portal</span>
                    <h3 className="text-xl font-black mt-2">Zooming through Bhola</h3>
                    <p className="text-xs text-green-100 mt-1 font-semibold leading-relaxed">
                      Accept active customer orders, zoom to their locations, and update statuses using our **Rider Checkpoint Simulator** below!
                    </p>
                  </div>
                </div>

                {/* Rider Active Work List */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                    <Bike className="h-5 w-5 text-green-600" />
                    Available / Active Deliveries (ডেলিভারি কাজসমূহ)
                  </h3>

                  {orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length > 0 ? (
                    <div className="space-y-4">
                      {orders
                        .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
                        .map((order) => (
                          <div key={order.id} className="p-4 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-gray-900 text-sm">{order.id}</span>
                                {getStatusBadge(order.status)}
                              </div>
                              <div className="text-gray-400 font-bold mt-1">Recipient: <span className="text-gray-900">{order.name}</span> ({order.phone})</div>
                              <div className="text-gray-500 font-semibold mt-1">Address: <span className="text-gray-900">{order.address}</span> ({order.area})</div>
                              <div className="text-orange-600 font-black mt-1">Value: ৳{order.total} • COD/bKash</div>
                            </div>
                            <div className="flex gap-2">
                              {order.trackingStep < 2 ? (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Processing', 2)}
                                  className="rounded-xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-wider px-4 py-2 text-[10px] shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                                >
                                  Accept & Ship
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'Delivered', 3)}
                                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider px-4 py-2 text-[10px] shadow-xs cursor-pointer transition-all hover:scale-105 active:scale-95"
                                >
                                  Mark Delivered
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-xs text-gray-400 font-semibold">No active orders available for delivery right now.</p>
                    </div>
                  )}
                </div>

                {/* Rider Checkpoint Simulator */}
                {orders.filter(o => o.status === 'Processing' && o.trackingStep === 2).length > 0 && (
                  <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                      <Map className="h-5 w-5 text-green-600" />
                      Rider Delivery Simulator (লাইভ ট্র্যাকিং সিমুলেটর)
                    </h3>
                    <p className="text-xs text-gray-400 mb-5 font-semibold">
                      You are currently delivering order **{orders.find(o => o.status === 'Processing' && o.trackingStep === 2)?.id}**. Press the button below to update checkpoint telemetry:
                    </p>

                    <div className="grid grid-cols-5 gap-2 mb-6 text-center text-[10px] font-black uppercase">
                      {['Kitchen', 'Bazar Bridge', 'Sadar Road', 'Hospital Rd', 'Customer Gate'].map((pt, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 mb-1 transition-all ${
                            riderCheckpoint >= idx
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-gray-50 border-gray-200 text-gray-300'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`${riderCheckpoint >= idx ? 'text-green-600 font-black' : 'text-gray-300'}`}>{pt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        disabled={riderCheckpoint === 4}
                        onClick={() => setRiderCheckpoint(p => Math.min(4, p + 1))}
                        className="rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-300 text-white font-extrabold text-xs px-5 py-2.5 shadow-xs cursor-pointer"
                      >
                        Advance Checkpoint
                      </button>
                      <button
                        onClick={() => {
                          const activeOrd = orders.find(o => o.status === 'Processing' && o.trackingStep === 2);
                          if (activeOrd) {
                            updateOrderStatus(activeOrd.id, 'Delivered', 3);
                            setRiderCheckpoint(0);
                          }
                        }}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 shadow-xs cursor-pointer"
                      >
                        Complete Handover
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Deliveryman History Tab View */}
            {activeTab === 'delivery_history' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-4 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShoppingBag className="h-5 w-5 text-green-600" />
                  Your Delivery History
                </h3>
                {orders.filter(o => o.status === 'Delivered').length > 0 ? (
                  <div className="space-y-3.5">
                    {orders
                      .filter(o => o.status === 'Delivered')
                      .map((order) => (
                        <div key={order.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold flex justify-between items-center">
                          <div>
                            <span className="font-mono font-black text-gray-900">{order.id}</span>
                            <span className="text-gray-400 ml-2">Delivered to {order.area}</span>
                          </div>
                          <span className="text-green-600 font-extrabold uppercase text-[10px]">Completed</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-400 font-semibold">No finished deliveries found in your log.</p>
                  </div>
                )}
              </div>
            )}

            {/* profile Tab View */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-5 flex items-center gap-1.5 uppercase tracking-wider">
                  <UserCheck className="h-5 w-5 text-orange-600" />
                  Edit Profile Details
                </h3>

                {profileSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-100 text-green-800 rounded-xl p-3 text-xs font-bold">
                    Profile details updated successfully!
                  </div>
                )}
                {profileError && (
                  <div className="mb-4 bg-red-50 border border-red-100 text-red-800 rounded-xl p-3 text-xs font-bold">
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfileSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Rahman"
                      className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. tanvir@bhola.com"
                      className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Mobile Phone (11 digits)</label>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Regional Delivery Area</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200 py-2.5 px-3 text-xs font-bold text-gray-800 focus:border-orange-500 focus:outline-none cursor-pointer"
                    >
                      {BHOLA_AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">Primary Home Address</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House 45, Level 2, Sadar Road, Bhola Sadar"
                      className="w-full bg-[#F9FAFB] rounded-xl border border-gray-200 px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer"
                    >
                      Save Profile Updates
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab View */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-50 pb-3 mb-5 gap-3">
                  <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <ShoppingBag className="h-5 w-5 text-orange-600" />
                    Your Order History
                  </h3>
                  {orders.length > 0 && (
                    <button
                      onClick={() => downloadAllOrdersBackup(orders)}
                      className="flex items-center gap-1 bg-orange-50 border border-orange-100/50 hover:bg-orange-100/50 text-orange-600 px-3.5 py-1.5 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Backup History (রিপোর্ট ডাউনলোড)</span>
                    </button>
                  )}
                </div>

                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-500 border-collapse">
                      <thead>
                        <tr className="bg-[#F9FAFB] text-gray-700 font-extrabold border-b border-gray-100">
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Order ID</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Date Placed</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Grand Total</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Payment Method</th>
                          <th className="py-3 px-4 uppercase tracking-wider text-[10px]">Delivery Status</th>
                          <th className="py-3 px-4 text-right uppercase tracking-wider text-[10px]">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-gray-50 hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{order.id}</td>
                            <td className="py-3.5 px-4 font-bold">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="py-3.5 px-4 font-black text-gray-900">৳{order.total}</td>
                            <td className="py-3.5 px-4 font-bold">{order.paymentMethod}</td>
                            <td className="py-3.5 px-4">{getStatusBadge(order.status)}</td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-3.5">
                                <button
                                  onClick={() => {
                                    setSelectedTrackingOrderId(order.id);
                                    handleTabChange('tracking');
                                  }}
                                  className="text-xs font-black text-orange-600 hover:text-orange-700 hover:underline cursor-pointer whitespace-nowrap"
                                >
                                  Track Item
                                </button>
                                <button
                                  onClick={() => downloadInvoiceFile(order)}
                                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-150 text-gray-500 hover:text-orange-600 transition-colors cursor-pointer"
                                  title="Download Invoice Receipt (.txt)"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-400 font-semibold">You haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Tracking Timeline Tab View */}
            {activeTab === 'tracking' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-6 flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="h-5 w-5 text-orange-600" />
                  Real-time Delivery Tracking
                </h3>

                {/* Dropdown selector if multiple orders exist */}
                {orders.length > 1 && (
                  <div className="flex items-center gap-2 mb-6 bg-[#F9FAFB] p-3 rounded-2xl border border-gray-100 text-xs">
                    <span className="font-extrabold text-gray-500 uppercase tracking-wider text-[10px]">Select Order:</span>
                    <select
                      value={selectedTrackingOrderId || ''}
                      onChange={(e) => setSelectedTrackingOrderId(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 font-bold text-gray-850 focus:outline-none cursor-pointer"
                    >
                      {orders.map((o) => (
                        <option key={o.id} value={o.id}>{o.id} - (৳{o.total})</option>
                      ))}
                    </select>
                  </div>
                )}

                {activeTrackingOrder ? (
                  <div className="flex flex-col gap-8">
                    
                    {/* Header Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F9FAFB] border border-gray-100 p-4 rounded-2xl text-xs font-semibold mb-1">
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Order Reference</span>
                        <span className="text-xs font-black text-gray-900 font-mono">{activeTrackingOrder.id}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Estimated Arriving</span>
                        <span className="text-xs font-black text-orange-600">
                          {activeTrackingOrder.trackingStep === 3 ? 'Arrived!' : '25-35 minutes'}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Delivery Zone</span>
                        <span className="text-xs font-black text-gray-900 truncate block">{activeTrackingOrder.area}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 font-bold uppercase">Current Status</span>
                        <span className="block mt-0.5">{getStatusBadge(activeTrackingOrder.status)}</span>
                      </div>
                    </div>

                    {/* Download Invoice Memo Quick Action */}
                    <div className="bg-orange-50/50 border border-orange-100/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-gray-700 animate-fade-in">
                      <div className="flex items-center gap-2 text-left">
                        <Download className="h-4 w-4 text-orange-600 shrink-0" />
                        <span>Need a copy of your memo? Download your official invoice receipt file!</span>
                      </div>
                      <button
                        onClick={() => downloadInvoiceFile(activeTrackingOrder)}
                        className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-black uppercase tracking-wider px-4 py-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Download Memo (.TXT)
                      </button>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="relative flex flex-col gap-8 pl-10 pt-2 border-l-2 border-dashed border-gray-100 ml-4">
                      {[
                        { 
                          title: 'Order Placed & Confirmed', 
                          desc: 'We received your order and the kitchen has verified details.',
                          time: 'Step 0',
                          completed: activeTrackingOrder.trackingStep >= 0 
                        },
                        { 
                          title: 'Preparing Your Scrumptious Food', 
                          desc: 'Our chefs are cooking your fresh meal in hygienic packages.',
                          time: 'Step 1',
                          completed: activeTrackingOrder.trackingStep >= 1 
                        },
                        { 
                          title: 'Rider Out for Delivery', 
                          desc: 'Our professional delivery rider has picked up your food and is zooming to your address.',
                          time: 'Step 2',
                          completed: activeTrackingOrder.trackingStep >= 2 
                        },
                        { 
                          title: 'Arrived at Your Table', 
                          desc: 'Enjoy your delicious meal! Don\'t forget to leave a review.',
                          time: 'Step 3',
                          completed: activeTrackingOrder.trackingStep >= 3 
                        }
                      ].map((step, idx) => (
                        <div key={idx} className="relative">
                          {/* Circle Dot Marker */}
                          <div 
                            className={`absolute -left-[51px] top-0 h-6 w-6 rounded-full flex items-center justify-center border-2 shadow-xs transition-all duration-300 z-10 ${
                              step.completed
                                ? 'bg-orange-600 border-orange-600 text-white font-extrabold'
                                : 'bg-white border-gray-200 text-gray-300 font-bold'
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="h-3.5 w-3.5" />
                            ) : (
                              <span className="text-[9px]">{idx}</span>
                            )}
                          </div>

                          <div className="flex flex-col">
                            <h4 className={`text-xs font-black uppercase tracking-tight transition-colors ${
                              step.completed ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-gray-400 mt-1 max-w-lg leading-relaxed font-semibold">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline Live Map Placement */}
                    <div className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50 aspect-video relative flex items-center justify-center text-center p-6 mt-4 shadow-xs">
                      {/* Ambient illustration inside maps */}
                      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600')` }} />
                      
                      <div className="relative z-10 flex flex-col items-center gap-2 max-w-xs">
                        <div className="h-12 w-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center animate-ping absolute" />
                        <div className="h-12 w-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center relative shadow-xs">
                          <Package className="h-5 w-5" />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Live Rider Tracking</h4>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-semibold">
                          Our rider **Tarek** is heading towards **{activeTrackingOrder.area}**. Average timing is extremely fast.
                        </p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-400 font-semibold">No orders found to track.</p>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab View */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-5 flex items-center gap-1.5 uppercase tracking-wider">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  Manage Delivery Addresses
                </h3>

                <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl flex items-start gap-3.5 mb-6 text-xs text-orange-800 leading-relaxed font-bold">
                  <MapPin className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black text-gray-900 block text-xs">Primary Registered Location:</span>
                    <span className="block mt-1 text-gray-700 font-semibold">{currentUser.address || 'Not specified yet. Update via Profile.'}</span>
                    {currentUser.area && <span className="block mt-2 text-[8px] font-black uppercase tracking-wider text-orange-600 bg-white border border-orange-100/50 px-2 py-0.5 rounded-md w-max">{currentUser.area}</span>}
                  </div>
                </div>

                <div className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Quick Edit Address</h4>
                  <p className="text-xs text-gray-400 mb-4 font-semibold leading-relaxed">Would you like to rewrite your address quickly? Select the Profile tab at the top-left sidebar to easily update your delivery details!</p>
                  <button
                    onClick={() => handleTabChange('profile')}
                    className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-5 py-2.5 shadow-xs transition-colors cursor-pointer"
                  >
                    Go to Profile Editor
                  </button>
                </div>
              </div>
            )}

            {/* Wishlist Tab View */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm animate-fade-in">
                <h3 className="text-sm font-black text-gray-900 border-b border-gray-50 pb-3 mb-5 flex items-center gap-1.5 uppercase tracking-wider">
                  <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  Your Wishlisted Foods (পছন্দের খাবারের তালিকা)
                </h3>

                {products.filter((p) => wishlist.includes(p.id)).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.filter((p) => wishlist.includes(p.id)).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 flex flex-col items-center max-w-sm mx-auto">
                    <div className="h-16 w-16 rounded-2xl bg-red-55 text-red-600 border border-red-100 flex items-center justify-center mb-4 shadow-2xs">
                      <Heart className="h-7 w-7" />
                    </div>
                    <h4 className="text-sm font-black text-gray-900 mb-1">Your wishlist is empty!</h4>
                    <p className="text-xs text-gray-400 leading-relaxed mb-6 font-semibold">
                      Explore Bhola's most famous delicacies and click the heart icon on any food item to save them here.
                    </p>
                    <button
                      onClick={() => navigate('/shop')}
                      className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 shadow-xs transition-colors cursor-pointer"
                    >
                      Browse Hot Dishes
                    </button>
                  </div>
                )}
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
};
