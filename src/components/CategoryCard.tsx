import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';
import * as LucideIcons from 'lucide-react';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
}

// Map categories to modern bento color palettes
const COLOR_MAP: Record<string, { bg: string; hoverBg: string; border: string; text: string }> = {
  biryani: {
    bg: 'bg-orange-50/80',
    hoverBg: 'hover:bg-orange-100/90',
    border: 'border-orange-100/70',
    text: 'text-orange-600',
  },
  fastfood: {
    bg: 'bg-yellow-50/80',
    hoverBg: 'hover:bg-yellow-100/90',
    border: 'border-yellow-100/70',
    text: 'text-yellow-700',
  },
  'rice-curry': {
    bg: 'bg-emerald-50/80',
    hoverBg: 'hover:bg-emerald-100/90',
    border: 'border-emerald-100/70',
    text: 'text-emerald-700',
  },
  sweets: {
    bg: 'bg-pink-50/80',
    hoverBg: 'hover:bg-pink-100/90',
    border: 'border-pink-100/70',
    text: 'text-pink-600',
  },
  homemade: {
    bg: 'bg-purple-50/80',
    hoverBg: 'hover:bg-purple-100/90',
    border: 'border-purple-100/70',
    text: 'text-purple-700',
  },
  drinks: {
    bg: 'bg-blue-50/80',
    hoverBg: 'hover:bg-blue-100/90',
    border: 'border-blue-100/70',
    text: 'text-blue-600',
  },
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, isSelected }) => {
  const colors = COLOR_MAP[category.id] || {
    bg: 'bg-gray-50/80',
    hoverBg: 'hover:bg-gray-100',
    border: 'border-gray-200/50',
    text: 'text-gray-700',
  };

  // Dynamically resolve icon from string
  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className={`h-6 w-6 ${colors.text}`} /> : <LucideIcons.Utensils className={`h-6 w-6 ${colors.text}`} />;
  };

  return (
    <Link
      id={`category-card-${category.id}`}
      to={`/shop?category=${category.id}`}
      className={`group cursor-pointer p-4 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xs h-36 ${
        isSelected
          ? `${colors.bg} ${colors.text} border-orange-500 ring-3 ring-orange-500/35 scale-[1.03]`
          : `${colors.bg} ${colors.hoverBg} ${colors.border} hover:scale-[1.03] hover:shadow-md`
      }`}
    >
      {/* Icon Sphere */}
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-xs border border-white/50 group-hover:scale-110 transition-transform duration-300">
        {getIconComponent(category.icon)}
      </div>

      <span className="text-xs sm:text-sm font-black text-gray-800 group-hover:text-orange-600 transition-colors tracking-tight line-clamp-1 leading-snug">
        {category.name}
      </span>
    </Link>
  );
};
