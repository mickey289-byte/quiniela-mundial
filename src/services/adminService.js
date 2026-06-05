import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export const guardarResultadosReales = async (data) => {
  const ref = doc(db, "resultados", "mundial2026")

  await setDoc(ref, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

export const obtenerResultadosReales = async () => {
  const ref = doc(db, "resultados", "mundial2026")
  const snap = await getDoc(ref)

  if (!snap.exists()) return null

  return snap.data()
}

export const obtenerQuinielasAdmin = async () => {
  const snap = await getDocs(collection(db, "quinielas"))

  return snap.docs.map((documento) => ({
    id: documento.id,
    ...documento.data(),
  }))
}

export const aprobarPagoQuiniela = async (uid) => {
  const ref = doc(db, "quinielas", uid)

  await updateDoc(ref, {
    estado: "aprobada",
    "pago.estado": "aprobado",
    "pago.pagado": true,
    "pago.aprobado": true,
    "pago.aprobadoAt": new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })
}

export const rechazarPagoQuiniela = async (uid) => {
  const ref = doc(db, "quinielas", uid)

  await updateDoc(ref, {
    estado: "rechazada",
    "pago.estado": "rechazado",
    "pago.pagado": false,
    "pago.aprobado": false,
    updatedAt: new Date().toISOString(),
  })
}

export const darDeBajaQuiniela = async (uid) => {
  const ref = doc(db, "quinielas", uid)

  await updateDoc(ref, {
    estado: "baja_por_falta_pago",
    "pago.estado": "vencido",
    "pago.pagado": false,
    "pago.aprobado": false,
    updatedAt: new Date().toISOString(),
  })
}

export const calcularPuntos = (quiniela, resultadosReales) => {
  let puntos = 0
  let aciertosExactos = 0

  Object.keys(resultadosReales.partidos || {}).forEach((partidoId) => {
    const real = resultadosReales.partidos[partidoId]
    const prediccion = quiniela.resultados?.[partidoId]

    if (!real || !prediccion) return

    if (
      real.local === "" ||
      real.visitante === "" ||
      real.local === null ||
      real.visitante === null ||
      real.local === undefined ||
      real.visitante === undefined
    ) {
      return
    }

    if (
      prediccion.local === "" ||
      prediccion.visitante === "" ||
      prediccion.local === null ||
      prediccion.visitante === null ||
      prediccion.local === undefined ||
      prediccion.visitante === undefined
    ) {
      return
    }

    const realLocal = Number(real.local)
    const realVisitante = Number(real.visitante)
    const predLocal = Number(prediccion.local)
    const predVisitante = Number(prediccion.visitante)

    const ganadorReal =
      realLocal > realVisitante
        ? "local"
        : realLocal < realVisitante
        ? "visitante"
        : "empate"

    const ganadorPred =
      predLocal > predVisitante
        ? "local"
        : predLocal < predVisitante
        ? "visitante"
        : "empate"

    if (realLocal === predLocal && realVisitante === predVisitante) {
      puntos += 5
      aciertosExactos += 1
      return
    }

    if (ganadorReal === ganadorPred) {
      puntos += 3
      return
    }

    if (realLocal === predLocal) puntos += 1
    if (realVisitante === predVisitante) puntos += 1
  })

  const finalReal = resultadosReales.final || {}
  const finalUser = quiniela.final || {}

  const finalistasReales = [
    finalReal.finalista1,
    finalReal.finalista2,
  ].filter(Boolean)

  if (finalistasReales.length > 0) {
    if (finalUser.finalista1 && finalistasReales.includes(finalUser.finalista1)) {
      puntos += 10
    }

    if (finalUser.finalista2 && finalistasReales.includes(finalUser.finalista2)) {
      puntos += 10
    }
  }

  const campeonAcertado =
    Boolean(finalReal.campeon) &&
    Boolean(finalUser.campeon) &&
    finalUser.campeon === finalReal.campeon

  if (campeonAcertado) puntos += 30

  return {
    puntos,
    aciertosExactos,
    campeonAcertado,
  }
}

export const recalcularRanking = async () => {
  const resultadosReales = await obtenerResultadosReales()

  if (!resultadosReales) {
    throw new Error("No hay resultados reales guardados")
  }

  const quinielasRef = collection(db, "quinielas")
  const snap = await getDocs(quinielasRef)

  const actualizaciones = snap.docs.map(async (documento) => {
    const quiniela = documento.data()

    if (quiniela.estado !== "aprobada") return

    const calculo = calcularPuntos(quiniela, resultadosReales)

    await updateDoc(doc(db, "quinielas", documento.id), {
      puntos: calculo.puntos,
      aciertosExactos: calculo.aciertosExactos,
      campeonAcertado: calculo.campeonAcertado,
      updatedAt: new Date().toISOString(),
    })
  })

  await Promise.all(actualizaciones)
}

export const obtenerRanking = async () => {
  const q = query(collection(db, "quinielas"), orderBy("puntos", "desc"))
  const snap = await getDocs(q)

  return snap.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((quiniela) => quiniela.estado === "aprobada")
}