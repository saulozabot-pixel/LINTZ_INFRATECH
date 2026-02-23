import { Shield, Lock, FileText } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Arquitetura de Solução</p>
                <p className="text-xs text-navy-300 leading-tight">Gestão Hierárquica de Informações</p>
              </div>
            </div>
            <p className="text-xs text-navy-400 leading-relaxed">
              Documento técnico de arquitetura elaborado para apresentação institucional a consultores e parceiros estratégicos de banco de investimentos.
            </p>
          </div>

          {/* Seções */}
          <div>
            <p className="text-xs font-semibold text-navy-300 uppercase tracking-widest mb-4">Seções do Documento</p>
            <ul className="space-y-2 text-xs text-navy-400">
              <li>01 — Sumário Executivo</li>
              <li>02 — Arquitetura Geral</li>
              <li>03 — Fluxo de Autenticação</li>
              <li>04 — Modelo Hierárquico</li>
              <li>05 — Segurança da Informação</li>
              <li>06 — Infraestrutura</li>
              <li>07 — Governança</li>
            </ul>
          </div>

          {/* Classificação */}
          <div>
            <p className="text-xs font-semibold text-navy-300 uppercase tracking-widest mb-4">Classificação do Documento</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Confidencial</p>
                  <p className="text-xs text-navy-400">Uso restrito a destinatários autorizados</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">Versão 1.0.0</p>
                  <p className="text-xs text-navy-400">Documento sujeito a revisões periódicas</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-500">
            © {year} Plataforma de Gestão Hierárquica de Informações. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-navy-500">Documento Técnico Interno</span>
            <span className="w-1 h-1 rounded-full bg-navy-600" />
            <span className="text-xs text-navy-500">Uso Corporativo</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
