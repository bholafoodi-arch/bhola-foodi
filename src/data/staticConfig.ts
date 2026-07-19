import { Category } from '../types';

export const BHOLA_AREAS = [
  'Sadar Road, Bhola Sadar',
  'Kheya Ghat, Bhola Sadar',
  'Char Fashion Town',
  'Lalmohan Sadar',
  'Borhanuddin Sadar',
  'Tazumuddin Sadar',
  'Daulatkhan',
  'Manpura Town'
];

export const CATEGORIES: Category[] = [
  {
    id: 'biryani',
    name: 'Biryani & Pulao',
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'fastfood',
    name: 'Fast Food',
    icon: 'Pizza',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'rice-curry',
    name: 'Rice & Bengali Curry',
    icon: 'ChefHat',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'sweets',
    name: 'Bhola Famous Sweets',
    icon: 'Cookie',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'homemade',
    name: 'Homemade Food',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'drinks',
    name: 'Drinks & Desserts',
    icon: 'CupSoda',
    image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=400&auto=format&fit=crop&q=80'
  }
];

export const OFFERS = [
  {
    id: 'o1',
    title: 'Royal Biryani Feast 👑',
    subtitle: 'Taste the legendary Kachchi Biryani in Bhola made with aromatic Basmati & rich spices! (খাসির কাচ্চি বিরিয়ানী)',
    code: 'KACCHILOVE',
    bgClass: 'from-[#FF6B6B] via-[#FF8E53] to-[#FF4E50]',
    gradientStyle: 'linear-gradient(135deg, #1c0c02 0%, #8c3202 45%, #d85c02 100%)',
    overlayStyle: 'linear-gradient(to right, #1c0c02 0%, rgba(28, 12, 2, 0.98) 35%, rgba(28, 12, 2, 0.7) 70%, transparent 100%)',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=1200&auto=format&fit=crop&q=80',
    tag: 'Trending Feast'
  },
  {
    id: 'o2',
    title: 'Traditional Sweet Fest 🍯',
    subtitle: 'Get 15% flat discount on famous Bhola Buffalo Curd & sweet delicacies! (ভোলার ঐতিহ্যবাহী দধি উৎসব)',
    code: 'DOIFEST15',
    bgClass: 'from-[#11998e] to-[#38ef7d]',
    gradientStyle: 'linear-gradient(135deg, #021a15 0%, #0d5e4b 45%, #1ebfa0 100%)',
    overlayStyle: 'linear-gradient(to right, #021a15 0%, rgba(2, 26, 21, 0.98) 35%, rgba(2, 26, 21, 0.7) 70%, transparent 100%)',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1200&auto=format&fit=crop&q=80',
    tag: 'Traditional Pride'
  },
  {
    id: 'o3',
    title: 'Sizzling Grill Bonanza 🔥',
    subtitle: 'Up to ৳120 discount on flame-grilled Tandoori chicken & hot loaded skewers! (কাবাব ও গ্রিল ধামাকা)',
    code: 'GRILLPOWER',
    bgClass: 'from-[#ED213A] to-[#93291E]',
    gradientStyle: 'linear-gradient(135deg, #1c0205 0%, #820a17 45%, #df182d 100%)',
    overlayStyle: 'linear-gradient(to right, #1c0205 0%, rgba(28, 2, 5, 0.98) 35%, rgba(28, 2, 5, 0.7) 70%, transparent 100%)',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1200&auto=format&fit=crop&q=80',
    tag: 'Fiery Bites'
  }
];
