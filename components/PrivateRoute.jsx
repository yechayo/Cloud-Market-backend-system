import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  console.log(token);
  return token ? children : <Navigate to="/login" replace />;
}

