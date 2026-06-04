import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function AdminRoute({ children }) {
  const { usuario, cargando } = useAuth()



  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando...
      </main>
    )
  }

  if (!usuario) {
    return <Navigate to="/login?modo=login" replace />
  }

  if (usuario.rol !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute

