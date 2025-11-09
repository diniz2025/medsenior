
import React from 'react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  const bubbleClasses = isBot
    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-r-xl rounded-bl-xl'
    : 'bg-blue-600 text-white rounded-l-xl rounded-br-xl';
  
  const containerClasses = isBot ? 'flex justify-start' : 'flex justify-end';

  return (
    <div className={`my-2 ${containerClasses}`}>
        <div className={`p-3 max-w-sm md:max-w-md lg:max-w-lg ${bubbleClasses}`}>
            {message.text && <div className="prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{ __html: message.text.replace(/\n/g, '<br />') }} />}
            {message.component}
        </div>
    </div>
  );
};

export default MessageBubble;
