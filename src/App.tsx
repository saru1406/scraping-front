import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Pages/Index';
import ChatPage from './Pages/chat';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/index" element={<Index />} />
        <Route path="/" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
