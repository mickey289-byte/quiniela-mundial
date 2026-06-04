import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando sesión...
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login?modo=login" replace />;
  }

  return children;
}

export default ProtectedRoute;