export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  reviewsCount: number;
  description: string;
  prepTime: string; // e.g. "20-30 min"
  restaurantName: string;
  isFeatured: boolean;
  isPopular: boolean;
  tags?: string[];
  isOutOfStock?: boolean;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  area?: string;
  role: 'user' | 'admin' | 'sub-admin' | 'deliveryman';
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  date: string;
  name: string;
  phone: string;
  address: string;
  area: string;
  paymentMethod: 'Cash on Delivery' | 'bKash' | 'Nagad';
  paymentStatus: 'Pending' | 'Paid';
  trackingStep: number; // 0: Placed, 1: Processing, 2: Out for Delivery, 3: Delivered
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  image?: string;
  images?: string[];
}
