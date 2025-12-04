"use client";
import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div 
        className={`fixed z-[100] transition-all p-8 duration-500 ease-in-out transform 
          ${notification.isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
          top-0 left-0 right-0 md:left-auto md:right-6 md:top-6 md:w-auto md:max-w-md
          p-4 pointer-events-none
        `}
      >
        <div className="pointer-events-auto bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative overflow-hidden min-w-[300px]">
           {/* Side accent bar */}
           <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${notification.type === 'error' ? 'bg-red-600' : 'bg-[#EB8E41]'}`}></div>

           <div className="pl-4 pr-2">
             <h4 className={`font-fino text-xl uppercase mb-2 ${notification.type === 'error' ? 'text-red-600' : 'text-black'}`}>
               {notification.type === 'error' ? 'Error' : 'Success'}
             </h4>
             <p className="font-merriweather italic text-sm text-gray-600 leading-relaxed">
               {notification.message}
             </p>
           </div>
        </div>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
