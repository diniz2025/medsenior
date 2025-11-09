
import React from 'react';

const DcgLogo: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" rx="40" fill="url(#paint0_linear_1_2)"/>
        <path d="M62 50C62 41.1634 69.1634 34 78 34H110C135.376 34 156 54.6243 156 80V120C156 145.376 135.376 166 110 166H78C69.1634 166 62 158.837 62 150V50Z" fill="white" fillOpacity="0.1"/>
        <text x="40" y="135" fontFamily="Arial, sans-serif" fontSize="80" fontWeight="bold" fill="white">DCG</text>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0066CC"/>
                <stop offset="1" stopColor="#004C99"/>
            </linearGradient>
        </defs>
    </svg>
);


const Header: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-2xl">
      <div className="flex items-center space-x-3">
        <DcgLogo />
        <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Assistente Virtual DCG</p>
            <p className="text-sm text-green-500 flex items-center">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
            </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
