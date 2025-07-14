import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHotkeys = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignore if user is typing in input/textarea
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        // Only allow Ctrl+S for save in forms
        if (event.ctrlKey && event.key === 's') {
          event.preventDefault();
          // Trigger save event
          const saveEvent = new CustomEvent('hotkey-save');
          document.dispatchEvent(saveEvent);
        }
        return;
      }

      // Navigation hotkeys
      if (event.ctrlKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            navigate('/');
            break;
          case '2':
            event.preventDefault();
            navigate('/products');
            break;
          case '3':
            event.preventDefault();
            navigate('/add-transaction');
            break;
          case '4':
            event.preventDefault();
            navigate('/restock');
            break;
          case '5':
            event.preventDefault();
            navigate('/history');
            break;
          case '6':
            event.preventDefault();
            navigate('/reports');
            break;
          case 'n':
            event.preventDefault();
            // Trigger new product event
            const newEvent = new CustomEvent('hotkey-new-product');
            document.dispatchEvent(newEvent);
            break;
          default:
            break;
        }
      }

      // Escape key
      if (event.key === 'Escape') {
        // Trigger escape event for modals
        const escapeEvent = new CustomEvent('hotkey-escape');
        document.dispatchEvent(escapeEvent);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);
};

export default useHotkeys;
