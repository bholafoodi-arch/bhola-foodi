import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OFFERS } from '../data/staticConfig';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  MapPin, 
  Search, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Star,
  Package,
  Activity,
  Phone,
  ArrowUpRight,
  TrendingUp,
  ThumbsUp,
  Award,
  Quote
} from 'lucide-react';

export const Home: React.FC = () => {
  const { currentUser, orders, getCartCount, products, categories } = useApp();
  const [activeOfferIndex, setActiveOfferIndex] = useState(0);
  const [reviewStartIndex, setReviewStartIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const navigate = useNavigate();

  // Fetch real restaurants and reviews from MongoDB
  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error("Error fetching restaurants:", err));

    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, []);

  // Rotate offers every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOfferIndex((prev) => (prev + 1) % OFFERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Rotate reviews every 7 seconds
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setReviewStartIndex((prev) => (prev + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Fallback if products are not loaded yet from context
  const sourceProducts = products || [];

  const featuredProducts = sourceProducts.filter((p) => p.isFeatured).slice(0, 3);
  const popularProducts = sourceProducts.filter((p) => p.isPopular).slice(0, 4);

  // Read the active order if available
  const activeOrder = orders.length > 0 ? orders[0] : null;

  return (
    <div id="home-page" className="bg-[#F9FAFB] flex flex-col min-h-screen pb-16 font-sans text-gray-900">
      
      {/* Primary Bento Workspace Section */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-12 gap-6">
          
          {/* Bento 1: Dynamic Hero Banner Carousel (col-span-12 lg:col-span-8) */}
          <div 
            className="col-span-12 lg:col-span-8 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between text-white shadow-xl min-h-[440px] group transition-all duration-1000 ease-in-out"
            style={{ background: OFFERS[activeOfferIndex].gradientStyle || '#ea580c' }}
          >
            {/* Background Image with stunning mix-blend-overlay blend mode */}
            <div className="absolute inset-0 z-0">
              <img 
                src={OFFERS[activeOfferIndex].image} 
                alt="Banner Background"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-100 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
              <div 
                className="absolute inset-0 transition-all duration-1000 ease-in-out" 
                style={{ background: OFFERS[activeOfferIndex].overlayStyle }}
              />
            </div>

            {/* Carousel Navigation Arrows and Carousel Dots */}
            <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
              {/* Carousel Indicator Dots */}
              <div className="flex gap-1.5 bg-black/20 backdrop-blur-md px-2.5 py-1.5 rounded-full">
                {OFFERS.map((offer, idx) => (
                  <button
                    key={offer.id}
                    onClick={() => setActiveOfferIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      activeOfferIndex === idx ? 'w-5 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-1">
                <button 
                  onClick={() => setActiveOfferIndex((prev) => (prev === 0 ? OFFERS.length - 1 : prev - 1))}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Previous Offer"
                >
                  <ChevronLeft className="h-4.5 w-4.5 text-white" />
                </button>
                <button 
                  onClick={() => setActiveOfferIndex((prev) => (prev + 1) % OFFERS.length)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Next Offer"
                >
                  <ChevronRight className="h-4.5 w-4.5 text-white" />
                </button>
              </div>
            </div>

            {/* Banner Top Badge */}
            <div className="relative z-10 self-start">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black bg-white/15 backdrop-blur-md text-white uppercase tracking-wider border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
                {OFFERS[activeOfferIndex].tag || 'Special Offer'}
              </span>
            </div>

            {/* Middle Main Header */}
            <div className="relative z-10 my-6 max-w-lg space-y-3.5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-none text-white drop-shadow-sm">
                {OFFERS[activeOfferIndex].title}
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-100 font-medium leading-relaxed drop-shadow-sm">
                {OFFERS[activeOfferIndex].subtitle}
              </p>
            </div>

            {/* Bottom Actions Row */}
            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Promo Box */}
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/10 shrink-0 shadow-inner">
                  <div>
                    <span className="block text-[8px] text-gray-200 font-extrabold uppercase tracking-widest">PROMO CODE</span>
                    <span className="font-mono font-black text-white text-sm tracking-wider">{OFFERS[activeOfferIndex].code}</span>
                  </div>
                  <button
                    onClick={() => handleCopyCode(OFFERS[activeOfferIndex].code)}
                    className="bg-white/20 hover:bg-white/35 text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0 cursor-pointer border border-white/10"
                    title="Copy Promo Code"
                  >
                    {copiedCode === OFFERS[activeOfferIndex].code ? (
                      <CheckCircle2 className="h-4 w-4 text-green-300" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Subtext info */}
                <span className="text-[11px] text-gray-200 font-bold hidden sm:inline-block">
                  ★ Standard delivery in 25-35 minutes across all municipalities.
                </span>
              </div>

              {/* Find Food Search Container */}
              <form onSubmit={handleSearchSubmit} className="flex items-center max-w-md w-full bg-white rounded-2xl overflow-hidden shadow-xl border border-white/10 p-1">
                <div className="pl-3 text-orange-600 shrink-0">
                  <MapPin className="h-4.5 w-4.5 text-orange-500" />
                </div>
                <input
                  type="text"
                  placeholder="Hungry? Search biryani, sweets, fast food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent py-2.5 pl-2 pr-4 text-xs text-gray-900 outline-none focus:ring-0 placeholder:text-gray-400 font-semibold"
                />
                <button 
                  type="submit" 
                  className="rounded-xl bg-gray-900 hover:bg-black text-white font-black text-xs px-4 sm:px-6 py-2.5 flex items-center gap-2 whitespace-nowrap shrink-0 shadow transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="h-4.5 w-4.5" />
                  <span>Find Food</span>
                </button>
              </form>
            </div>

            {/* Glowing Accent */}
            <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Bento 2: Popular Categories (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-5">
              <div>
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest block mb-0.5">Quick Order</span>
                <h3 className="font-black text-gray-900 text-lg tracking-tight">Popular Categories</h3>
              </div>
              <Link to="/shop" className="text-orange-600 text-xs font-black uppercase hover:underline flex items-center gap-0.5">
                <span>See All</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Categories Mini Bento Subgrid */}
            <div className="grid grid-cols-2 gap-3 flex-grow">
              {categories.slice(0, 4).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Secondary Bento Grid Row: Specials & Live Track */}
      <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-12 gap-6">

          {/* Bento 3: Chef Recommended Specials (col-span-12 lg:col-span-8) */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Chef Picks</span>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Bhola Online Chef Specials</h2>
              </div>
              <Link to="/shop?filter=featured" className="text-orange-600 hover:text-orange-700 text-xs font-black uppercase tracking-wider flex items-center gap-1">
                <span>View All Specials</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Specials list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>

          {/* Bento 4: Active Track or Quick stats (col-span-12 lg:col-span-4) */}
          <div className="col-span-12 lg:col-span-4 bg-gray-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between min-h-[380px]">
            
            {activeOrder ? (
              // Case A: User has real active order
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
                      <h3 className="font-black text-sm tracking-wide uppercase">Active Order Tracking</h3>
                    </div>
                    <span className="bg-emerald-500 text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider text-white">
                      {activeOrder.status}
                    </span>
                  </div>

                  {/* Order stats container */}
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Estimated Arriving</p>
                        <p className="text-lg font-black text-white">
                          {activeOrder.trackingStep === 3 ? 'Arrived!' : '25-35 minutes'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Order Reference</p>
                        <p className="text-xs font-mono font-bold text-orange-400">{activeOrder.id}</p>
                      </div>
                    </div>

                    {/* Progress tracking bar */}
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className="bg-orange-500 h-full transition-all duration-500" 
                        style={{ width: `${(activeOrder.trackingStep + 1) * 25}%` }} 
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                      <span>Confirmed</span>
                      <span>Prepared</span>
                      <span>On Road</span>
                      <span>Arrived</span>
                    </div>
                  </div>
                </div>

                {/* Delivery rider details */}
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center font-bold text-white shadow">
                      {activeOrder.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-white">{activeOrder.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">Delivering to {activeOrder.area}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/dashboard?tab=tracking')}
                      className="ml-auto bg-white/10 hover:bg-white/20 p-2.5 rounded-xl transition-colors cursor-pointer"
                      title="Track Order on Dashboard"
                    >
                      <ArrowUpRight className="h-4.5 w-4.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Case B: Promo statistics and status (Fallback)
              <div className="flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4.5 w-4.5 text-orange-400" />
                      <h3 className="font-black text-xs uppercase tracking-widest text-orange-400">Bhola Local Status</h3>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-emerald-500/20">
                      All Systems Active
                    </span>
                  </div>

                  {/* App Stats showcase */}
                  <div className="space-y-3">
                    <h4 className="text-lg font-black tracking-tight leading-snug">
                      Your Trusted Local Taste Network
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                      We connect home cooks, legendary dessert makers, and top local restaurants to deliver fresh meals under strict hygiene standards.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase">Avg Delivery</span>
                      <span className="text-base font-black text-orange-400">28 Mins</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="block text-[8px] text-gray-400 font-bold uppercase">Happy Eaters</span>
                      <span className="text-base font-black text-orange-400">12K+</span>
                    </div>
                  </div>
                </div>

                {/* Promo button */}
                <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-xs">
                      BO
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-white leading-none">Bhola Online Delivery</p>
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Fast • Hygienic • Hot</p>
                    </div>
                  </div>
                  <Link 
                    to="/shop" 
                    className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
                  >
                    <span>Browse Menu</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Bento Block 3: Commitment & Core Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">How We Serve You</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">The Bhola Online Advantage</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100/30">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2">Lightning Fast Delivery</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              Our active network of local riders delivers steaming fresh food from certified municipal restaurants to your door within 25-45 minutes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100/30">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2">Bhola Famous Sweets</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              Enjoy hassle-free door delivery of Bhola\'s world-famous thick Buffalo Curd (Mohisher Doi) prepared fresh in clay pots by traditional sweet shops.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100/90 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-gray-900 mb-2">Strict Hygiene Audits</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-semibold">
              We strictly audit our partner kitchens and homemade chefs to enforce maximum safety, freshness, and packaging hygiene.
            </p>
          </div>

        </div>
      </section>

      {/* Bento Block 4: Popular Dishes */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Everyone's Favorites</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Popular Dishes in Town</h2>
          </div>
          <Link to="/shop?filter=popular" className="group flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
            <span>View All Popular</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Bento Block 5: Partner Shops & Kitchens */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Local Culinary Stars</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Partner Shops & Kitchens</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
            <span>Order From Them</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((rest) => (
            <div 
              key={rest.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-md hover:scale-[1.015] transition-all duration-300 flex flex-col p-4"
            >
              {/* Image box */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-50">
                <img 
                  src={rest.image} 
                  alt={rest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/95 px-2 py-0.5 rounded-lg text-[10px] font-black text-gray-900 shadow-xs flex items-center gap-0.5">
                  <Star className="h-3 w-3 text-amber-500 fill-current" />
                  <span>{rest.rating}</span>
                </div>
              </div>

              {/* Content box */}
              <div className="pt-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-base font-black text-gray-900 mb-0.5 group-hover:text-orange-600 transition-colors tracking-tight">{rest.name}</h3>
                  <p className="text-xs text-orange-600 font-extrabold mb-3 uppercase tracking-wider">{rest.cuisine}</p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-2.5 mt-2 font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate max-w-[150px]">{rest.address}</span>
                  </div>
                  <span className="shrink-0 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-wider">{rest.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Block 6: Testimonial Reviews Slider Carousel */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full" id="customer-testimonials">
        <div className="bg-orange-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          {/* Stunning Background Accent Glow */}
          <div className="absolute right-[-40px] top-[-40px] w-96 h-96 bg-orange-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-[-40px] bottom-[-40px] w-96 h-96 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 mb-10">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest block mb-1.5">Verified Love from Bhola</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">What Our Customers Say</h2>
            </div>
            
            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setReviewStartIndex((prev) => (reviews.length === 0 ? 0 : (prev === 0 ? reviews.length - 1 : prev - 1)))}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white transition-all focus:outline-none cursor-pointer border border-white/5 shadow-md"
                aria-label="Previous Testimonial"
                title="Previous Review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setReviewStartIndex((prev) => (reviews.length === 0 ? 0 : (prev + 1) % reviews.length))}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white transition-all focus:outline-none cursor-pointer border border-white/5 shadow-md"
                aria-label="Next Testimonial"
                title="Next Review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Slider Content Wrapper */}
          <div className="relative z-10 overflow-hidden">
            {/* We render a responsive grid where cards are dynamically selected starting from reviewStartIndex */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
              {reviews.length > 0 ? [0, 1, 2].map((offset) => {
                const reviewIndex = (reviewStartIndex + offset) % reviews.length;
                const rev = reviews[reviewIndex];
                
                // Hide second and third card on mobile, hide third card on tablet
                const visibilityClass = 
                  offset === 1 ? 'hidden md:flex' : 
                  offset === 2 ? 'hidden lg:flex' : 'flex';

                return (
                  <div 
                    key={`${rev.id}-${offset}`}
                    className={`${visibilityClass} bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left border border-white/10 flex flex-col justify-between hover:bg-white/15 hover:scale-[1.01] transition-all duration-300 relative group overflow-hidden min-h-[220px] shadow-lg`}
                  >
                    {/* Decorative Background Quote Icon */}
                    <Quote className="absolute right-4 bottom-4 h-24 w-24 text-white/[0.04] pointer-events-none group-hover:scale-110 group-hover:text-white/[0.06] transition-transform duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-1 mb-4 text-amber-300">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4.5 w-4.5 ${i < rev.rating ? 'fill-current text-yellow-300' : 'opacity-30'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-orange-50 italic leading-relaxed mb-6 font-semibold">
                        "{rev.comment}"
                      </p>
                    </div>
                    
                    <div className="relative z-10 border-t border-white/10 pt-4 flex justify-between items-center text-xs font-bold text-orange-100">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center font-black text-white text-[10px] uppercase">
                          {rev.userName.charAt(0)}
                        </div>
                        <span className="font-extrabold text-white">{rev.userName}</span>
                      </div>
                      <span className="text-[10px] opacity-80">{rev.date}</span>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-3 text-center py-8 text-orange-100 font-bold">
                  No reviews left yet! Order and be the first to leave a review.
                </div>
              )}
            </div>
          </div>

          {/* Carousel Indicator Dots */}
          <div className="relative z-10 flex justify-center gap-2 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setReviewStartIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  reviewStartIndex === idx 
                    ? 'w-8 bg-white' 
                    : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
                title={`Go to testimonial page ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
