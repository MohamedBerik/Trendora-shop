import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Container, Row, Col, Button, Form, InputGroup, 
  Card, Badge, Alert, Spinner, Dropdown
} from "react-bootstrap";
import { 
  FaSearch, FaCalendar, FaUser, FaComments, FaArrowRight, 
  FaTags, FaHeart, FaEye, FaPenFancy, FaNewspaper, 
  FaUsers, FaHashtag, FaFire, FaEnvelope, FaCheck, FaRocket,
  FaSort, FaBookmark, FaRegBookmark, FaStar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// بيانات المكونات
const categories = [
  { id: 1, name: "الموضة", slug: "fashion", count: 12, color: "#e91e63" },
  { id: 2, name: "التكنولوجيا", slug: "technology", count: 8, color: "#2196f3" },
  { id: 3, name: "نصائح التسوق", slug: "shopping-tips", count: 15, color: "#4caf50" },
  { id: 4, name: "عروض خاصة", slug: "deals", count: 6, color: "#ff9800" },
  { id: 5, name: "شؤون المنزل", slug: "lifestyle", count: 9, color: "#9c27b0" },
];

const popularPosts = [
  {
    id: 1,
    title: "أحدث صيحات الموضة لهذا الموسم",
    image: "/images/blog/popular-1.jpg",
    date: "2024-01-15",
    views: 1250,
    slug: "latest-fashion-trends-spring-2024",
    readTime: "5 دقائق"
  },
  {
    id: 2,
    title: "كيف تختار الهاتف المناسب لك",
    image: "/images/blog/popular-2.jpg",
    date: "2024-01-12",
    views: 980,
    slug: "how-to-choose-right-smartphone",
    readTime: "8 دقائق"
  },
  {
    id: 3,
    title: "نصائح للتسوق الذكي وتوفير المال",
    image: "/images/blog/popular-3.jpg",
    date: "2024-01-10",
    views: 1560,
    slug: "smart-shopping-money-saving-secrets",
    readTime: "6 دقائق"
  },
];

const blogPosts = [
  {
    id: 1,
    title: "أحدث صيحات الموضة لربيع 2024",
    excerpt: "اكتشف أحدث صيحات الأزياء والموضة لهذا الربيع مع نصائح عملية لدمجها في خزانة ملابسك.",
    content: "المحتوى الكامل للمقال...",
    image: "/images/blog/fashion-spring-2024.jpg",
    category: "الموضة",
    tags: ["موضة", "أزياء", "ربيع", "تسوق"],
    author: "سارة أحمد",
    date: "15 يناير 2024",
    readTime: "5 دقائق",
    views: 1250,
    likes: 89,
    comments: 23,
    slug: "latest-fashion-trends-spring-2024",
    featured: true,
    trending: true
  },
  {
    id: 2,
    title: "كيف تختار الهاتف الذكي المناسب",
    excerpt: "دليل شامل لاختيار الهاتف الذكي الذي يناسب احتياجاتك وميزانيتك مع مقارنة بين أفضل الماركات.",
    content: "المحتوى الكامل للمقال...",
    image: "/images/blog/choose-smartphone.jpg",
    category: "التكنولوجيا",
    tags: ["تكنولوجيا", "هواتف", "نصائح", "شراء"],
    author: "محمد الخالد",
    date: "12 يناير 2024",
    readTime: "8 دقائق",
    views: 980,
    likes: 67,
    comments: 15,
    slug: "how-to-choose-right-smartphone",
    featured: true,
    trending: false
  },
  {
    id: 3,
    title: "أسرار التسوق الذكي وتوفير المال",
    excerpt: "تعلم فن التسوق الذكي وكيفية توفير المال مع الحصول على أفضل المنتجات والعروض.",
    content: "المحتوى الكامل للمقال...",
    image: "/images/blog/smart-shopping.jpg",
    category: "نصائح التسوق",
    tags: ["تسوق", "توفير", "نصائح", "عروض"],
    author: "فاطمة العلي",
    date: "10 يناير 2024",
    readTime: "6 دقائق",
    views: 1560,
    likes: 124,
    comments: 34,
    slug: "smart-shopping-money-saving-secrets",
    featured: false,
    trending: true
  },
  {
    id: 4,
    title: "أفضل العروض والتخفيضات هذا الأسبوع",
    excerpt: "لا تفوت هذه العروض الحصرية والتخفيضات المذهلة على أفضل المنتجات في متجرنا.",
    content: "المحتوى الكامل للمقال...",
    image: "/images/blog/weekly-deals.jpg",
    category: "عروض خاصة",
    tags: ["عروض", "تخفيضات", "خصومات", "موسمية"],
    author: "أحمد السعد",
    date: "8 يناير 2024",
    readTime: "4 دقائق",
    views: 2100,
    likes: 156,
    comments: 42,
    slug: "best-deals-discounts-this-week",
    featured: true,
    trending: false
  },
  {
    id: 5,
    title: "تنظيم المنزل بطرق مبتكرة",
    excerpt: "أفكار إبداعية لتنظيم منزلك وتحويله إلى مساحة مريحة وجميلة باستخدام منتجات عملية.",
    content: "المحتوى الكامل للمقال...",
    image: "/images/blog/home-organization.jpg",
    category: "شؤون المنزل",
    tags: ["منزل", "تنظيم", "ديكور", "حياة"],
    author: "لمى الشمري",
    date: "5 يناير 2024",
    readTime: "7 دقائق",
    views: 890,
    likes: 78,
    comments: 19,
    slug: "creative-home-organization-ideas",
    featured: false,
    trending: false
  },
  {
    id: 6,
    title: "دليل العناية بالبشرة في الشتاء",
    excerpt: "نصائح خبراء العناية بالبشرة للحفاظ على نضارتها ورطوبتها خلال فصل الشتاء.",
    content: "المحتوى الكامل للمقال...",
    image: "/images/blog/winter-skincare.jpg",
    category: "شؤون المنزل",
    tags: ["بشرة", "عناية", "شتاء", "جمال"],
    author: "نورة الفهد",
    date: "3 يناير 2024",
    readTime: "5 دقائق",
    views: 1340,
    likes: 95,
    comments: 28,
    slug: "winter-skincare-guide",
    featured: false,
    trending: true
  },
];

// مكونات المدونة المحسنة
const BlogHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }} 
      className="blog-header"
    >
      <Container>
        <Row className="text-center">
          <Col>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="blog-icon mb-4"
            >
              <FaPenFancy size={48} />
            </motion.div>
           
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="display-4 fw-bold mb-3 text-gradient"
            >
              مدونة تريندورا
            </motion.h1>
           
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lead mb-4 opacity-90"
            >
              اكتشف أحدث مقالاتنا حول الموضة، التكنولوجيا، نصائح التسوق، وأكثر
            </motion.p>

            {/* إحصائيات */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="blog-stats"
            >
              <Row className="justify-content-center">
                <Col xs="auto">
                  <motion.div 
                    className="stat-item"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaNewspaper size={28} className="mb-2 stat-icon" />
                    <div className="stat-number fw-bold">50+</div>
                    <div className="stat-label">مقالة</div>
                  </motion.div>
                </Col>
                <Col xs="auto">
                  <motion.div 
                    className="stat-item"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaUsers size={28} className="mb-2 stat-icon" />
                    <div className="stat-number fw-bold">10K+</div>
                    <div className="stat-label">قارئ</div>
                  </motion.div>
                </Col>
                <Col xs="auto">
                  <motion.div 
                    className="stat-item"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FaPenFancy size={28} className="mb-2 stat-icon" />
                    <div className="stat-number fw-bold">15+</div>
                    <div className="stat-label">كاتب</div>
                  </motion.div>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
};

