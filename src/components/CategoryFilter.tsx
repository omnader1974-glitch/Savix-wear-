import React from 'react';
import { Category, CategoryItem } from '../types';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  productsCount: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onSelectSort: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
  categories?: CategoryItem[];
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  productsCount,
  sortBy,
  onSelectSort,
  categories = [],
}) => {
  const activeCustomCategories = categories.filter((c) => c.isActive !== false);

  const filterTabs: { id: Category; label: string }[] = [
    { id: 'all', label: 'جميع المنتجات' },
    { id: 'new', label: 'وصل حديثاً ✨' },
    ...activeCustomCategories.map((c) => ({ id: c.slug, label: c.name })),
    { id: 'sale', label: 'التخفيضات 🔥' },
  ];

  return (
    <div className="border-b border-neutral-200 bg-white sticky top-16 sm:top-20 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-4">
          
          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {filterTabs.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Sort & Count Controls */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4 text-xs sm:text-sm font-medium text-neutral-600">
            <span className="text-neutral-500 whitespace-nowrap">
              عرض ({productsCount}) منتج
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-500" />
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSelectSort(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs sm:text-sm py-1.5 px-3 focus:outline-none focus:border-black font-arabic cursor-pointer"
              >
                <option value="featured">الأكثر مبيعاً والمميز</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
                <option value="rating">التقييم: الأعلى تقييماً</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
