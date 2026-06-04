import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  guardarResultadosReales,
  obtenerResultadosReales,
  recalcularRanking,
  obtenerQuinielasAdmin,
aprobarPagoQuiniela,
rechazarPagoQuiniela,
darDeBajaQuiniela,
} from "../services/adminService"
import { partidos, partidosPlanos, equipos } from "../data/mundial2026"

function Admin() {
  const [resultados, setResultados] = useState({})
  const [final, setFinal] = useState({
    finalista1: "",
    finalista2: "",
    campeon: "",
  })

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [quinielas, setQuinielas] = useState([])
const [cargandoQuinielas, setCargandoQuinielas] = useState(true)
const [actualizandoPago, setActualizandoPago] = useState(null)

  useEffect(() => {
    const cargarResultados = async () => {
      try {
        const data = await obtenerResultadosReales()

        if (data) {
          setResultados(data.partidos || {})
          setFinal(
            data.final || {
              finalista1: "",
              finalista2: "",
              campeon: "",
            }
          )
        }
      } catch (error) {
        console.error(error)
        setMensaje("Error al cargar resultados reales")
      } finally {
        setCargando(false)
      }
    }

    cargarResultados()
  }, [])

  const cambiarResultado = (index, campo, valor) => {
    setResultados({
      ...resultados,
      [index]: {
        ...resultados[index],
        [campo]: valor,
      },
    })
  }

  const cargarQuinielas = async () => {
  try {
    setCargandoQuinielas(true)
    const data = await obtenerQuinielasAdmin()
    setQuinielas(data)
  } catch (error) {
    console.error(error)
    setMensaje("Error al cargar quinielas")
  } finally {
    setCargandoQuinielas(false)
  }
}

useEffect(() => {
  cargarQuinielas()
}, [])

const aprobarPago = async (uid) => {
  try {
    setActualizandoPago(uid)
    await aprobarPagoQuiniela(uid)
    await cargarQuinielas()
    setMensaje("Pago aprobado correctamente")
  } catch (error) {
    console.error(error)
    setMensaje("Error al aprobar pago")
  } finally {
    setActualizandoPago(null)
  }
}

const rechazarPago = async (uid) => {
  try {
    setActualizandoPago(uid)
    await rechazarPagoQuiniela(uid)
    await cargarQuinielas()
    setMensaje("Pago rechazado")
  } catch (error) {
    console.error(error)
    setMensaje("Error al rechazar pago")
  } finally {
    setActualizandoPago(null)
  }
}

const darDeBaja = async (uid) => {
  try {
    setActualizandoPago(uid)
    await darDeBajaQuiniela(uid)
    await cargarQuinielas()
    setMensaje("Quiniela dada de baja")
  } catch (error) {
    console.error(error)
    setMensaje("Error al dar de baja")
  } finally {
    setActualizandoPago(null)
  }
}

  const guardarResultados = async () => {
    try {
      setGuardando(true)
      setMensaje("")

      await guardarResultadosReales({
        partidos: resultados,
        final,
      })

      await recalcularRanking()

      setMensaje("Resultados guardados y ranking actualizado")
    } catch (error) {
      console.error(error)
      setMensaje("Error al guardar o recalcular ranking")
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando panel admin...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="fixed inset-0 bg-[url('/mundial-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950" />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="text-slate-300 hover:text-white">
            ← Volver
          </Link>

          <Link
            to="/ranking"
            className="bg-white/10 border border-white/10 px-4 py-2 rounded-full text-slate-200 hover:bg-white/20"
          >
            Ver Ranking
          </Link>
        </div>

        <div className="mb-10">
          <p className="text-emerald-400 font-bold mb-2">Panel Admin</p>

          <h1 className="text-5xl font-black">Resultados Reales</h1>

          <p className="text-slate-400 mt-3">
            Captura los marcadores reales para actualizar los puntos automáticamente.
          </p>

          {mensaje && (
            <div className="mt-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-2xl px-5 py-4">
              {mensaje}
            </div>
          )}
        </div>

        <section className="mb-10 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
  <h2 className="text-2xl font-black mb-5">💳 Panel de Pagos</h2>

  {cargandoQuinielas ? (
    <p className="text-slate-400">Cargando quinielas...</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-400 border-b border-white/10">
            <th className="py-3 pr-4">Folio</th>
            <th className="py-3 pr-4">Nombre</th>
            <th className="py-3 pr-4">Correo</th>
            <th className="py-3 pr-4">Método</th>
            <th className="py-3 pr-4">Estado</th>
            <th className="py-3 pr-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {quinielas.map((q) => (
            <tr key={q.uid} className="border-b border-white/10">
              <td className="py-4 pr-4 font-bold text-emerald-400">
                {q.folio || "Sin folio"}
              </td>

              <td className="py-4 pr-4">
                {q.usuario?.nombre || "Sin nombre"}
              </td>

              <td className="py-4 pr-4 text-slate-400">
                {q.usuario?.email || "Sin correo"}
              </td>

              <td className="py-4 pr-4 capitalize">
                {q.pago?.metodo || "Sin método"}
              </td>

              <td className="py-4 pr-4">
                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs">
                  {q.estado || q.pago?.estado || "pendiente"}
                </span>
              </td>

              <td className="py-4 pr-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => aprobarPago(q.uid)}
                    disabled={actualizandoPago === q.uid}
                    className="rounded-xl bg-emerald-400 px-3 py-2 text-xs font-black text-slate-950 disabled:opacity-50"
                  >
                    Aprobar
                  </button>

                  <button
                    onClick={() => rechazarPago(q.uid)}
                    disabled={actualizandoPago === q.uid}
                    className="rounded-xl bg-yellow-400 px-3 py-2 text-xs font-black text-slate-950 disabled:opacity-50"
                  >
                    Rechazar
                  </button>

                  <button
                    onClick={() => darDeBaja(q.uid)}
                    disabled={actualizandoPago === q.uid}
                    className="rounded-xl bg-red-500 px-3 py-2 text-xs font-black text-white disabled:opacity-50"
                  >
                    Baja
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            {partidos.map((grupo) => (
              <section key={grupo.seccion}>
                <h2 className="text-2xl font-black mb-4">
                  ⚽ {grupo.seccion}
                </h2>

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
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-xl"
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
                              value={resultados[index]?.local ?? ""}
                              onChange={(e) =>
                                cambiarResultado(index, "local", e.target.value)
                              }
                              className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 text-center text-2xl font-black"
                            />
                          </div>

                          <span className="text-slate-500 font-black">VS</span>

                          <div>
                            <div className="flex items-center justify-end gap-3 mb-3">
                              <span className="font-bold text-lg">
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
                              value={resultados[index]?.visitante ?? ""}
                              onChange={(e) =>
                                cambiarResultado(
                                  index,
                                  "visitante",
                                  e.target.value
                                )
                              }
                              className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 text-center text-2xl font-black"
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
              <h2 className="text-2xl font-black mb-5">Final Real</h2>

              <div className="space-y-4">
                <select
                  value={final.finalista1}
                  onChange={(e) =>
                    setFinal({ ...final, finalista1: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-4 text-white"
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
                  value={final.finalista2}
                  onChange={(e) =>
                    setFinal({ ...final, finalista2: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-4 text-white"
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
                  value={final.campeon}
                  onChange={(e) =>
                    setFinal({ ...final, campeon: e.target.value })
                  }
                  className="w-full h-14 rounded-2xl bg-slate-900 border border-white/10 px-4 text-white"
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

            <button
              onClick={guardarResultados}
              disabled={guardando}
              className="w-full h-16 rounded-3xl bg-emerald-400 text-slate-950 font-black text-lg hover:bg-emerald-300 transition disabled:opacity-50"
            >
              {guardando ? "Actualizando..." : "Guardar y recalcular ranking"}
            </button>


          </aside>
        </div>
      </div>
    </main>
  )
}

export default Admin