import React, { useState, useMemo } from 'react';
import { X, Search, ArrowLeft, Tag } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const quickTags = ['تيشيرت أبيض', 'هودي أوفرسايز', 'سويت بانتس', 'كارغو', 'خصومات الصيف'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.fitType && p.fitType.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
    );
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-start justify-center p-3 sm:p-6 animate-fadeIn font-arabic">
      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden mt-8 sm:mt-16 border border-neutral-200 text-right">
        
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن تيشيرت، هودي، بنطال، مقاس..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-neutral-400 hover:text-black px-2 py-1"
            >
              مسح
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
          <span className="text-xs font-bold text-neutral-500 block mb-2">كلمات بحث شائعة:</span>
          <div className="flex flex-wrap gap-2">
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="bg-white border border-neutral-200 hover:border-black text-xs font-medium text-neutral-700 hover:text-black px-3 py-1.5 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-neutral-400 text-xs">
              ابدأ بكتابة اسم المنتج للبحث الفوري في التشكيلة
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-neutral-700">لم يتم العثور على نتائج لـ "{query}"</p>
              <p className="text-xs text-neutral-400">تأكد من كتابة الكلمات بشكل صحيح أو جرب البحث بكلمة عامة مثل "تيشيرت" أو "هودي"</p>
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 aspect-square bg-white shrink-0 overflow-hidden border border-neutral-200">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                      {product.name}
                    </h4>
                    <span className="text-[11px] text-neutral-500 font-brand">
                      {product.fitType}
                    </span>
                  </div>
                </div>

                <div className="text-left font-brand font-black text-sm text-black shrink-0">
                  {product.price} <span className="font-arabic text-xs font-bold">ج.م</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
