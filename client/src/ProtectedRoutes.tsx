import { Navigate, useLocation } from 'react-router-dom'
import { isLoggedIn } from './services/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation() 

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}