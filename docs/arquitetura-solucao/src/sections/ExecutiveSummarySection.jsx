import { CheckCircle2, TrendingUp, Users, BarChart3 } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'

const highlights = [
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Segurança em Múltiplas Camadas',
    description:
      'A plataforma implementa proteção em profundidade, combinando autenticação por token, criptografia de dados em trânsito e em repouso, validação de entrada e controle de sessão com expiração automática.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: 'Controle Hierárquico de Acesso',
    description:
      'O sistema adota um modelo de permissões baseado em níveis hierárquicos (A, AA, AAA, ABC), garantindo que cada consultor acesse exclusivamente as informações pertinentes ao seu perfil e responsabilidade.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: 'Arquitetura Escalável',
    description:
      'Projetada para crescimento horizontal e vertical, a infraestrutura suporta aumento de carga sem degradação de desempenho, utilizando serviços em nuvem com balanceamento de carga e auto-scaling.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Governança e Auditoria',
    description:
      'Todas as operações realizadas na plataforma são registradas em logs imutáveis de auditoria, permitindo rastreabilidade completa de acessos, alterações e exportações de dados sensíveis.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
]

export default function ExecutiveSummarySection() {
  return (
    <section id="sumario" className="py-20 bg-slate-50">
      <div className="section-container">
        <SectionHeader
          number={1}
          title="Sumário Executivo"
          subtitle="Visão geral da solução e seus principais pilares estratégicos"
        />

        {/* Overview Text */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-3 space-y-4">
            <p className="text-base text-navy-700 leading-relaxed">
              A <strong className="text-navy-900">Plataforma de Gestão Hierárquica de Informações</strong> é uma solução 
              corporativa desenvolvida para centralizar, organizar e controlar o acesso a dados estratégicos em ambientes 
              de banco de investimentos, onde a confidencialidade e a integridade das informações são requisitos críticos.
            </p>
            <p className="text-base text-navy-600 leading-relaxed">
              A solução foi concebida com base nos princípios de <em>least privilege</em> (menor privilégio), 
              <em> defense in depth</em> (defesa em profundidade) e <em>zero trust</em>, assegurando que cada 
              interação com o sistema seja autenticada, autorizada e auditada de forma independente.
            </p>
            <p className="text-base text-navy-600 leading-relaxed">
              O modelo hierárquico de acesso permite que gestores configurem permissões granulares por nível, 
              garantindo que consultores de diferentes perfis operem dentro de seus limites de responsabilidade, 
              sem comprometer a visibilidade necessária para a tomada de decisão estratégica.
            </p>
          </div>

          {/* Key Numbers */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 content-start">
            {[
              { value: '4', label: 'Níveis Hierárquicos', sub: 'A · AA · AAA · ABC' },
              { value: '100%', label: 'Operações Auditadas', sub: 'Rastreabilidade total' },
              { value: 'TLS', label: 'Criptografia', sub: 'Dados em trânsito' },
              { value: '24/7', label: 'Monitoramento', sub: 'Infraestrutura ativa' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-navy-100 p-4 shadow-soft">
                <p className="text-2xl font-bold text-navy-900 mb-1">{item.value}</p>
                <p className="text-xs font-semibold text-navy-700 leading-tight">{item.label}</p>
                <p className="text-xs text-navy-400 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {highlights.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border ${item.border} ${item.bg} p-6 flex gap-4`}
            >
              <div className={`mt-0.5 flex-shrink-0 ${item.color}`}>{item.icon}</div>
              <div>
                <h3 className="text-sm font-semibold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
