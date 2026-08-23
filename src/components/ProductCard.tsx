import React from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div className="group flex flex-col bg-white border border-neutral-200/80 hover:border-neutral-900 transition-all duration-300 relative shadow-2xs hover:shadow-md">
      
      {/* 1:1 Square Product Image Stage */}
      <div
        className="relative aspect-square w-full bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        
        {/* Main Image - Large and Clear */}
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Secondary Image hover if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} - view 2`}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNew && (
            <span className="bg-black text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow-xs">
              جديد
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-neutral-900 text-amber-300 text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 shadow-xs">
              الأكثر طلباً ⭐
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-rose-600 text-white text-[9px] sm:text-[11px] font-bold px-1.5 py-0.5 shadow-xs">
              خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 left-2 sm:top-2.5 sm:left-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/85 backdrop-blur-xs text-neutral-700 hover:bg-white hover:text-black shadow-xs'
          }`}
          aria-label="إضافة للمفضلة"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Desktop Quick View Button Hover Bar */}
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 hidden md:group-hover:flex items-center justify-center gap-2 transition-all duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-white/95 backdrop-blur-md text-black font-bold text-xs py-2 px-3 hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>معاينة وتحديد المقاس</span>
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 text-right justify-between">
        
        <div>
          {/* Colors dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              {product.colors.slice(0, 4).map((col, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-neutral-300 shrink-0"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-neutral-400 font-brand">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 hover:text-neutral-600 cursor-pointer transition-colors leading-tight mb-1"
          >
            {product.name}
          </h3>

          {/* Fit / Subtitle */}
          {product.fitType && (
            <div className="text-[10px] sm:text-xs text-neutral-500 font-brand truncate mb-1">
              {product.fitType}
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 mb-2">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-bold text-neutral-800">{product.rating || 4.9}</span>
            {product.reviewsCount ? (
              <span className="text-neutral-400">({product.reviewsCount})</span>
            ) : null}
          </div>
        </div>

        {/* Price & Quick Action */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-1.5 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="font-brand font-black text-xs sm:text-base text-black">
                {product.price} <span className="font-arabic text-[10px] sm:text-xs font-bold">ج.م</span>
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onQuickView(product)}
            className="p-1.5 sm:p-2 text-black bg-neutral-100 hover:bg-black hover:text-white transition-colors cursor-pointer shrink-0"
            title="اختيار المقاس والإضافة للسلة"
            aria-label="اختيار المقاس والإضافة للسلة"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
