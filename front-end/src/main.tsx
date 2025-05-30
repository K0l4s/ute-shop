import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.tsx'
import { WebSocketProvider } from './context/WebSocketContext.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store={store}>
      <WebSocketProvider>
        <App />
      </WebSocketProvider>
    </Provider>
  </BrowserRouter>
)
