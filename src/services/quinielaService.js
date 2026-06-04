import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export const guardarQuiniela = async (uid, data) => {
  if (!uid) throw new Error("No hay UID de usuario")

  const ref = doc(db, "quinielas", uid)
  await setDoc(ref, data)
}

export const obtenerQuiniela = async (uid) => {
  if (!uid) return null

  const ref = doc(db, "quinielas", uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return snap.data()
  }

  return null
}