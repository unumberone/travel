import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";  // Thêm import cho Gemini
import placesData from './places.json';

const API_KEY = 'AIzaSyAM07SgwxPWt3pUw70ZkkjbbBAt64dJjSg';  // Chắc là key của bạn cho Google Gemini

const useChatbot = () => {
  const [messages, setMessages] = useState([{
    id: 1,
    text: "Xin chào! Tôi có thể giúp gì cho bạn?",
    sender: 'bot',
    timestamp: new Date().toISOString()
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Khởi tạo API Gemini
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",  // Bạn có thể thay đổi model nếu cần
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const callGeminiAgent = async (userText, contextInfo = '') => {
    const prompt = `
Người dùng hỏi: "${userText}"
${contextInfo ? `\nThông tin nội bộ:\n${contextInfo}` : ''}

Bạn là một chuyên gia tư vấn du lịch. Hãy đưa ra câu trả lời chi tiết, chuyên nghiệp, dễ hiểu và hấp dẫn, bao gồm đặc sản, hoạt động nổi bật, lịch trình gợi ý nếu phù hợp.
`;

    try {
      // Sử dụng Google Gemini API để gửi prompt
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);

      return result.response.text();  // Trả về phản hồi từ Gemini
    } catch (error) {
      console.error('Lỗi khi gọi Google Gemini API:', error);
      return "Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.";
    }
  };

  const splitTextToParagraphs = (text) => {
    // Chia văn bản thành các đoạn ngắn, mỗi đoạn không quá 2 dòng
    const paragraphs = text.split(/(?<=\.)\s+/); // Cắt ở vị trí dấu chấm và khoảng trắng sau đó
    return paragraphs.join('\n\n'); // Nối lại thành từng đoạn văn với 2 dấu xuống dòng
  };

  const generateBotResponse = useCallback(async (userMessage) => {
    const lower = userMessage.toLowerCase();

    const matchedPlace = placesData.find(place =>
      lower.includes(place.tinh_thanh.toLowerCase()) ||
      lower.includes(place.ten.toLowerCase())
    );

    try {
      if (matchedPlace) {
        const nộiDung = matchedPlace.noi_dung;
        const contextInfo = `Địa điểm: ${matchedPlace.ten} - ${matchedPlace.tinh_thanh}\nThông tin: ${nộiDung}`;

        // Nếu hỏi câu mở rộng => dùng Gemini API
        if (
          lower.includes('đặc sản') ||
          lower.includes('ăn gì') ||
          lower.includes('gợi ý') ||
          lower.includes('lịch trình') ||
          lower.includes('tour') ||
          lower.includes('gần đó') ||
          lower.includes('phù hợp') ||
          lower.includes('đi như nào') ||
          lower.includes('đẹp không') ||
          lower.includes('hay gì')
        ) {
          return splitTextToParagraphs(await callGeminiAgent(userMessage, contextInfo));
        }

        return splitTextToParagraphs(`Tôi đã tìm thấy thông tin về ${matchedPlace.ten} tại ${matchedPlace.tinh_thanh}:\n${nộiDung}`);
      }

      // Không tìm thấy trong dữ liệu => hỏi AI
      if (
        lower.includes('đặc sản') ||
        lower.includes('tư vấn') ||
        lower.includes('gợi ý') ||
        lower.includes('nên đi') ||
        lower.includes('đi đâu') ||
        lower.includes('có gì') ||
        lower.includes('phù hợp') ||
        lower.includes('tour') ||
        lower.includes('lịch trình') ||
        lower.includes('đẹp không')
      ) {
        return splitTextToParagraphs(await callGeminiAgent(userMessage));
      }

      // Một số phản hồi cứng
      if (lower.includes('hello') || lower.includes('xin chào') || lower.includes('chào')) {
        return splitTextToParagraphs("Xin chào! Rất vui được gặp bạn. Tôi có thể hỗ trợ bạn tìm hiểu các tour hoặc địa điểm du lịch nhé!");
      }

      if (lower.includes('cảm ơn') || lower.includes('thank')) {
        return splitTextToParagraphs("Không có gì! Nếu cần hỗ trợ thêm, tôi luôn sẵn sàng.");
      }

      if (lower.includes('tạm biệt') || lower.includes('bye')) {
        return splitTextToParagraphs("Tạm biệt! Chúc bạn một chuyến đi tuyệt vời!");
      }

      if (lower.includes('giúp') || lower.includes('help')) {
        return splitTextToParagraphs("Tôi có thể tư vấn tour, tìm điểm đến, hoặc đưa ra gợi ý lịch trình. Bạn muốn khám phá điều gì hôm nay?");
      }

      // Phản hồi ngẫu nhiên
      const fallback = [
        "Tôi hiểu ý bạn. Bạn có thể nói rõ hơn không?",
        "Đó là một câu hỏi thú vị! Để tôi kiểm tra thông tin...",
        "Tôi đang xử lý, vui lòng chờ trong giây lát...",
        "Bạn có thể nói cụ thể hơn để tôi hỗ trợ tốt hơn không?"
      ];
      return splitTextToParagraphs(fallback[Math.floor(Math.random() * fallback.length)]);
    } catch (err) {
      console.error("Lỗi khi tạo phản hồi bot:", err);
      return splitTextToParagraphs("Xin lỗi, tôi gặp sự cố khi trả lời câu hỏi của bạn. Vui lòng thử lại sau.");
    }
  }, []);

  const addUserMessage = useCallback((text) => {
    if (!text.trim()) return;
    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
  }, []);

  const addBotMessage = useCallback((text) => {
    const botMessage = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, botMessage]);
  }, []);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim()) return;
    addUserMessage(userText);
    setIsLoading(true);
    setIsTyping(true);

    try {
      const botText = await generateBotResponse(userText);
      addBotMessage(botText);
    } catch (err) {
      console.error('Lỗi khi gọi Gemini:', err);
      addBotMessage('Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.');
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [generateBotResponse, addUserMessage, addBotMessage]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 1,
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    }]);
  }, []);

  const deleteMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const sendQuickMessage = useCallback((text) => {
    sendMessage(text);
  }, [sendMessage]);

  const formatTime = useCallback((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }, []);

  return {
    messages,
    isTyping,
    inputValue,
    isLoading,
    messagesEndRef,

    sendMessage,
    addUserMessage,
    addBotMessage,
    clearMessages,
    deleteMessage,
    sendQuickMessage,
    setInputValue,
    scrollToBottom,
    formatTime,

    messageCount: messages.length,
    hasMessages: messages.length > 1
  };
};

export default useChatbot;
