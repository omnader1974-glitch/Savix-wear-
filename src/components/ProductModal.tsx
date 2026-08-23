import React, { useState } from 'react';
import { X, Heart, Star, Check, ShoppingBag, Ruler, Truck, ShieldAlert, Sparkles } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, qty: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenSizeGuide: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  onOpenSizeGuide,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors?.[0]?.name || '');
      setSelectedSize(product.sizes?.[0] || 'L');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-white w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-neutral-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 text-neutral-500 hover:text-black bg-white/90 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Images Section */}
          <div className="p-4 sm:p-6 bg-neutral-50 flex flex-col justify-between">
            {/* Main Stage Image - 1:1 Square */}
            <div className="relative aspect-square w-full bg-white overflow-hidden border border-neutral-200 mb-3">
              <img
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-3 right-3 bg-rose-600 text-white text-xs font-bold px-2.5 py-1">
                  خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 aspect-square border-2 overflow-hidden transition-all cursor-pointer ${
                      selectedImage === idx ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="p-6 sm:p-8 flex flex-col text-right font-arabic max-h-[85vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-brand">
                SAVIX OFFICIAL
              </span>
              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-full transition-colors ${
                  isWishlisted ? 'text-rose-600 bg-rose-50' : 'text-neutral-400 hover:text-black'
                }`}
                title="إضافة للمفضلة"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-2">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-neutral-800">{product.rating}</span>
              <span className="text-neutral-400">({product.reviewsCount} تقييم معتمد)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 p-3 bg-neutral-50 border border-neutral-100">
              <span className="text-2xl sm:text-3xl font-black font-brand text-black">
                {product.price} <span className="text-sm font-arabic font-bold">ج.م</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  {product.originalPrice} ج.م
                </span>
              )}
              <span className="text-xs text-emerald-700 font-bold mr-auto bg-emerald-50 px-2 py-1">
                متوفر في المخزون
              </span>
            </div>

            {/* Color selection */}
            <div className="mb-5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 mb-2">
                <span>اللون المختار: <strong className="text-black">{selectedColor}</strong></span>
              </div>
              <div className="flex gap-2">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-bold transition-all ${
                        isSelected
                          ? 'border-black bg-black text-white shadow-xs'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 mb-2">
                <span>المقاس: <strong className="text-black">{selectedSize}</strong></span>
                <button
                  onClick={onOpenSizeGuide}
                  className="text-neutral-500 hover:text-black flex items-center gap-1 underline"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>دليل المقاسات</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2.5 text-center text-sm font-brand font-bold transition-all ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white border border-neutral-200 text-neutral-800 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-neutral-700">الكمية:</span>
              <div className="flex items-center border border-neutral-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-sm font-bold text-center min-w-[36px]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 mb-6">
              <button
                id="add-to-cart-modal-btn"
                onClick={handleAdd}
                className={`w-full py-4 text-center font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black text-white hover:bg-neutral-800 shadow-md active:scale-98'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تمت الإضافة إلى السلة بنجاح!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>أضف إلى حقيبة التسوق ({product.price * quantity} ج.م)</span>
                  </>
                )}
              </button>
            </div>

            {/* Description and Fabric Specs */}
            <div className="border-t border-neutral-100 pt-4 space-y-3 text-xs text-neutral-600">
              <div>
                <strong className="text-black block mb-1">وصف المنتج:</strong>
                <p className="leading-relaxed">{product.description}</p>
              </div>
              <div className="bg-neutral-50 p-3 border border-neutral-100 rounded-none space-y-1.5">
                <div className="flex items-center gap-2 text-neutral-800 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
                  <span>مواصفات الخامة: {product.fabricSpecs}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Truck className="w-3.5 h-3.5 text-neutral-600" />
                  <span>التوصيل خلال 1 - 3 أيام عمل مع إمكانية المعاينة قبل الدفع</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
