import { datosPago } from "../config/datosPago"

function PagoInfo({ folio = "", compacto = false }) {
  const mensajeWhatsApp = folio
    ? `Hola, ya realicé mi pago de la Quiniela Mundial 2026.

Folio: ${folio}

Monto pagado: $200 MXN.

Adjunto mi comprobante para validación.`
    : `Hola, quiero información para participar en la Quiniela Mundial 2026.`

  const whatsappURL = `https://wa.me/${datosPago.whatsapp}?text=${encodeURIComponent(
    mensajeWhatsApp
  )}`

  return (
    <section className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <h2 className="text-2xl font-black mb-4">💳 Datos de Pago</h2>

      <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-4 mb-5">
        <p className="text-sm text-slate-300">Costo de entrada</p>
        <p className="text-3xl font-black text-emerald-400">$200 MXN</p>
      </div>

      {!compacto && (
        <div className="space-y-5">
          <div>
            <h3 className="font-black text-white mb-2">Depósito bancario</h3>
            <p className="text-slate-300 text-sm">
              Banco: {datosPago.deposito.banco}
            </p>
            <p className="text-slate-300 text-sm">
              Titular: {datosPago.deposito.titular}
            </p>
            <p className="text-slate-300 text-sm">
              Cuenta: {datosPago.deposito.cuenta}
            </p>
          </div>

          <div>
            <h3 className="font-black text-white mb-2">Transferencia SPEI</h3>
            <p className="text-slate-300 text-sm">
              Banco: {datosPago.transferencia.banco}
            </p>
            <p className="text-slate-300 text-sm">
              Titular: {datosPago.transferencia.titular}
            </p>
            <p className="text-slate-300 text-sm">
              CLABE: {datosPago.transferencia.clabe}
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-300 text-sm">
            <p className="font-bold mb-1">Fecha límite de pago</p>
            <p>10 de junio de 2026 a las 11:59 PM</p>
          </div>
        </div>
      )}

      {folio && (
        <div className="mt-5 bg-slate-900 border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-slate-400 text-sm">Tu folio</p>
          <p className="text-2xl font-black text-emerald-400 tracking-widest">
            {folio}
          </p>
        </div>
      )}

      <a
        href={whatsappURL}
        target="_blank"
        rel="noreferrer"
        className="mt-5 flex items-center justify-center w-full h-14 rounded-2xl bg-green-500 text-white font-black hover:bg-green-600 transition"
      >
        {folio ? "Enviar comprobante por WhatsApp" : "Contactar por WhatsApp"}
      </a>

      <p className="text-slate-400 text-xs mt-4 text-center">
        Usa tu folio como referencia de pago. Tu quiniela se aprobará cuando el
        administrador valide tu comprobante.
      </p>
    </section>
  )
}

export default PagoInfo