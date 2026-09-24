import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "stream-chat-react/dist/css/v2/index.css";
import './index.css'
import App from './App.jsx';

// import from the react-router
import { BrowserRouter } from 'react-router'

// import the material of the TanStack here
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// create the query client
const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap the App inside the BrowserRouter so that we use any feature of it in anywhere in APP */}
    <BrowserRouter> 
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
  