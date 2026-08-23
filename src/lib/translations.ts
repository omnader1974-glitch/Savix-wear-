// Utility to provide pure English representations for customer-facing storefront

export function getEnglishCategoryName(name: string, slug?: string): string {
  if (!name) return 'Collection';
  
  // Specific slug lookups
  if (slug) {
    switch (slug.toLowerCase()) {
      case 'all': return 'All Products';
      case 'new': return 'New Arrivals ✨';
      case 'sale': return 'Sale & Offers 🔥';
      case 'tshirts':
      case 't-shirts':
      case 'tees':
        return 'T-Shirts';
      case 'hoodies':
      case 'sweatshirts':
        return 'Hoodies & Sweatshirts';
      case 'pants':
      case 'sweatpants':
      case 'cargo':
        return 'Pants & Cargo';
      case 'shorts': return 'Shorts';
      case 'jackets': return 'Jackets & Outerwear';
      case 'accessories': return 'Accessories';
    }
  }

  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();

  // Common Arabic to English category mappings
  if (lower.includes('تيشيرت') || lower.includes('تي شيرت') || lower.includes('تشرت') || lower.includes('tshirt') || lower.includes('tee')) {
    if (lower.includes('صيف') || lower.includes('summer')) return 'Summer T-Shirts';
    if (lower.includes('اوفر') || lower.includes('oversize')) return 'Oversized T-Shirts';
    return 'T-Shirts';
  }
  if (lower.includes('هودي') || lower.includes('سويت شيرت') || lower.includes('سوت شيرت') || lower.includes('hoodie')) {
    return 'Hoodies & Sweatshirts';
  }
  if (lower.includes('بنطال') || lower.includes('بنطلون') || lower.includes('بناطيل') || lower.includes('كارغو') || lower.includes('سويت بانتس') || lower.includes('pants')) {
    return 'Pants & Cargo';
  }
  if (lower.includes('شورت') || lower.includes('shorts')) {
    return 'Shorts';
  }
  if (lower.includes('جاكيت') || lower.includes('جاكت') || lower.includes('سترة') || lower.includes('jacket')) {
    return 'Jackets & Outerwear';
  }
  if (lower.includes('اكسسوار') || lower.includes('إكسسوار') || lower.includes('accessories')) {
    return 'Accessories';
  }
  if (lower.includes('طقم') || lower.includes('اطقم') || lower.includes('sets')) {
    return 'Streetwear Sets';
  }

  // If already in English or has latin characters
  if (!/[\u0600-\u06FF]/.test(trimmed)) {
    return trimmed;
  }

  return 'Streetwear Collection';
}

export function getEnglishGovernorateName(name: string, id?: string): string {
  if (id) {
    switch (id.toLowerCase()) {
      case 'cairo': return 'Cairo';
      case 'giza': return 'Giza';
      case 'alex':
      case 'alexandria': return 'Alexandria';
      case 'qalyubia': return 'Qalyubia';
      case 'sharqia': return 'Sharqia';
      case 'daqahlia': return 'Dakahlia (Mansoura)';
      case 'gharbia': return 'Gharbia (Tanta)';
      case 'menofia': return 'Monufia';
      case 'beheira': return 'Beheira (Damanhour)';
      case 'kafr_el_sheikh': return 'Kafr El Sheikh';
      case 'damietta': return 'Damietta';
      case 'port_said': return 'Port Said';
      case 'ismailia': return 'Ismailia';
      case 'suez': return 'Suez';
      case 'fayoum': return 'Fayoum';
      case 'beni_suef': return 'Beni Suef';
      case 'minya': return 'Minya';
      case 'assiut': return 'Asyut';
      case 'sohag': return 'Sohag';
      case 'qena': return 'Qena';
      case 'luxor': return 'Luxor';
      case 'aswan': return 'Aswan';
      case 'red_sea': return 'Red Sea (Hurghada)';
      case 'matrouh': return 'Matrouh & North Coast';
    }
  }

  const text = name.trim();
  if (text.includes('القاهرة')) return 'Cairo';
  if (text.includes('الجيزة')) return 'Giza';
  if (text.includes('الإسكندرية') || text.includes('الاسكندرية')) return 'Alexandria';
  if (text.includes('القليوبية')) return 'Qalyubia';
  if (text.includes('الشرقية')) return 'Sharqia';
  if (text.includes('الدقهلية') || text.includes('المنصورة')) return 'Dakahlia (Mansoura)';
  if (text.includes('الغربية') || text.includes('طنطا')) return 'Gharbia (Tanta)';
  if (text.includes('المنوفية')) return 'Monufia';
  if (text.includes('البحيرة') || text.includes('دمنهور')) return 'Beheira (Damanhour)';
  if (text.includes('كفر الشيخ')) return 'Kafr El Sheikh';
  if (text.includes('دمياط')) return 'Damietta';
  if (text.includes('بورسعيد')) return 'Port Said';
  if (text.includes('الإسماعيلية') || text.includes('الاسماعيلية')) return 'Ismailia';
  if (text.includes('السويس')) return 'Suez';
  if (text.includes('الفيوم')) return 'Fayoum';
  if (text.includes('بني سويف')) return 'Beni Suef';
  if (text.includes('المنيا')) return 'Minya';
  if (text.includes('أسيوط') || text.includes('اسيوط')) return 'Asyut';
  if (text.includes('سوهاج')) return 'Sohag';
  if (text.includes('قنا')) return 'Qena';
  if (text.includes('الأقصر') || text.includes('الاقصر')) return 'Luxor';
  if (text.includes('أسوان') || text.includes('اسوان')) return 'Aswan';
  if (text.includes('البحر الأحمر') || text.includes('الغردقة')) return 'Red Sea (Hurghada)';
  if (text.includes('مطروح') || text.includes('الساحل')) return 'Matrouh & North Coast';

  // If already in English or latin
  if (!/[\u0600-\u06FF]/.test(text)) {
    return text;
  }

  return 'Egypt Region';
}

