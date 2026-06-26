import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/DashboardLayout.jsx';
import OverviewPage from './pages/OverviewPage';
import RoutesPage from  './pages/RoutesPage'
import FleetPage from './pages/FleetPage.jsx';
import TripsPage from './pages/TripsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/fleet" element={<FleetPage />} />
        <Route path="/trips" element={<TripsPage />} />

      </Route>
    </Routes>
  );
}

export default App;