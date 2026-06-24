import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import RoutePage from './pages/RoutePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/route/:routeId" element={<RoutePage />} />
    </Routes>
  );
}

export default App;