const BlogPost = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const navigate = useNavigate();

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleBookmark = (e) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const handleReadMore = () => {
    navigate(`/blog/${post.slug}`);
  };

  const categoryColor = categories.find(cat => cat.name === post.category)?.color || '#667eea';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="blog-post-card"
      onClick={handleReadMore}
    >
      <Card className="h-100 border-0 shadow-lg post-card">
        {/* الصورة */}
        <div className="post-image-wrapper">
          <Card.Img 
            variant="top" 
            src={post.image} 
            alt={post.title} 
            className="post-image"
          />
          <div className="post-overlay">
            <Button
              variant="light"
              size="sm"
              className="read-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleReadMore();
              }}
            >
              اقرأ المزيد <FaArrowRight size={12} />
            </Button>
          </div>
          
          {/* الشارات */}
          <div className="post-badges">
            <Badge 
              className="category-badge"
              style={{ backgroundColor: categoryColor }}
            >
              {post.category}
            </Badge>
            {post.featured && (
              <Badge bg="warning" className="featured-badge">
                <FaStar size={10} /> مميز
              </Badge>
            )}
            {post.trending && (
              <Badge bg="danger" className="trending-badge">
                <FaFire size={10} /> ترند
              </Badge>
            )}
          </div>

          {/* زر الحفظ */}
          <Button
            variant="light"
            size="sm"
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmark}
          >
            {isBookmarked ? <FaBookmark size={14} /> : <FaRegBookmark size={14} />}
          </Button>
        </div>

        <Card.Body className="d-flex flex-column">
          {/* التصنيفات */}
          <div className="post-tags mb-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                bg="outline-primary"
                text="primary"
                className="tag-badge me-1 mb-1"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* العنوان */}
          <Card.Title className="post-title h5">
            {post.title}
          </Card.Title>

          {/* الملخص */}
          <Card.Text className="post-excerpt text-muted flex-grow-1">
            {post.excerpt}
          </Card.Text>

          {/* الميتاداتا */}
          <div className="post-meta mt-auto">
            <div className="d-flex justify-content-between align-items-center text-muted small">
              <div className="d-flex gap-3">
                <span className="d-flex align-items-center gap-1">
                  <FaCalendar size={12} />
                  {post.date}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaUser size={12} />
                  {post.author}
                </span>
              </div>
              <div className="d-flex gap-3">
                <span
                  className={`d-flex align-items-center gap-1 like-btn ${isLiked ? "text-danger" : ""}`}
                  onClick={handleLike}
                >
                  <FaHeart size={12} />
                  {likes}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaComments size={12} />
                  {post.comments}
                </span>
                <span className="d-flex align-items-center gap-1">
                  <FaEye size={12} />
                  {post.views}
                </span>
              </div>
            </div>
          </div>

          {/* وقت القراءة */}
          <div className="read-time mt-2">
            <Badge bg="outline-secondary" text="secondary">
              ⏱️ {post.readTime}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

