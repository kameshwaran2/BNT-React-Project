import React, { useState, useEffect } from 'react';


const OnlineTestHelper = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3501/faqs')  
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Failed to fetch FAQs:", err));
  }, []);

  const handleQuestionClick = (faq) => {
    setChatMessages((prev) => [...prev, { type: 'question', text: faq.question }]);
    setIsThinking(true);

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { type: 'answer', text: faq.answer }]);
      setIsThinking(false);
    }, 2000);
  };

  return (
    <div className={`chatbot-wrapper ${darkMode ? 'dark' : 'light'}`}>
      {isOpen ? (
        <div className={`chatbox ${darkMode ? 'dark' : 'light'}`}>
          <div className="chatbox-header">
            <span>How can I assist you?</span>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="chatbox-body">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.type === 'question' ? `🙋‍♂️ ${msg.text}` : `🤖 ${msg.text}`}
              </div>
            ))}

            {isThinking && (
              <div className="chat-message answer spinner">
                <div className="spinner-border text-primary" role="status" style={{ width: '1.5rem', height: '1.5rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Thinking...</span>
              </div>
            )}
          </div>

          <div className="chatbox-footer">
            <h6 className="text-muted mb-2">FAQs</h6>
            <div className="faq-btn-container">
              {faqs.map((faq, index) => (
                <button
                  key={index}
                  className="faq-btn"
                  onClick={() => handleQuestionClick(faq)}
                  title={faq.question}
                >
                  {faq.question.length > 30 ? faq.question.slice(0, 30) + '...' : faq.question}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <button className="chat-icon" onClick={() => setIsOpen(true)}>
          💬
        </button>
      )}
    </div>
  );
};

export default OnlineTestHelper;
