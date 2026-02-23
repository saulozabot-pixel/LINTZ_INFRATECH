export default function SecurityCard({ icon, title, description, color = 'navy' }) {
  const colorMap = {
    navy: {
      bg: 'bg-navy-50',
      border: 'border-navy-100',
      iconBg: 'bg-navy-900',
      iconText: 'text-white',
    },
    gold: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500',
      iconText: 'text-white',
    },
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-600',
      iconText: 'text-white',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      iconBg: 'bg-blue-600',
      iconText: 'text-white',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      iconBg: 'bg-red-600',
      iconText: 'text-white',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      iconBg: 'bg-purple-600',
      iconText: 'text-white',
    },
  }

  const c = colorMap[color] || colorMap.navy

  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3 shadow-soft hover:shadow-card transition-shadow`}>
      <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
        <span className={c.iconText}>{icon}</span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-navy-900 mb-1">{title}</h4>
        <p className="text-xs text-navy-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
