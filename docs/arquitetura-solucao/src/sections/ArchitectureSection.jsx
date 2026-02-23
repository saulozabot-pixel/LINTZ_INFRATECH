import { Monitor, Globe, Server, Database, ClipboardList, ArrowDown } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'

const architectureSteps = [
  {
    icon: <Globe className="w-5 h-5" />,
    label: 'Usuário (Web / Mobile)',
    description: 'Consultor acessa via navegador ou aplicativo nativo',
    tag: 'Camada de Apresentação',
    tagColor: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  {
    icon: <Monitor className="w-5 h-5" />,
    label: 'Interface Web Responsiva',
    description: 'SPA com React — renderização dinâmica e navegação fluida',
    tag: 'Frontend',
    tagColor: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
  },
  {
    icon: <Server className="w-5 h-5" />,
    label: 'API Segura',
    description: 'Autenticação JWT · Regras de negócio · Rate limiting · Validação de entrada',
    tag: 'Backend / Lógica de Negócio',
    tagColor: 'bg-navy-100 text-navy-700',
    border: 'border-navy-200',
    bg: 'bg-navy-50',
    highlight: true,
  },
  {
    icon: <Database className="w-5 h-5" />,
    label: 'Banco de Dados Estruturado',
    description: 'Dados isolados por nível hierárquico · Criptografia em repouso · Backups automáticos',
    tag: 'Persistência',
    tagColor: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    label: 'Sistema de Auditoria',
    description: 'Logs imutáveis · Rastreamento de sessões · Relatórios de conformidade',
    tag: 'Governança',
    tagColor: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
]

export default function ArchitectureSection() {
  return (
    <section id="arquitetura" className="py-20 bg-white">
      <div className="section-container">
        <SectionHeader
          number={2}
          title="Arquitetura Geral"
          subtitle="Visão em camadas da estrutura técnica da plataforma"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Diagram */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md mx-auto space-y-0">
              {architectureSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  {/* Card */}
                  <div
                    className={`w-full rounded-xl border ${step.border} ${step.bg} px-5 py-4 shadow-soft ${
                      step.highlight ? 'ring-2 ring-navy-900 ring-offset-2' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          step.highlight ? 'bg-navy-900 text-white' : 'bg-white text-navy-600 border border-navy-100'
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold text-navy-900">{step.label}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${step.tagColor}`}>
                            {step.tag}
                          </span>
                        </div>
                        <p className="text-xs text-navy-500 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {index < architectureSteps.length - 1 && (
                    <div className="flex flex-col items-center py-1 text-navy-300">
                      <div className="w-px h-4 bg-navy-200" />
                      <ArrowDown className="w-4 h-4" />
                      <div className="w-px h-4 bg-navy-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-3">Princípios Arquiteturais</h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-4">
                A arquitetura da plataforma segue o padrão de <strong>separação de responsabilidades em camadas</strong>, 
                onde cada nível possui função bem definida e interfaces de comunicação controladas. Isso garante 
                manutenibilidade, testabilidade e segurança independente por camada.
              </p>
              <p className="text-sm text-navy-600 leading-relaxed">
                A comunicação entre camadas é sempre autenticada e criptografada, impedindo que uma falha em 
                uma camada comprometa as demais. O banco de dados nunca é acessado diretamente pelo frontend — 
                toda operação passa obrigatoriamente pela API.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Separação de Camadas', desc: 'Frontend, API e banco de dados completamente desacoplados' },
                { label: 'API como Gateway Único', desc: 'Toda lógica de negócio e validação centralizada na API' },
                { label: 'Banco Isolado', desc: 'Sem acesso direto externo — apenas via API autenticada' },
                { label: 'Auditoria Transversal', desc: 'Logs gerados em todas as camadas de forma independente' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-navy-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-navy-800">{item.label}</p>
                    <p className="text-xs text-navy-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
