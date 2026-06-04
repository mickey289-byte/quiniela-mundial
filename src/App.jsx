import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import { AuthProvider } from "./context/AuthContext"
import Quiniela from "./pages/Quiniela";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"
import Admin from "./pages/Admin"
import Ranking from "./pages/Ranking"

function App() {
  return (
    <BrowserRouter>
     <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
              <Route
        path="/quiniela"
        element={
          <ProtectedRoute>
            <Quiniela />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>

<Route path="/ranking" element={<Ranking />} />
      </Routes>
       </AuthProvider>
    </BrowserRouter>
  )
}

export default App