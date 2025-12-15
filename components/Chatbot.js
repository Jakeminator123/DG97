import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "./animations/MagneticButton";

const POSITION_CLASSES = {
  "bottom-right": {
    button: "fixed bottom-6 right-6 z-[100]",
    window: "fixed bottom-24 right-6 z-[100]",
  },
  "bottom-left": {
    button: "fixed bottom-6 left-6 z-[100]",
    window: "fixed bottom-24 left-6 z-[100]",
  },
};

export default function Chatbot({ position = "bottom-right" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hej! Jag är DG97:s virtuella assistent. Hur kan jag hjälpa dig idag?",
      sender: "bot",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageIdRef = useRef(2); // Start from 2 since we have initial message

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickResponses = [
    "Berätta om era kontorsrum",
    "Vad kostar det?",
    "Kan jag boka visning?",
    "Var ligger ni?"
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue; // Store before clearing
    const userMessage = {
      id: messageIdRef.current++,
      text: messageText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response (placeholder for real API integration)
    setTimeout(() => {
      const botResponse = {
        id: messageIdRef.current++,
        text: getBotResponse(messageText),
        sender: 'bot'
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('kontorsrum') || lowerMessage.includes('rum')) {
      return "Vi erbjuder fullt möblerade kontorsrum för 1-6 personer. Alla rum har fönster, ergonomiska möbler och är redo att användas direkt. Vill du veta mer om priser eller boka en visning?";
    } else if (lowerMessage.includes('pris') || lowerMessage.includes('kosta')) {
      return "Våra priser varierar beroende på rummets storlek och avtalsperiod. Allt ingår i hyran - möbler, internet, städning, kaffe och tillgång till konferensrum. Kontakta oss för en offert anpassad efter dina behov!";
    } else if (lowerMessage.includes('visning') || lowerMessage.includes('boka')) {
      return "Självklart! Vi visar gärna våra lokaler. Ring oss på 070-886 22 79 eller skicka ett mail till hej@dg97.se så bokar vi in en tid som passar dig.";
    } else if (lowerMessage.includes('var') || lowerMessage.includes('adress') || lowerMessage.includes('ligger')) {
      return "Vi finns på Drottninggatan 97 i Vasastan, Stockholm. Nära till både Odenplan och Rådmansgatan tunnelbana. Perfekt läge mitt i city!";
    } else {
      return "Tack för din fråga! För mer detaljerad information kontakta oss gärna på hej@dg97.se eller ring 070-886 22 79. Vi hjälper dig gärna!";
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        className={`${(POSITION_CLASSES[position] || POSITION_CLASSES["bottom-right"]).button} bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Stäng chatt" : "Öppna chatt"}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${(POSITION_CLASSES[position] || POSITION_CLASSES["bottom-right"]).window} w-96 max-w-[calc(100vw-3rem)] bg-white rounded-lg shadow-2xl overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-primary-600 text-white p-4">
              <h3 className="font-semibold text-lg">DG97 Kontorshotell</h3>
              <p className="text-sm text-primary-100">Vi svarar direkt!</p>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-800 shadow'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white rounded-lg p-3 shadow">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Responses */}
            <div className="p-3 bg-gray-100 border-t">
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(response)}
                    className="text-xs bg-white border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <label htmlFor="chatbot-input" className="sr-only">
                  Skriv ditt meddelande
                </label>
                <input
                  type="text"
                  id="chatbot-input"
                  name="chatbot-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Skriv ditt meddelande..."
                  autoComplete="off"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
                  disabled={!inputValue.trim()}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
