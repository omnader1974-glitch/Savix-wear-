import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  getDoc,
  getDocFromServer,
  where,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import {
  Product,
  CategoryItem,
  OrderData,
  Coupon,
  Governorate,
  StoreSettings,
} from '../types';
import { GOVERNORATES, VALID_COUPONS, FREE_SHIPPING_THRESHOLD } from '../data/products';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn('Firestore Operation Info:', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Recursively remove all `undefined` properties from any object or array
 * so Firestore setDoc / updateDoc never throws Unsupported field value: undefined
 */
export function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item)) as unknown as T;
  }
  if (typeof data === 'object' && !(data instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeData(val);
      }
    }
    return cleaned as T;
  }
  return data;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'SAVIX',
  logoText: 'SAVIX',
  logoImage: '',
  announcementText: '🔥 شحن مجاني للطلبات أكثر من 1000 جنيه لجميع محافظات مصر + حق المعاينة قبل الاستلام',
  heroBadge: 'SAVIX SUMMER COLLECTION 2026',
  heroTitle: 'NEW COLLECTION',
  heroSubtitle: 'تشكيلة الصيف والستريت وير الجديدة متوفرة الآن بأعلى معايير جودة القطن المصري وتصميمات عصرية جريئة تناسب أسلوبك اليومي.',
  heroImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
  heroCtaText: 'تسوق التشكيلة الآن',
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  currency: 'ج.م',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  tiktokUrl: 'https://tiktok.com',
  whatsappNumber: '201000000000',
  phone: '01000000000',
  email: 'support@savixstore.com',
  address: 'القاهرة، مصر',
  workingHours: 'يومياً من 10:00 صباحاً حتى 10:00 مساءً',
  aboutText: 'علامة تجارية رائدة متخصصة في تقديم أحدث صيحات الملابس العصرية وأزياء الستريت وير بأعلى معايير جودة القطن المصري وتصميمات مينيمال أنيقة.',
  footerCopy: '© 2026 Savix Apparel Inc. جميع الحقوق محفوظة لمتجر سافيكس الرسمي.',
  refundPolicy: 'حق المعاينة الكامل عند الاستلام متاح لجميع الطلبات. يمكنك استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط الحفاظ على الحالة الأصلية للمنتج وتغليفه.',
  termsText: 'يتم شحن الطلبات خلال 1 إلى 3 أيام عمل حسب المحافظة. يتاح الدفع عند الاستلام (COD) أو عبر إنستاباي والمحافظ الإلكترونية.',
};

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-tshirts',
    slug: 'tshirts',
    name: 'تيشيرتات صيفية',
    nameEn: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    order: 1,
    isActive: true,
    description: 'تيشيرتات قطن مصري 100% بقصات أوفرسايز ورجلار عصرية',
  },
  {
    id: 'cat-hoodies',
    slug: 'hoodies',
    name: 'هوديز وسويت شيرت',
    nameEn: 'Hoodies & Sweatshirts',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    order: 2,
    isActive: true,
    description: 'هوديز وسويت شيرت ثقيلة مبطنة بأعلى كثافة للدفء والأناقة',
  },
  {
    id: 'cat-pants',
    slug: 'pants',
    name: 'بناطيل وكارغو',
    nameEn: 'Pants & Cargo',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    order: 3,
    isActive: true,
    description: 'بناطيل تاكتيكال وسويت بانتس مريحة للاستخدام اليومي',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-oversized-black-tee',
    name: 'تيشيرت أوفرسايز بيزيك أسود',
    nameEn: 'Oversized Minimalist Black Tee',
    category: 'tshirts',
    price: 450,
    originalPrice: 600,
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'تيشيرت بقصة أوفرسايز عصرية مريحة مصنوع من قطن مصري 100% عالي الجودة مع معالجة ضد الانكماش.',
    colors: [
      { name: 'أسود كربوني', hex: '#111111' },
      { name: 'أبيض ناصع', hex: '#FFFFFF' },
      { name: 'بيج رملي', hex: '#D2B48C' },
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    fitType: 'Oversized / Boxy Fit',
    fabricSpecs: '100% قطن مصري كومباكت 240 GSM',
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    rating: 4.9,
    reviewsCount: 28,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-heavy-streetwear-hoodie',
    name: 'هودي ستريت وير ثقيل بريميوم',
    nameEn: 'Heavyweight Streetwear Hoodie',
    category: 'hoodies',
    price: 890,
    originalPrice: 1100,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'هودي ثقيل مبطن خامة ميلتون قطنية ممتازة مع كابيشون مزدوج وجيب أمامي كانغارو بتطريز مينيمال دقيق.',
    colors: [
      { name: 'رمادي غامق', hex: '#2B2B2B' },
      { name: 'أسود', hex: '#111111' },
      { name: 'أخضر زيتي', hex: '#4A5D4E' },
    ],
    sizes: ['M', 'L', 'XL', '2XL'],
    fitType: 'Drop Shoulder Relaxed',
    fabricSpecs: 'قطن ميلتون مصري مبطن 420 GSM',
    isNew: true,
    isBestSeller: true,
    isSale: true,
    inStock: true,
    rating: 5.0,
    reviewsCount: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-tactical-cargo-pants',
    name: 'بنطلون كارغو تاكتيكال بجيوب متعددة',
    nameEn: 'Tactical Multi-Pocket Cargo Pants',
    category: 'pants',
    price: 750,
    originalPrice: 920,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'بنطلون كارغو عصري بجيوب جانبية وأشرطة قابلة للتعديل عند الكاحل، مريح جداً وعملي للارتداء اليومي.',
    colors: [
      { name: 'أسود مطفي', hex: '#1C1C1C' },
      { name: 'بيج كاكي', hex: '#A89F91' },
    ],
    sizes: ['30', '32', '34', '36', '38'],
    fitType: 'Tapered Cargo Fit',
    fabricSpecs: 'جابردين قطني متين مع نسبة ليكرا 2%',
    isNew: false,
    isBestSeller: true,
    isSale: false,
    inStock: true,
    rating: 4.8,
    reviewsCount: 19,
    createdAt: new Date().toISOString(),
  },
];

