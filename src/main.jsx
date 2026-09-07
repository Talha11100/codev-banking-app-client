import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import 'aos/dist/aos.css';
import App from './App.jsx'
import AppProvider from './context/AppProvider';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
