import { FileText, Calendar, User, Building2 } from 'lucide-react'

export default function HeroSection() {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section
      id="capa"
      className="min-h-screen flex flex-col justify-center bg-white pt-16"
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-navy-900 via-navy-700 to-gold-500" />

      <div className="flex-1 flex flex-col justify-center section-container py-20">
        <div className="max-w-3xl">
          {/* Document type label */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-6 h-6 bg-navy-900 rounded flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold text-navy-500 uppercase tracking-widest">
              Documento de Arquitetura de Solução
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-navy-950 leading-tight mb-6">
            Plataforma de{' '}
            <span className="text-navy-700">Gestão Hierárquica</span>{' '}
            <br className="hidden lg:block" />
            de Informações
          </h1>

          {/* Description */}
          <p className="text-lg text-navy-500 leading-relaxed mb-12 max-w-2xl">
            Este documento descreve a arquitetura técnica e funcional da plataforma de gestão hierárquica de informações, 
            desenvolvida para atender às necessidades de controle de acesso, segurança e governança de dados em 
            ambientes corporativos de alta complexidade.
          </p>

          {/* Divider */}
          <div className="w-16 h-0.5 bg-gold-500 mb-12" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetaCard
              icon={<Calendar className="w-4 h-4" />}
              label="Data de Emissão"
              value={today}
            />
            <MetaCard
              icon={<FileText className="w-4 h-4" />}
              label="Versão"
              value="1.0.0 — Inicial"
            />
            <MetaCard
              icon={<User className="w-4 h-4" />}
              label="Classificação"
              value="Confidencial"
              highlight
            />
            <MetaCard
              icon={<Building2 className="w-4 h-4" />}
              label="Destinatário"
              value="Consultores Autorizados"
            />
          </div>
        </div>
      </div>

      {/* Bottom section indicator */}
      <div className="section-container pb-10">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-navy-100" />
          <span className="text-xs text-navy-300 font-mono">INÍCIO DO DOCUMENTO</span>
          <div className="h-px flex-1 bg-navy-100" />
        </div>
      </div>
    </section>
  )
}

function MetaCard({ icon, label, value, highlight = false }) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight
          ? 'bg-navy-900 border-navy-800 text-white'
          : 'bg-slate-50 border-navy-100 text-navy-900'
      }`}
    >
      <div className={`mb-2 ${highlight ? 'text-navy-300' : 'text-navy-400'}`}>
        {icon}
      </div>
      <p className={`text-xs mb-1 ${highlight ? 'text-navy-300' : 'text-navy-400'}`}>{label}</p>
      <p className={`text-sm font-semibold leading-tight ${highlight ? 'text-white' : 'text-navy-900'}`}>
        {value}
      </p>
    </div>
  )
}
