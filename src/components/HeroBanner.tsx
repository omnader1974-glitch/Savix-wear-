import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreSale: () => void;
  settings?: StoreSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onExploreSale, settings }) => {
  const badge = settings?.heroBadge || 'SAVIX SUMMER COLLECTION 2026';
  const title = settings?.heroTitle || 'NEW STREETWEAR COLLECTION';
  const subtitle =
    settings?.heroSubtitle && !/[\u0600-\u06FF]/.test(settings.heroSubtitle)
      ? settings.heroSubtitle
      : 'Discover the latest urban streetwear essentials crafted from 100% premium Egyptian heavyweight cotton with clean minimalist aesthetics.';
  const ctaText =
    settings?.heroCtaText && !/[\u0600-\u06FF]/.test(settings.heroCtaText)
      ? settings.heroCtaText
      : 'SHOP COLLECTION NOW';
  const heroImage =
    settings?.heroImage ||
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80';

  return (
    <div className="relative bg-neutral-900 text-white overflow-hidden font-brand" dir="ltr">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Streetwear Lookbook"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 md:py-40 flex flex-col items-center text-center">
        
        {/* Top Tag / Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white/10 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>{badge}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase max-w-4xl leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl font-light leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            onClick={onShopNow}
            className="bg-white text-black hover:bg-neutral-200 font-bold px-8 py-4 text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreSale}
            className="bg-transparent hover:bg-white/10 text-white border border-white/40 font-bold px-8 py-4 text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>DISCOVER SALE & OFFERS 🔥</span>
          </button>
        </div>

        {/* Feature Guarantees Strip */}
        <div className="mt-14 sm:mt-20 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl text-neutral-300 text-xs">
          <div className="flex items-center justify-center gap-2">
            <Truck className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">Fast Nationwide Delivery</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">100% Premium Egyptian Cotton</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">Inspect Before Delivery</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white shrink-0" />
            <span className="font-medium">14-Day Easy Returns</span>
          </div>
        </div>

      </div>
    </div>
  );
};
