import { Crown, Star, Shield, User } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'

const levels = [
  {
    level: 'A',
    name: 'Acesso Básico',
    icon: <User className="w-5 h-5" />,
    description: 'Perfil destinado a consultores em fase inicial ou com atuação restrita. Permite visualização de informações públicas internas, relatórios consolidados sem dados sensíveis e acesso ao painel pessoal de atividades.',
    permissions: [
      'Visualizar relatórios consolidados',
      'Acessar painel pessoal',
      'Consultar base de conhecimento pública',
      'Registrar atividades e anotações próprias',
    ],
    restrictions: [
      'Sem acesso a dados de clientes',
      'Sem exportação de relatórios',
      'Sem acesso a painéis administrativos',
    ],
    color: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      badge: 'bg-slate-200 text-slate-700',
      icon: 'bg-slate-600',
      dot: 'bg-slate-400',
    },
  },
  {
    level: 'AA',
    name: 'Acesso Intermediário',
    icon: <Star className="w-5 h-5" />,
    description: 'Perfil para consultores sênior com responsabilidade sobre carteiras de clientes. Permite acesso a dados operacionais, relatórios detalhados e funcionalidades de análise e acompanhamento de portfólio.',
    permissions: [
      'Todas as permissões do nível A',
      'Acesso a dados de clientes vinculados',
      'Exportação de relatórios em PDF',
      'Visualização de histórico de operações',
      'Acesso a ferramentas de análise',
    ],
    restrictions: [
      'Sem acesso a dados de outros consultores',
      'Sem permissão de configuração do sistema',
    ],
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      icon: 'bg-blue-600',
      dot: 'bg-blue-400',
    },
  },
  {
    level: 'AAA',
    name: 'Acesso Administrativo',
    icon: <Shield className="w-5 h-5" />,
    description: 'Perfil para gestores e líderes de equipe. Permite supervisão de consultores subordinados, acesso a relatórios gerenciais, configuração de permissões de níveis inferiores e visualização de logs de auditoria.',
    permissions: [
      'Todas as permissões do nível AA',
      'Supervisão de consultores da equipe',
      'Acesso a relatórios gerenciais',
      'Configuração de permissões (A e AA)',
      'Visualização de logs de auditoria',
      'Exportação de dados em múltiplos formatos',
    ],
    restrictions: [
      'Sem acesso a configurações globais do sistema',
      'Sem permissão de criação de usuários AAA/ABC',
    ],
    color: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
      icon: 'bg-purple-700',
      dot: 'bg-purple-400',
    },
  },
  {
    level: 'ABC',
    name: 'Acesso Estratégico / Supervisão',
    icon: <Crown className="w-5 h-5" />,
    description: 'Perfil de mais alto nível, destinado à diretoria e supervisores estratégicos. Acesso irrestrito a todas as funcionalidades da plataforma, incluindo configurações globais, criação de usuários e relatórios executivos.',
    permissions: [
      'Acesso irrestrito a todas as funcionalidades',
      'Configuração global do sistema',
      'Criação e gestão de todos os perfis',
      'Acesso a relatórios executivos e estratégicos',
      'Controle de políticas de segurança',
      'Visualização de todos os logs e auditorias',
      'Exportação e integração com sistemas externos',
    ],
    restrictions: [],
    color: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      icon: 'bg-amber-600',
      dot: 'bg-amber-400',
    },
  },
]

export default function HierarchySection() {
  return (
    <section id="hierarquia" className="py-20 bg-white">
      <div className="section-container">
        <SectionHeader
          number={4}
          title="Modelo Hierárquico de Acesso"
          subtitle="Estrutura de permissões por nível de perfil de usuário"
        />

        {/* Summary Table */}
        <div className="mb-12 overflow-x-auto rounded-xl border border-navy-100 shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-900 text-white">
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Nível</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Descrição</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Perfil Típico</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell">Escopo de Dados</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {[
                { level: 'A', desc: 'Acesso básico', profile: 'Consultor Júnior', scope: 'Dados públicos internos' },
                { level: 'AA', desc: 'Acesso intermediário', profile: 'Consultor Sênior', scope: 'Carteira própria de clientes' },
                { level: 'AAA', desc: 'Acesso administrativo', profile: 'Gestor / Líder de Equipe', scope: 'Equipe e relatórios gerenciais' },
                { level: 'ABC', desc: 'Acesso estratégico / supervisão', profile: 'Diretor / Supervisor', scope: 'Irrestrito — toda a plataforma' },
              ].map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono ${levels[i].color.badge}`}>
                      {row.level}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-navy-700 font-medium">{row.desc}</td>
                  <td className="px-5 py-3.5 text-navy-500 hidden md:table-cell">{row.profile}</td>
                  <td className="px-5 py-3.5 text-navy-500 hidden lg:table-cell">{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detailed Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {levels.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border ${item.color.border} ${item.color.bg} p-6 shadow-soft`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${item.color.icon} flex items-center justify-center text-white flex-shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${item.color.badge}`}>
                      {item.level}
                    </span>
                    <h3 className="text-sm font-semibold text-navy-900">{item.name}</h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-navy-600 leading-relaxed mb-4">{item.description}</p>

              {/* Permissions */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-navy-700 mb-2 uppercase tracking-wide">Permissões</p>
                <ul className="space-y-1">
                  {item.permissions.map((perm, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-navy-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color.dot} mt-1.5 flex-shrink-0`} />
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Restrictions */}
              {item.restrictions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-navy-400 mb-2 uppercase tracking-wide">Restrições</p>
                  <ul className="space-y-1">
                    {item.restrictions.map((rest, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-navy-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-navy-300 mt-1.5 flex-shrink-0" />
                        {rest}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.restrictions.length === 0 && (
                <div className="mt-2">
                  <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    ✦ Sem restrições — Acesso total
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
