import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/stores/authStore';
import LoginPage from './features/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './features/dashboard/Dashboard';
import CustomerManagement from './features/customers/CustomerManagement';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/dashboard/*" 
            element={
              isAuthenticated ? (
                <DashboardLayout>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="customers" element={<CustomerManagement />} />
                  </Routes>
                </DashboardLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



