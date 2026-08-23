import React, { useState } from 'react';
import { X, MessageCircle, Phone, Clock, Mail, ShieldCheck, Send, Check } from 'lucide-react';
import { StoreSettings } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: StoreSettings;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const brandName = settings?.storeName || 'SAVIX';
  const whatsappNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '201000000000';
  const supportEmail = settings?.email || 'support@savix.store';
  const returnPolicy =
    settings?.refundPolicy ||
    'معاينة المنتج قبل الاستلام متاحة لجميع المحافظات. يحق لك استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام في حالته الأصلية.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setName('');
      setPhone('');
      setMessage('');
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn font-arabic">
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden my-auto border border-neutral-200 text-right">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <h2 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span>تواصل مع خدمة عملاء {brandName}</span>
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
          
          {/* Quick WhatsApp & Support Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`مرحباً ${brandName}، عندي استفسار بخصوص المنتجات`)}`}
              target="_blank"
              rel="noreferrer"
              className="p-4 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-emerald-950">محادثة واتساب مباشرة</span>
                <span className="text-[11px] text-emerald-700">رد فوري ومتابعة على مدار الساعة</span>
              </div>
            </a>

            <div className="p-4 bg-neutral-50 border border-neutral-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-bold text-xs text-neutral-900">البريد الإلكتروني للدعم</span>
                <span className="text-[11px] text-neutral-600 font-brand">{supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="bg-neutral-50 p-4 border border-neutral-200 space-y-2 text-xs text-neutral-700">
            <h4 className="font-bold text-black flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>سياسة الاستبدال والاسترجاع والضمان:</span>
            </h4>
            <p className="leading-relaxed text-neutral-600">
              {returnPolicy}
            </p>
          </div>

          {/* Send direct message */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <h4 className="font-bold text-xs text-black border-b border-neutral-200 pb-1">
              أو اترك لنا رسالة وسنعاود الاتصال بك:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="الاسم"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>

            <textarea
              rows={3}
              placeholder="اكتب استفسارك أو طلبك بالتفصيل..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="w-full border border-neutral-300 px-3 py-2 text-xs focus:outline-none focus:border-black resize-none"
            />

            <button
              type="submit"
              disabled={sent}
              className={`w-full py-3 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                sent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-black hover:bg-neutral-800 text-white shadow-xs'
              }`}
            >
              {sent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم إرسال رسالتك بنجاح، شكراً لتواصلك!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
