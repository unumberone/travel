import { useEffect, useRef, useState } from 'react';
import useChatbot from './useChatbot';
import placesData from './places.json';
import './chatbot.css';
import './gemini'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    addBotMessage,
    messagesEndRef,
    isTyping,
    isLoading
  } = useChatbot();

  const welcomeSentRef = useRef(false);

  useEffect(() => {
    if (!welcomeSentRef.current && isOpen) {
      const welcomeMsg = `Xin chào! Tôi có thông tin về ${placesData.length} địa điểm du lịch. Bạn muốn khám phá tour nào hôm nay?`;
      setTimeout(() => {
        addBotMessage(welcomeMsg);
        welcomeSentRef.current = true;
      }, 500);
    }
  }, [addBotMessage, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;
    const userInput = inputValue.trim();
    setInputValue('');
    sendMessage(userInput);
  };

  return (
    <div className="chatbot-fixed-wrapper">
      {!isOpen && (
        <button className="chatbot-icon" onClick={() => setIsOpen(true)} title="Chat với tư vấn viên">
          💬
        </button>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <span>Chat tư vấn</span>
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbot-body">
            {messages.map(msg => (
              <div key={msg.id} className={`chatbot-message ${msg.sender}`}>
                <div className="chatbot-bubble">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-message bot">
                <div className="chatbot-bubble">Đang nhập...</div>
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chatbot-footer">
            <input
              className="chatbot-input"
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              className="chatbot-send"
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
