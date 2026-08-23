import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';
import { CartItem, Coupon, StoreSettings } from '../types';
import { VALID_COUPONS, FREE_SHIPPING_THRESHOLD } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onProceedCheckout: () => void;
  coupons?: Coupon[];
  settings?: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onProceedCheckout,
  coupons = VALID_COUPONS,
  settings,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Free shipping logic with dynamic settings
  const freeThreshold = settings?.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : FREE_SHIPPING_THRESHOLD;
  const isFreeShipping = subtotal >= freeThreshold;
  const remainingForFreeShipping = Math.max(0, freeThreshold - subtotal);
  const progressPercentage = Math.min(100, Math.round((subtotal / (freeThreshold || 1)) * 100));

  // Discount calculation
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    // Search active coupons from database first
    const activeCoupons = coupons.filter((c) => c.isActive !== false);
    const matched = activeCoupons.find((c) => c.code.toUpperCase() === code);

    if (matched) {
      if (matched.minOrderAmount && subtotal < matched.minOrderAmount) {
        setCouponError(`الحد الأدنى لاستخدام هذا الكوبون هو ${matched.minOrderAmount} ج.م`);
        return;
      }
      onApplyCoupon(matched);
      setCouponInput('');
    } else {
      setCouponError('كود الخصم غير صالح أو منتهي الصلاحية');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-start animate-fadeIn font-arabic">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-right">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="font-bold text-lg text-neutral-900">
              حقيبة التسوق ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-neutral-50 p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            {isFreeShipping ? (
              <span className="text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                تهانينا! حصلت على شحن مجاني 🚚
              </span>
            ) : (
              <span className="text-neutral-700">
                أضف منتجات بقيمة <strong className="text-black">{remainingForFreeShipping} ج.م</strong> للحصول على شحن مجاني!
              </span>
            )}
            <span className="text-neutral-500">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-emerald-600' : 'bg-black'}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-neutral-600 font-bold text-base">حقيبة التسوق فارغة حالياً</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                تصفح تشكيلة الملابس العصرية واختر ما يناسبك الآن.
              </p>
              <button
                onClick={onClose}
                className="mt-2 bg-black text-white px-6 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-neutral-50 border border-neutral-200 transition-all hover:border-neutral-300"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 aspect-square bg-white shrink-0 overflow-hidden border border-neutral-200">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                      <span>المقاس: <strong className="text-neutral-800 font-brand">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>اللون: <strong className="text-neutral-800">{item.selectedColor}</strong></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-200/60">
                    <div className="font-brand font-black text-sm text-black">
                      {item.product.price * item.quantity} <span className="font-arabic text-xs font-bold">ج.م</span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border border-neutral-300 bg-white">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-bold min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Action */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3">
            
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="كود الخصم (مثال: SAVIX10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black font-brand uppercase"
                />
                <button
                  type="submit"
                  className="bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 text-xs font-bold px-4 py-2 transition-colors border border-neutral-300 cursor-pointer"
                >
                  تطبيق
                </button>
              </div>
              {couponError && (
                <div className="flex items-center gap-1 text-[11px] text-rose-600 mt-1">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponError}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2 py-1 mt-1">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    تم تطبيق كود <strong>{appliedCoupon.code}</strong> ({appliedCoupon.description})
                  </span>
                  <button
                    type="button"
                    onClick={() => onApplyCoupon(null)}
                    className="text-rose-600 underline font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-brand font-bold text-neutral-900">{subtotal} ج.م</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم المطبق:</span>
                  <span className="font-brand">-{discount} ج.م</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>الشحن:</span>
                <span className="font-bold text-neutral-900">
                  {isFreeShipping ? (
                    <span className="text-emerald-700">مجاني 🚚</span>
                  ) : (
                    'يحسب عند إتمام الطلب'
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-neutral-200">
                <span>المجموع الكلي التقديري:</span>
                <span className="font-brand text-lg">{Math.max(0, subtotal - discount)} ج.م</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              id="proceed-checkout-btn"
              onClick={onProceedCheckout}
              className="w-full bg-black text-white py-3.5 font-bold text-sm tracking-wider uppercase hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md active:scale-98 cursor-pointer"
            >
              <span>متابعة إتمام الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <p className="text-center text-[11px] text-neutral-400">
              الدفع عند الاستلام متاح مع حق المعاينة قبل الاستلام
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
