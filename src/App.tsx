import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, CartItem, Coupon, OrderData, CategoryItem, Governorate, StoreSettings } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { ContactModal } from './components/ContactModal';
import { AccountModal } from './components/AccountModal';
import { DashboardModal } from './components/DashboardModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { PlusCircle, PackageOpen } from 'lucide-react';
import {
  subscribeProducts,
  subscribeCategories,
  subscribeOrders,
  subscribeCoupons,
  subscribeGovernorates,
  subscribeSettings,
  seedInitialDatabaseIfEmpty,
  saveProduct,
  deleteProduct,
  saveCategory,
  deleteCategory,
  updateOrderStatus,
  saveCoupon,
  deleteCoupon,
  saveGovernorate,
  saveStoreSettings,
  DEFAULT_STORE_SETTINGS,
} from './lib/db';

export default function App() {
  // Real-time Firestore States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [settings, setSettings] = useState<StoreSettings | undefined>(undefined);

  // Category & Sorting
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Interactive Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const handleOpenAdminSettings = () => {
    if (isAdminAuthenticated) {
      setIsDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminLoginOpen(false);
    setIsDashboardOpen(true);
    addToast('success', 'مرحباً بك! تم تسجيل الدخول إلى لوحة التحكم بنجاح');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsDashboardOpen(false);
    addToast('info', 'تم تسجيل الخروج من لوحة التحكم');
  };

  // Cart & Wishlist with localStorage hydration
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('savix_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('savix_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Seed & Initialize Firestore subscriptions
  useEffect(() => {
    // Seed initial structure if empty
    seedInitialDatabaseIfEmpty();

    const unsubProducts = subscribeProducts((items) => {
      setProducts(items);
    });

    const unsubCategories = subscribeCategories((cats) => {
      setCategories(cats);
    });

    const unsubOrders = subscribeOrders((ords) => {
      setOrders(ords);
    });

    const unsubCoupons = subscribeCoupons((cpns) => {
      setCoupons(cpns);
    });

    const unsubGovs = subscribeGovernorates((govs) => {
      setGovernorates(govs);
    });

    const unsubSettings = subscribeSettings((st) => {
      setSettings(st);
    });

    return () => {
      unsubProducts();
      unsubCategories();
      unsubOrders();
      unsubCoupons();
      unsubGovs();
      unsubSettings();
    };
  }, []);

  // Sync cart and wishlist with remaining active products
  useEffect(() => {
    if (selectedProduct && !products.some((p) => p.id === selectedProduct.id)) {
      setSelectedProduct(null);
    }
  }, [products, selectedProduct]);

  // Save Cart & Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('savix_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('savix_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (activeCategory === 'new') {
      list = list.filter((p) => p.isNew);
    } else if (activeCategory === 'sale') {
      list = list.filter((p) => p.isSale || (p.originalPrice && p.originalPrice > p.price));
    } else if (activeCategory !== 'all') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'featured') {
      list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return list;
  }, [products, activeCategory, sortBy]);

  // Product CRUD operations backed by Firestore
  const handleAddProduct = async (newProduct: Product) => {
    try {
      await saveProduct(newProduct);
      addToast('success', `تم نشر المنتج "${newProduct.name}" بنجاح في المتجر`);
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حفظ المنتج');
    }
  };

  const handleUpdateProduct = async (updated: Product) => {
    try {
      await saveProduct(updated);
      addToast('success', `تم تحديث بيانات "${updated.name}" بنجاح`);
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء تحديث المنتج');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
      addToast('info', 'تم حذف المنتج من المتجر بنجاح');
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حذف المنتج');
    }
  };

  // Category CRUD operations backed by Firestore
  const handleAddCategory = async (newCat: CategoryItem) => {
    try {
      await saveCategory(newCat);
      addToast('success', `تمت إضافة قسم "${newCat.name}" بنجاح`);
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء إضافة القسم');
    }
  };

  const handleUpdateCategory = async (cat: CategoryItem) => {
    try {
      await saveCategory(cat);
      addToast('success', `تم تعديل قسم "${cat.name}" بنجاح`);
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء تعديل القسم');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      await deleteCategory(catId);
      addToast('info', 'تم حذف القسم بنجاح');
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حذف القسم');
    }
  };

  // Order status update backed by Firestore
  const handleUpdateOrderStatus = async (orderId: string, status: OrderData['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      addToast('success', `تم تحديث حالة الطلب إلى "${status}"`);
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  // Coupon CRUD operations backed by Firestore
  const handleAddCoupon = async (coupon: Coupon) => {
    try {
      await saveCoupon(coupon);
      addToast('success', `تم حفظ كود الخصم "${coupon.code}" بنجاح`);
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حفظ كود الخصم');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupon(couponId);
      addToast('info', 'تم حذف كود الخصم بنجاح');
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حذف الكود');
    }
  };

  // Governorate update backed by Firestore
  const handleUpdateGovernorates = async (govs: Governorate[]) => {
    try {
      for (const g of govs) {
        await saveGovernorate(g);
      }
      addToast('success', 'تم حفظ أسعار ومناطق الشحن بنجاح');
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حفظ مناطق الشحن');
    }
  };

  // Settings update backed by Firestore
  const handleUpdateSettings = async (st: StoreSettings) => {
    try {
      await saveStoreSettings(st);
      addToast('success', 'تم حفظ جميع إعدادات ومحتوى المتجر بنجاح');
    } catch (e) {
      console.error(e);
      addToast('error', 'حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: string, qty: number = 1) => {
    const itemKey = `${product.id}-${color}-${size}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemKey);
      if (existing) {
        return prev.map((item) =>
          item.id === itemKey ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [
        ...prev,
        {
          id: itemKey,
          product,
          selectedColor: color,
          selectedSize: size,
          quantity: qty,
        },
      ];
    });

    addToast('success', `تمت إضافة "${product.name}" (${size}) إلى حقيبة التسوق`);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    addToast('info', 'تم حذف المنتج من حقيبة التسوق');
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((p) => p.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('info', `تمت إزالة "${product.name}" من قائمة الرغبات`);
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('success', `تمت إضافة "${product.name}" إلى قائمة الرغبات`);
    }
  };

  const handleOrderCompleted = (order: OrderData) => {
    setCart([]);
    setAppliedCoupon(null);
    addToast('success', `تم استلام طلبك بنجاح برقم ${order.orderNumber}`);
  };

  const handleShopNow = (cat: Category = 'all') => {
    setActiveCategory(cat);
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Active category display title
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);
  const activeCategoryTitle =
    activeCategory === 'all'
      ? 'الأكثر مبيعاً والتشكيلة الكاملة'
      : activeCategory === 'new'
      ? 'أحدث القطع المضافة حديثاً ✨'
      : activeCategory === 'sale'
      ? 'عروض وخصومات التصفية الخاصة 🔥'
      : activeCategoryObj?.name || 'التشكيلة المختارة';

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-arabic">
      
      {/* Navigation Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        cartCount={totalCartCount}
        categories={categories}
        settings={settings}
      />

      {/* Hero Banner Section */}
      <HeroBanner onShopNow={handleShopNow} settings={settings} />

      {/* Filter / Category Bar */}
      <div id="products-section">
        <CategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          productsCount={filteredProducts.length}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          categories={categories}
        />
      </div>

      {/* Main Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1 font-brand">
            {settings?.storeName || 'SAVIX'} STREETWEAR
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            {activeCategoryTitle}
          </h2>
          <div className="w-12 h-0.5 bg-black mx-auto mt-3" />
        </div>

        {/* Product Grid / Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 border border-neutral-200 p-8 space-y-4 max-w-2xl mx-auto">
            <div className="w-14 h-14 bg-white border border-neutral-300 rounded-full flex items-center justify-center mx-auto text-neutral-400">
              <PackageOpen className="w-7 h-7 stroke-[1.25]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900">لا توجد منتجات مضافة حالياً</h3>
              <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                قسم المنتجات فارغ تماماً. يمكنك الآن إضافة منتجاتك الخاصة، تصنيفاتها، صورها، وأسعارها عبر لوحة التحكم بكل سهولة.
              </p>
            </div>
            <button
              onClick={handleOpenAdminSettings}
              className="inline-flex items-center gap-2 bg-black text-white px-7 py-3 text-xs font-bold hover:bg-neutral-800 transition-colors uppercase tracking-wider font-brand shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة منتج من لوحة التحكم</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 border border-neutral-200 p-8 space-y-4 max-w-xl mx-auto">
            <p className="text-base font-bold text-neutral-800">لا توجد منتجات مطابقة لهذا التصنيف حالياً</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className="bg-black text-white px-5 py-2 text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                عرض كل المنتجات ({products.length})
              </button>
              <button
                onClick={handleOpenAdminSettings}
                className="bg-white border border-neutral-300 text-neutral-800 px-5 py-2 text-xs font-bold hover:border-black transition-colors cursor-pointer"
              >
                إضافة منتج لهذا القسم
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setSelectedProduct(p)}
                onAddToCart={(p, size, col) => handleAddToCart(p, size, col, 1)}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer Section */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdminLogin={handleOpenAdminSettings}
        categories={categories}
        settings={settings}
      />

      {/* Modals and Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlist.some((w) => w.id === selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={(c) => {
          setAppliedCoupon(c);
          if (c) addToast('success', `تم تطبيق كود الخصم ${c.code}`);
        }}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        coupons={coupons}
        settings={settings}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={handleOrderCompleted}
        governorates={governorates}
        settings={settings}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onOpenProduct={(p) => setSelectedProduct(p)}
      />

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        savedOrders={orders}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        settings={settings}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        savedOrders={orders}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        settings={settings}
      />

      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      <DashboardModal
        isOpen={isDashboardOpen && isAdminAuthenticated}
        onClose={() => setIsDashboardOpen(false)}
        onLogout={handleAdminLogout}
        products={products}
        categories={categories}
        orders={orders}
        coupons={coupons}
        governorates={governorates}
        settings={settings || DEFAULT_STORE_SETTINGS}
        onShowToast={addToast}
      />

      {/* Global Toast Feedback */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

    </div>
  );
}
