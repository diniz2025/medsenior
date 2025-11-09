
import React, { useState, KeyboardEvent } from 'react';
import type { Message } from '../types';

interface InputBarProps {
  onSend: (text: string) => void;
  activeMessage: Message | null;
  isTyping: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSend, activeMessage, isTyping }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() && !isTyping) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleOptionClick = (option: string) => {
    if (!isTyping) {
        onSend(option);
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
      {activeMessage?.options ? (
        <div className="flex flex-wrap justify-center gap-2">
          {activeMessage.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center">
          <input
            type={activeMessage?.inputType || 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? "Assistente está digitando..." : "Digite sua mensagem..."}
            disabled={isTyping || !activeMessage}
            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !inputValue.trim()}
            className="bg-blue-600 text-white p-3 rounded-r-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default InputBar;
