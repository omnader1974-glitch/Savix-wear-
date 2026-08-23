import React, { useState } from 'react';
import { X, Package, Search } from 'lucide-react';
import { OrderData } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOrders: OrderData[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  savedOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedOrder, setMatchedOrder] = useState<OrderData | null>(
    savedOrders.length > 0 ? savedOrders[0] : null
  );
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    const found = savedOrders.find(
      (o) =>
        o.orderNumber.toLowerCase() === q ||
        o.phone.includes(q) ||
        (o.altPhone && o.altPhone.includes(q))
    );

    if (found) {
      setMatchedOrder(found);
    } else {
      setMatchedOrder(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-arabic">
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-right">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-black" />
            <span>تتبع شحنة وطلبك</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="أدخل رقم الطلب (مثل SVX-123456) أو رقم الهاتف المسجل"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-neutral-300 px-3 py-2.5 text-xs focus:outline-none focus:border-black font-brand uppercase"
            />
            <button
              type="submit"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 transition-colors cursor-pointer"
            >
              تتبع الآن
            </button>
          </form>

          {/* Results */}
          {matchedOrder ? (
            <div className="space-y-6">
              
              {/* Order Meta */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                  <span className="font-bold text-sm text-neutral-900">
                    طلب رقم: <strong className="font-brand">{matchedOrder.orderNumber}</strong>
                  </span>
                  <span className="bg-black text-white px-2.5 py-0.5 font-bold text-[11px]">
                    {matchedOrder.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-neutral-600">
                  <div>تاريخ الطلب: <strong className="text-black">{matchedOrder.date}</strong></div>
                  <div>المحافظة: <strong className="text-black">{matchedOrder.governorate}</strong></div>
                  <div>المستلم: <strong className="text-black">{matchedOrder.customerName}</strong></div>
                  <div>الإجمالي: <strong className="text-black font-brand">{matchedOrder.total} ج.م</strong></div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="relative border-r-2 border-neutral-200 mr-4 space-y-6 pr-6">
                
                <div className="relative">
                  <span className="absolute -right-[31px] top-0.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white"></span>
                  <h4 className="font-bold text-xs text-neutral-900">1. تم استلام الطلب وتأكيده</h4>
                  <p className="text-[11px] text-neutral-500">تم تسجيل طلبك في النظام وجاري تجهيزه من المخازن.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -right-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    matchedOrder.status === 'جاري التجهيز' || matchedOrder.status === 'تم الشحن' || matchedOrder.status === 'في الطريق' || matchedOrder.status === 'تم التسليم'
                      ? 'bg-emerald-600'
                      : 'bg-neutral-300'
                  }`}></span>
                  <h4 className="font-bold text-xs text-neutral-900">2. تم تجهيز الشحنة وتغليفها</h4>
                  <p className="text-[11px] text-neutral-500">تم فحص جودة الملابس وتغليفها بعناية.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -right-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    matchedOrder.status === 'تم الشحن' || matchedOrder.status === 'في الطريق' || matchedOrder.status === 'تم التسليم'
                      ? 'bg-emerald-600'
                      : 'bg-neutral-300'
                  }`}></span>
                  <h4 className="font-bold text-xs text-neutral-900">3. الشحنة مع مندوب التوصيل</h4>
                  <p className="text-[11px] text-neutral-500">في طريقها لعنوانك، سيتم الاتصال بك قبل الوصول.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -right-[31px] top-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    matchedOrder.status === 'تم التسليم' ? 'bg-emerald-600' : 'bg-neutral-300'
                  }`}></span>
                  <h4 className="font-bold text-xs text-neutral-900">4. تم التسليم بنجاح</h4>
                  <p className="text-[11px] text-neutral-500">معاينة واستلام واستمتع بمنتجاتك!</p>
                </div>

              </div>

            </div>
          ) : searched ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              لم نتمكن من العثور على طلب برقم البحث المدخل. يرجى التأكد من رقم الطلب أو رقم الهاتف.
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400 text-xs">
              أدخل رقم طلبك لمعرفة مكانه خطوة بخطوة وموعد وصول المندوب.
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-white text-center">
          <button
            onClick={onClose}
            className="bg-black text-white px-8 py-2.5 text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
