import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, X } from 'lucide-react';

interface NotificationBanner {
  id: string;
  orderId: string;
  name: string;
  total: number;
  itemsCount: number;
  area: string;
  timestamp: Date;
}

export const OrderNotificationManager: React.FC = () => {
  const { orders, currentUser } = useApp();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const [banners, setBanners] = useState<NotificationBanner[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load Messenger-style double pop chime sound
  const playChime = () => {
    try {
      // Create audio context if it doesn't exist
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Note 1 (Messenger sweet pop sound)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.12);

      // Note 2 (Delayed high sweet tone)
      setTimeout(() => {
        if (ctx.state === 'suspended') return;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880.00, ctx.currentTime); // A5
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.22);
      }, 75);
    } catch (e) {
      console.warn('Could not play notification sound:', e);
    }
  };

  const removeBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  useEffect(() => {
    // Only admins or sub-admins get real-time order alerts
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'sub-admin')) {
      return;
    }

    if (!orders || orders.length === 0) return;

    // Get list of already notified order IDs from localStorage to persist across refreshes
    let notifiedIds: string[] = [];
    try {
      const stored = localStorage.getItem('bhola_notified_orders');
      if (stored) {
        notifiedIds = JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading notified orders:', e);
    }

    const now = Date.now();
    let hasNewNotification = false;
    const newlyNotified: string[] = [...notifiedIds];

    orders.forEach(order => {
      // We only notify for 'Pending' orders
      if (order.status !== 'Pending') return;

      // Ensure it was placed recently (e.g. within the last 15 minutes)
      const orderTime = new Date(order.date).getTime();
      const isRecent = !isNaN(orderTime) && (now - orderTime) < 15 * 60 * 1000;

      if (isRecent && !notifiedIds.includes(order.id)) {
        hasNewNotification = true;
        newlyNotified.push(order.id);

        const bannerId = `${order.id}-${now}`;
        const itemsCount = order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;

        // Add to banner state
        setBanners(prev => [
          {
            id: bannerId,
            orderId: order.id,
            name: order.name,
            total: order.total,
            itemsCount,
            area: order.area,
            timestamp: new Date()
          },
          ...prev
        ]);

        // Auto-dismiss after 15 seconds
        setTimeout(() => {
          removeBanner(bannerId);
        }, 15000);
      }
    });

    if (hasNewNotification) {
      // Play Messenger-style beep
      playChime();

      // Persist notified list in localStorage
      try {
        localStorage.setItem('bhola_notified_orders', JSON.stringify(newlyNotified));
      } catch (e) {
        console.error('Error saving notified orders list:', e);
      }
    }
  }, [orders, currentUser]);

  // If there are no banners, don't render anything
  if (banners.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from {
            transform: translateY(50px) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Portal container on bottom-right */}
      <div 
        id="order-notification-portal"
        className="fixed bottom-6 right-6 z-9999 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none"
      >
        {banners.map(banner => (
          <div 
            key={banner.id}
            className="bg-white border-2 border-orange-500 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col gap-2 text-gray-800 pointer-events-auto transition-all duration-300 transform hover:scale-[1.02]"
            style={{
              animation: 'toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            {/* Top orange status gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shrink-0">
                  <Bell className="w-4.5 h-4.5 animate-bounce" />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black text-orange-600 tracking-wider block">নতুন অর্ডার এসেছে!</span>
                  <h4 className="text-xs font-black text-gray-900">{banner.orderId}</h4>
                </div>
              </div>
              <button 
                onClick={() => removeBanner(banner.id)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-[11px] font-bold text-gray-700 space-y-0.5">
              <p>গ্রাহক: <span className="font-extrabold text-gray-900">{banner.name}</span></p>
              <p>এলাকা: <span className="font-extrabold text-gray-900">{banner.area}</span></p>
              <p>পরিমাণ: <span className="font-extrabold text-gray-900">{banner.itemsCount} টি আইটেম</span></p>
            </div>
            
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-gray-900">৳{banner.total.toLocaleString()}</span>
                <span className="text-[8px] bg-emerald-50 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-widest animate-pulse">Active</span>
              </div>
              <button
                onClick={() => {
                  const destTab = currentUser?.role === 'admin' ? 'admin_orders' : 'subadmin_orders';
                  navigate(`/dashboard?tab=${destTab}`);
                  removeBanner(banner.id);
                }}
                className="text-[10px] font-black text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl border border-orange-100 transition-all cursor-pointer"
              >
                ম্যানেজ করুন
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
