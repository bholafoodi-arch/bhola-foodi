import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  Clock, 
  ShoppingBag, 
  ChevronLeft, 
  Check, 
  ShieldCheck, 
  Store, 
  MessageSquare,
  ThumbsUp,
  Heart,
  Camera,
  X,
  Plus
} from 'lucide-react';
import { Review } from '../types';

const CATEGORY_IMAGES: Record<string, string[]> = {
  sweets: [
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80'
  ],
  biryani: [
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80'
  ],
  fastfood: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80'
  ],
  'rice-curry': [
    'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80'
  ],
  homemade: [
    'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=800&auto=format&fit=crop&q=80'
  ],
  drinks: [
    'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&auto=format&fit=crop&q=80'
  ]
};

export const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, products } = useApp();
  
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  
  const [zoomOrigin, setZoomOrigin] = useState('center');
  const [isZooming, setIsZooming] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  };
  
  // Mock product reviews state (initial + user generated)
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewImage, setNewReviewImage] = useState('');
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  const handleReviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Find the product
  const sourceProducts = products || [];
  const product = sourceProducts.find((p) => p.id === productId || (p as any)._id === productId);

  // Collect fallback images or product-specific images
  const extraImages = product && (product.images && product.images.length > 0
    ? product.images
    : (CATEGORY_IMAGES[product.category] || CATEGORY_IMAGES['rice-curry']));
  const allUniqueImages = product ? Array.from(new Set([product.image, ...extraImages])) : [];

  // Load initial reviews or mock some
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setAddedFeedback(false);
      setReviewSubmitSuccess(false);
      setActiveImage(product.image);
      
      // Seed reviews for this product
      setProductReviews([
        {
          id: 'r-1',
          userName: 'Rafiqul Islam',
          rating: 5,
          date: '2026-06-30',
          comment: `Absolutely loved this ${product.name}! It was delivered burning hot, and the flavors are completely authentic to Bhola.`
        },
        {
          id: 'r-2',
          userName: 'Marjana Chowdhury',
          rating: 4,
          date: '2026-07-04',
          comment: 'Very tasty and nicely packed. The preparation speed was quick, and the rider was well-behaved.'
        }
      ]);
    }
  }, [productId, product]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-4">Dish Not Found</h2>
        <p className="text-gray-500 mb-6">The food item you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow hover:bg-orange-600 transition-colors">
          Go Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.isOutOfStock) return;
    addToCart(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-user-${Date.now()}`,
      userName: newReviewName.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      image: newReviewImage || undefined
    };

    setProductReviews([newReview, ...productReviews]);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewImage('');
    setReviewSubmitSuccess(true);
    setTimeout(() => setReviewSubmitSuccess(false), 4000);
  };

  // Find related products in the same category first, excluding itself from sourceProducts
  let relatedProducts = sourceProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  );
  
  // If we don't have at least 3 in the same category, top up with other featured or popular products
  if (relatedProducts.length < 3) {
    const otherProducts = sourceProducts.filter(
      (p) => p.id !== product.id && !relatedProducts.some((rp) => rp.id === p.id)
    );
    relatedProducts = [...relatedProducts, ...otherProducts].slice(0, 3);
  } else {
    relatedProducts = relatedProducts.slice(0, 3);
  }

  return (
    <div id="product-details-page" className="bg-gray-50 min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-orange-500 mb-6 group cursor-pointer"
        >
          <ChevronLeft className="h-4.5 w-4.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Menu</span>
        </button>

        {/* Product Box */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-10 mb-12">
          
          {/* Left Column: Image Gallery with Interactive Thumbnails */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div 
              className="relative aspect-video sm:aspect-square md:aspect-auto rounded-2xl overflow-hidden bg-gray-50 h-[300px] md:h-[420px] shadow-sm border border-gray-100 cursor-zoom-in"
              onMouseEnter={() => setIsZooming(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => {
                setIsZooming(false);
                setZoomOrigin('center');
              }}
            >
              <img 
                src={activeImage || product.image} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-transform duration-100 ease-out ${product.isOutOfStock ? 'grayscale opacity-75' : ''}`}
                style={{
                  transformOrigin: zoomOrigin,
                  transform: isZooming && !product.isOutOfStock ? 'scale(2.2)' : 'scale(1)',
                }}
              />
              {product.isOutOfStock ? (
                <span className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center pointer-events-none">
                  <span className="bg-red-600 text-white font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-2xl shadow-xl animate-pulse">
                    Stock Out (স্টক শেষ)
                  </span>
                </span>
              ) : product.isFeatured ? (
                <span className="absolute top-4 left-4 bg-orange-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md pointer-events-none">
                  Featured Selection
                </span>
              ) : null}
            </div>

            {/* Thumbnail Row */}
            {allUniqueImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
                {allUniqueImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 cursor-pointer ${
                      (activeImage || product.image) === imgUrl 
                        ? 'border-orange-500 shadow-md scale-95' 
                        : 'border-gray-200 opacity-60 hover:opacity-100 hover:scale-[1.02]'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${product.name} gallery ${idx + 1}`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {/* Subtle active cover screen */}
                    {(activeImage || product.image) === imgUrl && (
                      <div className="absolute inset-0 bg-orange-500/15" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              
              {/* Restaurant info & Time */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-xs font-bold text-orange-500 uppercase tracking-widest">
                  <Store className="h-4 w-4" />
                  {product.restaurantName}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 font-semibold px-2.5 py-1 rounded-md">
                  <Clock className="h-3.5 w-3.5 text-orange-500" />
                  {product.prepTime} Preparation
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-400">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-sm font-bold text-gray-900 ml-1">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-xs text-gray-400 font-medium">|</span>
                <span className="text-xs text-orange-500 font-bold hover:underline cursor-pointer">
                  {productReviews.length} Verified Customer Reviews
                </span>
              </div>

              {/* Price Tag */}
              <div className="flex items-baseline gap-2 py-2 border-y border-gray-100 my-1">
                <span className="text-2xl sm:text-3xl font-black text-gray-900">৳{product.price}</span>
                <span className="text-xs text-gray-400 font-medium">Flat Price</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Safe badging */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 text-xs font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Fresh and Hygienic</span>
                </div>
                <div className="flex items-center gap-2 bg-orange-50 text-orange-800 p-2.5 rounded-xl border border-orange-100 text-xs font-bold">
                  <ShoppingBag className="h-4 w-4 text-orange-600 shrink-0" />
                  <span>Eco-friendly Packing</span>
                </div>
              </div>

            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              
              {/* Quantity Counter */}
              <div className={`flex items-center border border-gray-300 rounded-full overflow-hidden h-12 shrink-0 bg-gray-50 ${product.isOutOfStock ? 'opacity-50 pointer-events-none' : ''}`}>
                <button
                  disabled={product.isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 text-gray-600 hover:bg-gray-100 h-full font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-gray-800 w-12 text-center select-none">
                  {product.isOutOfStock ? 0 : quantity}
                </span>
                <button
                  disabled={product.isOutOfStock}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 text-gray-600 hover:bg-gray-100 h-full font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                disabled={product.isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 h-12 flex items-center justify-center gap-2 rounded-full text-sm font-black text-white shadow-md transition-all ${
                  product.isOutOfStock 
                    ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                    : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg active:scale-98'
                }`}
              >
                {product.isOutOfStock ? (
                  <>
                    <span>Stock Out (স্টক শেষ)</span>
                  </>
                ) : addedFeedback ? (
                  <>
                    <Check className="h-5 w-5 text-white" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add {quantity} to Cart (৳{product.price * quantity})</span>
                  </>
                )}
              </button>

              {/* Wishlist Toggle Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`h-12 w-12 shrink-0 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                    : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-50 hover:text-red-500'
                }`}
                title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`h-5 w-5 transition-transform duration-300 active:scale-125 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>

            </div>

          </div>
        </div>

        {/* Tab Section: Reviews & Feedback */}
        <section className="bg-white rounded-3xl border border-gray-200 p-6 lg:p-10 mb-12">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            Customer Reviews ({productReviews.length})
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 font-bold text-xs uppercase flex items-center justify-center">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{rev.userName}</h4>
                          <span className="text-[10px] text-gray-400 font-medium">{rev.date}</span>
                        </div>
                      </div>
                      
                      {/* Rating stars */}
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < rev.rating ? 'fill-current' : 'opacity-25'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 italic">
                      "{rev.comment}"
                    </p>
                    
                    {rev.image && (
                      <div className="mt-3 relative inline-block rounded-xl overflow-hidden border border-gray-150 max-w-[160px] bg-gray-50 shadow-xs">
                        <img 
                          src={rev.image} 
                          alt="Customer review photo" 
                          referrerPolicy="no-referrer"
                          className="max-h-28 w-auto object-cover rounded-xl transition-transform duration-350 hover:scale-105" 
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 mt-3 hover:text-orange-500 cursor-pointer">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>Was this review helpful?</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
              <h3 className="text-sm font-black text-gray-900 mb-4">Leave a Review</h3>
              
              {reviewSubmitSuccess && (
                <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-lg border border-green-100 text-xs font-bold">
                  Thank you! Your review was published successfully.
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewName}
                    onChange={(e) => setNewReviewName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Rating</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    <option value={2}>⭐⭐ (2 Stars)</option>
                    <option value={1}>⭐ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Comment</label>
                  <textarea
                    required
                    rows={3}
                    value={newReviewComment}
                    onChange={(e) => setNewReviewComment(e.target.value)}
                    placeholder="Share your experience about this dish"
                    className="w-full bg-white rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">
                    Add Photo <span className="text-gray-400 font-semibold">(ছবি যুক্ত করুন - ঐচ্ছিক)</span>
                  </label>
                  
                  {newReviewImage ? (
                    <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-white p-2">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
                        <img 
                          src={newReviewImage} 
                          alt="Review attachment preview" 
                          referrerPolicy="no-referrer"
                          className="max-h-32 object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setNewReviewImage('')}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors cursor-pointer flex items-center justify-center"
                          title="Remove Photo"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl py-4 px-3 bg-white hover:bg-gray-100/50 hover:border-orange-400 transition-all cursor-pointer text-center group">
                        <Camera className="h-6 w-6 text-gray-400 group-hover:text-orange-500 transition-colors mb-1" />
                        <span className="text-[10px] text-gray-500 font-extrabold group-hover:text-gray-700">Upload Image File</span>
                        <span className="text-[9px] text-gray-400 mt-0.5">PNG, JPG, JPEG up to 5MB</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleReviewImageChange}
                          className="hidden" 
                        />
                      </label>
                      <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-200"></span>
                        </div>
                        <span className="relative bg-gray-50 px-2 text-[9px] text-gray-400 uppercase font-black">Or</span>
                      </div>
                      <input
                        type="text"
                        value={newReviewImage}
                        onChange={(e) => setNewReviewImage(e.target.value)}
                        placeholder="Paste image URL here..."
                        className="w-full bg-white rounded-lg border border-gray-300 px-3 py-1.5 text-[10px] text-gray-850 placeholder-gray-400 focus:border-orange-500 focus:outline-none font-mono"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Submit Review
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* Related Items */}
        {relatedProducts.length > 0 && (
          <section id="related-items" className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
              <div>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-1">Specially Curated For You</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  You Might Also Like <span className="text-gray-400 font-medium text-sm sm:text-base">(আপনার পছন্দের অন্যান্য খাবার)</span>
                </h2>
              </div>
              <div className="h-1 w-20 bg-orange-500 rounded-full mt-2 md:mt-0" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
