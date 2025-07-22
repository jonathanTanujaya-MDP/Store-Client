import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { TransactionProvider } from './context/TransactionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProductProvider>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </ProductProvider>
    </AuthProvider>
  </StrictMode>,
)
