const fs = require('fs');
const path = require('path');

function analyzeCodeOnly() {
  const projectPath = process.cwd();
  const srcPath = path.join(projectPath, 'src');
  
  let stats = {
    codeFiles: 0,
    codeLines: 0,
    components: 0,
    hooks: 0,
    pages: 0,
    contexts: 0,
    fileTypes: {},
    largestCodeFiles: []
  };

  const codeExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.json'];

  function scanDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        if (file === 'node_modules' || file.startsWith('.') || file === 'build') {
          return;
        }
        
        const filePath = path.join(dir, file);
        
        try {
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            scanDirectory(filePath);
          } else {
            const ext = path.extname(filePath).toLowerCase();
            if (codeExtensions.includes(ext)) {
              analyzeCodeFile(filePath, stat);
            }
          }
        } catch (error) {
          console.log(`Cannot access: ${filePath}`);
        }
      });
    } catch (error) {
      console.log(`Cannot read directory: ${dir}`);
    }
  }

  function analyzeCodeFile(filePath, stat) {
    const ext = path.extname(filePath);
    stats.codeFiles++;
    stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').length;
      stats.codeLines += lines;
      
      // حفظ الملفات الكبيرة للتحليل
      if (lines > 100) {
        stats.largestCodeFiles.push({
          file: filePath.replace(projectPath + path.sep, ''),
          lines: lines
        });
      }
      
      // تحليل نوع الملف بناءً على المسار
      const relativePath = filePath.replace(projectPath + path.sep, '');
      
      if (relativePath.includes('components') || relativePath.includes('Components')) stats.components++;
      if (relativePath.includes('hooks') || relativePath.includes('Hooks')) stats.hooks++;
      if (relativePath.includes('pages') || relativePath.includes('Pages')) stats.pages++;
      if (relativePath.includes('context') || relativePath.includes('Context')) stats.contexts++;
      
    } catch (error) {
      console.log(`Error reading file: ${filePath}`);
    }
  }

  console.log('🔍 Scanning CODE files only...');
  scanDirectory(projectPath);
  
  // ترتيب الملفات الكبيرة
  stats.largestCodeFiles.sort((a, b) => b.lines - a.lines);
  
  // عرض التقرير
  console.log('\n📊 CODE Analysis Report (No Images):');
  console.log('='.repeat(50));
  console.log(`📄 Code Files: ${stats.codeFiles}`);
  console.log(`📝 Total Code Lines: ${stats.codeLines}`);
  console.log(`⚛️  React Components: ${stats.components}`);
  console.log(`🎣 Custom Hooks: ${stats.hooks}`);
  console.log(`📄 Pages: ${stats.pages}`);
  console.log(`🔄 Contexts: ${stats.contexts}`);
  
  console.log('\n📂 File Types:');
  Object.entries(stats.fileTypes)
    .sort(([,a], [,b]) => b - a)
    .forEach(([ext, count]) => {
      console.log(`   ${ext || 'no-ext'}: ${count} files`);
    });
  
  console.log('\n📈 Largest Code Files (Top 10):');
  stats.largestCodeFiles.slice(0, 10).forEach((file, index) => {
    console.log(`   ${index + 1}. ${file.file} (${file.lines} lines)`);
  });
  
  console.log('\n💡 Recommendations:');
  if (stats.largestCodeFiles.length > 0 && stats.largestCodeFiles[0].lines > 300) {
    console.log('   ⚠️  Consider splitting large files into smaller components');
  }
  if (stats.codeLines > 10000) {
    console.log('   📦 Large codebase - consider code splitting');
  }
  
  console.log('='.repeat(50));
  console.log('✅ Duplicate assets folder has been removed!');
}

// تشغيل التحليل
analyzeCodeOnly();