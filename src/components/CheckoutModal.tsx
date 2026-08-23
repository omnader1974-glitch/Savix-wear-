import React, { useState } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, CreditCard, Banknote, Smartphone, MessageCircle } from 'lucide-react';
import { CartItem, Coupon, Governorate, OrderData, StoreSettings } from '../types';
import { GOVERNORATES, FREE_SHIPPING_THRESHOLD } from '../data/products';
import { saveOrder } from '../lib/db';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  onOrderCompleted: (order: OrderData) => void;
  governorates?: Governorate[];
  settings?: StoreSettings;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  onOrderCompleted,
  governorates = GOVERNORATES,
  settings,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [selectedGovId, setSelectedGovId] = useState(governorates[0]?.id || 'cairo');
  const [cityArea, setCityArea] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay' | 'vodafone_cash'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderData | null>(null);

  if (!isOpen) return null;

  const activeGovs = governorates.filter((g) => g.isActive !== false);
  const selectedGov = activeGovs.find((g) => g.id === selectedGovId) || activeGovs[0] || GOVERNORATES[0];
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  // Shipping
  const threshold = settings?.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : FREE_SHIPPING_THRESHOLD;
  const shippingFee = subtotal >= threshold ? 0 : (selectedGov?.shippingFee || 45);
  const grandTotal = Math.max(0, subtotal - discount + shippingFee);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!customerName.trim()) {
      errs.customerName = 'يرجى إدخال الاسم بالكامل';
    }
    if (!phone.trim() || phone.trim().length < 11) {
      errs.phone = 'يرجى إدخال رقم هاتف صحيح (11 رقم)';
    }
    if (!cityArea.trim()) {
      errs.cityArea = 'يرجى كتابة المنطقة أو المدينة';
    }
    if (!detailedAddress.trim()) {
      errs.detailedAddress = 'يرجى كتابة العنوان التفصيلي (الشارع، رقم العقار، الشقة)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderNum = `SVX-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderData = {
      orderNumber: orderNum,
      customerName: customerName.trim(),
      phone: phone.trim(),
      altPhone: altPhone.trim(),
      governorate: selectedGov.name,
      cityArea: cityArea.trim(),
      detailedAddress: detailedAddress.trim(),
      notes: notes.trim(),
      paymentMethod,
      items: [...cart],
      subtotal,
      discount,
      shipping: shippingFee,
      total: grandTotal,
      couponCode: appliedCoupon?.code,
      date: new Date().toLocaleDateString('ar-EG', { dateStyle: 'long' }),
      status: 'تم الاستلام',
      createdAt: new Date().toISOString(),
    };

    try {
      // Save directly into persistent Firestore database
      await saveOrder(newOrder);
      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      // Fallback local display
      setConfirmedOrder(newOrder);
      onOrderCompleted(newOrder);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppConfirmation = () => {
    if (!confirmedOrder) return;
    const itemsList = confirmedOrder.items
      .map((i) => `• ${i.product.name} (${i.selectedColor} - مقاس ${i.selectedSize}) × ${i.quantity}`)
      .join('\n');

    const brandName = settings?.storeName || 'SAVIX';
    const storeWhatsApp = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '201000000000';

    const msg = encodeURIComponent(
      `مرحباً ${brandName}، لقد قمت بطلب جديد عبر الموقع:\n` +
      `رقم الطلب: ${confirmedOrder.orderNumber}\n` +
      `الاسم: ${confirmedOrder.customerName}\n` +
      `رقم الهاتف: ${confirmedOrder.phone}\n` +
      `العنوان: ${confirmedOrder.governorate} - ${confirmedOrder.cityArea} - ${confirmedOrder.detailedAddress}\n` +
      `طريقة الدفع: ${confirmedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : confirmedOrder.paymentMethod === 'instapay' ? 'InstaPay' : 'فودافون كاش'}\n` +
      `المنتجات:\n${itemsList}\n` +
      `الإجمالي: ${confirmedOrder.total} ج.م`
    );
    window.open(`https://wa.me/${storeWhatsApp}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-arabic">
      <div className="relative bg-white w-full max-w-3xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-right">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-black" />
            {confirmedOrder ? 'تأكيد الطلب' : 'بيانات الشحن والتوصيل'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Order Confirmed Screen */}
        {confirmedOrder ? (
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-scale">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1 font-brand">
                {settings?.storeName || 'SAVIX STORE'}
              </span>
              <h3 className="text-2xl font-black text-neutral-900">
                شكراً لك! تم استلام طلبك بنجاح
              </h3>
              <p className="text-sm text-neutral-600 mt-2">
                رقم الطلب الخاص بك هو: <strong className="text-black font-brand text-base">{confirmedOrder.orderNumber}</strong>
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                سيقوم فريق خدمة العملاء بالتواصل معك هاتفياً على <strong className="text-black">{confirmedOrder.phone}</strong> لتأكيد ميعاد التوصيل.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 text-right text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b border-neutral-200 pb-2 font-bold text-sm">
                <span>ملخص الفاتورة</span>
                <span className="text-neutral-500">{confirmedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>المستلم:</span>
                <span className="font-bold">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>عنوان التوصيل:</span>
                <span className="font-medium text-neutral-700">{confirmedOrder.governorate} - {confirmedOrder.cityArea}</span>
              </div>
              <div className="flex justify-between">
                <span>طريقة الدفع:</span>
                <span className="font-bold text-neutral-800">
                  {confirmedOrder.paymentMethod === 'cod' ? 'الدفع نقدياً عند الاستلام' : confirmedOrder.paymentMethod === 'instapay' ? 'InstaPay' : 'فودافون كاش'}
                </span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-2 text-sm font-black">
                <span>المبلغ الإجمالي المستحق:</span>
                <span className="font-brand text-base text-black">{confirmedOrder.total} ج.م</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                onClick={handleSendWhatsAppConfirmation}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال التفاصيل عبر واتساب</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-black hover:bg-neutral-800 text-white font-bold py-3 px-4 text-xs transition-colors cursor-pointer"
              >
                متابعة التسوق
              </button>
            </div>

          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
                1. البيانات الشخصية وبيانات التواصل
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    الاسم بالكامل <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: أحمد محمد علي"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs focus:outline-none focus:border-black ${
                      errors.customerName ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.customerName && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.customerName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    رقم الهاتف المحمول <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="01012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs text-right focus:outline-none focus:border-black ${
                      errors.phone ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.phone}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    رقم هاتف إضافي أو واتساب (اختياري)
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="01187654321"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2.5 text-xs text-right focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المحافظة <span className="text-rose-600">*</span>
                  </label>
                  <select
                    value={selectedGovId}
                    onChange={(e) => setSelectedGovId(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black bg-white cursor-pointer"
                  >
                    {activeGovs.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name} ({gov.shippingFee} ج.م - {gov.deliveryDays})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
                2. عنوان الشحن بالتفصيل
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    المنطقة / الحي / المدينة <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: التجمع الخامس / مدينة نصر / الدقي"
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs focus:outline-none focus:border-black ${
                      errors.cityArea ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.cityArea && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.cityArea}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    العنوان التفصيلي (اسم الشارع، رقم العمارة، رقم الشقة، علامة مميزة) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: شارع التسعين الشمالي، عمارة 14، الدور الثالث، بجوار مسجد..."
                    value={detailedAddress}
                    onChange={(e) => setDetailedAddress(e.target.value)}
                    className={`w-full border px-3 py-2.5 text-xs focus:outline-none focus:border-black ${
                      errors.detailedAddress ? 'border-rose-500 bg-rose-50' : 'border-neutral-300'
                    }`}
                  />
                  {errors.detailedAddress && (
                    <span className="text-[11px] text-rose-600 block mt-1">{errors.detailedAddress}</span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    ملاحظات للمندوب (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: الاتصال قبل الوصول بنصف ساعة"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-black border-b border-neutral-200 pb-2">
                3. طريقة الدفع
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-black bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-5 h-5 text-neutral-800" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-black"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-black">الدفع عند الاستلام (COD)</span>
                    <span className="text-[11px] text-neutral-500">ادفع نقداً بعد فحص ومعاينة المنتج</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('instapay')}
                  className={`p-3 border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'instapay'
                      ? 'border-black bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Smartphone className="w-5 h-5 text-neutral-800" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'instapay'}
                      onChange={() => setPaymentMethod('instapay')}
                      className="accent-black"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-black">تحويل InstaPay</span>
                    <span className="text-[11px] text-neutral-500">تحويل فوري عبر تطبيق إنستاباي</span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('vodafone_cash')}
                  className={`p-3 border cursor-pointer flex flex-col justify-between gap-2 transition-all ${
                    paymentMethod === 'vodafone_cash'
                      ? 'border-black bg-neutral-50 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-neutral-800" />
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'vodafone_cash'}
                      onChange={() => setPaymentMethod('vodafone_cash')}
                      className="accent-black"
                    />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-black">محفظة إلكترونية</span>
                    <span className="text-[11px] text-neutral-500">فودافون كاش / أورانج / اتصالات</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary & Total */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2 text-xs">
              <div className="font-bold text-sm text-neutral-900 border-b border-neutral-200 pb-2">
                ملخص الطلب ({cart.reduce((a, b) => a + b.quantity, 0)} قطع)
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>المجموع الفرعي:</span>
                <span className="font-brand font-bold text-black">{subtotal} ج.م</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>كود الخصم ({appliedCoupon.code}):</span>
                  <span className="font-brand">-{discount} ج.م</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>مصاريف الشحن ({selectedGov.name}):</span>
                <span className="font-bold text-black">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold">شحن مجاني 🚚</span>
                  ) : (
                    `${shippingFee} ج.م`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-neutral-200">
                <span>المبلغ الإجمالي النهائي:</span>
                <span className="font-brand text-xl text-black">{grandTotal} ج.م</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-2">
              <button
                type="submit"
                id="submit-order-btn"
                disabled={isSubmitting}
                className="w-full bg-black hover:bg-neutral-800 text-white py-4 font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>جاري تأكيد وحفظ الطلب...</span>
                ) : (
                  <>
                    <span>تأكيد الطلب الآن ({grandTotal} ج.م)</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>جميع طلباتك محمية بضمان الجودة والاستبدال الفوري</span>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
