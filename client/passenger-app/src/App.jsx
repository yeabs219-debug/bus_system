import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import RoutePage from './pages/RoutePage';
import ScanPage from './pages/ScanPage';
import TicketPage from './pages/TicketPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/route/:routeId" element={<RoutePage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route path="/ticket" element={<TicketPage />} />
    </Routes>
  );
}

export default App;