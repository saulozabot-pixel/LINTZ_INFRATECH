import { Settings2, FileSearch, GitBranch, BarChart2, AlertTriangle, Users2 } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'

const governanceItems = [
  {
    icon: <Settings2 className="w-5 h-5" />,
    title: 'Controle Granular de Permissões',
    description:
      'Administradores com nível AAA ou ABC podem configurar permissões específicas por usuário, grupo ou departamento, indo além dos níveis padrão. É possível conceder ou revogar acesso a módulos individuais, relatórios específicos ou conjuntos de dados, com vigência por período determinado.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: <FileSearch className="w-5 h-5" />,
    title: 'Logs de Auditoria Completos',
    description:
      'Cada ação realizada na plataforma gera um registro imutável contendo: identificação do usuário, timestamp com fuso horário, endereço IP, tipo de operação, dados acessados ou modificados e resultado da operação. Logs são armazenados em repositório separado com acesso restrito.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: 'Rastreamento de Alterações',
    description:
      'O sistema mantém histórico completo de versões para dados críticos, permitindo visualizar o estado anterior de qualquer registro, identificar quem realizou cada alteração e reverter modificações indevidas. O rastreamento é automático e não pode ser desativado por nenhum perfil de usuário.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    icon: <BarChart2 className="w-5 h-5" />,
    title: 'Relatórios Administrativos',
    description:
      'Painéis gerenciais oferecem visibilidade em tempo real sobre: usuários ativos, tentativas de acesso não autorizado, volume de operações por período, distribuição de acessos por nível hierárquico e indicadores de conformidade. Relatórios podem ser agendados e exportados automaticamente.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Alertas e Notificações',
    description:
      'O sistema emite alertas automáticos para eventos críticos: múltiplas tentativas de login falhas, acesso fora do horário habitual, exportação de volume incomum de dados, alterações em configurações de segurança e tentativas de acesso a recursos não autorizados.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
  },
  {
    icon: <Users2 className="w-5 h-5" />,
    title: 'Gestão do Ciclo de Vida de Usuários',
    description:
      'Processos formais para criação, modificação e desativação de contas de usuário, com aprovação obrigatória por nível superior. Contas inativas por mais de 30 dias são automaticamente suspensas. Desligamentos de colaboradores acionam revogação imediata de todos os acessos.',
    color: 'text-navy-600',
    bg: 'bg-navy-50',
    border: 'border-navy-100',
  },
]

export default function GovernanceSection() {
  return (
    <section id="governanca" className="py-20 bg-slate-50">
      <div className="section-container">
        <SectionHeader
          number={7}
          title="Governança"
          subtitle="Políticas, controles e processos para gestão responsável da plataforma"
        />

        {/* Intro Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-navy-100 p-6 lg:p-8 shadow-soft">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Modelo de Governança Corporativa</h3>
            <p className="text-sm text-navy-600 leading-relaxed mb-4">
              A governança da plataforma é estruturada em três pilares fundamentais: <strong className="text-navy-800">controle de acesso</strong>, 
              <strong className="text-navy-800"> rastreabilidade</strong> e <strong className="text-navy-800">conformidade</strong>. 
              Esses pilares garantem que a plataforma opere dentro dos limites regulatórios aplicáveis ao setor financeiro, 
              mantendo a integridade e a confidencialidade das informações estratégicas.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed mb-4">
              O modelo adota o princípio de <em>segregação de funções</em>, onde nenhum usuário possui permissão 
              irrestrita sem supervisão. Mesmo o nível ABC está sujeito a auditoria e seus acessos são registrados 
              com o mesmo rigor aplicado aos demais perfis.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed">
              Revisões periódicas de acesso são realizadas trimestralmente, com relatórios entregues à diretoria 
              para validação e ajuste das políticas de segurança conforme a evolução do negócio.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {[
              { label: 'Revisão de Acessos', value: 'Trimestral', icon: '📅' },
              { label: 'Retenção de Logs', value: '5 anos', icon: '🗂️' },
              { label: 'Resposta a Incidentes', value: '< 4 horas', icon: '⚡' },
              { label: 'Treinamento de Equipe', value: 'Semestral', icon: '🎓' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-navy-100 p-4 shadow-soft flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-navy-400 font-medium">{item.label}</p>
                  <p className="text-sm font-bold text-navy-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Governance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {governanceItems.map((item, index) => (
            <div
              key={index}
              className={`rounded-xl border ${item.border} ${item.bg} p-5 shadow-soft`}
            >
              <div className={`mb-3 ${item.color}`}>{item.icon}</div>
              <h4 className="text-sm font-semibold text-navy-900 mb-2">{item.title}</h4>
              <p className="text-xs text-navy-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Closing Statement */}
        <div className="bg-navy-900 rounded-2xl p-6 lg:p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-1 bg-gold-500 rounded-full mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-4">
              Comprometimento com a Excelência Operacional
            </h3>
            <p className="text-sm text-navy-200 leading-relaxed mb-6">
              A Plataforma de Gestão Hierárquica de Informações foi concebida para ser não apenas uma ferramenta 
              tecnológica, mas um instrumento de governança corporativa. Cada decisão arquitetural reflete o 
              compromisso com a segurança, a transparência e a conformidade regulatória exigida pelo mercado 
              financeiro de alta performance.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Segurança', 'Conformidade', 'Rastreabilidade', 'Escalabilidade', 'Governança'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
