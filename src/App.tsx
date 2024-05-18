import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './Pages/Index';
// import AboutPage from './AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/index" element={<Index />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
