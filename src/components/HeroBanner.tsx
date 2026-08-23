import React from 'react';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { Category, StoreSettings } from '../types';

interface HeroBannerProps {
  onShopNow: (cat?: Category) => void;
  settings?: StoreSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, settings }) => {
  const badge = settings?.heroBadge || 'SAVIX SUMMER COLLECTION 2026';
  const title = settings?.heroTitle || 'NEW COLLECTION';
  const subtitle =
    settings?.heroSubtitle ||
    'تشكيلة الصيف والستريت وير الجديدة متوفرة الآن بأعلى معايير جودة القطن المصري وتصميمات عصرية جريئة تناسب أسلوبك اليومي.';
  const bgImage =
    settings?.heroImage ||
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80';
  const ctaText = settings?.heroCtaText || 'تسوق التشكيلة الآن';

  return (
    <div className="relative bg-neutral-950 text-white overflow-hidden">
      {/* Dynamic Background */}
      <div
        className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/85 to-transparent z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex flex-col justify-center min-h-[560px]">
        <div className="max-w-2xl text-right">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1 text-xs sm:text-sm font-bold text-neutral-200 mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            {badge}
          </div>

          <h1 className="font-brand text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white mb-4 leading-none">
            {title}
          </h1>

          <p className="font-arabic text-base sm:text-xl text-neutral-300 mb-8 leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              id="hero-shop-btn"
              onClick={() => onShopNow('all')}
              className="bg-white text-black font-brand font-black text-sm uppercase tracking-wider px-8 py-4 hover:bg-neutral-200 transition-all flex items-center gap-3 shadow-lg active:scale-95 cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onShopNow('sale')}
              className="bg-transparent border border-white/40 text-white font-arabic font-bold text-sm px-7 py-4 hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer"
            >
              عروض وتخفيضات خاصة 🔥
            </button>
          </div>

          {/* Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/15 text-xs text-neutral-300 font-arabic">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>شحن سريع لكل المحافظات</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>قطن مصري فاخر 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>معاينة قبل الاستلام</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-neutral-400 shrink-0" />
              <span>استبدال واسترجاع 14 يوم</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
