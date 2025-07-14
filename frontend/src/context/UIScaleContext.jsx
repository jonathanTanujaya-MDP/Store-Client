import React, { createContext, useState, useContext, useEffect } from 'react';

const UIScaleContext = createContext();

export const useUIScale = () => useContext(UIScaleContext);

export const UIScaleProvider = ({ children }) => {
  const [scaleFactor, setScaleFactor] = useState(1.0); // Default scale 1.0 (100%)

  // Apply the scale factor to the root HTML element
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * scaleFactor}px`;
  }, [scaleFactor]);

  return (
    <UIScaleContext.Provider value={{ scaleFactor, setScaleFactor }}>
      {children}
    </UIScaleContext.Provider>
  );
};