import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, CartItem, User, Order, Category } from '../types';

interface AppContextType {
  currentUser: User | null;
  dbConnected: boolean;
  dbError: string | null;
  cart: CartItem[];
  orders: Order[];
  products: Product[];
  categories: Category[];
  systemUsers: User[];
  updateProductsList: (newProducts: Product[]) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (isOpen: boolean) => void;
  login: (emailOrPhone: string, password: string) => { success: boolean; error?: string } | Promise<{ success: boolean; error?: string }>;
  signUp: (userData: { name: string; email: string; phone: string; password: string; role?: 'user' | 'admin' | 'sub-admin' | 'deliveryman' }) => { success: boolean; error?: string } | Promise<{ success: boolean; error?: string }>;
  googleSignIn: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void | Promise<void>;
  updateProfile: (updatedData: { name: string; email: string; phone: string; address?: string; area?: string; role?: 'user' | 'admin' | 'sub-admin' | 'deliveryman' }) => { success: boolean } | Promise<{ success: boolean }>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderDetail: { name: string; phone: string; address: string; area: string; paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' }) => Order | Promise<Order>;
  getCartCount: () => number;
  getCartSubtotal: () => number;
  getCartTotal: () => number;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingStep: number) => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USERS_KEY = 'bhola_online_users';
const CURRENT_USER_KEY = 'bhola_online_current_user';
const CART_KEY = 'bhola_online_cart';
const ORDERS_KEY = 'bhola_online_orders';
const WISHLIST_KEY = 'bhola_online_wishlist';
const PRODUCTS_KEY = 'bhola_online_products';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const queryClient = useQueryClient();

  // Check database status on load
  useEffect(() => {
    fetch('/api/db-status')
      .then((res) => res.json())
      .then((data) => {
        setDbConnected(data.connected);
        setDbError(data.error);
      })
      .catch((err) => {
        setDbConnected(false);
        setDbError("Could not reach backend server database status endpoint.");
      });
  }, []);

