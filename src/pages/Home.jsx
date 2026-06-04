import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { logoutUser } from "../services/authService"
import PagoInfo from "../components/PagoInfo"

function Home() {
  const { usuario } = useAuth()
  const handleLogout = async () => {
  try {
    await logoutUser()
  } catch (error) {
    console.error(error)
  }
}

  return (
    
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[url('/mundial-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <h1 className="text-xl font-black tracking-wide">
            Quiniela<span className="text-emerald-400">Mickey</span>
          </h1>

          <button className="hidden md:block px-5 py-2 rounded-full border border-white/20 text-sm hover:bg-white/10 transition">
            Mundial 2026
          </button>

          {usuario ? (
<div className="flex items-center gap-3">
  <div className="hidden sm:block text-right">
    <p className="text-xs text-slate-400">Sesión iniciada</p>
    <p className="text-sm font-bold text-emerald-400 max-w-[180px] truncate">
      {usuario.displayName || usuario.email}
    </p>
  </div>

  <Link
    to="/quiniela"
    className="px-5 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition"
  >
    Mi quiniela
  </Link>

  <button
    onClick={handleLogout}
    className="px-5 py-3 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition"
  >
    Salir
  </button>
</div>
          ) : (
            <Link
              to="/login?modo=login"
              className="px-5 py-3 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-6 min-h-[calc(100vh-88px)] flex items-center">
          <div className="max-w-3xl">
            <span className="inline-flex mb-6 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm">
              Quiniela by Mickey · Mundial 2026
            </span>

            <h2 className="text-5xl md:text-7xl font-black leading-tight">
              Predice los partidos más importantes del mundial
            </h2>

            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl">
              Registra tus marcadores, predice la gran final y compite contra
              otros participantes por el primer lugar.
            </p>

            {usuario && (
              <div className="mt-8 rounded-3xl bg-white/10 border border-emerald-400/20 backdrop-blur-md p-6 max-w-xl">
                <p className="text-sm text-slate-300 mb-1">Perfil activo</p>
                <h3 className="text-2xl font-black text-emerald-400">
                  {usuario.displayName || "Participante"}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{usuario.email}</p>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/quiniela"
                    className="px-6 py-3 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition text-center"
                  >
                    Ver mi quiniela
                  </Link>

                  <Link
                    to="/ranking"
                    className="px-6 py-3 rounded-2xl bg-white/10 border border-white/15 font-semibold hover:bg-white/15 transition text-center"
                  >
                    Ver ranking
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              {usuario ? (
                <Link
                  to="/quiniela"
                  className="px-8 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition text-center"
                >
                  Ir a mi quiniela
                </Link>
              ) : (
                <Link
                  to="/login?modo=registro"
                  className="px-8 py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition text-center"
                >
                  Entrar a la quiniela
                </Link>
              )}

              <Link
                to="/ranking"
                className="px-8 py-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm font-semibold hover:bg-white/15 transition text-center"
              >
                Ver ranking
              </Link>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl">
              <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
                <p className="text-3xl font-black text-emerald-400">20</p>
                <p className="text-sm text-slate-300 mt-1">Partidos</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
                <p className="text-3xl font-black text-emerald-400">1</p>
                <p className="text-sm text-slate-300 mt-1">Final</p>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md p-5">
                <p className="text-3xl font-black text-emerald-400">Auto</p>
                <p className="text-sm text-slate-300 mt-1">Ranking</p>
              </div>
            </div>
          </div>
        </div>


   

            </section>

      <section className="bg-slate-900 py-20 px-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">
              💰 Participa en la Quiniela Mundial 2026
            </h2>

            <p className="text-slate-400 max-w-2xl mx-auto">
              Completa tu quiniela, realiza tu pago y envía tu comprobante para
              que tu participación sea validada.
            </p>
          </div>

          <PagoInfo />
        </div>
      </section>


       


      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-8">
            <h3 className="text-2xl font-black mb-3">
              Predicciones únicas
            </h3>
            <p className="text-slate-400">
              Cada participante guarda sus resultados una sola vez. Después de
              confirmar, la quiniela queda bloqueada.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-8">
            <h3 className="text-2xl font-black mb-3">
              Puntuación automática
            </h3>
            <p className="text-slate-400">
              El sistema compara los pronósticos con los resultados reales y
              calcula los puntos de cada jugador.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-8">
            <h3 className="text-2xl font-black mb-3">Ranking en vivo</h3>
            <p className="text-slate-400">
              Conforme se capturan los resultados, la tabla de posiciones se
              actualiza para mostrar quién va ganando.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home