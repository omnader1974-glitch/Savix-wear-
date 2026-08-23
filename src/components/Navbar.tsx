import React, { useState } from 'react';
import { Menu, Search, User, ShoppingBag, X, ChevronRight, Sparkles } from 'lucide-react';
import { Category, CategoryItem, StoreSettings } from '../types';

interface NavbarProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenTracking: () => void;
  onOpenContact: () => void;
  onOpenSizeGuide: () => void;
  cartCount?: number;
  categories?: CategoryItem[];
  settings?: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenCart,
  onOpenSearch,
  onOpenAccount,
  onOpenTracking,
  onOpenContact,
  onOpenSizeGuide,
  cartCount = 0,
  categories = [],
  settings,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dynamic active categories list
  const activeCategories = categories.filter((c) => c.isActive !== false);

  const handleCategorySelect = (cat: Category) => {
    onSelectCategory(cat);
    setDrawerOpen(false);
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    onSelectCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandName = settings?.storeName || settings?.logoText || 'SAVIX';
  const announcement = settings?.announcementText;

  return (
    <>
      {/* Top Announcement Bar (if configured in settings) */}
      {announcement && (
        <div className="bg-black text-white text-[11px] sm:text-xs py-2 px-4 text-center font-arabic font-medium tracking-wide">
          {announcement}
        </div>
      )}

      <header
        id="main-website-header"
        dir="ltr"
        className="sticky top-0 z-40 w-full bg-white border-b border-neutral-100/90 transition-all"
      >
        <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between relative">
          
          {/* ================= LEFT GROUP ================= */}
          {/* Layout: Hamburger Menu → Search */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5 z-10">
            {/* 1. Hamburger Menu Icon (3 horizontal lines) */}
            <button
              id="header-hamburger-menu-btn"
              onClick={() => setDrawerOpen(true)}
              className="p-2 -ml-1 text-black hover:text-neutral-600 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="القائمة"
              title="القائمة"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.25] text-black" />
            </button>

            {/* 2. Search Icon (Magnifying glass) */}
            <button
              id="header-search-btn"
              onClick={onOpenSearch}
              className="p-2 text-black hover:text-neutral-600 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="بحث"
              title="بحث"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.25] text-black" />
            </button>
          </div>

          {/* ================= EXACT CENTER: WEBSITE NAME ================= */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-auto max-w-[45vw] truncate">
            <button
              id="header-logo-btn"
              onClick={handleLogoClick}
              className="font-brand font-light text-lg sm:text-2xl md:text-3xl tracking-[0.22em] sm:tracking-[0.3em] uppercase text-black hover:opacity-75 transition-opacity select-none focus:outline-none whitespace-nowrap block cursor-pointer"
              aria-label={`${brandName} الصفحة الرئيسية`}
            >
              {settings?.logoImage ? (
                <img src={settings.logoImage} alt={brandName} className="h-8 sm:h-10 object-contain mx-auto" />
              ) : (
                brandName
              )}
            </button>
          </div>

          {/* ================= RIGHT GROUP ================= */}
          {/* Layout: Account → Shopping Bag */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-5 z-10">
            {/* 3. User / Account Profile Outline Icon (Head & Shoulders) */}
            <button
              id="header-account-btn"
              onClick={onOpenAccount}
              className="p-2 text-black hover:text-neutral-600 transition-colors focus:outline-none flex items-center justify-center cursor-pointer"
              aria-label="الحساب"
              title="حسابي"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.25] text-black" />
            </button>

            {/* 4. Shopping Bag / Cart Outline Icon */}
            <button
              id="header-shopping-bag-btn"
              onClick={onOpenCart}
              className="p-2 -mr-1 text-black hover:text-neutral-600 transition-colors focus:outline-none flex items-center justify-center relative cursor-pointer"
              aria-label="حقيبة التسوق"
              title="حقيبة التسوق"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.25] text-black" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center font-brand">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ================= SLIDE-OUT MENU DRAWER ================= */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-50 flex flex-col font-arabic animate-slideInRight">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <span className="font-brand font-light text-xl tracking-[0.25em] uppercase text-black">
                {brandName}
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Drawer Categories Navigation */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  الأقسام والتشكيلات
                </p>
                <div className="space-y-1">
                  {/* All products */}
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full flex items-center justify-between py-3 px-3 text-right text-sm font-medium transition-colors ${
                      activeCategory === 'all'
                        ? 'bg-neutral-100 text-black font-bold'
                        : 'text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <span>جميع المنتجات</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 rotate-180" />
                  </button>

                  {/* New arrivals */}
                  <button
                    onClick={() => handleCategorySelect('new')}
                    className={`w-full flex items-center justify-between py-3 px-3 text-right text-sm font-medium transition-colors ${
                      activeCategory === 'new'
                        ? 'bg-neutral-100 text-black font-bold'
                        : 'text-neutral-800 hover:bg-neutral-50'
                    }`}
                  >
                    <span>وصل حديثاً ✨</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 rotate-180" />
                  </button>

                  {/* Dynamic Categories from database */}
                  {activeCategories.map((cat) => {
                    const isSelected = activeCategory === cat.slug;
                    return (
                      <button
                        key={cat.id || cat.slug}
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full flex items-center justify-between py-3 px-3 text-right text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-neutral-100 text-black font-bold'
                            : 'text-neutral-800 hover:bg-neutral-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <ChevronRight className="w-4 h-4 text-neutral-400 rotate-180" />
                      </button>
                    );
                  })}

                  {/* Sale */}
                  <button
                    onClick={() => handleCategorySelect('sale')}
                    className={`w-full flex items-center justify-between py-3 px-3 text-right text-sm font-bold text-rose-600 transition-colors ${
                      activeCategory === 'sale'
                        ? 'bg-rose-50 font-bold'
                        : 'hover:bg-rose-50/50'
                    }`}
                  >
                    <span>عروض وتخفيضات 🔥</span>
                    <ChevronRight className="w-4 h-4 text-rose-400 rotate-180" />
                  </button>
                </div>
              </div>

              {/* Quick Links & Services */}
              <div className="pt-4 border-t border-neutral-100 space-y-2 text-sm text-neutral-700">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenTracking();
                  }}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-neutral-50 transition-colors text-right"
                >
                  <span>📦 تتبع شحنتك وطلباتك</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 rotate-180" />
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenSizeGuide();
                  }}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-neutral-50 transition-colors text-right"
                >
                  <span>📏 جدول ودليل المقاسات</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 rotate-180" />
                </button>

                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenContact();
                  }}
                  className="w-full flex items-center justify-between py-2.5 px-3 hover:bg-neutral-50 transition-colors text-right"
                >
                  <span>💬 تواصل معنا وخدمة العملاء</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 rotate-180" />
                </button>
              </div>

              {/* Shopping Guarantee Highlight */}
              <div className="bg-neutral-50 p-4 border border-neutral-100 space-y-1 text-xs text-neutral-600">
                <p className="font-bold text-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
                  تسوق بثقة مع {brandName}
                </p>
                <p className="leading-relaxed">
                  معاينة المنتج قبل الاستلام متاحة لجميع المحافظات مع سياسة استبدال واسترجاع خلال 14 يوماً.
                </p>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500 font-brand">
              <span>{brandName} OFFICIAL STORE</span>
              <span>© 2026</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
