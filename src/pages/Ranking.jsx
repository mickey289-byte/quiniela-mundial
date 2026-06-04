import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { obtenerRanking } from "../services/adminService"

function Ranking() {
  const [ranking, setRanking] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarRanking = async () => {
      try {
        const data = await obtenerRanking()
        setRanking(data)
      } catch (error) {
        console.error("Error al cargar ranking:", error)
      } finally {
        setCargando(false)
      }
    }

    cargarRanking()
  }, [])

  if (cargando) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Cargando ranking...
      </main>
    )
  }

return (
  <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
    <div className="fixed inset-0 bg-[url('/mundial-bg.jpg')] bg-cover bg-center opacity-20" />
    <div className="fixed inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950" />
    <div className="fixed -top-32 -left-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
    <div className="fixed bottom-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

    <div className="relative max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-10">
        <Link to="/" className="text-slate-300 hover:text-white transition">
          ← Volver
        </Link>

        <Link
          to="/quiniela"
          className="bg-emerald-400 text-slate-950 px-5 py-2 rounded-full font-black hover:bg-emerald-300 transition shadow-lg shadow-emerald-400/20"
        >
          Mi Quiniela
        </Link>
      </div>

      <section className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 px-5 py-2 rounded-full font-bold mb-5">
          🏆 Mundial 2026
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight">
          Ranking General
        </h1>

        <p className="text-slate-300 mt-4 text-lg">
          La tabla de los mejores pronósticos rumbo a la gloria.
        </p>
      </section>

      {ranking.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center backdrop-blur-xl">
          <p className="text-slate-300">
            Todavía no hay quinielas registradas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ranking.map((item, index) => {
            const medalla =
              index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⚽"

            return (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl p-5 md:p-6 ${
                  index === 0
                    ? "bg-yellow-400/10 border-yellow-300/30 shadow-lg shadow-yellow-400/10"
                    : index === 1
                    ? "bg-slate-300/10 border-slate-300/20"
                    : index === 2
                    ? "bg-orange-400/10 border-orange-300/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="absolute right-6 top-4 text-6xl opacity-10">
                  {medalla}
                </div>

                <div className="grid md:grid-cols-[90px_1fr_140px_140px_140px] gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{medalla}</span>
                    <span className="text-2xl font-black text-emerald-300">
                      #{index + 1}
                    </span>
                  </div>

                  <div>
                    <p className="font-black text-xl">
                      {item.usuario?.nombre || "Usuario"}
                    </p>
                    <p className="text-sm text-slate-400">
                      {item.usuario?.email || "Sin correo"}
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      Puntos
                    </p>
                    <p className="text-3xl font-black text-emerald-300">
                      {item.puntos || 0}
                    </p>
                  </div>

                  <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 text-center">
                    <p className="text-xs text-slate-500 font-bold uppercase">
                      Exactos
                    </p>
                    <p className="text-2xl font-black">
                      {item.aciertosExactos || 0}
                    </p>
                  </div>

                  <div className="text-center">
                    {item.campeonAcertado ? (
                      <span className="inline-flex bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-black">
                        Campeón ✅
                      </span>
                    ) : (
                      <span className="inline-flex bg-white/10 border border-white/10 text-slate-400 px-4 py-2 rounded-full text-sm font-black">
                        Pendiente
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  </main>
)
}

export default Ranking