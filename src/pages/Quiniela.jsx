import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  guardarQuiniela as guardarQuinielaFirestore,
  obtenerQuiniela,
} from "../services/quinielaService"
import {
  partidos,
  partidosPlanos,
  equipos,
  sistemaPuntos,
} from "../data/mundial2026"
import { datosPago } from "../config/datosPago"
import PagoInfo from "../components/PagoInfo"

function Quiniela() {
  const { usuario } = useAuth()

  const [resultados, setResultados] = useState({})
  const [final, setFinal] = useState({
    finalista1: "",
    finalista2: "",
    campeon: "",
  })

  const [cargandoQuiniela, setCargandoQuiniela] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [bloqueada, setBloqueada] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [metodoPago, setMetodoPago] = useState("")
  const [mostrarModalPago, setMostrarModalPago] = useState(false)
  const [folioGenerado, setFolioGenerado] = useState("")

  useEffect(() => {
    const cargarQuiniela = async () => {
      if (!usuario?.uid) return

      try {
        const quinielaGuardada = await obtenerQuiniela(usuario.uid)

        if (quinielaGuardada) {
          setResultados(quinielaGuardada.resultados || {})
          setFinal(
            quinielaGuardada.final || {
              finalista1: "",
              finalista2: "",
              campeon: "",
            }
          )

          setMetodoPago(quinielaGuardada.pago?.metodo || "")
          setBloqueada(quinielaGuardada.bloqueada === true)

if (quinielaGuardada.folio) {
  setFolioGenerado(quinielaGuardada.folio)

  setMensaje(
    `Quiniela enviada. Tu folio es ${quinielaGuardada.folio}`
  )


           
          } else {
            setMensaje("Quiniela guardada y bloqueada")
          }
        }
      } catch (error) {
        console.error("Error al cargar quiniela:", error)
        setMensaje("Error al cargar tu quiniela")
      } finally {
        setCargandoQuiniela(false)
      }
    }

    cargarQuiniela()
  }, [usuario])

  const cambiarResultado = (index, campo, valor) => {
    if (bloqueada) return

    setResultados((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [campo]: valor,
      },
    }))
  }

  const cambiarFinal = (campo, valor) => {
    if (bloqueada) return

    setFinal((prev) => ({
      ...prev,
      [campo]: valor,
    }))
  }

  const generarFolio = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `QNL-2026-${random}`
  }

  const rellenarDemo = () => {
    if (bloqueada) return

    const demo = {}

    partidosPlanos.forEach((_, index) => {
      demo[index] = {
        local: Math.floor(Math.random() * 4).toString(),
        visitante: Math.floor(Math.random() * 4).toString(),
      }
    })

    setResultados(demo)

    setFinal({
      finalista1: equipos[0] || "",
      finalista2: equipos[1] || "",
      campeon: equipos[0] || "",
    })

    setMetodoPago("transferencia")
    setMensaje("Datos demo cargados para prueba")
  }

  const completados = Object.values(resultados).filter(
    (r) =>
      r.local !== undefined &&
      r.local !== "" &&
      r.visitante !== undefined &&
      r.visitante !== ""
  ).length

  const totalPartidos = partidosPlanos.length
  const progreso =
    totalPartidos > 0 ? Math.round((completados / totalPartidos) * 100) : 0

  const finalCompleta =
    final.finalista1 !== "" && final.finalista2 !== "" && final.campeon !== ""

  const finalValida =
    final.finalista1 !== final.finalista2 &&
    (final.campeon === final.finalista1 || final.campeon === final.finalista2)

  const quinielaCompleta =
    completados === totalPartidos && finalCompleta && finalValida

  const guardar = async () => {
    if (!usuario?.uid) {
      setMensaje("Debes iniciar sesión para guardar tu quiniela")
      return
    }

    if (bloqueada) {
      setMensaje("Tu quiniela ya está guardada y bloqueada")
      return
    }

    if (!finalCompleta || completados !== totalPartidos) {
      setMensaje("Completa todos los partidos y la predicción final")
      return
    }

    if (final.finalista1 === final.finalista2) {
      setMensaje("Los finalistas no pueden ser el mismo equipo")
      return
    }

    if (final.campeon !== final.finalista1 && final.campeon !== final.finalista2) {
      setMensaje("El campeón debe ser uno de tus finalistas")
      return
    }

    if (!metodoPago) {
      setMensaje("Selecciona un método de pago")
      return
    }

    try {
      setGuardando(true)

      const folio = generarFolio()
      setFolioGenerado(folio)

      const datos = {
        uid: usuario.uid,
        folio,
        estado: "pendiente_pago",

        usuario: {
          uid: usuario.uid,
          nombre: usuario.displayName || usuario.nombre || "",
          email: usuario.email || "",
        },

        resultados,
        final,

        pago: {
          metodo: metodoPago,
          referencia: folio,
          estado: "pendiente",
          pagado: false,
          aprobado: false,
          fechaLimite: "2026-06-10T23:59:00",
        },

        bloqueada: true,
        puntos: 0,
        aciertosExactos: 0,
        campeonAcertado: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await guardarQuinielaFirestore(usuario.uid, datos)

      setBloqueada(true)
      setMensaje(`Quiniela enviada. Tu folio es ${folio}`)
    } catch (error) {
      console.error("Error al guardar quiniela:", error)
      setMensaje("Error al guardar la quiniela")
    } finally {
      setGuardando(false)
    }
  }

  if (cargandoQuiniela) {
    return (
      <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center">
        <p className="text-slate-400">Cargando quiniela...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('/mundial-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="text-slate-300 hover:text-white transition">
            ← Volver
          </Link>

          <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full text-emerald-300">
            Progreso {progreso}%
          </div>
        </div>

        <div className="mb-10">
          <p className="text-emerald-400 font-bold mb-2">Mundial 2026</p>

          <h1 className="text-5xl font-black">Completa tu Quiniela</h1>

          <p className="text-slate-400 mt-3">
            Predice los resultados, finalistas y campeón del torneo.
          </p>

          {!bloqueada && (
            <button
              type="button"
              onClick={rellenarDemo}
              className="mt-5 rounded-2xl bg-slate-800 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 transition"
            >
              Rellenar demo
            </button>
          )}

          {mensaje && (
            <div
              className={`mt-5 rounded-2xl px-5 py-4 border ${
                bloqueada
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"
              }`}
            >
              {mensaje}
            </div>
          )}

          <div className="w-full h-3 bg-slate-800 rounded-full mt-6 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            {partidos.map((grupo) => (
              <section key={grupo.seccion}>
                <h2 className="text-2xl font-black mb-4">⚽ {grupo.seccion}</h2>

                <div className="grid md:grid-cols-2 gap-5">
                  {grupo.juegos.map((juego) => {
                    const [local, visitante] = juego.equipos

                    const index = partidosPlanos.findIndex(
                      ([l, v]) =>
                        l.nombre === local.nombre &&
                        v.nombre === visitante.nombre
                    )

                    return (
                      <div
                        key={`${juego.grupo}-${local.nombre}-${visitante.nombre}`}
                        className={`bg-white/5 border rounded-3xl p-5 backdrop-blur-xl ${
                          bloqueada
                            ? "border-emerald-500/20"
                            : "border-white/10"
                        }`}
                      >
                        <p className="text-xs text-slate-500 mb-2">
                          Partido {index + 1}
                        </p>

                        <div className="mb-4 text-xs text-slate-400 space-y-1">
                          <p>
                            {juego.fecha} · {juego.hora}
                          </p>
                          <p>{juego.grupo}</p>
                          <p>{juego.estadio}</p>
                        </div>

                        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                          <div>
                            <div className="flex items-center gap-3 mb-3">
                              <img
                                src={`https://flagcdn.com/w40/${local.codigo}.png`}
                                alt={local.nombre}
                                className="w-8 h-6 rounded shadow"
                              />

                              <span className="font-bold text-lg">
                                {local.nombre}
                              </span>
                            </div>

                            <input
                              type="number"
                              min="0"
                              disabled={bloqueada}
                              value={resultados[index]?.local ?? ""}
                              onChange={(e) =>
                                cambiarResultado(
                                  index,
                                  "local",
                                  e.target.value
                                )
                              }
                              className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 text-center text-2xl font-black disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                          </div>

                          <span className="text-slate-500 font-black">VS</span>

                          <div>
                            <div className="flex items-center justify-end gap-3 mb-3">
                              <span className="font-bold text-lg text-right">
                                {visitante.nombre}
                              </span>

                              <img
                                src={`https://flagcdn.com/w40/${visitante.codigo}.png`}
                                alt={visitante.nombre}
                                className="w-8 h-6 rounded shadow"
                              />
                            </div>

                            <input
                              type="number"
                              min="0"
                              disabled={bloqueada}
                              value={resultados[index]?.visitante ?? ""}
                              onChange={(e) =>
                                cambiarResultado(
                                  index,
                                  "visitante",
                                  e.target.value
                                )
                              }
                              className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 text-center text-2xl font-black disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black mb-5">🏆 Sistema de Puntos</h2>

              <div className="space-y-3">
                {sistemaPuntos.map((item) => (
                  <div
                    key={item.concepto}
                    className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0"
                  >
                    <span className="text-slate-300">{item.concepto}</span>
                    <span className="font-black text-emerald-400">
                      {item.puntos}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black mb-5">Predicción Final</h2>

              <div className="space-y-4">
                <select
                  disabled={bloqueada}
                  value={final.finalista1}
                  onChange={(e) => cambiarFinal("finalista1", e.target.value)}
                  className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-4 text-white disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900 text-white">
                    Finalista 1
                  </option>

                  {equipos.map((equipo) => (
                    <option
                      key={equipo}
                      value={equipo}
                      className="bg-slate-900 text-white"
                    >
                      {equipo}
                    </option>
                  ))}
                </select>

                <select
                  disabled={bloqueada}
                  value={final.finalista2}
                  onChange={(e) => cambiarFinal("finalista2", e.target.value)}
                  className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-4 text-white disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900 text-white">
                    Finalista 2
                  </option>

                  {equipos.map((equipo) => (
                    <option
                      key={equipo}
                      value={equipo}
                      className="bg-slate-900 text-white"
                    >
                      {equipo}
                    </option>
                  ))}
                </select>

                <select
                  disabled={bloqueada}
                  value={final.campeon}
                  onChange={(e) => cambiarFinal("campeon", e.target.value)}
                  className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-4 text-white disabled:opacity-60"
                >
                  <option value="" className="bg-slate-900 text-white">
                    Campeón
                  </option>

                  {equipos.map((equipo) => (
                    <option
                      key={equipo}
                      value={equipo}
                      className="bg-slate-900 text-white"
                    >
                      {equipo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-2xl font-black mb-5">💳 Método de Pago</h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="deposito"
                    checked={metodoPago === "deposito"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    disabled={bloqueada}
                  />
                  <span>Depósito Bancario</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={metodoPago === "transferencia"}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    disabled={bloqueada}
                  />
                  <span>Transferencia SPEI</span>
                </label>
              </div>

              <div className="mt-5 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-300 text-sm">
                <p className="font-bold mb-2">⚠️ Fecha límite de pago</p>

                <p>10 de junio de 2026 a las 11:59 PM</p>

                <p className="mt-2">
                  Si el pago no se registra antes de la fecha límite, la
                  quiniela será dada de baja automáticamente del sistema.
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarModalPago(true)}
              disabled={bloqueada || guardando || !quinielaCompleta || !metodoPago}
              className="w-full h-16 rounded-3xl bg-emerald-400 text-slate-950 font-black text-lg hover:bg-emerald-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bloqueada
                ? "Quiniela Bloqueada"
                : guardando
                ? "Guardando..."
                : !quinielaCompleta
                ? "Completa la quiniela"
                : "Guardar Quiniela"}
            </button>

            {!quinielaCompleta && !bloqueada && (
              <p className="text-sm text-slate-500 text-center">
                Completa los {totalPartidos} partidos, finalistas y campeón para
                poder guardar.
              </p>
            )}
          </aside>
        </div>
      </div>
      

      {mostrarModalPago && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto px-4 py-6">
             <div className="min-h-full flex items-start md:items-center justify-center">
                 <div className="w-full max-w-2xl bg-slate-950 border border-white/10 rounded-3xl p-5 md:p-8 shadow-2xl my-6">
            <h2 className="text-3xl font-black text-white mb-4">
              Confirmar envío de quiniela
            </h2>

            <p className="text-slate-300 mb-6">
              Antes de guardar tu quiniela, confirma tu método de pago. Recuerda
              que después de enviarla ya no podrás modificar tus resultados.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <label
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  metodoPago === "deposito"
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name="metodoPagoModal"
                  value="deposito"
                  checked={metodoPago === "deposito"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mb-3"
                />
                <h3 className="font-black text-lg">Depósito</h3>
                <p className="text-sm text-slate-400">
                  Pago mediante depósito bancario.
                </p>
              </label>

              <label
                className={`border rounded-2xl p-5 cursor-pointer transition ${
                  metodoPago === "transferencia"
                    ? "border-emerald-400 bg-emerald-400/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name="metodoPagoModal"
                  value="transferencia"
                  checked={metodoPago === "transferencia"}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mb-3"
                />
                <h3 className="font-black text-lg">Transferencia</h3>
                <p className="text-sm text-slate-400">
                  Pago por transferencia bancaria SPEI.
                </p>
              </label>
            </div>

            <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 mb-6">
  <p className="font-black text-white mb-2">
    📌 Tu folio / referencia de pago
  </p>

  <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-4 text-center mb-4">
    <p className="text-3xl font-black text-emerald-400 tracking-widest">
      {folioGenerado || "Se generará al guardar"}
    </p>
  </div>

  {metodoPago === "deposito" && (
    <div className="text-slate-300 text-sm space-y-2">
      <p className="font-bold text-white">Datos para depósito:</p>
      <p>Banco: {datosPago.deposito.banco}</p>
      <p>Nombre: {datosPago.deposito.titular}</p>
      <p>Número de cuenta: {datosPago.deposito.cuenta}</p>
      <p>Referencia: {folioGenerado || "Tu folio"}</p>
    </div>
  )}

  {metodoPago === "transferencia" && (
    <div className="text-slate-300 text-sm space-y-2">
      <p className="font-bold text-white">Datos para transferencia:</p>
      <p>Banco: {datosPago.transferencia.banco}</p>
      <p>Nombre: {datosPago.transferencia.titular}</p>
      <p>CLABE: {datosPago.transferencia.clabe}</p>
      <p>Concepto / Referencia: {folioGenerado || "Tu folio"}</p>
    </div>
  )}

<div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
  <p className="font-black text-emerald-400 mb-3">
    📲 Envío de comprobante
  </p>

  <p className="text-slate-300 text-sm mb-3">
    Una vez realizado el pago de <strong>$200 MXN</strong>,
    envía tu comprobante por WhatsApp junto con tu folio.
  </p>

  <div className="bg-slate-900 rounded-xl p-4 border border-white/10">
    <p className="text-sm text-slate-400 mb-2">
      Número de contacto:
    </p>

    <p className="text-xl font-black text-white">
      +52 33 40494049
    </p>
  </div>
</div>
</div>



            <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-2xl p-5 mb-6">
              <p className="font-black mb-2">⚠️ Fecha límite de pago</p>
              <p>
                La fecha límite de pago es el{" "}
                <strong>10/06/2026 a las 11:59 PM</strong>.
              </p>
              <p className="mt-2">
                Si no se registra el pago antes de esa fecha, tu quiniela será
                dada de baja del sistema.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalPago(false)}
                className="w-full h-14 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!metodoPago || guardando}
onClick={() => {
  if (folioGenerado) {
    setMostrarModalPago(false)
  } else {
    guardar()
  }
}}
                className="w-full h-14 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {folioGenerado ? "Entendido" : guardando ? "Guardando..." : "Confirmar y guardar"}
              </button>
            </div>
          </div>
        </div>
        </div>

        
      )}
    </main>
  )
}

export default Quiniela