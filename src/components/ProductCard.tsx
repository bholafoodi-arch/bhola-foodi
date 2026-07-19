import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, ShoppingCart, Eye, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group bg-white rounded-3xl p-4 border border-gray-100/80 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image Section */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
        <Link to={`/shop/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.isOutOfStock ? 'grayscale opacity-75' : ''}`}
          />
        </Link>
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1 z-10">
          {product.isOutOfStock ? (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-600 text-white shadow-xs">
              Stock Out
            </span>
          ) : (
            <>
              {product.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-600 text-white shadow-xs"
                >
                  {tag}
                </span>
              ))}
              {product.isFeatured && !product.tags?.includes('Best Seller') && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-gray-900 text-white shadow-xs">
                  Chef Special
                </span>
              )}
            </>
          )}
        </div>

        {product.isOutOfStock && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-3xs flex items-center justify-center z-10">
            <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-md">
              Stock Out (শেষ)
            </span>
          </div>
        )}

        {/* Floating Heart Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-15 p-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer group/wishlist"
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart 
            className={`h-4 w-4 transition-all duration-300 ${
              isWishlisted 
                ? 'text-red-500 fill-red-500' 
                : 'text-gray-400 group-hover/wishlist:text-red-500'
            }`} 
          />
        </button>

        {/* Pricing Overlay over Image */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-gray-900 text-xs font-black px-2.5 py-1 rounded-lg shadow-sm">
          ৳{product.price}
        </div>

        {/* Prep Time Overlay */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-xs">
          <Clock className="h-3.5 w-3.5 text-orange-400" />
          <span>{product.prepTime}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="pt-4 flex flex-col flex-1">
        {/* Restaurant name */}
        <Link to={`/shop/${product.id}`} className="block">
          <span className="text-[10px] font-extrabold text-orange-600 tracking-wider uppercase mb-1 hover:underline">
            {product.restaurantName}
          </span>
        </Link>
        
        {/* Product Name */}
        <Link to={`/shop/${product.id}`} className="block">
          <h3 className="text-sm font-black text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1 mb-1 tracking-tight hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <Link to={`/shop/${product.id}`} className="block">
          <p className="text-xs text-gray-400 line-clamp-2 leading-normal mb-3 font-medium hover:text-gray-600">
            {product.description}
          </p>
        </Link>

        {/* Rating and Reviews & Price Row */}
        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-[10px] text-gray-400 font-normal">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1">
            <Link 
              to={`/shop/${product.id}`}
              className="p-1.5 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-600 border border-gray-100 hover:border-orange-100 transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            
            <button
              id={`add-to-cart-btn-${product.id}`}
              disabled={product.isOutOfStock}
              onClick={handleAddToCart}
              className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold text-white transition-all ${
                product.isOutOfStock
                  ? 'bg-gray-300 cursor-not-allowed shadow-none'
                  : 'bg-orange-600 hover:bg-orange-700 shadow-xs active:scale-95 cursor-pointer'
              }`}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{product.isOutOfStock ? 'Stock Out' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
