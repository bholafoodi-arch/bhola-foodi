import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { BHOLA_AREAS } from '../data/staticConfig';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  CreditCard, 
  CheckCircle,
  Truck,
  Download
} from 'lucide-react';
import { downloadInvoiceFile } from '../utils/downloadHelper';

export const Checkout: React.FC = () => {
  const { cart, currentUser, placeOrder, getCartSubtotal } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve discount/promo details passed from Cart page
  const discountState = location.state?.discount || 0;
  const promoState = location.state?.promo || null;

  // Checkout address states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState(BHOLA_AREAS[0]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'bKash' | 'Nagad'>('Cash on Delivery');
  
  // Wallet payment fields
  const [walletNumber, setWalletNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  
  // Form error and loading states
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState<any>(null);

  // Sync profile details if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.area) setArea(currentUser.area);
    }
  }, [currentUser]);

  // Redirect if cart is empty and order wasn't just placed successfully
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, orderSuccess, navigate]);

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors(null);

    // Basic Validation
    if (!name.trim()) return setFormErrors('Please enter your full delivery name.');
    if (!phone.trim()) return setFormErrors('Please enter your active contact phone number.');
    if (phone.length < 11) return setFormErrors('Please enter a valid 11-digit Bangladeshi mobile number.');
    if (!address.trim()) return setFormErrors('Please describe your complete delivery address (house/road/floor).');
    
    // Wallet Validation
    if (paymentMethod !== 'Cash on Delivery') {
      if (!walletNumber.trim()) return setFormErrors(`Please specify your ${paymentMethod} sender number.`);
      if (walletNumber.length < 11) return setFormErrors(`A valid ${paymentMethod} mobile number must be 11-digits.`);
      if (!transactionId.trim()) return setFormErrors('Please specify the transaction ID (TxnID) of payment.');
    }

    setIsPlacing(true);

    // Call placeOrder which syncs to MongoDB backend
    Promise.resolve(placeOrder({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      area,
      paymentMethod
    })).then((placedOrder) => {
      setPlacedOrderInfo(placedOrder);
      setIsPlacing(false);
      setOrderSuccess(true);
    }).catch((err) => {
      console.error(err);
      setIsPlacing(false);
      setFormErrors('Failed to place order. Please try again.');
    });
  };

  const subtotal = getCartSubtotal();
  const deliveryCharge = promoState === 'BHOFLAFREE' ? 0 : 45;
  const total = Math.max(0, subtotal - discountState + deliveryCharge);

  if (orderSuccess && placedOrderInfo) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-xs text-orange-500 font-extrabold tracking-wider uppercase mb-6">
            Order Reference: {placedOrderInfo.id}
          </p>

          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Congratulations! Your order has been registered at **{placedOrderInfo.area}**. Our partner kitchen is preparing your dishes and our riders will call you shortly.
          </p>

          {/* Quick Order Info Card */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left mb-8 flex flex-col gap-2.5">
            <div className="flex justify-between text-xs font-bold text-gray-600">
              <span>Customer:</span>
              <span className="text-gray-900">{placedOrderInfo.name}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-600">
              <span>Deliver To:</span>
              <span className="text-gray-900 truncate max-w-[200px]">{placedOrderInfo.address}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-gray-600">
              <span>Payment Mode:</span>
              <span className="text-gray-900">{placedOrderInfo.paymentMethod}</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-sm font-black text-gray-900">
              <span>Paid Total:</span>
              <span>৳{placedOrderInfo.total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard?tab=orders')}
            className="w-full py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-sm font-black text-white shadow hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mb-3"
          >
            <Truck className="h-4.5 w-4.5" />
            <span>Track Order Timeline</span>
          </button>

          <button
            onClick={() => downloadInvoiceFile(placedOrderInfo)}
            className="w-full py-3 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4 text-orange-500" />
            <span>Download Invoice Receipt (মেমো ডাউনলোড করুন)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page" className="bg-gray-50 min-h-screen pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Back link */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-orange-500 mb-6 cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Back to Cart</span>
        </button>

        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-8">
          Complete Your Order
        </h1>

        {formErrors && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-800 rounded-xl p-4 text-xs font-extrabold">
            {formErrors}
          </div>
        )}

        <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Address & Payment Selection */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Delivery address card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <MapPin className="h-5 w-5 text-orange-500" />
                Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Receiver's Name</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-gray-400">
                      <UserIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Tanvir Rahman"
                      className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Mobile Contact Phone</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-gray-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 pl-10 pr-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Regional Delivery Area in Bhola</label>
                  <div className="relative">
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 px-3 text-xs font-bold text-gray-800 focus:border-orange-500 focus:outline-none"
                    >
                      {BHOLA_AREAS.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Exact Home Address & Landmark</label>
                  <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Describe building name, apartment number, street details, and famous landmarks nearby..."
                    className="w-full bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment options card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-base font-black text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Select Payment Mode
              </h3>

              {/* Selector boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[
                  { id: 'Cash on Delivery', name: 'Cash on Delivery (COD)', desc: 'Pay rider on delivery', color: 'border-orange-500' },
                  { id: 'bKash', name: 'bKash Mobile Money', desc: 'Secure digital payment', color: 'border-pink-500' },
                  { id: 'Nagad', name: 'Nagad Postal Cash', desc: 'Fast digital payment', color: 'border-red-500' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPaymentMethod(mode.id as any)}
                    className={`flex flex-col items-start p-4 border rounded-xl text-left cursor-pointer transition-all ${
                      paymentMethod === mode.id 
                        ? `bg-orange-50/50 border-orange-500 ring-1 ring-orange-500` 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs font-extrabold text-gray-900">{mode.name}</span>
                    <span className="text-[10px] text-gray-400 mt-1">{mode.desc}</span>
                  </button>
                ))}
              </div>

              {/* bKash / Nagad specific forms */}
              {paymentMethod !== 'Cash on Delivery' && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 animate-fade-in flex flex-col gap-4">
                  <div className="text-xs text-gray-600 leading-relaxed font-semibold">
                    <span className="font-black text-orange-600 block mb-1">Merchant Payment Guideline</span>
                    Send total **৳{total}** to our merchant wallet **01700-000000** as a "Payment" (bKash/Nagad), and fill out details below:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Sender Mobile Number</label>
                      <input
                        type="tel"
                        required
                        value={walletNumber}
                        onChange={(e) => setWalletNumber(e.target.value)}
                        placeholder="e.g. 018XXXXXXXX"
                        className="w-full bg-white rounded-lg border border-gray-300 py-2 px-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Transaction ID (TxnID)</label>
                      <input
                        type="text"
                        required
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. BKX928471"
                        className="w-full bg-white rounded-lg border border-gray-300 py-2 px-3 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Sidebar calculations review */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">
              Review Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h3>

            {/* Cart scroll items summary list */}
            <div className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                  <img src={item.product.image} alt={item.product.name} className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{item.product.name}</h4>
                    <span className="text-gray-400 font-semibold">{item.quantity} x ৳{item.product.price}</span>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">৳{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Price list */}
            <div className="flex flex-col gap-3 text-xs border-t border-gray-100 pt-4">
              <div className="flex justify-between font-semibold text-gray-500">
                <span>Cart Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              
              {discountState > 0 && (
                <div className="flex justify-between font-bold text-emerald-600">
                  <span>Discount Applied</span>
                  <span>-৳{discountState}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-gray-500">
                <span>Rider Delivery Fee</span>
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  <span>৳{deliveryCharge}</span>
                )}
              </div>

              <hr className="border-gray-100" />

              <div className="flex justify-between text-base font-black text-gray-900">
                <span>Grand Total</span>
                <span>৳{total}</span>
              </div>
            </div>

            {/* Action Checkout button */}
            <button
              type="submit"
              disabled={isPlacing}
              className={`w-full py-3.5 rounded-full text-xs font-bold tracking-wider uppercase text-white shadow transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isPlacing 
                  ? 'bg-orange-400 cursor-not-allowed' 
                  : 'bg-orange-500 hover:bg-orange-600 hover:shadow-md'
              }`}
            >
              {isPlacing ? (
                <span>Placing Your Order...</span>
              ) : (
                <span>Place Order (৳{total})</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
