import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaCalendar, FaUser, FaComments, FaArrowRight, FaTags, FaShare } from 'react-icons/fa';
import BlogHeader from './components/BlogHeader';
import BlogPost from './components/BlogPost';
import BlogSidebar from './components/BlogSidebar';
import Newsletter from './components/Newsletter';
import { blogPosts, categories, popularPosts } from './data/blogData';
import './Blog.css';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // تصفية المقالات حسب الفئة والبحث
  useEffect(() => {
    let filtered = blogPosts;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category === activeCategory || 
        post.tags.includes(activeCategory)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [activeCategory, searchTerm]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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
              <Row className="align-items-center">
                <Col md={6}>
                  <InputGroup className="search-box">
                    <Form.Control
                      type="text"
                      placeholder="ابحث في المقالات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-0"
                    />
                    <Button variant="primary">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={6}>
                  <div className="categories-filter">
                    <div className="d-flex flex-wrap gap-2 justify-content-md-end">
                      <Button
                        variant={activeCategory === 'all' ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setActiveCategory('all')}
                      >
                        الكل
                      </Button>
                      {categories.map(category => (
                        <Button
                          key={category.id}
                          variant={activeCategory === category.slug ? 'primary' : 'outline-primary'}
                          size="sm"
                          onClick={() => setActiveCategory(category.slug)}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </Col>
        </Row>

        <Row>
          {/* المقالات */}
          <Col lg={8}>
            <AnimatePresence mode="wait">
              {currentPosts.length === 0 ? (
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
                        : 'لا توجد مقالات في هذه الفئة حالياً'
                      }
                    </p>
                    {(searchTerm || activeCategory !== 'all') && (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSearchTerm('');
                          setActiveCategory('all');
                        }}
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
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          السابق
                        </Button>
                        
                        {[...Array(totalPages)].map((_, index) => (
                          <Button
                            key={index + 1}
                            variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Button>
                        ))}
                        
                        <Button
                          variant="outline-primary"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          التالي
                        </Button>
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
    </motion.div>
  );
};

export default Blog;