const BlogSidebar = ({ categories, popularPosts, activeCategory, onCategoryChange }) => {
  const navigate = useNavigate();

  return (
    <div className="blog-sidebar-content">
      {/* فئات المدونة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="sidebar-widget categories-widget"
      >
        <h5 className="sidebar-title d-flex align-items-center gap-2">
          <FaHashtag className="text-primary" />
          فئات المدونة
        </h5>
        <div className="category-list">
          <div
            className={`category-item ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => onCategoryChange("all")}
          >
            <span className="d-flex align-items-center gap-2">
              <div className="category-dot" style={{backgroundColor: '#667eea'}}></div>
              جميع المقالات
            </span>
            <span className="badge bg-primary rounded-pill">
              {categories.reduce((total, cat) => total + cat.count, 0)}
            </span>
          </div>
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`category-item ${activeCategory === category.slug ? "active" : ""}`}
              onClick={() => onCategoryChange(category.slug)}
            >
              <span className="d-flex align-items-center gap-2">
                <div 
                  className="category-dot" 
                  style={{backgroundColor: category.color}}
                ></div>
                {category.name}
              </span>
              <span className="badge bg-light text-dark rounded-pill">
                {category.count}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* المقالات الشائعة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="sidebar-widget popular-widget"
      >
        <h5 className="sidebar-title d-flex align-items-center gap-2">
          <FaFire className="text-warning" />
          المقالات الشائعة
        </h5>
        <div className="popular-posts-list">
          {popularPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="popular-post"
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
            >
              <div className="popular-post-rank">
                #{index + 1}
              </div>
              <img
                src={post.image}
                alt={post.title}
                className="popular-post-image"
              />
              <div className="popular-post-content">
                <div className="popular-post-title">{post.title}</div>
                <div className="popular-post-meta d-flex align-items-center gap-2">
                  <FaCalendar size={10} />
                  <span>{post.date}</span>
                  <FaEye size={10} />
                  <span>{post.views}</span>
                </div>
                <div className="popular-post-readtime">
                  ⏱️ {post.readTime}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* إعلان أو دعوة للعمل */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="sidebar-widget"
      >
        <div
          className="promo-banner text-center p-4 rounded-4"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <div className="promo-icon mb-3">
            <FaRocket size={32} />
          </div>
          <h6 className="fw-bold mb-2">انضم إلى مجتمعنا</h6>
          <p className="small mb-3 opacity-90">احصل على آخر المقالات والعروض مباشرة في بريدك</p>
          <button
            className="btn btn-light btn-sm fw-bold px-3"
            onClick={() => document.getElementById("newsletter")?.scrollIntoView({ behavior: "smooth" })}
          >
            اشترك الآن
          </button>
        </div>
      </motion.div>

      {/* الوسوم الشائعة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="sidebar-widget tags-widget"
      >
        <h5 className="sidebar-title d-flex align-items-center gap-2">
          <FaTags className="text-info" />
          الوسوم الشائعة
        </h5>
        <div className="tags-cloud">
          {["موضة", "تكنولوجيا", "تسوق", "عروض", "نصائح", "جمال", "منزل", "صحة", "أزياء", "توفير"].map((tag) => (
            <motion.span
              key={tag}
              className="tag"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(tag)}
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // محاكاة عملية الاشتراك
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="newsletter-section"
      id="newsletter"
    >
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="newsletter-content">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="newsletter-icon mb-4"
              >
                <FaEnvelope size={48} />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="fw-bold mb-3 text-gradient"
              >
                انضم إلى قائمة بريدنا
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="lead mb-4 opacity-90"
              >
                احصل على أحدث المقالات، نصائح التسوق، والعروض الحصرية مباشرة في بريدك الإلكتروني
              </motion.p>

              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-message text-center"
                >
                  <Alert variant="success" className="d-inline-flex align-items-center gap-2 py-3 px-4 border-0">
                    <FaCheck className="text-success fs-5" />
                    <div>
                      <div className="fw-bold fs-6">تم الاشتراك بنجاح!</div>
                      <small>شكراً لك، سنرسل لك آخر التحديثات قريباً.</small>
                    </div>
                  </Alert>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="newsletter-form"
                >
                  <Form onSubmit={handleSubmit}>
                    <div className="d-flex gap-2 flex-column flex-md-row">
                      <Form.Control
                        type="email"
                        placeholder="بريدك الإلكتروني"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        size="lg"
                        className="flex-fill border-0 shadow-sm newsletter-input"
                      />
                      <Button
                        type="submit"
                        variant="warning"
                        size="lg"
                        disabled={isLoading}
                        className="fw-bold d-flex align-items-center gap-2 border-0 newsletter-btn"
                      >
                        {isLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            جاري الاشتراك...
                          </>
                        ) : (
                          <>
                            <FaRocket />
                            اشترك الآن
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="small text-center mt-3 opacity-75"
                  >
                    نحن نحترم خصوصيتك. لن نشارك بريدك مع أي طرف ثالث.
                  </motion.p>
                </motion.div>
              )}

              {/* إحصائيات الاشتراكات */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="newsletter-stats mt-5"
              >
                <Row className="justify-content-center text-center">
                  <Col xs="auto">
                    <div className="stat-item">
                      <div className="stat-number fw-bold">5,247+</div>
                      <div className="stat-label">مشترك</div>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="stat-item">
                      <div className="stat-number fw-bold">98%</div>
                      <div className="stat-label">رضا العملاء</div>
                    </div>
                  </Col>
                  <Col xs="auto">
                    <div className="stat-item">
                      <div className="stat-number fw-bold">24/7</div>
                      <div className="stat-label">دعم فني</div>
                    </div>
                  </Col>
                </Row>
              </motion.div>
            </div>
          </Col>
        </Row>
      </Container>
    </motion.section>
  );
};

// المكون الرئيسي للمدونة
const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const postsPerPage = 6;

  // استخدام useMemo لتحسين الأداء
  const sortedAndFilteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // التصفية حسب الفئة
    if (activeCategory !== "all") {
      filtered = filtered.filter((post) => 
        post.category === activeCategory || 
        post.tags.includes(activeCategory)
      );
    }

    // البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        post.author.toLowerCase().includes(term)
      );
    }

    // الترتيب
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "likes":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    return filtered;
  }, [activeCategory, searchTerm, sortBy]);

  // محاكاة التحميل
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilteredPosts(sortedAndFilteredPosts);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [sortedAndFilteredPosts]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="blog-page"
    >
      {/* الهيدر */}
      <BlogHeader />

      {/* المحتوى الرئيسي */}
      <Container className="py-5">
        <Row>
          {/* شريط البحث والفئات */}
          <Col lg={12}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="blog-controls mb-5"
            >
              <Row className="align-items-center gy-3">
                <Col md={6} lg={4}>
                  <InputGroup className="search-box">
                    <Form.Control
                      type="text"
                      placeholder="ابحث في المقالات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0 search-input"
                    />
                    <Button variant="primary" className="search-btn">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Col>
                
                <Col md={6} lg={5}>
                  <div className="categories-filter">
                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                      <Button
                        variant={activeCategory === "all" ? "primary" : "outline-primary"}
                        size="sm"
                        onClick={() => setActiveCategory("all")}
                        className="category-btn"
                      >
                        الكل
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={activeCategory === category.slug ? "primary" : "outline-primary"}
                          size="sm"
                          onClick={() => setActiveCategory(category.slug)}
                          className="category-btn"
                          style={activeCategory === category.slug ? {
                            backgroundColor: category.color,
                            borderColor: category.color
                          } : {}}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Col>
                
                <Col lg={3}>
                  <Dropdown className="sort-dropdown">
                    <Dropdown.Toggle variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-between">
                      <FaSort className="me-2" />
                      {sortBy === "newest" && "الأحدث"}
                      {sortBy === "oldest" && "الأقدم"}
                      {sortBy === "popular" && "الأكثر مشاهدة"}
                      {sortBy === "likes" && "الأكثر إعجاباً"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => setSortBy("newest")}>
                        الأحدث
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy("oldest")}>
                        الأقدم
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy("popular")}>
                        الأكثر مشاهدة
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => setSortBy("likes")}>
                        الأكثر إعجاباً
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>

        <Row>
          {/* المقالات */}
          <Col lg={8}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-5"
                >
                  <div className="loading-spinner">
                    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                    <p className="mt-3 text-muted">جاري تحميل المقالات...</p>
                  </div>
                </motion.div>
              ) : currentPosts.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-5"
                >
                  <div className="empty-state">
                    <div className="empty-icon mb-3">📝</div>
                    <h4 className="empty-title">لا توجد مقالات</h4>
                    <p className="empty-description text-muted">
                      {searchTerm
                        ? `لم نعثر على مقالات تطابق "${searchTerm}"`
                        : "لا توجد مقالات في هذه الفئة حالياً"
                      }
                    </p>
                    {(searchTerm || activeCategory !== "all") && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSearchTerm("");
                          setActiveCategory("all");
                        }}
                        className="mt-3"
                      >
                        عرض جميع المقالات
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="posts-grid"
                >
                  <Row>
                    {currentPosts.map((post, index) => (
                      <Col md={6} key={post.id} className="mb-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <BlogPost post={post} />
                        </motion.div>
                      </Col>
                    ))}
                  </Row>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="blog-pagination mt-5"
                    >
                      <div className="d-flex justify-content-center gap-2 flex-wrap">
                        <Button
                          variant="outline-primary"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="pagination-btn"
                        >
                          السابق
                        </Button>
                       
                        {[...Array(totalPages)].map((_, index) => (
                          <Button
                            key={index + 1}
                            variant={currentPage === index + 1 ? "primary" : "outline-primary"}
                            onClick={() => handlePageChange(index + 1)}
                            className="pagination-btn"
                          >
                            {index + 1}
                          </Button>
                        ))}
                       
                        <Button
                          variant="outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="pagination-btn"
                        >
                          التالي
                        </Button>
                      </div>
                      
                      <div className="text-center mt-3 text-muted small">
                        عرض {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, filteredPosts.length)} من {filteredPosts.length} مقالة
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Col>

          {/* الشريط الجانبي */}
          <Col lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="blog-sidebar"
            >
              <BlogSidebar
                categories={categories}
                popularPosts={popularPosts}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>

      {/* النشرة البريدية */}
      <Newsletter />

      {/* إضافة الـ CSS مباشرة في المكون */}
      <style jsx>{`
        .blog-page {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* الهيدر */
        .blog-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 5rem 0;
          position: relative;
          overflow: hidden;
        }

        .blog-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
          opacity: 0.6;
        }

        .blog-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .text-gradient {
          background: linear-gradient(135deg, #fff 0%, #e2e8f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .blog-stats {
          margin-top: 3rem;
        }

        .stat-item {
          padding: 1.5rem 1rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .stat-icon {
          opacity: 0.9;
        }

        .stat-number {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
          font-weight: 500;
        }

        /* البحث */
        .search-box {
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: white;
        }

        .search-input {
          padding: 15px 20px;
          border: none;
          font-size: 1rem;
          background: transparent;
        }

        .search-input:focus {
          box-shadow: none;
          background: transparent;
        }

        .search-btn {
          padding: 15px 25px;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          transform: scale(1.05);
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
        }

        .category-btn {
          border-radius: 25px;
          padding: 8px 20px;
          font-weight: 600;
          transition: all 0.3s ease;
          border-width: 2px;
        }

        .category-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .sort-dropdown .dropdown-toggle {
          border-radius: 15px;
          padding: 10px 20px;
          border: 2px solid #e2e8f0;
          background: white;
          color: #4a5568;
          font-weight: 600;
        }

        .sort-dropdown .dropdown-toggle:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }

        /* البطاقات */
        .blog-post-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .post-card {
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }

        .post-card:hover {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .post-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
          height: 250px;
        }

        .post-image {
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }

        .blog-post-card:hover .post-image {
          transform: scale(1.1);
        }

        .post-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .blog-post-card:hover .post-overlay {
          opacity: 1;
        }

        .read-more-btn {
          border-radius: 25px;
          padding: 10px 25px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          transform: scale(1.1);
          background: white;
          color: #667eea;
        }

        .post-badges {
          position: absolute;
          top: 15px;
          left: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-start;
        }

        .category-badge {
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 15px;
          font-weight: 600;
          border: none;
        }

        .featured-badge, .trending-badge {
          font-size: 0.7rem;
          padding: 5px 10px;
          border-radius: 12px;
          font-weight: 600;
        }

        .bookmark-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #666;
          transition: all 0.3s ease;
        }

        .bookmark-btn:hover, .bookmark-btn.bookmarked {
          background: #667eea;
          color: white;
          transform: scale(1.1);
        }

        .post-title {
          color: #2d3748;
          font-weight: 700;
          line-height: 1.4;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .post-excerpt {
          line-height: 1.7;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #718096;
          margin-bottom: 1.5rem;
        }

        .post-meta {
          font-size: 0.85rem;
          border-top: 1px solid #f1f5f9;
          padding-top: 1rem;
        }

        .like-btn {
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 5px 10px;
          border-radius: 15px;
        }

        .like-btn:hover {
          background: rgba(254, 202, 202, 0.3);
        }

        .like-btn.text-danger:hover {
          background: rgba(254, 202, 202, 0.5);
        }

        .tag-badge {
          font-size: 0.75rem;
          padding: 6px 12px;
          border-radius: 15px;
          border: 2px solid #667eea;
          background: transparent;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .tag-badge:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .read-time {
          margin-top: 1rem;
        }

        /* الشريط الجانبي */
        .blog-sidebar {
          position: sticky;
          top: 2rem;
        }

        .sidebar-widget {
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid #f1f5f9;
          transition: all 0.3s ease;
        }

        .sidebar-widget:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }

        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 3px solid #667eea;
        }

        .category-list .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          cursor: pointer;
          border-radius: 10px;
          margin: 0 -0.5rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .category-list .category-item:hover {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding-left: 1rem;
          transform: translateX(5px);
        }

        .category-list .category-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding-left: 1rem;
        }

        .category-list .category-item.active .badge {
          background: rgba(255, 255, 255, 0.2) !important;
          color: white !important;
        }

        .category-list .category-item:last-child {
          border-bottom: none;
        }

        .category-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }

        .popular-post {
          display: flex;
          gap: 15px;
          padding: 1rem 0;
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s ease;
          cursor: pointer;
          align-items: center;
        }

        .popular-post:hover {
          background: #f8fafc;
          padding-left: 1rem;
          border-radius: 10px;
        }

        .popular-post:last-child {
          border-bottom: none;
        }

        .popular-post-rank {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .popular-post-image {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .popular-post-content {
          flex: 1;
        }

        .popular-post-title {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          color: #2d3748;
        }

        .popular-post-meta {
          font-size: 0.75rem;
          color: #718096;
          margin-bottom: 0.25rem;
        }

        .popular-post-readtime {
          font-size: 0.7rem;
          color: #a0aec0;
        }

        .promo-banner {
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .promo-banner:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
        }

        .promo-icon {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          color: #4a5568;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
        }

        .tag:hover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        /* النشرة البريدية */
        .newsletter-section {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 5rem 0;
          margin-top: 4rem;
          position: relative;
          overflow: hidden;
        }

        .newsletter-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 70%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 30%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
        }

        .newsletter-content {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .newsletter-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          margin-bottom: 1.5rem;
        }

        .newsletter-form {
          max-width: 500px;
          margin: 2rem auto 0;
        }

        .newsletter-input {
          border-radius: 15px;
          padding: 15px 20px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .newsletter-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .newsletter-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 0 0.2rem rgba(255, 255, 255, 0.1);
          color: white;
        }

        .newsletter-btn {
          border-radius: 15px;
          padding: 15px 30px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none;
        }

        .newsletter-btn:hover:not(:disabled) {
          transform: scale(1.05);
          background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
        }

        .newsletter-stats .stat-item {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
        }

        /* Pagination */
        .blog-pagination .pagination-btn {
          border-radius: 12px;
          padding: 10px 20px;
          font-weight: 600;
          transition: all 0.3s ease;
          border-width: 2px;
        }

        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        /* الحالة الفارغة */
        .empty-state {
          padding: 4rem 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .empty-icon {
          font-size: 5rem;
          opacity: 0.5;
          margin-bottom: 1.5rem;
        }

        .empty-title {
          color: #4a5568;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .empty-description {
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }

        .loading-spinner {
          padding: 4rem 2rem;
        }

        /* التجاوب */
        @media (max-width: 768px) {
          .blog-header {
            padding: 3rem 0;
          }
         
          .blog-controls .row {
            gap: 1rem;
          }
         
          .categories-filter .d-flex {
            justify-content: center !important;
          }
         
          .post-image {
            height: 200px;
          }
         
          .popular-post {
            flex-direction: column;
            text-align: center;
          }
         
          .popular-post-image {
            width: 100%;
            height: 120px;
            margin-bottom: 0.5rem;
          }
          
          .newsletter-section {
            padding: 3rem 0;
          }
          
          .newsletter-stats .row {
            gap: 1rem;
          }

          .stat-item {
            padding: 1rem;
          }

          .blog-icon, .newsletter-icon {
            width: 80px;
            height: 80px;
          }
        }

        /* تحسينات للوضع الداكن */
        @media (prefers-color-scheme: dark) {
          .blog-page {
            background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
          }
          
          .post-card, .sidebar-widget {
            background: #2d3748;
            border-color: #4a5568;
          }
          
          .post-title, .sidebar-title, .popular-post-title {
            color: #e2e8f0;
          }
          
          .post-excerpt, .popular-post-meta {
            color: #a0aec0;
          }
          
          .category-list .category-item {
            border-color: #4a5568;
          }
          
          .category-list .category-item:hover {
            background: #4a5568;
          }

          .search-input {
            background: #2d3748;
            color: #e2e8f0;
            border-color: #4a5568;
          }

          .sort-dropdown .dropdown-toggle {
            background: #2d3748;
            border-color: #4a5568;
            color: #e2e8f0;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Blog;