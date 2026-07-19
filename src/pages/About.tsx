import React from 'react';
import { Award, ShieldCheck, HeartHandshake, MapPin, Truck, HelpCircle, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div id="about-page" className="bg-[#F9FAFB] min-h-screen pb-16 font-sans text-gray-900">
      
      {/* Intro Banner (Bento Style) */}
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 w-full">
        <div className="relative bg-orange-600 text-white p-8 sm:p-12 rounded-3xl shadow-lg overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&auto=format&fit=crop&q=80" 
              alt="Bhola Online About Background"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-10 filter blur-xs"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-orange-600 to-orange-700/90" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center gap-3 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black bg-white/20 text-white uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-yellow-300" />
              Our Roots
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-1">The Bhola Online Story</h1>
            <p className="text-xs sm:text-sm text-orange-100 font-medium leading-relaxed">
              Connecting local culinary artists, legendary dessert makers, and busy families across the largest island in Bangladesh since 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative Section (Bento layout) */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Story Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold text-orange-600 uppercase tracking-widest block">Connecting Communities</span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug tracking-tight">
                Bridging the Gap Between Island Flavors and Your Dining Table
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Bhola, the largest island in Bangladesh, is famous for its rich culinary heritage—especially its legendary buffalo milk curd (Mohisher Doi), fresh river Hilsha (Ilish), and traditional sweets. However, accessing these delicious food options conveniently was always a challenge.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Founded in 2026, <strong className="text-orange-600">Bhola Online</strong> was born out of a simple mission: to empower local restaurants, home cooks, and sweet shops while providing residents with quick, hygienic, and affordable food delivery right to their doorsteps.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
              <div>
                <span className="block text-xl font-black text-orange-600">10k+</span>
                <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider">Meals Served</span>
              </div>
              <div>
                <span className="block text-xl font-black text-orange-600">25+</span>
                <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider">Kitchen Partners</span>
              </div>
              <div>
                <span className="block text-xl font-black text-orange-600">25m</span>
                <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-wider">Avg Delivery</span>
              </div>
            </div>
          </div>

          {/* Graphics Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-4 justify-between relative min-h-[300px]">
            <div className="relative aspect-video lg:aspect-auto lg:flex-1 rounded-2xl overflow-hidden bg-gray-50">
              <img 
                src="https://images.unsplash.com/photo-1526367790999-015078648c7e?w=800&auto=format&fit=crop&q=80" 
                alt="Delivery Rider on Scooter"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Visual float badge */}
            <div className="bg-orange-50 border border-orange-100/40 rounded-2xl p-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white text-orange-600 flex items-center justify-center shrink-0 shadow-xs">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[9px] text-orange-600 font-extrabold uppercase tracking-wider">Active Riders</span>
                <span className="font-black text-gray-900 text-xs">40+ Registered Local Riders</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values / Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Our Core Standard</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Why Bhola Online Stands Out</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100/30 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 mb-1.5">Unmatched Hygiene Control</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                We strictly audit all kitchen listings. From chef grooming to packaging seals, we double-check that every order matches strict health standards before heading out.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-yellow-50 text-yellow-700 flex items-center justify-center border border-yellow-100/30 shrink-0">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 mb-1.5">Support for Local Artisans</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                We run a zero-onboarding fee model for micro home cooks and female entrepreneurs in Bhola, allowing them to monetize their skills and showcase local culinary heritage.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100/30 shrink-0">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 mb-1.5">100% Customer Obsessed</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Whether you order a ৳100 Rosshogolla or a ৳1000 party feast, we treat your delivery with the utmost speed and priority. Friendly support is just one click away.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Coverage Area List (Bento card lists) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Our Footprint</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-8">Delivery Coverage Areas in Bhola</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              'Bhola Sadar',
              'Sadar Road',
              'Kheya Ghat',
              'Char Fashion',
              'Lalmohan',
              'Borhanuddin',
              'Tazumuddin',
              'Daulatkhan'
            ].map((area) => (
              <div 
                key={area} 
                className="flex items-center gap-2 p-3.5 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-left hover:border-orange-200 hover:bg-orange-50/20 transition-all cursor-default"
              >
                <MapPin className="h-4.5 w-4.5 text-orange-600 shrink-0" />
                <span className="text-xs font-black text-gray-800 tracking-tight">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Founders / Team (Bento card style) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest block mb-1">Passionate Crew</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">The Hearts Behind the App</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Kazi Mahbub',
              role: 'Founder & CEO',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
            },
            {
              name: 'Salma Akter',
              role: 'Culinary Lead & Advisor',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
            },
            {
              name: 'Tarek Jamil',
              role: 'Logistics Operations Lead',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
            },
            {
              name: 'Anika Rahman',
              role: 'Customer Support Manager',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80'
            }
          ].map((member) => (
            <div 
              key={member.name} 
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 text-center p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col items-center"
            >
              <div className="h-20 w-20 rounded-2xl overflow-hidden mb-4 border border-orange-100 shadow-xs shrink-0">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-sm font-black text-gray-900 tracking-tight">{member.name}</h4>
              <p className="text-[10px] text-orange-600 font-extrabold uppercase tracking-wider mt-0.5">{member.role}</p>
              <p className="text-[11px] text-gray-400 mt-2.5 leading-relaxed font-semibold">Dedicated to keeping Bhola fed with fresh local delicacies.</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
