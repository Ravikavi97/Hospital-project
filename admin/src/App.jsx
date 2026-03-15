import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { can } from './permissions.js';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import DoctorsPage from './pages/DoctorsPage.jsx';
import DepartmentsPage from './pages/DepartmentsPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import AccessDenied from './components/AccessDenied.jsx';

const Protected = ({ children }) => {
  const { auth } = useAuth();
  return auth ? children : <Navigate to="/login" replace />;
};

const Guarded = ({ action, children }) => {
  const { auth } = useAuth();
  return can(auth?.user?.role, action) ? children : <AccessDenied />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected><Layout /></Protected>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="doctors" element={<DoctorsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="users" element={<Guarded action="manageUsers"><UsersPage /></Guarded>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
