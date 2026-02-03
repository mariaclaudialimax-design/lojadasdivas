import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  fallback = <LoadingScreen /> 
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Access Denied</div>;
  }

  return <>{children}</>;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

export default PrivateRoute;