export function getEnglishDeliveryDays(deliveryDays?: string): string {
  if (!deliveryDays) return '1 - 3 Business Days';
  if (deliveryDays.includes('1 - 2') || deliveryDays.includes('1-2')) return '1 - 2 Business Days';
  if (deliveryDays.includes('2 - 3') || deliveryDays.includes('2-3')) return '2 - 3 Business Days';
  if (deliveryDays.includes('2 - 4') || deliveryDays.includes('2-4')) return '2 - 4 Business Days';
  if (deliveryDays.includes('3 - 4') || deliveryDays.includes('3-4')) return '3 - 4 Business Days';
  if (deliveryDays.includes('3 - 5') || deliveryDays.includes('3-5')) return '3 - 5 Business Days';
  if (deliveryDays.includes('3 - 6') || deliveryDays.includes('3-6')) return '3 - 6 Business Days';
  if (!/[\u0600-\u06FF]/.test(deliveryDays)) return deliveryDays;
  return '2 - 3 Business Days';
}

export function getEnglishOrderStatus(status?: string): string {
  if (!status) return 'Order Placed';
  switch (status) {
    case 'تم الاستلام': return 'Order Placed';
    case 'قيد التجهيز':
    case 'جاري التجهيز': return 'Processing';
    case 'في الطريق':
    case 'تم الشحن': return 'Out for Delivery';
    case 'تم التسليم': return 'Delivered';
    case 'ملغي':
    case 'تم الإلغاء': return 'Cancelled';
    default:
      if (!/[\u0600-\u06FF]/.test(status)) return status;
      return 'Order Placed';
  }
}

export function getEnglishColorName(name: string): string {
  if (!name) return 'Standard';
  const lower = name.trim().toLowerCase();
  if (lower.includes('أسود') || lower.includes('اسود') || lower === 'black') return 'Black';
  if (lower.includes('أبيض') || lower.includes('ابيض') || lower === 'white') return 'White';
  if (lower.includes('بيج') || lower === 'beige') return 'Beige';
  if (lower.includes('كحلي') || lower.includes('أزرق') || lower === 'navy') return 'Navy Blue';
  if (lower.includes('زيتي') || lower.includes('أخضر') || lower === 'olive') return 'Olive Green';
  if (lower.includes('رمادي') || lower.includes('رصاصي') || lower === 'grey' || lower === 'gray') return 'Heather Grey';
  if (lower.includes('بني') || lower === 'brown') return 'Mocha Brown';
  if (lower.includes('نبيتي') || lower === 'burgundy') return 'Burgundy';
  if (lower.includes('أوف وايت') || lower === 'off-white') return 'Off-White';
  if (lower.includes('سماوي') || lower === 'sky-blue') return 'Sky Blue';
  if (lower.includes('أحمر') || lower === 'red') return 'Crimson Red';
  
  if (!/[\u0600-\u06FF]/.test(name)) return name;
  return 'Classic';
}
