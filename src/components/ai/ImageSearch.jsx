const ImageSearch = () => {
  const handleImageUpload = async (image) => {
    // استخدام AI للتعرف على الصورة وإرجاع منتجات مشابهة
    const similarProducts = await analyzeImage(image);
    return similarProducts;
  };
  
  return (
    <div className="image-search">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};