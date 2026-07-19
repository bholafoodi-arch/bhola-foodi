import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell } from 'lucide-react';
import { toast } from 'react-toastify';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const PushNotificationManager: React.FC = () => {
  const { currentUser } = useApp();
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermissionState(Notification.permission);
    }

    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      currentUser &&
      (currentUser.role === 'admin' || currentUser.role === 'sub-admin')
    ) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Push Service Worker registered:', reg);
          // If permission is already granted, try to renew subscription automatically
          if (Notification.permission === 'granted') {
            subscribeUser(reg, currentUser.email);
          }
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, [currentUser]);

  const subscribeUser = async (registration: ServiceWorkerRegistration, email: string) => {
    try {
      // 1. Get public key
      const keyRes = await fetch('/api/push-public-key');
      const { publicKey } = await keyRes.json();
      if (!publicKey) throw new Error('VAPID public key not found');

      // 2. Subscribe
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // 3. Save subscription on backend
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription, email })
      });

      console.log('Successfully subscribed to Web Push Notifications.');
    } catch (err) {
      console.error('Failed to subscribe user to push:', err);
    }
  };

  const handleRequestPermission = async () => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      toast.error('System notifications are not supported on this device/browser.');
      return;
    }

    setIsSubscribing(true);
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);

      if (permission === 'granted') {
        const reg = await navigator.serviceWorker.getRegistration('/sw.js');
        if (reg && currentUser) {
          await subscribeUser(reg, currentUser.email);
          toast.success('🔔 Background notifications successfully enabled!');
        } else {
          toast.error('Service Worker not ready. Please try again in a moment.');
        }
      } else if (permission === 'denied') {
        toast.warning('Notifications blocked. Please enable them in your browser settings to receive alerts.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to configure notifications.');
    } finally {
      setIsSubscribing(false);
    }
  };

  // Only show if user is admin/sub-admin
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'sub-admin')) {
    return null;
  }

  // If already granted, we don't show the setup banner
  if (permissionState === 'granted') {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-amber-100 p-3 rounded-xl text-amber-600 shrink-0">
          <Bell className="h-6 w-6 animate-bounce" />
        </div>
        <div className="flex-grow">
          <h3 className="font-bold text-gray-900 text-base mb-1">
            মোবাইলে ব্যাকগ্রাউন্ড নোটিফিকেশন চালু করুন 🔔
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            ওয়েবসাইট বা ট্যাব বন্ধ থাকলেও নতুন অর্ডার আসলে মোবাইলের স্ক্রিনের উপর মেসেজ (Push Notification) আসবে।
          </p>
        </div>
        <button
          onClick={handleRequestPermission}
          disabled={isSubscribing}
          className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-xl transition shadow-sm w-full sm:w-auto text-center cursor-pointer select-none"
        >
          {isSubscribing ? 'চালু হচ্ছে...' : 'নোটিফিকেশন চালু করুন'}
        </button>
      </div>
    </div>
  );
};
