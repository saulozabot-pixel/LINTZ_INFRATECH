import { LogIn, ShieldCheck, Key, Layers, CheckCircle2, XCircle, ArrowDown, ArrowRight } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'

const flowSteps = [
  {
    icon: <LogIn className="w-5 h-5" />,
    label: 'Login',
    description: 'Usuário insere credenciais (e-mail + senha)',
    step: '01',
    color: 'border-blue-200 bg-blue-50',
    iconBg: 'bg-blue-600',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: 'Validação de Credenciais',
    description: 'Verificação de hash da senha e status da conta',
    step: '02',
    color: 'border-indigo-200 bg-indigo-50',
    iconBg: 'bg-indigo-600',
  },
  {
    icon: <Key className="w-5 h-5" />,
    label: 'Geração de Token Seguro',
    description: 'Emissão de JWT assinado com expiração configurável',
    step: '03',
    color: 'border-purple-200 bg-purple-50',
    iconBg: 'bg-purple-600',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    label: 'Verificação de Nível Hierárquico',
    description: 'Identificação do perfil: A / AA / AAA / ABC',
    step: '04',
    color: 'border-navy-200 bg-navy-50',
    iconBg: 'bg-navy-900',
    highlight: true,
  },
]

export default function AuthFlowSection() {
  return (
    <section id="autenticacao" className="py-20 bg-slate-50">
      <div className="section-container">
        <SectionHeader
          number={3}
          title="Fluxo de Autenticação"
          subtitle="Processo de verificação de identidade e autorização hierárquica"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Flow Diagram */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  {/* Step Card */}
                  <div
                    className={`w-full rounded-xl border ${step.color} px-5 py-4 shadow-soft ${
                      step.highlight ? 'ring-2 ring-navy-900 ring-offset-2' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg ${step.iconBg} flex items-center justify-center flex-shrink-0 text-white`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono text-navy-400">{step.step}</span>
                          <p className="text-sm font-semibold text-navy-900">{step.label}</p>
                        </div>
                        <p className="text-xs text-navy-500">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  {index < flowSteps.length - 1 && (
                    <div className="flex flex-col items-center py-1 text-navy-300">
                      <div className="w-px h-4 bg-navy-200" />
                      <ArrowDown className="w-4 h-4" />
                      <div className="w-px h-4 bg-navy-200" />
                    </div>
                  )}
                </div>
              ))}

              {/* Decision: Acesso Concedido / Negado */}
              <div className="flex flex-col items-center py-1 text-navy-300">
                <div className="w-px h-4 bg-navy-200" />
                <ArrowDown className="w-4 h-4" />
                <div className="w-px h-4 bg-navy-200" />
              </div>

              <div className="w-full grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center shadow-soft">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-emerald-800">Acesso Concedido</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Sessão iniciada</p>
                </div>
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center shadow-soft">
                  <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-red-800">Acesso Negado</p>
                  <p className="text-xs text-red-500 mt-0.5">Tentativa registrada</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-3">Mecanismos de Segurança</h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-4">
                O fluxo de autenticação foi projetado para ser resistente a ataques de força bruta, 
                replay de tokens e interceptação de credenciais. Cada etapa é independente e falha 
                de forma segura, sem expor informações sobre o motivo da rejeição ao usuário final.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Bloqueio por Tentativas',
                  desc: 'Após 5 tentativas falhas consecutivas, a conta é temporariamente bloqueada e o evento é registrado.',
                  icon: '🔒',
                },
                {
                  title: 'Token com Expiração',
                  desc: 'Tokens JWT possuem tempo de vida configurável (padrão: 8h) e são invalidados no logout.',
                  icon: '⏱️',
                },
                {
                  title: 'Refresh Token Seguro',
                  desc: 'Renovação de sessão via refresh token armazenado em cookie HttpOnly, inacessível via JavaScript.',
                  icon: '🔄',
                },
                {
                  title: 'Auditoria de Acesso',
                  desc: 'Cada login bem-sucedido ou falho é registrado com IP, timestamp e agente do usuário.',
                  icon: '📋',
                },
                {
                  title: 'Verificação Hierárquica',
                  desc: 'O nível de acesso é verificado a cada requisição, não apenas no login inicial.',
                  icon: '🏛️',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-navy-100 shadow-soft">
                  <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-navy-800">{item.title}</p>
                    <p className="text-xs text-navy-500 leading-relaxed mt-0.5">{item.desc}</p>
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