// Test connection
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is disconnected.');
    }
  }
}

// Initialize default data if firestore is brand new (only runs ONCE)
export async function seedInitialDatabaseIfEmpty() {
  try {
    const metaRef = doc(db, 'settings', 'system_metadata');
    const metaDoc = await getDoc(metaRef);
    if (metaDoc.exists() && metaDoc.data()?.isInitialized) {
      // Database has already been initialized previously. Do not re-seed deleted items!
      return;
    }

    // 1. Settings
    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'general'), sanitizeData(DEFAULT_STORE_SETTINGS));
    }

    // 2. Categories
    const catSnapshot = await getDocs(collection(db, 'categories'));
    if (catSnapshot.empty) {
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), sanitizeData(cat));
      }
    }

    // 3. Products
    const prodSnapshot = await getDocs(collection(db, 'products'));
    if (prodSnapshot.empty) {
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), sanitizeData(prod));
      }
    }

    // 4. Governorates
    const govSnapshot = await getDocs(collection(db, 'governorates'));
    if (govSnapshot.empty) {
      for (let i = 0; i < GOVERNORATES.length; i++) {
        const g = GOVERNORATES[i];
        await setDoc(doc(db, 'governorates', g.id), sanitizeData({
          ...g,
          isActive: true,
          order: i + 1,
        }));
      }
    }

    // 5. Coupons
    const couponSnapshot = await getDocs(collection(db, 'coupons'));
    if (couponSnapshot.empty) {
      for (const c of VALID_COUPONS) {
        const id = `coupon-${c.code.toLowerCase()}`;
        await setDoc(doc(db, 'coupons', id), sanitizeData({
          ...c,
          id,
          isActive: true,
          minSpend: 0,
          createdAt: new Date().toISOString(),
        }));
      }
    }

    // Mark system as permanently initialized
    await setDoc(metaRef, {
      isInitialized: true,
      initializedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seeding');
  }
}

// ================= REAL-TIME SUBSCRIBERS =================

export function subscribeProducts(callback: (products: Product[]) => void) {
  const q = collection(db, 'products');
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Product;
        items.push({ ...data, id: docSnap.id });
      });
      // Sort newest first
      items.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      callback([]);
    }
  );
}

export function subscribeCategories(callback: (categories: CategoryItem[]) => void) {
  const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: CategoryItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as CategoryItem;
        items.push({ ...data, id: docSnap.id });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
      callback([]);
    }
  );
}

export function subscribeOrders(callback: (orders: OrderData[]) => void) {
  const q = collection(db, 'orders');
  return onSnapshot(
    q,
    (snapshot) => {
      const items: OrderData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as OrderData;
        items.push({ ...data, id: docSnap.id });
      });
      // Sort latest orders first
      items.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date).getTime();
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date).getTime();
        return timeB - timeA;
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      callback([]);
    }
  );
}

export function subscribeCoupons(callback: (coupons: Coupon[]) => void) {
  const q = collection(db, 'coupons');
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Coupon[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Coupon;
        items.push({ ...data, id: docSnap.id });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coupons');
      callback([]);
    }
  );
}

export function subscribeGovernorates(callback: (governorates: Governorate[]) => void) {
  const q = query(collection(db, 'governorates'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const items: Governorate[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Governorate;
        items.push({ ...data, id: docSnap.id });
      });
      callback(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'governorates');
      callback([]);
    }
  );
}

