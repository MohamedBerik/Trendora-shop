import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { apiValue } from "../constants/AllData";

// إنشاء السياق
const ProductsContext = createContext();

// مكون Provider
export const ProductsProvider = ({ children }) => {
  const data = useContext(apiValue);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        console.log('🔄 جاري تحميل المنتجات...');
        
        if (!data || !Array.isArray(data)) {
          console.warn('⚠️ لا توجد بيانات منتجات أو البيانات غير صالحة');
          setProducts([]);
          setIsLoading(false);
          return;
        }

        // تحويل البيانات من apiValue إلى تنسيق متوافق مع جميع الصفحات
        const formattedProducts = data.map((item, index) => {
          // التأكد من وجود ID فريد
          const productId = item.id || `prod-${index}-${Date.now()}`;
          
          // الحصول على الصور المتاحة
          const productImages = Array.isArray(item.images) ? item.images : [];
          const productThumbnail = item.thumbnail || productImages[0] || '/assets/img/placeholder.jpg';
          
          return {
            // المعرفات
            id: productId,
            sku: item.sku || productId,
            
            // المعلومات الأساسية (متوافقة مع جميع الصفحات)
            name: item.title || item.name || 'منتج بدون اسم',
            title: item.title || item.name || 'منتج بدون اسم',
            description: item.description || 'لا يوجد وصف للمنتج',
            
            // الأسعار والتخفيضات
            price: Number(item.price) || 0,
            originalPrice: Number(item.originalPrice) || Number(item.price) || 0,
            discountPercentage: Number(item.discountPercentage) || 0,
            discount: Number(item.discount) || 0,
            
            // التقييم والمخزون
            rating: Number(item.rating) || 0,
            stock: Number(item.stock) || 0,
            inStock: (Number(item.stock) || 0) > 0,
            
            // التصنيفات
            category: item.category || 'غير مصنف',
            brand: item.brand || 'علامة تجارية غير معروفة',
            tags: Array.isArray(item.tags) ? item.tags : [],
            
            // الصور (متوافقة مع جميع الصفحات)
            image: productThumbnail, // للحصول على توافق مع OrdersContext
            images: productImages,
            thumbnail: productThumbnail,
            
            // معلومات إضافية
            isFeatured: Boolean(item.featured) || false,
            isNew: Boolean(item.isNew) || false,
            createdAt: item.createdAt || new Date().toISOString(),
            updatedAt: item.updatedAt || new Date().toISOString(),
            
            // معلومات الشحن
            weight: item.weight || 0,
            dimensions: item.dimensions || {},
            
            // ضمانات وإضافات
            warranty: item.warranty || '',
            features: Array.isArray(item.features) ? item.features : [],
            
            // للإحصائيات
            salesCount: Number(item.salesCount) || 0,
            viewCount: Number(item.viewCount) || 0
          };
        });

        console.log('✅ تم تحميل المنتجات:', formattedProducts.length);
        setProducts(formattedProducts);

        // استخراج الفئات والعلامات التجارية الفريدة
        const uniqueCategories = [...new Set(formattedProducts.map(p => p.category).filter(Boolean))];
        const uniqueBrands = [...new Set(formattedProducts.map(p => p.brand).filter(Boolean))];
        
        setCategories(uniqueCategories);
        setBrands(uniqueBrands);
        setIsLoading(false);

      } catch (err) {
        console.error('❌ خطأ في تحميل المنتجات:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeProducts();
  }, [data]);

  // دالة للبحث عن منتج بواسطة ID (محسنة للتوافق)
  const getProductById = (productId) => {
    if (!productId) return null;
    
    return products.find(product => {
      const searchId = productId.toString().toLowerCase();
      return (
        product.id.toString().toLowerCase() === searchId ||
        product.sku.toString().toLowerCase() === searchId ||
        (product.name && product.name.toString().toLowerCase().includes(searchId))
      );
    });
  };

  // دالة للحصول على المنتجات حسب الفئة
  const getProductsByCategory = (category) => {
    if (!category || category === "all" || category === "الكل") return products;
    return products.filter(product => 
      product.category?.toLowerCase() === category.toLowerCase()
    );
  };

  // دالة للبحث في المنتجات (محسنة)
  const searchProducts = (searchTerm, filters = {}) => {
    if (!searchTerm && !filters.category && !filters.brand && !filters.minPrice && !filters.maxPrice) {
      return products;
    }
    
    let filtered = products;

    // البحث النصي
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(term) ||
        product.title?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.brand?.toLowerCase().includes(term) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    // التصفية بالفئة
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // التصفية بالعلامة التجارية
    if (filters.brand && filters.brand !== 'all') {
      filtered = filtered.filter(product => 
        product.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // التصفية بالسعر
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= Number(filters.maxPrice));
    }

    // التصفية بالمخزون
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    return filtered;
  };

  // دالة للحصول على المنتجات المميزة
  const getFeaturedProducts = () => {
    return products.filter(product => product.isFeatured);
  };

  // دالة للحصول على المنتجات الجديدة
  const getNewProducts = () => {
    return products
      .filter(product => product.isNew)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // دالة للحصول على المنتجات الأكثر مبيعاً
  const getBestSellingProducts = () => {
    return products
      .filter(product => product.salesCount > 0)
      .sort((a, b) => b.salesCount - a.salesCount);
  };

  // دالة للحصول على المنتجات ذات التخفيضات
  const getDiscountedProducts = () => {
    return products
      .filter(product => product.discountPercentage > 0)
      .sort((a, b) => b.discountPercentage - a.discountPercentage);
  };

  // دالة للحصول على منتجات ذات صلة
  const getRelatedProducts = (currentProduct, limit = 4) => {
    if (!currentProduct) return [];
    
    return products
      .filter(product => 
        product.id !== currentProduct.id && 
        (product.category === currentProduct.category || 
         product.brand === currentProduct.brand)
      )
      .slice(0, limit);
  };

  // إحصائيات المنتجات
  const productsStats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter(p => p.inStock).length;
    const outOfStock = total - inStock;
    const featured = products.filter(p => p.isFeatured).length;
    const withDiscount = products.filter(p => p.discountPercentage > 0).length;
    
    const averagePrice = total > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / total 
      : 0;
    
    const averageRating = total > 0
      ? products.reduce((sum, p) => sum + p.rating, 0) / total
      : 0;

    return {
      total,
      inStock,
      outOfStock,
      featured,
      withDiscount,
      averagePrice: Number(averagePrice.toFixed(2)),
      averageRating: Number(averageRating.toFixed(1)),
      categoriesCount: categories.length,
      brandsCount: brands.length
    };
  }, [products, categories, brands]);

  const value = {
    // البيانات الأساسية
    products,
    categories,
    brands,
    isLoading,
    error,
    
    // الإحصائيات
    stats: productsStats,
    totalProducts: products.length,
    
    // الدوال الأساسية
    getProductById,
    getProductsByCategory,
    searchProducts,
    
    // الدوال المتقدمة
    getFeaturedProducts,
    getNewProducts,
    getBestSellingProducts,
    getDiscountedProducts,
    getRelatedProducts,
    
    // دوال التحقق
    hasProducts: products.length > 0,
    hasCategories: categories.length > 0,
    hasBrands: brands.length > 0,
    
    // دوال مساعدة سريعة
    getProductName: (productId) => {
      const product = getProductById(productId);
      return product?.name || 'منتج غير معروف';
    },
    
    getProductImage: (productId) => {
      const product = getProductById(productId);
      return product?.image || '/assets/img/placeholder.jpg';
    },
    
    getProductPrice: (productId) => {
      const product = getProductById(productId);
      return product?.price || 0;
    },
    
    // دالة للتحديث (للاستخدام المستقبلي)
    updateProduct: (productId, updates) => {
      setProducts(prev => prev.map(product =>
        product.id === productId ? { ...product, ...updates } : product
      ));
    },
    
    // دالة التحديث من مصدر خارجي (للاستخدام المستقبلي)
    refreshProducts: (newProducts) => {
      if (Array.isArray(newProducts)) {
        setProducts(newProducts);
      }
    }
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// Hook لاستخدام السياق
export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};

// Hook مساعد للاستخدام السريع
export const useProduct = (productId) => {
  const { getProductById } = useProducts();
  return getProductById(productId);
};

export default ProductsContext;