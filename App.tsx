
import React from 'react';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen antialiased text-gray-800 dark:text-gray-200">
      <div className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4">
        <ChatWindow />
      </div>
    </div>
  );
};

export default App;
