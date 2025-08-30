import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

// Interface for chatbot request
interface ChatbotRequest {
  message: string;
  sessionId?: string;
}

// Interface for chatbot response
interface ChatbotResponse {
  response: string;
  suggestions?: string[];
  products?: any[];
  actionType?: 'text' | 'product' | 'order' | 'cart';
}

// Simple NLP processing function
const processMessage = (message: string): ChatbotResponse => {
  const lowerMessage = message.toLowerCase();
  
  // Sample product data
  const products = [
    {
      _id: '1',
      name: 'Dairy Licious Organic Whole Milk',
      price: 4.99,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      description: 'Fresh organic whole milk from grass-fed cows, a Dairy Licious premium product',
      category: 'milk',
      unit: 'liter',
      brand: 'Dairy Licious'
    },
    {
      _id: '2',
      name: 'Dairy Licious Artisan Cheddar Cheese',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
      description: 'Aged artisan cheddar cheese with rich flavor, crafted by Dairy Licious experts',
      category: 'cheese',
      unit: 'kg',
      brand: 'Dairy Licious'
    },
    {
      _id: '3',
      name: 'Dairy Licious Greek Yogurt',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1571212059353-05d1e2c5c8b5?w=400',
      description: 'Creamy Greek yogurt packed with protein, made with Dairy Licious quality',
      category: 'yogurt',
      unit: 'pack',
      brand: 'Dairy Licious'
    }
  ];

  // Intent detection
  if (lowerMessage.includes('milk') || lowerMessage.includes('dairy')) {
    return {
      response: 'Here are our fresh Dairy Licious milk products! 🥛',
      actionType: 'product',
      products: products.filter(p => p.category === 'milk'),
      suggestions: ['Add to cart', 'Tell me more', 'Show other products']
    };
  }
  
  if (lowerMessage.includes('cheese')) {
    return {
      response: 'Check out our Dairy Licious artisan cheese selection! 🧀',
      actionType: 'product',
      products: products.filter(p => p.category === 'cheese'),
      suggestions: ['Add to cart', 'Show ingredients', 'Compare prices']
    };
  }
  
  if (lowerMessage.includes('yogurt')) {
    return {
      response: 'Perfect! Here\'s our Dairy Licious premium yogurt collection! 🥛',
      actionType: 'product',
      products: products.filter(p => p.category === 'yogurt'),
      suggestions: ['Add to cart', 'Nutritional info', 'Other flavors']
    };
  }
  
  if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
    return {
      response: 'I\'d love to help you place an order for our premium Dairy Licious products! What dairy items are you looking for? I can suggest milk, cheese, yogurt, or browse our full catalog.',
      actionType: 'order',
      suggestions: ['Show all products', 'Milk products', 'Cheese selection', 'Yogurt varieties']
    };
  }
  
  if (lowerMessage.includes('cart') || lowerMessage.includes('add')) {
    return {
      response: 'I can help you add Dairy Licious items to your cart! Which products would you like to add?',
      actionType: 'cart',
      suggestions: ['Show milk', 'Show cheese', 'Show yogurt', 'View cart']
    };
  }
  
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      response: `I'm your Dairy Licious shopping assistant! Here's how I can help:

🥛 **Find Products**: Ask about our premium milk, cheese, yogurt, or any dairy product
🛒 **Add to Cart**: I can add Dairy Licious items directly to your shopping cart  
📦 **Place Orders**: Guide you through the ordering process for fresh dairy
💬 **Voice Commands**: Click the microphone to speak to me
❓ **Product Info**: Get details about ingredients, nutrition, and quality

Just tell me what delicious Dairy Licious products you're craving! 😊`,
      actionType: 'text',
      suggestions: ['Show milk products', 'Show cheese products', 'Show yogurt products', 'View my cart']
    };
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return {
      response: `Hello! 👋 Welcome to Dairy Licious! I'm your AI shopping assistant. 

I can help you:
- Find the perfect premium dairy products
- Add Dairy Licious items to your cart  
- Place orders quickly for fresh delivery
- Answer questions about our products

What delicious Dairy Licious products are you looking for today?`,
      actionType: 'text',
      suggestions: ['Browse milk', 'Browse cheese', 'Browse yogurt', 'See all products']
    };
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return {
      response: 'Here are our current Dairy Licious prices:\n\n🥛 Premium Milk: $4.99/liter\n🧀 Artisan Cheese: $12.99/kg\n🥛 Greek Yogurt: $3.99/pack\n\nAll products are premium quality and organic! Which Dairy Licious product would you like to add to your cart?',
      actionType: 'text',
      suggestions: ['Add milk to cart', 'Add cheese to cart', 'Add yogurt to cart', 'Compare products']
    };
  }
  
  // Default response
  return {
    response: `I understand you're asking about "${message}". Let me help you find what you need from our Dairy Licious collection! 

I specialize in premium dairy products and can help you with:
- 🥛 Fresh Dairy Licious milk and dairy beverages  
- 🧀 Artisan Dairy Licious cheeses
- 🥛 Premium Dairy Licious yogurts
- 🛒 Adding items to your cart

What specific Dairy Licious product interests you?`,
    actionType: 'text',
    suggestions: ['Show milk options', 'Show cheese options', 'Show yogurt options', 'Help me choose']
  };
};

// POST /api/chatbot/message
router.post('/message', async (req: Request, res: Response) => {
  try {
    const { message, sessionId }: ChatbotRequest = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }
    
    // Process the message
    const response = processMessage(message);
    
    // Log for development
    console.log(`💬 Chatbot Request [${sessionId || 'anonymous'}]: ${message}`);
    console.log(`🤖 Chatbot Response: ${response.response}`);
    
    res.json({
      success: true,
      data: response,
      sessionId: sessionId || `session_${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Sorry, I encountered an error. Please try again.'
    });
  }
});

// GET /api/chatbot/suggestions
router.get('/suggestions', (req: Request, res: Response) => {
  const suggestions = [
    'Show me your Dairy Licious milk products',
    'I want to buy Dairy Licious cheese',
    'What Dairy Licious yogurt do you have?',
    'Add Dairy Licious milk to my cart',
    'Help me place an order',
    'What are your Dairy Licious prices?',
    'Tell me about Dairy Licious organic products'
  ];
  
  res.json({
    success: true,
    data: { suggestions }
  });
});

// GET /api/chatbot/health
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Chatbot API is running!',
    timestamp: new Date().toISOString()
  });
});

export default router;
