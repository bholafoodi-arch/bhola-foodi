import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

export const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, getCartSubtotal } = useApp();
  const navigate = useNavigate();
  
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [discountValue, setDiscountValue] = useState(0);

  const subtotal = getCartSubtotal();
  const deliveryCharge = appliedPromo === 'BHOFLAFREE' ? 0 : 45; // 45 standard delivery in Bhola

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoInput.trim().toUpperCase();

    if (code === 'BHOFLAFREE') {
      if (subtotal < 200) {
        setPromoError('BHOFLAFREE requires minimum purchase of ৳200.');
        return;
      }
      setAppliedPromo(code);
      setDiscountValue(0);
    } else if (code === 'DOIFEST') {
      // 15% discount on Sweets, let's do simple 15% off flat
      setAppliedPromo(code);
      setDiscountValue(Math.round(subtotal * 0.15));
    } else if (code === 'WEEKENDPARTY') {
      if (subtotal < 400) {
        setPromoError('WEEKENDPARTY requires minimum purchase of ৳400.');
        return;
      }
      setAppliedPromo(code);
      setDiscountValue(100);
    } else {
      setPromoError('Invalid promo code. Try DOIFEST or BHOFLAFREE.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setDiscountValue(0);
    setPromoInput('');
    setPromoError(null);
  };

  const finalTotal = Math.max(0, subtotal - discountValue + deliveryCharge);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center">
        <div className="h-20 w-20 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md mb-8">
          You haven\'t added any scrumptious food from Bhola to your cart yet. Take a look at our hot menu and satisfy your hunger!
        </p>
        <Link 
          to="/shop" 
          className="rounded-full bg-orange-500 px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <span>Explore Delicious Food</span>
          <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    );
  }

  return (
    <div id="cart-page" className="bg-gray-50 min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
          Your Food Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Cart Table List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div 
                key={item.product.id}
                className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumb */}
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Body Content */}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide inline-block mb-1">
                    {item.product.restaurantName}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    {item.product.name}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Unit Price: ৳{item.product.price}
                  </p>
                  
                  {/* Total price for this row */}
                  <div className="font-extrabold text-sm sm:text-base text-gray-900 mt-2 sm:hidden">
                    ৳{item.product.price * item.quantity}
                  </div>
                </div>

                {/* Quantity adjustments */}
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-9 bg-gray-50">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 text-gray-600 hover:bg-gray-100 h-full font-bold transition-colors cursor-pointer"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-2 text-xs font-bold text-gray-800 w-8 text-center select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 text-gray-600 hover:bg-gray-100 h-full font-bold transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Desktop Total Price */}
                  <div className="hidden sm:block font-black text-base text-gray-900 w-24 text-right">
                    ৳{item.product.price * item.quantity}
                  </div>

                  {/* Delete Row button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
              Order Summary
            </h3>

            {/* Calculations List */}
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between font-medium text-gray-600">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>

              {discountValue > 0 && (
                <div className="flex justify-between font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    Discount Applied
                  </span>
                  <span>-৳{discountValue}</span>
                </div>
              )}

              <div className="flex justify-between font-medium text-gray-600">
                <span>Delivery Fee</span>
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span>৳{deliveryCharge}</span>
                )}
              </div>

              <hr className="my-1 border-gray-100" />

              <div className="flex justify-between text-base font-black text-gray-900">
                <span>Total Payment</span>
                <span>৳{finalTotal}</span>
              </div>
            </div>

            {/* Promo code submission */}
            <div className="border-t border-gray-100 pt-4">
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-orange-50 border border-orange-200 text-orange-800 p-2.5 rounded-xl text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-orange-600" />
                    <span>Promo "{appliedPromo}" Active</span>
                  </div>
                  <button 
                    onClick={handleRemovePromo}
                    className="text-[10px] uppercase font-extrabold text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Have a Promo? e.g. DOIFEST"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="flex-1 bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 text-xs uppercase text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-4 transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[10px] font-bold text-red-500 mt-1.5 ml-1">{promoError}</p>
              )}
            </div>

            {/* Hint Box */}
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 text-[11px] text-amber-800 leading-relaxed font-semibold">
              <span className="font-extrabold uppercase block text-amber-600 mb-0.5 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Promotion Tips
              </span>
              Use code **DOIFEST** for 15% flat discount, or **BHOFLAFREE** for free delivery above ৳200 purchase!
            </div>

            {/* Check-Out Action Button */}
            <button
              onClick={() => navigate('/checkout', { state: { discount: discountValue, promo: appliedPromo } })}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 text-sm font-black text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
