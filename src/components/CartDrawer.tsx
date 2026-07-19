import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowRight, 
  UtensilsCrossed, 
  Info 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    updateCartQuantity, 
    removeFromCart, 
    getCartSubtotal, 
    getCartCount 
  } = useApp();
  
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCartDrawerOpen(false);
      }
    };
    if (cartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cartDrawerOpen, setCartDrawerOpen]);

  // Click outside drawer to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
      setCartDrawerOpen(false);
    }
  };

  if (!cartDrawerOpen) return null;

  const subtotal = getCartSubtotal();
  const deliveryFee = 45; // Flat rate across Bhola region
  const total = subtotal > 0 ? subtotal + deliveryFee : 0;

  const handleCheckoutClick = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleExploreClick = () => {
    setCartDrawerOpen(false);
    navigate('/shop');
  };

  return (
    <div 
      id="cart-drawer-overlay" 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-55 bg-black/60 backdrop-blur-xs flex justify-end transition-all duration-300"
    >
      <div 
        ref={drawerRef}
        id="cart-drawer" 
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slide-left relative z-10"
      >
        
        {/* Header section of Drawer */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Your Cart Drawer</h3>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest block">
                {getCartCount()} {getCartCount() === 1 ? 'Delicious Dish' : 'Dishes Added'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setCartDrawerOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable list of Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div 
                key={item.product.id}
                className="flex gap-3 bg-[#F9FAFB] p-3.5 rounded-2xl border border-gray-100 relative group hover:border-orange-100 transition-all"
              >
                {/* Product Image */}
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-100">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover" 
                  />
                </div>

                {/* Details info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-xs font-black text-gray-900 truncate tracking-tight pr-5">
                      {item.product.name}
                    </h4>
                    <span className="text-[9px] text-orange-600 font-bold block mt-0.5 uppercase tracking-wider">
                      {item.product.restaurantName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {/* Price total */}
                    <span className="text-xs font-black text-gray-900">
                      ৳{item.product.price * item.quantity}
                    </span>

                    {/* Quantity selectors */}
                    <div className="flex items-center bg-white border border-gray-150 rounded-xl px-1.5 py-1 gap-2.5 shadow-2xs">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-0.5 text-gray-400 hover:text-orange-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-xs font-black text-gray-800 font-mono w-4 text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-0.5 text-gray-400 hover:text-orange-600 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute right-2 top-2 p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto py-10">
              <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4 border border-orange-100/30">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-black text-gray-900 mb-1">Your cart is empty!</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-6 font-semibold">
                Looks like you haven't added any of Bhola's special delicacies to your basket yet.
              </p>
              <button
                onClick={handleExploreClick}
                className="rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs px-6 py-3 shadow-xs hover:shadow transition-all cursor-pointer"
              >
                Browse Popular Dishes
              </button>
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-[#F9FAFB] space-y-4 shadow-inner">
            
            {/* Info Badge */}
            <div className="flex gap-2 p-3 bg-white rounded-xl border border-gray-150 text-[10px] text-gray-500 font-semibold leading-relaxed">
              <Info className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
              <span>We charge flat ৳45 for hygiene delivery right to your table anywhere across the Bhola area.</span>
            </div>

            {/* Calculations lines */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Subtotal (আইটেম মূল্য):</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-bold">
                <span>Delivery Fee (ডেলিভারি চার্জ):</span>
                <span>৳{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-dashed border-gray-200">
                <span>Total Amount (সর্বমোট বিল):</span>
                <span className="text-orange-600 text-base">৳{total}</span>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-xs font-black text-white uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="w-full py-3.5 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>View Full Cart Page (কার্ট পেজে যান)</span>
              </button>
              
              <button
                onClick={() => setCartDrawerOpen(false)}
                className="w-full py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Continue Hopping (আরো খাবার খুঁজুন)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