  // Load products from MongoDB using TanStack Query
  const { data: products = [], refetch: refetchProducts } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data));
      return data;
    },
    initialData: () => {
      const stored = localStorage.getItem(PRODUCTS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  });

  // Load orders from MongoDB using TanStack Query
  const { data: orders = [], refetch: refetchOrders } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      localStorage.setItem(ORDERS_KEY, JSON.stringify(data));
      return data;
    },
    initialData: () => {
      const stored = localStorage.getItem(ORDERS_KEY);
      return stored ? JSON.parse(stored) : [];
    },
    refetchInterval: currentUser && (currentUser.role === 'admin' || currentUser.role === 'sub-admin') ? 5000 : false,
    refetchIntervalInBackground: true
  });

  // Load system users from MongoDB using TanStack Query
  const { data: systemUsers = [], refetch: refetchSystemUsers } = useQuery<User[]>({
    queryKey: ['systemUsers'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to fetch system users');
      const data = await res.json();
      localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(data));
      return data;
    },
    initialData: () => {
      const stored = localStorage.getItem(DEFAULT_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  });

  // Load initial data from MongoDB with localStorage fallback
  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing stored user', e);
      }
    }

    const storedCart = localStorage.getItem(CART_KEY);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing stored cart', e);
      }
    }

    const storedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (storedWishlist) {
      try {
        setWishlist(JSON.parse(storedWishlist));
      } catch (e) {
        console.error('Error parsing stored wishlist', e);
      }
    }
  }, []);

  // Sync logged in user's cart from MongoDB
  useEffect(() => {
    const syncCartWithServer = async () => {
      if (currentUser) {
        try {
          const res = await fetch(`/api/carts/${currentUser.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.items)) {
              setCart(data.items);
              localStorage.setItem(CART_KEY, JSON.stringify(data.items));
            } else {
              // If server has no cart, but we have items in localStorage, sync them to server!
              const localCart = localStorage.getItem(CART_KEY);
              if (localCart) {
                const parsed = JSON.parse(localCart);
                if (parsed.length > 0) {
                  await fetch(`/api/carts/${currentUser.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: parsed })
                  });
                }
              }
            }
          }
        } catch (e) {
          console.error('Failed to load/sync cart from server:', e);
        }
      }
    };

    syncCartWithServer();
  }, [currentUser?.id]);

  // Sync state changes to localStorage
  const saveUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    if (currentUser) {
      try {
        await fetch(`/api/carts/${currentUser.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: newCart })
        });
      } catch (e) {
        console.error('Failed to sync cart to MongoDB:', e);
      }
    }
  };

  const saveOrders = (newOrders: Order[]) => {
    queryClient.setQueryData(['orders'], newOrders);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(newOrders));
  };

  const addProductMutation = useMutation({
    mutationFn: async (newProduct: Product) => {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (!res.ok) throw new Error('Failed to save product on server');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetchProducts();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete product on server');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetchProducts();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, updateData }: { productId: string; updateData: Partial<Product> }) => {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error('Failed to update product status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      refetchProducts();
    },
  });

  const placeOrderMutation = useMutation({
    mutationFn: async (newOrder: Order) => {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!res.ok) throw new Error('Failed to place order');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      refetchOrders();
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingStep }: { orderId: string; status: Order['status']; trackingStep: number }) => {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingStep }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      refetchOrders();
    },
  });

  const signUpMutation = useMutation({
    mutationFn: async (completeUser: any) => {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeUser),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to sign up user in MongoDB');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      refetchSystemUsers();
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update user profile in MongoDB');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['systemUsers'] });
      refetchSystemUsers();
    },
  });

  const updateProductsList = async (newProducts: Product[]) => {
    // Sync with MongoDB API using TanStack Query mutations
    if (newProducts.length > products.length) {
      const addedProduct = newProducts.find(p => !products.some(oldP => oldP.id === p.id));
      if (addedProduct) {
        await addProductMutation.mutateAsync(addedProduct);
      }
    } else if (newProducts.length < products.length) {
      const deletedProduct = products.find(p => !newProducts.some(newP => newP.id === p.id));
      if (deletedProduct) {
        await deleteProductMutation.mutateAsync(deletedProduct.id);
      }
    } else {
      // If sizes are equal, check if an item was updated
      for (const newP of newProducts) {
        const oldP = products.find(p => p.id === newP.id);
        if (oldP && (oldP.isFeatured !== newP.isFeatured || oldP.isOutOfStock !== newP.isOutOfStock)) {
          await updateProductMutation.mutateAsync({
            productId: newP.id,
            updateData: { isFeatured: newP.isFeatured, isOutOfStock: newP.isOutOfStock }
          });
        }
      }
    }
  };

  // Auth Operations
  const login = async (emailOrPhone: string, password: string) => {
    try {
      // Direct login to Node.js / Express backend with MongoDB
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone, password })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Incorrect email, phone or password.');
      }

      const data = await res.json();
      if (data.success && data.user) {
        saveUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: 'Failed to retrieve user details.' };
      }
    } catch (e: any) {
      console.error('MongoDB login failed:', e);
      return { success: false, error: e.message || 'Invalid email/phone or password.' };
    }
  };

  const signUp = async (userData: { name: string; email: string; phone: string; password: string; role?: 'user' | 'admin' | 'sub-admin' | 'deliveryman' }) => {
    try {
      const completeUser = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        role: userData.role || 'user',
        address: '',
        area: ''
      };

      // 1. Check if user already exists
      try {
        const usersRes = await fetch('/api/users');
        if (usersRes.ok) {
          const allUsers = await usersRes.json();
          const exists = allUsers.some((u: any) => u.email === userData.email || u.phone === userData.phone);
          if (exists) {
            return { success: false, error: 'User with this email or phone already exists.' };
          }
        }
      } catch (err) {
        console.warn("User validation error, attempting direct signup:", err);
      }

      // 2. Perform direct signup mutation to MongoDB Collection
      const result = await signUpMutation.mutateAsync(completeUser);
      if (result && result.success && result.user) {
        saveUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: 'Registration failed on MongoDB Server.' };
      }
    } catch (e: any) {
      console.error('MongoDB signup failed:', e);
      return { success: false, error: e.message || 'Sign up failed.' };
    }
  };

  const googleSignIn = async () => {
    return { success: false, error: 'Google Sign In is bypassed. Please use regular Email & Password login to save directly into MongoDB.' };
  };

  const logout = async () => {
    saveUser(null);
  };

  const updateProfile = async (updatedData: { name: string; email: string; phone: string; address?: string; area?: string; role?: 'user' | 'admin' | 'sub-admin' | 'deliveryman' }) => {
    if (!currentUser) return { success: false };

    const updatedUser: User = {
      ...currentUser,
      ...updatedData
    };

    try {
      await updateProfileMutation.mutateAsync({ id: currentUser.id, ...updatedData });
      console.log('Profile updated in MongoDB successfully');
    } catch (e) {
      console.error('Failed to sync profile update to MongoDB:', e);
    }

    saveUser(updatedUser);

    const usersStr = localStorage.getItem(DEFAULT_USERS_KEY);
    if (usersStr) {
      try {
        const users = JSON.parse(usersStr);
        const index = users.findIndex((u: any) => u.id === currentUser.id);
        if (index !== -1) {
          users[index] = { ...users[index], ...updatedData };
          localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(users));
        }
      } catch (e) {
        console.error('Failed to update default users in local storage:', e);
      }
    }

    return { success: true };
  };

  // Cart Operations
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.isOutOfStock) {
      return;
    }
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      saveCart(updatedCart);
    } else {
      saveCart([...cart, { product, quantity }]);
    }
    setCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    saveCart(cart.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  // Order Operations
  const placeOrder = async (orderDetail: { name: string; phone: string; address: string; area: string; paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad' }) => {
    const subtotal = getCartSubtotal();
    const deliveryCharge = 45; // Flat 45 Taka delivery charge across Bhola region
    const total = subtotal + deliveryCharge;

    const newOrder: Order = {
      id: `BO-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      subtotal,
      deliveryCharge,
      total,
      status: 'Pending',
      date: new Date().toISOString(),
      name: orderDetail.name,
      phone: orderDetail.phone,
      address: orderDetail.address,
      area: orderDetail.area,
      paymentMethod: orderDetail.paymentMethod,
      paymentStatus: orderDetail.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      trackingStep: 0
    };

    try {
      await placeOrderMutation.mutateAsync(newOrder);
      console.log('Order synchronized to MongoDB');
    } catch (e) {
      console.error('Failed to sync order to MongoDB:', e);
    }

    const updatedOrders = [newOrder, ...orders];
    saveOrders(updatedOrders);
    clearCart();

    // Trigger dummy status update workflow in background
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'Processing', 1);
    }, 15000); // changes to processing in 15s

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], trackingStep: number) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ orderId, status, trackingStep });
      console.log('Order status updated in MongoDB');
    } catch (e) {
      console.error('Failed to update order status in MongoDB:', e);
    }

    queryClient.setQueryData(['orders'], (currentOrders: Order[] | undefined) => {
      const updated = (currentOrders || []).map((o) =>
        o.id === orderId ? { ...o, status, trackingStep } : o
      );
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Utilities
  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 0 ? subtotal + 45 : 0; // Flat 45 Taka delivery
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      let next;
      if (prev.includes(productId)) {
        next = prev.filter((id) => id !== productId);
      } else {
        next = [...prev, productId];
      }
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const KNOWN_CATEGORIES: Record<string, { name: string; icon: string; image: string }> = {
    biryani: {
      name: 'Biryani & Pulao',
      icon: 'Utensils',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
    },
    fastfood: {
      name: 'Fast Food',
      icon: 'Pizza',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
    },
    'rice-curry': {
      name: 'Rice & Bengali Curry',
      icon: 'ChefHat',
      image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=400&auto=format&fit=crop&q=80'
    },
    sweets: {
      name: 'Bhola Famous Sweets',
      icon: 'Cookie',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
    },
    sweetmeats: {
      name: 'Sweets & Dessert (মিষ্টি)',
      icon: 'Cookie',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
    },
    curries: {
      name: 'Traditional Curries (তরকারি)',
      icon: 'ChefHat',
      image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=400&auto=format&fit=crop&q=80'
    },
    snacks: {
      name: 'Quick Snacks (নাস্তা)',
      icon: 'Pizza',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
    },
    streetfood: {
      name: 'Street Food (স্ট্রিট ফুড)',
      icon: 'Utensils',
      image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=80'
    },
    homemade: {
      name: 'Homemade Food',
      icon: 'Home',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
    },
    drinks: {
      name: 'Drinks & Desserts',
      icon: 'CupSoda',
      image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=80'
    }
  };

  const categories = React.useMemo<Category[]>(() => {
    const uniqueCategoryIds = Array.from(
      new Set((products || []).map((p) => p.category?.toLowerCase() || ''))
    ).filter(Boolean);

    const mapped: Category[] = uniqueCategoryIds.map((id) => {
      const known = KNOWN_CATEGORIES[id];
      if (known) {
        return {
          id,
          name: known.name,
          icon: known.icon,
          image: known.image
        };
      }
      
      const formattedName = id
        .split(/[-_ ]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return {
        id,
        name: formattedName,
        icon: 'Utensils',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
      };
    });

    if (mapped.length === 0) {
      return Object.entries(KNOWN_CATEGORIES).map(([id, item]) => ({
        id,
        name: item.name,
        icon: item.icon,
        image: item.image
      }));
    }

    return mapped;
  }, [products]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        dbConnected,
        dbError,
        cart,
        orders,
        products,
        categories,
        systemUsers,
        updateProductsList,
        cartDrawerOpen,
        setCartDrawerOpen,
        login,
        signUp,
        googleSignIn,
        logout,
        updateProfile,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        getCartCount,
        getCartSubtotal,
        getCartTotal,
        updateOrderStatus,
        wishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
