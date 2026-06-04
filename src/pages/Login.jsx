import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [modo, setModo] = useState("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const modoUrl = searchParams.get("modo");

    if (modoUrl === "registro") {
      setModo("registro");
    } else {
      setModo("login");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      if (modo === "registro") {
        await registerUser({
          nombre,
          email,
          password,
        });
      } else {
        await loginUser({
          email,
          password,
        });
      }

      navigate("/quiniela");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/email-already-in-use") {
        setError("Ese correo ya está registrado. Inicia sesión.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Ocurrió un error. Intenta nuevamente.");
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[url('/mundial-bg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-slate-950/80" />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-emerald-950/40" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-block mb-6 text-sm text-slate-300 hover:text-emerald-300 transition"
        >
          ← Volver al inicio
        </Link>

        <div className="rounded-3xl bg-white/[0.06] border border-white/10 backdrop-blur-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-black text-center">
            Quiniela<span className="text-emerald-400">Pro</span>
          </h1>

          <p className="mt-3 text-center text-slate-300">
            {modo === "registro"
              ? "Crea tu cuenta para guardar tu quiniela"
              : "Inicia sesión para continuar"}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-white/10 p-1">
            <button
              type="button"
              onClick={() => setModo("login")}
              className={`py-3 rounded-xl font-bold transition ${
                modo === "login"
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => setModo("registro")}
              className={`py-3 rounded-xl font-bold transition ${
                modo === "registro"
                  ? "bg-emerald-400 text-slate-950"
                  : "text-slate-300 hover:bg-white/10"
              }`}
            >
              Registro
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {modo === "registro" && (
              <div>
                <label className="block mb-2 text-sm font-semibold text-slate-300">
                  Nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-emerald-400 transition"
                />
              </div>
            )}

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-300">
                Correo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@email.com"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-emerald-400 transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-slate-300">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/10 outline-none focus:border-emerald-400 transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-4 rounded-2xl bg-emerald-400 text-slate-950 font-black hover:bg-emerald-300 transition disabled:opacity-60"
            >
              {cargando
                ? "Cargando..."
                : modo === "registro"
                ? "Crear cuenta"
                : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Login;