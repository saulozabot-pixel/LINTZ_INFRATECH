import { Lock, Shield, KeyRound, CheckSquare, ClipboardList, HardDrive } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'
import SecurityCard from '../components/SecurityCard'

const securityItems = [
  {
    icon: <Lock className="w-5 h-5" />,
    title: 'HTTPS / TLS 1.3',
    description:
      'Toda comunicação entre cliente e servidor é criptografada com TLS 1.3, o protocolo mais moderno e seguro disponível. Certificados SSL são renovados automaticamente e monitorados continuamente.',
    color: 'blue',
  },
  {
    icon: <KeyRound className="w-5 h-5" />,
    title: 'Autenticação por Token JWT',
    description:
      'Tokens JSON Web Token (JWT) assinados com algoritmo RS256 garantem autenticidade e integridade das sessões. Cada token carrega o nível hierárquico do usuário e expira automaticamente.',
    color: 'purple',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Hash de Senha (bcrypt)',
    description:
      'Senhas nunca são armazenadas em texto puro. O algoritmo bcrypt com fator de custo adaptativo é utilizado, tornando ataques de força bruta computacionalmente inviáveis mesmo com hardware moderno.',
    color: 'navy',
  },
  {
    icon: <CheckSquare className="w-5 h-5" />,
    title: 'Validação de Dados',
    description:
      'Todas as entradas de dados são validadas e sanitizadas no servidor, independentemente da validação no frontend. Proteção contra SQL Injection, XSS e CSRF é aplicada em todas as rotas da API.',
    color: 'green',
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: 'Registro de Auditoria',
    description:
      'Logs imutáveis registram todas as operações críticas: logins, acessos a dados sensíveis, exportações, alterações de configuração e tentativas de acesso não autorizado, com timestamp e identificação do usuário.',
    color: 'gold',
  },
  {
    icon: <HardDrive className="w-5 h-5" />,
    title: 'Backup Automatizado',
    description:
      'Backups incrementais são realizados a cada 6 horas e backups completos diariamente. Os dados são replicados em múltiplas regiões geográficas com retenção de 90 dias e testes de restauração mensais.',
    color: 'red',
  },
]

export default function SecuritySection() {
  return (
    <section id="seguranca" className="py-20 bg-slate-50">
      <div className="section-container">
        <SectionHeader
          number={5}
          title="Segurança da Informação"
          subtitle="Camadas de proteção aplicadas em toda a plataforma"
        />

        {/* Intro */}
        <div className="bg-navy-900 rounded-2xl p-6 lg:p-8 mb-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-3">Abordagem de Segurança em Profundidade</h3>
              <p className="text-sm text-navy-200 leading-relaxed">
                A segurança da plataforma é implementada em múltiplas camadas independentes, seguindo o princípio 
                de <em>Defense in Depth</em>. Isso significa que a falha de um mecanismo de proteção não compromete 
                os demais. Cada camada — da rede ao banco de dados — possui seus próprios controles de segurança, 
                monitoramento e alertas.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1 lg:gap-2">
              {[
                { label: 'Camadas de Proteção', value: '6+' },
                { label: 'Conformidade', value: 'LGPD' },
                { label: 'Uptime Alvo', value: '99.9%' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 text-center lg:text-left lg:flex lg:items-center lg:gap-3">
                  <p className="text-xl font-bold text-white lg:text-2xl">{stat.value}</p>
                  <p className="text-xs text-navy-300 mt-0.5 lg:mt-0">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {securityItems.map((item, index) => (
            <SecurityCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
              color={item.color}
            />
          ))}
        </div>

        {/* Compliance Banner */}
        <div className="rounded-xl border border-navy-100 bg-white p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-navy-900 mb-1">Conformidade com LGPD e Boas Práticas de Mercado</h4>
              <p className="text-xs text-navy-500 leading-relaxed">
                A plataforma foi desenvolvida em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), 
                adotando princípios de minimização de dados, finalidade, transparência e segurança. Relatórios de impacto 
                à proteção de dados (RIPD) são gerados periodicamente para avaliação de riscos.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['LGPD', 'ISO 27001', 'OWASP Top 10'].map((tag) => (
                <span key={tag} className="badge bg-navy-100 text-navy-700 text-xs">
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
