import AdminLayout from '@/components/AdminLayout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Questions from '@/pages/Questions';
import Responses from '@/pages/Responses';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';

export default function AppRoutes() {
  // On peut supprimer l'appel à useAuth ici si non utilisé
  // const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public login route */}
      <Route 
        path="/administration" 
        element={
          <Login />
        } 
      />
      
      {/* Protected admin routes */}
      <Route path="/admin" element={
        <PrivateRoute>
          <AdminLayout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="questions" element={<Questions />} />
        <Route path="responses" element={<Responses />} />
      </Route>

      {/* Redirect root to administration */}
      <Route path="/" element={<Navigate to="/administration" replace />} />
      
      {/* Catch all - redirect to administration */}
      <Route path="*" element={<Navigate to="/administration" replace />} />
    </Routes>
  );
}