export function subscribeSettings(callback: (settings: StoreSettings) => void) {
  const settingsDocRef = doc(db, 'settings', 'general');
  return onSnapshot(
    settingsDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ ...DEFAULT_STORE_SETTINGS, ...docSnap.data() } as StoreSettings);
      } else {
        callback(DEFAULT_STORE_SETTINGS);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/general');
      callback(DEFAULT_STORE_SETTINGS);
    }
  );
}

// ================= CRUD MUTATIONS =================

// Products
export async function saveProduct(product: Product): Promise<void> {
  const id = product.id || `prod-${Date.now()}`;
  const docRef = doc(db, 'products', id);
  const now = new Date().toISOString();
  const cleaned = sanitizeData({
    ...product,
    id,
    updatedAt: now,
    createdAt: product.createdAt || now,
  });
  await setDoc(docRef, cleaned);
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!productId) return;
  try {
    // 1. Delete document directly by ID
    await deleteDoc(doc(db, 'products', productId));
    
    // 2. Also search if any doc has an 'id' or 'name' field matching productId to ensure total cleanup
    const q = query(collection(db, 'products'), where('id', '==', productId));
    const snaps = await getDocs(q);
    for (const snap of snaps.docs) {
      if (snap.id !== productId) {
        await deleteDoc(snap.ref);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    throw err;
  }
}

// Categories
export async function saveCategory(category: CategoryItem): Promise<void> {
  const id = category.id || `cat-${category.slug || Date.now()}`;
  const docRef = doc(db, 'categories', id);
  const cleaned = sanitizeData({
    ...category,
    id,
  });
  await setDoc(docRef, cleaned);
}

export async function deleteCategory(categoryId: string): Promise<void> {
  if (!categoryId) return;
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
    const q = query(collection(db, 'categories'), where('id', '==', categoryId));
    const snaps = await getDocs(q);
    for (const snap of snaps.docs) {
      if (snap.id !== categoryId) {
        await deleteDoc(snap.ref);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
    throw err;
  }
}

export async function reorderCategories(categories: CategoryItem[]): Promise<void> {
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const cleaned = sanitizeData({ ...cat, order: i + 1 });
    await setDoc(doc(db, 'categories', cat.id), cleaned, { merge: true });
  }
}

// Orders
export async function saveOrder(order: OrderData): Promise<string> {
  const id = order.id || `order-${Date.now()}`;
  const docRef = doc(db, 'orders', id);
  const now = new Date().toISOString();
  const cleaned = sanitizeData({
    ...order,
    id,
    createdAt: now,
  });
  await setDoc(docRef, cleaned);
  return id;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderData['status']
): Promise<void> {
  const docRef = doc(db, 'orders', orderId);
  await setDoc(docRef, { status }, { merge: true });
}

export async function deleteOrder(orderId: string): Promise<void> {
  if (!orderId) return;
  try {
    await deleteDoc(doc(db, 'orders', orderId));
    const q = query(collection(db, 'orders'), where('id', '==', orderId));
    const snaps = await getDocs(q);
    for (const snap of snaps.docs) {
      if (snap.id !== orderId) {
        await deleteDoc(snap.ref);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`);
    throw err;
  }
}

// Coupons
export async function saveCoupon(coupon: Coupon): Promise<void> {
  const id = coupon.id || `coupon-${coupon.code.toLowerCase().trim()}`;
  const docRef = doc(db, 'coupons', id);
  const cleaned = sanitizeData({
    ...coupon,
    id,
    code: coupon.code.toUpperCase().trim(),
    createdAt: coupon.createdAt || new Date().toISOString(),
  });
  await setDoc(docRef, cleaned);
}

export async function deleteCoupon(couponId: string): Promise<void> {
  if (!couponId) return;
  try {
    await deleteDoc(doc(db, 'coupons', couponId));
    const q = query(collection(db, 'coupons'), where('id', '==', couponId));
    const snaps = await getDocs(q);
    for (const snap of snaps.docs) {
      if (snap.id !== couponId) {
        await deleteDoc(snap.ref);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `coupons/${couponId}`);
    throw err;
  }
}

// Governorates
export async function saveGovernorate(gov: Governorate): Promise<void> {
  const id = gov.id || `gov-${Date.now()}`;
  const docRef = doc(db, 'governorates', id);
  const cleaned = sanitizeData({
    ...gov,
    id,
  });
  await setDoc(docRef, cleaned);
}

export async function deleteGovernorate(govId: string): Promise<void> {
  if (!govId) return;
  try {
    await deleteDoc(doc(db, 'governorates', govId));
    const q = query(collection(db, 'governorates'), where('id', '==', govId));
    const snaps = await getDocs(q);
    for (const snap of snaps.docs) {
      if (snap.id !== govId) {
        await deleteDoc(snap.ref);
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `governorates/${govId}`);
    throw err;
  }
}

// Store Settings
export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const docRef = doc(db, 'settings', 'general');
  const cleaned = sanitizeData(settings);
  await setDoc(docRef, cleaned, { merge: true });
}
