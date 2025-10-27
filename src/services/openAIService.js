class OpenAIService {
  constructor() {
    this.apiKey = null;
    this.baseURL = 'https://api.openai.com/v1';
  }

  initialize(apiKey) {
    this.apiKey = apiKey;
  }

  async chat(message, context = {}) {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `أنت مساعد تسوق ذكي لمتجر إلكتروني. 
              ساعد المستخدم في العثور على المنتجات، الإجابة عن الأسئلة، 
              وتقديم توصيات ذكية. كن مفيداً وودوداً.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Service Error:', error);
      throw error;
    }
  }

  async analyzePreferences(userData) {
    // تحليل تفضيلات المستخدم باستخدام OpenAI
    const prompt = `
      قم بتحليل بيانات المستخدم التالية وتحديد تفضيلاتهم في التسوق:
      ${JSON.stringify(userData)}
      
      أعد النتائج في شكل JSON يحتوي على:
      - الفئات المفضلة
      - نطاق السعر
      - الأنماط المفضلة
      - العلامات التجارية المفضلة
    `;

    return await this.chat(prompt);
  }

  async generateRecommendations(userPreferences, products) {
    const prompt = `
      بناءً على تفضيلات المستخدم التالية:
      ${JSON.stringify(userPreferences)}
      
      وقائمة المنتجات المتاحة:
      ${JSON.stringify(products.slice(0, 50))}
      
      قم بترتيب أفضل 6 منتجات تناسب هذا المستخدم مع شرح سبب التوصية.
      أعد النتائج في شكل JSON.
    `;

    return await this.chat(prompt);
  }

  async classifyProducts(query, products) {
    const prompt = `
      قم بتصنيف المنتجات التالية بناءً على البحث: "${query}"
      ${JSON.stringify(products)}
      
      أعد قائمة بالمنتجات المصنفة حسب الأكثر صلة.
    `;

    return await this.chat(prompt);
  }

  async analyzeSentiment(text) {
    const prompt = `
      قم بتحليل المشاعر في النص التالي وتحديد إذا كانت إيجابية، سلبية، أو محايدة:
      "${text}"
      
      أعد النتيجة في شكل JSON يحتوي على:
      - المشاعر (positive/negative/neutral)
      - الثقة (score بين 0-1)
      - النقاط الرئيسية
    `;

    return await this.chat(prompt);
  }
}

export const openAIService = new OpenAIService();