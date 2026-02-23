import { Cloud, Server, Database, ShieldAlert, Activity, ArrowDown, ArrowRight } from 'lucide-react'
import SectionHeader from '../components/SectionHeader'

const infraLayers = [
  {
    icon: <Cloud className="w-5 h-5" />,
    label: 'Nuvem / VPS',
    description: 'Provedor de infraestrutura gerenciada com SLA de 99.9% de disponibilidade',
    tag: 'Infraestrutura Base',
    tagColor: 'bg-sky-100 text-sky-700',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    iconBg: 'bg-sky-600',
  },
  {
    icon: <Server className="w-5 h-5" />,
    label: 'Servidor de Aplicação',
    description: 'Node.js / Runtime containerizado com Docker — escalável horizontalmente',
    tag: 'Camada de Aplicação',
    tagColor: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-200',
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-600',
  },
  {
    icon: <Database className="w-5 h-5" />,
    label: 'Banco de Dados Isolado',
    description: 'Instância dedicada sem exposição pública — acesso exclusivo via rede privada',
    tag: 'Persistência',
    tagColor: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-600',
    highlight: true,
  },
  {
    icon: <ShieldAlert className="w-5 h-5" />,
    label: 'Firewall / Proxy Reverso',
    description: 'Nginx + WAF — filtragem de tráfego malicioso, rate limiting e proteção DDoS',
    tag: 'Segurança de Rede',
    tagColor: 'bg-red-100 text-red-700',
    border: 'border-red-200',
    bg: 'bg-red-50',
    iconBg: 'bg-red-600',
  },
  {
    icon: <Activity className="w-5 h-5" />,
    label: 'Monitoramento',
    description: 'Alertas em tempo real, métricas de performance e dashboards operacionais 24/7',
    tag: 'Observabilidade',
    tagColor: 'bg-amber-100 text-amber-700',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-600',
  },
]

const specs = [
  { label: 'Ambiente', value: 'Cloud (AWS / GCP / Azure)' },
  { label: 'Containerização', value: 'Docker + Kubernetes' },
  { label: 'CI/CD', value: 'Pipeline automatizado' },
  { label: 'Banco de Dados', value: 'PostgreSQL (gerenciado)' },
  { label: 'Cache', value: 'Redis — sessões e rate limit' },
  { label: 'CDN', value: 'Assets estáticos distribuídos' },
  { label: 'Backup', value: 'Incremental 6h / Full diário' },
  { label: 'Monitoramento', value: 'Prometheus + Grafana' },
]

export default function InfrastructureSection() {
  return (
    <section id="infraestrutura" className="py-20 bg-white">
      <div className="section-container">
        <SectionHeader
          number={6}
          title="Infraestrutura"
          subtitle="Topologia de implantação e componentes de suporte operacional"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Infra Diagram */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-sm mx-auto">
              {infraLayers.map((layer, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div
                    className={`w-full rounded-xl border ${layer.border} ${layer.bg} px-5 py-4 shadow-soft ${
                      layer.highlight ? 'ring-2 ring-emerald-500 ring-offset-2' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg ${layer.iconBg} flex items-center justify-center flex-shrink-0 text-white`}>
                        {layer.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-semibold text-navy-900">{layer.label}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${layer.tagColor}`}>
                            {layer.tag}
                          </span>
                        </div>
                        <p className="text-xs text-navy-500 leading-relaxed">{layer.description}</p>
                      </div>
                    </div>
                  </div>

                  {index < infraLayers.length - 1 && (
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

          {/* Specs & Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-navy-900 mb-3">Especificações Técnicas</h3>
              <p className="text-sm text-navy-600 leading-relaxed mb-5">
                A infraestrutura é provisionada como código (IaC), garantindo reprodutibilidade, 
                versionamento e auditabilidade de todas as configurações de ambiente. Ambientes de 
                desenvolvimento, homologação e produção são completamente isolados.
              </p>

              {/* Specs Table */}
              <div className="rounded-xl border border-navy-100 overflow-hidden shadow-soft">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-navy-50">
                    {specs.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-2.5 text-xs font-semibold text-navy-500 w-2/5">{spec.label}</td>
                        <td className="px-4 py-2.5 text-xs text-navy-800 font-medium">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-semibold text-emerald-800">Alta Disponibilidade</p>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                A arquitetura é projetada para eliminar pontos únicos de falha (SPOF). 
                Balanceamento de carga distribui requisições entre múltiplas instâncias, 
                e o banco de dados opera em modo de replicação com failover automático em 
                menos de 30 segundos em caso de falha do nó primário.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'SLA Alvo', value: '99.9%' },
                  { label: 'Failover', value: '< 30s' },
                  { label: 'RTO', value: '< 1h' },
                ].map((m, i) => (
                  <div key={i} className="bg-white rounded-lg p-2.5 text-center border border-emerald-100">
                    <p className="text-sm font-bold text-emerald-700">{m.value}</p>
                    <p className="text-xs text-emerald-600">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
