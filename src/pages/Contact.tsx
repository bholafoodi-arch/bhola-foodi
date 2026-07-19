import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  HelpCircle,
  Clock
} from 'lucide-react';

export const Contact: React.FC = () => {
  // Feedback form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate submission latency
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubject('Feedback');

      setTimeout(() => setSubmitSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div id="contact-page" className="bg-gray-50 min-h-screen pb-16">
      
      {/* Upper Hero Panel */}
      <section className="bg-orange-500 text-white py-12 text-center shadow-inner">
        <div className="mx-auto max-w-3xl px-4 flex flex-col gap-2">
          <span className="text-xs font-bold text-orange-100 uppercase tracking-widest">We're Here For You</span>
          <h1 className="text-3xl sm:text-4xl font-black">Contact Bhola Online</h1>
          <p className="text-sm text-orange-50 max-w-lg mx-auto leading-relaxed mt-1">
            Have queries about restaurant listings, rider applications, or custom corporate sweet orders? Let\'s chat!
          </p>
        </div>
      </section>

      {/* Main Grid area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Quick Contacts Box */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* Quick stats info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col gap-5">
              <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">
                HQ Office Details
              </h3>

              <ul className="flex flex-col gap-4 text-xs font-semibold text-gray-600">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-900 font-extrabold text-xs">Main Headquarters</span>
                    <span className="block text-gray-500 mt-1 font-medium leading-relaxed">
                      Level 3, Karim Mansion, Sadar Road (Opposite Pouroshova), Bhola Sadar, Bangladesh
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-900 font-extrabold text-xs">Customer Support Phone</span>
                    <span className="block text-gray-500 mt-1 font-medium">+880 1700-000000</span>
                    <span className="block text-gray-500 font-medium">+880 1800-000001</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-900 font-extrabold text-xs">Official Email</span>
                    <span className="block text-gray-500 mt-1 font-medium">support@bholaonline.com</span>
                    <span className="block text-gray-500 font-medium">partners@bholaonline.com</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-gray-900 font-extrabold text-xs">Operation Timings</span>
                    <span className="block text-gray-500 mt-1 font-medium">Daily: 09:00 AM - 11:30 PM (BDT)</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Support FAQ notice */}
            <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 text-xs text-amber-800 leading-relaxed font-semibold">
              <span className="font-extrabold text-amber-600 block mb-1 uppercase flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5" /> Quick Rider Support
              </span>
              Are you a registered delivery rider or partner sweet shop? Please reach out directly to the active coordinator at **+880 1700-000005** for instant terminal assistance.
            </div>

          </div>

          {/* Interactive Form Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 shadow-sm">
            <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 mb-6">
              Write Us a Message
            </h3>

            {submitSuccess && (
              <div className="mb-6 bg-green-50 border border-green-100 text-green-800 rounded-xl p-4 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>Your feedback was dispatched successfully! Our team will respond within 24 hours.</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rafiqul Islam"
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 px-3.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rafiq@gmail.com"
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 px-3.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Mobile Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 01712345678"
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 px-3.5 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Subject Topic</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 py-2.5 px-3 text-xs font-bold text-gray-800 focus:border-orange-500 focus:outline-none"
                >
                  <option value="Feedback">General Customer Feedback</option>
                  <option value="Partner">Restaurant Shop Partnership</option>
                  <option value="Rider">Delivery Rider Application</option>
                  <option value="Sweets">Bulk Buffalo Curd Sweet Orders</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-1">Your Detailed Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your suggestions, complaints, or inquiries here..."
                  className="w-full bg-gray-50 rounded-xl border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs px-8 shadow hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Sending Feedback...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Elegant Map Placeholder */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm p-4 mt-12">
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest pl-2">Geographic Location Map</div>
          
          <div className="aspect-video sm:aspect-[21/9] rounded-2xl bg-gray-100 border border-gray-200 relative overflow-hidden flex items-center justify-center text-center p-6">
            <div className="absolute inset-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000')` }} />
            
            <div className="relative z-10 flex flex-col items-center gap-2 max-w-sm">
              <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center animate-bounce shadow-sm">
                <MapPin className="h-5 w-5 fill-current" />
              </div>
              <h4 className="text-sm font-black text-gray-900">Bhola Online HQ Map</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                Karim Mansion, Sadar Road, Bhola Town (Municipality Center).
              </p>
              <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded">
                Coordinates: 22.6859° N, 90.6440° E
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
