import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { 
  SlidersHorizontal, 
  Search, 
  ArrowUpDown, 
  X, 
  UtensilsCrossed, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

export const Shop: React.FC = () => {
  const { products, categories } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Read search & category query params from URL
  const searchQueryParam = searchParams.get('search') || '';
  const categoryQueryParam = searchParams.get('category') || 'all';
  const filterQueryParam = searchParams.get('filter') || 'all'; // featured, popular, etc.

  // Local state for interactive filtering synced with URL
  const [searchInput, setSearchInput] = useState(searchQueryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryQueryParam);
  const [activeSpecialFilter, setActiveSpecialFilter] = useState(filterQueryParam);
  const [sortOption, setSortOption] = useState('default');

  // Sync state if URL search parameters change externally
  useEffect(() => {
    setSearchInput(searchQueryParam);
  }, [searchQueryParam]);

  useEffect(() => {
    setSelectedCategory(categoryQueryParam);
  }, [categoryQueryParam]);

  useEffect(() => {
    setActiveSpecialFilter(filterQueryParam);
  }, [filterQueryParam]);

  // Sync state back to URL when selections are made
  const updateQueryParams = (newCat: string, newSearch: string, newSpecial: string) => {
    const params: any = {};
    if (newCat && newCat !== 'all') params.category = newCat;
    if (newSearch) params.search = newSearch;
    if (newSpecial && newSpecial !== 'all') params.filter = newSpecial;
    setSearchParams(params);
    setVisibleCount(8); // Reset pagination on filter change
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateQueryParams(categoryId, searchInput, activeSpecialFilter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    updateQueryParams(selectedCategory, val, activeSpecialFilter);
  };

  const handleSpecialFilterToggle = (filterType: string) => {
    const nextVal = activeSpecialFilter === filterType ? 'all' : filterType;
    setActiveSpecialFilter(nextVal);
    updateQueryParams(selectedCategory, searchInput, nextVal);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedCategory('all');
    setActiveSpecialFilter('all');
    setSortOption('default');
    setSearchParams({});
    setVisibleCount(8);
  };

  // Filtered and Sorted Products computation
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...(products || [])];

    // 1. Live Search Filter
    if (searchInput.trim()) {
      const q = searchInput.toLowerCase();
      list = list.filter(
        (p) => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.restaurantName.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // 3. Special Status Filter
    if (activeSpecialFilter === 'featured') {
      list = list.filter((p) => p.isFeatured);
    } else if (activeSpecialFilter === 'popular') {
      list = list.filter((p) => p.isPopular);
    } else if (activeSpecialFilter === 'cheap') {
      list = list.filter((p) => p.price <= 200); // Items under 200 Taka
    }

    // 4. Sorting
    if (sortOption === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'popularity') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, searchInput, selectedCategory, activeSpecialFilter, sortOption]);

  const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount);

  return (
    <div id="shop-page" className="bg-[#F9FAFB] min-h-screen pb-16 font-sans text-gray-900">
      
      {/* Floating Bento Banner */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 w-full">
        <div className="bg-orange-600 text-white p-8 sm:p-10 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="absolute right-[-40px] top-[-40px] w-80 h-80 bg-orange-500/30 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black bg-white/20 text-white uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                Bhola Special Delivery
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1.5">Order Fresh Food in Bhola</h1>
              <p className="text-xs text-orange-100 font-medium leading-relaxed max-w-xl">
                Choose from legendary sweets, royal mutton kachchi, extra crispy burgers, and healthy home-cooked meals prepared under strict sanitary standards.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold border border-white/10 shrink-0 shadow-sm">
              <span className="text-orange-200 block text-[8px] uppercase tracking-widest font-extrabold">FLAT RATE SHIPPING</span>
              <span className="text-sm font-black">৳45 Delivery Charge</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-6 items-start">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden md:flex flex-col w-64 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm shrink-0">
            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
              <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                <SlidersHorizontal className="h-4 w-4 text-orange-600" />
                Filter Options
              </h3>
              {(searchInput || selectedCategory !== 'all' || activeSpecialFilter !== 'all') && (
                <button 
                  onClick={handleClearFilters}
                  className="text-[10px] font-black text-red-500 hover:text-red-600 uppercase tracking-wider cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Categories</h4>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    selectedCategory === 'all' 
                      ? 'bg-orange-50 text-orange-600 font-extrabold border-l-4 border-orange-600 pl-4' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>All Dishes</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-45" />
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      selectedCategory === cat.id 
                        ? 'bg-orange-50 text-orange-600 font-extrabold border-l-4 border-orange-600 pl-4' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-45" />
                  </button>
                ))}
              </div>
            </div>

            {/* Chef Highlights / Specials */}
            <div className="mb-2 border-t border-gray-50 pt-5">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Highlights</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleSpecialFilterToggle('featured')}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    activeSpecialFilter === 'featured'
                      ? 'bg-orange-50 text-orange-600 border-orange-200 font-extrabold'
                      : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Chef Specials</span>
                </button>
                <button
                  onClick={() => handleSpecialFilterToggle('popular')}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    activeSpecialFilter === 'popular'
                      ? 'bg-orange-50 text-orange-600 border-orange-200 font-extrabold'
                      : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Most Popular</span>
                </button>
                <button
                  onClick={() => handleSpecialFilterToggle('cheap')}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                    activeSpecialFilter === 'cheap'
                      ? 'bg-orange-50 text-orange-600 border-orange-200 font-extrabold'
                      : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Under ৳200</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Catalog View */}
          <main className="flex-1">
            
            {/* Top Toolbar (Bento Grid Style) */}
            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              
              {/* Active search bar inside shop */}
              <div className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Refine search..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full rounded-2xl border border-gray-200 bg-[#F9FAFB] py-2 pl-4 pr-10 text-xs font-medium text-gray-900 focus:border-orange-500 focus:outline-none"
                />
                <button className="absolute right-3 top-2.5 text-gray-400">
                  {searchInput ? (
                    <X className="h-4 w-4 cursor-pointer hover:text-red-500" onClick={() => { setSearchInput(''); updateQueryParams(selectedCategory, '', activeSpecialFilter); }} />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Sorting & Filter buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-1 rounded-2xl border border-gray-200 py-2.5 px-4 text-xs font-extrabold text-gray-700 bg-gray-50 hover:bg-gray-100"
                >
                  <SlidersHorizontal className="h-4 w-4 text-orange-600" />
                  <span>Filters</span>
                </button>

                {/* Sort Option dropdown */}
                <div className="flex items-center gap-1.5 bg-[#F9FAFB] border border-gray-200 rounded-2xl px-3.5 py-2 text-xs font-extrabold text-gray-700">
                  <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="bg-transparent border-none outline-none font-bold cursor-pointer focus:ring-0"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results count label */}
            <div className="mb-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider pl-1">
              Found {filteredAndSortedProducts.length} mouth-watering options in Bhola
            </div>

            {/* Products Grid */}
            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center max-w-md mx-auto my-8 shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4 border border-orange-100/30">
                  <UtensilsCrossed className="h-6 w-6" />
                </div>
                <h3 className="text-base font-black text-gray-900 mb-1">No delicacies found</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 font-semibold">
                  We couldn't find any dishes in Bhola matching your search criteria. Try resetting filters or testing different terms!
                </p>
                <button
                  onClick={handleClearFilters}
                  className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Load More Pagination */}
            {filteredAndSortedProducts.length > displayedProducts.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="rounded-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 font-extrabold text-xs px-8 py-3 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  Load More Dishes
                </button>
              </div>
            )}

          </main>

        </div>
      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-left">
            <div>
              <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                <h3 className="text-sm font-black text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
                  <SlidersHorizontal className="h-4 w-4 text-orange-600" />
                  Filter Menu
                </h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Categories</h4>
                <div className="flex flex-col gap-1 max-h-56 overflow-y-auto">
                  <button
                    onClick={() => { handleCategorySelect('all'); setMobileFiltersOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      selectedCategory === 'all' ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Dishes
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { handleCategorySelect(cat.id); setMobileFiltersOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                        selectedCategory === cat.id ? 'bg-orange-50 text-orange-600 font-extrabold' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights */}
              <div className="mb-6 border-t border-gray-50 pt-4">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Highlights</h4>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { handleSpecialFilterToggle('featured'); setMobileFiltersOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                      activeSpecialFilter === 'featured' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-100'
                    }`}
                  >
                    <Sparkles className="h-4 w-4 animate-spin-slow" />
                    <span>Chef Specials</span>
                  </button>
                  <button
                    onClick={() => { handleSpecialFilterToggle('popular'); setMobileFiltersOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                      activeSpecialFilter === 'popular' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-100'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Most Popular</span>
                  </button>
                  <button
                    onClick={() => { handleSpecialFilterToggle('cheap'); setMobileFiltersOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs font-bold rounded-xl border transition-all ${
                      activeSpecialFilter === 'cheap' ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-gray-600 border-gray-100'
                    }`}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Under ৳200</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => { handleClearFilters(); setMobileFiltersOpen(false); }}
              className="w-full rounded-xl bg-gray-900 py-3 text-xs font-black text-white uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
