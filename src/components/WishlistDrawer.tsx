import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveWishlist: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveWishlist,
  onOpenProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-start animate-fadeIn font-arabic">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-right">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h2 className="font-bold text-lg text-neutral-900">
              قائمة أمنياتك ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-500 hover:text-black hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <p className="text-neutral-700 font-bold text-sm">قائمة الرغبات فارغة</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                انقر على رمز القلب على أي منتج لحفظه والرجوع إليه لاحقاً.
              </p>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-neutral-50 border border-neutral-200 transition-all hover:border-neutral-300"
              >
                <div className="w-20 h-24 bg-white shrink-0 overflow-hidden border border-neutral-200 cursor-pointer" onClick={() => { onOpenProduct(product); onClose(); }}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4
                        onClick={() => { onOpenProduct(product); onClose(); }}
                        className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-1 cursor-pointer hover:text-neutral-600"
                      >
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveWishlist(product)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                        title="إزالة من المفضلة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="font-brand font-black text-sm text-black mt-1">
                      {product.price} <span className="font-arabic text-xs font-bold">ج.م</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onOpenProduct(product);
                      onClose();
                    }}
                    className="w-full mt-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold py-2 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>تحديد المقاس والإضافة للسلة</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-neutral-600 hover:text-black"
          >
            متابعة التسوق
          </button>
        </div>

      </div>
    </div>
  );
};
