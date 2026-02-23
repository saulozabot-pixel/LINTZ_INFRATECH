export default function SectionHeader({ number, title, subtitle }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-mono font-semibold text-navy-400 bg-navy-100 px-2.5 py-1 rounded-md">
          {String(number).padStart(2, '0')}
        </span>
        <div className="h-px flex-1 bg-navy-100 max-w-[60px]" />
      </div>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
      <div className="section-divider" />
    </div>
  )
}
