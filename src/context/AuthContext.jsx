import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "../firebase/firebaseConfig"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)

        const datosUsuario = userSnap.exists() ? userSnap.data() : {}

        setUsuario({
          uid: user.uid,
          email: user.email,
          nombre: datosUsuario.nombre || user.displayName || "",
          rol: datosUsuario.rol || "user",
        })
      } else {
        setUsuario(null)
      }

      setCargando(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ usuario, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}