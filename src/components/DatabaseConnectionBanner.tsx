import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, AlertTriangle, X, ChevronDown, ChevronUp, Key } from 'lucide-react';

export const DatabaseConnectionBanner: React.FC = () => {
  const { dbConnected, dbError } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [showInstructions, setShowInstructions] = useState(false);

  if (dbConnected || !isOpen) return null;

  return (
    <div id="db-connection-banner" className="bg-amber-50 border-b border-amber-200 text-amber-900 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-100 rounded-lg text-amber-700 mt-0.5">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold leading-relaxed">
                ডাটাবেজ কানেক্ট করা সম্ভব হয়নি (MongoDB Connection Failed - Bad Auth). 
              </p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                আপনার সাইনআপ ও অন্যান্য তথ্য এখন ব্রাউজারের লোকাল স্টোরেজে সেভ হচ্ছে, মেইন ডাটাবেজে যাচ্ছে না।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors focus:outline-none"
            >
              <Key className="h-3 w-3" />
              {showInstructions ? "Hide Guide" : "How to Fix / সমাধান"}
              {showInstructions ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-amber-100 rounded-lg text-amber-700 transition-colors focus:outline-none"
              title="Close warning"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {showInstructions && (
          <div className="mt-3 pt-3 border-t border-amber-200 text-xs text-amber-950 bg-amber-100/50 rounded-xl p-4 flex flex-col gap-3">
            <div>
              <h4 className="font-bold flex items-center gap-1.5 text-amber-900">
                <Database className="h-4 w-4" />
                মেইন ডাটাবেজ কানেকশন সমস্যা সমাধান গাইড (How to Fix MongoDB Atlas):
              </h4>
              <p className="mt-1 text-gray-700 leading-relaxed text-[11px]">
                সার্ভারের হার্ডকোডেড ফলব্যাক ইউজারনেম ও পাসওয়ার্ড দিয়ে MongoDB Atlas এ অথেনটিকেশন রিজেক্ট হচ্ছে (<code className="bg-amber-200/60 px-1 rounded font-mono text-[10px]">bad auth : Authentication failed</code>)। ডাটাবেজে রিয়েল ডাটা পাঠাতে নিচের ধাপগুলো সম্পন্ন করুন:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <p className="font-bold text-amber-900 mb-1 text-[11px]">১. গুগল এআই স্টুডিও সিক্রেট সেট করুন (Recommended):</p>
                <ol className="list-decimal pl-4 space-y-1 text-gray-600 text-[11px]">
                  <li>গুগল এআই স্টুডিওর ডানদিকের গিয়ার আইকন / <strong>Settings</strong> মেনুতে যান।</li>
                  <li>সেখান থেকে <strong>Secrets / Environment Variables</strong> এ ক্লিক করুন।</li>
                  <li>দুটি নতুন সিক্রেট অ্যাড করুন:
                    <ul className="list-disc pl-4 mt-1 font-mono text-[10px] text-gray-800 space-y-0.5">
                      <li><strong className="text-amber-800">DB_USER</strong> = আপনার ডাটাবেজ ইউজারনেম</li>
                      <li><strong className="text-amber-800">DB_PASS</strong> = আপনার ডাটাবেজ পাসওয়ার্ড</li>
                    </ul>
                  </li>
                  <li>পেজ রিফ্রেশ করুন বা ডেভেলপমেন্ট সার্ভার রিস্টার্ট করুন।</li>
                </ol>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200">
                <p className="font-bold text-amber-900 mb-1 text-[11px]">২. অথবা আমাদের জানান (Ask code change):</p>
                <p className="text-gray-600 text-[11px] leading-relaxed">
                  আপনার কাছে যদি সঠিক ইউজারনেম ও পাসওয়ার্ড থাকে, তাহলে চ্যাটে আমাকে বলুন। আমি সরাসরি <code className="bg-amber-200/60 px-1 rounded font-mono text-[10px]">server.ts</code> ফাইলে সেই ক্রেডেনশিয়াল আপডেট করে দেব যেন এটি সবসময় সরাসরি কানেক্ট হতে পারে।
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
