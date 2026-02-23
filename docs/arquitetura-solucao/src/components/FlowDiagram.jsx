import { ArrowDown } from 'lucide-react'

export default function FlowDiagram({ steps }) {
  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {steps.map((step, index) => (
        <div key={index} className="w-full flex flex-col items-center">
          {/* Box */}
          <div
            className={`w-full rounded-xl px-5 py-4 text-center shadow-soft border transition-all ${
              step.highlight
                ? 'bg-navy-900 border-navy-800 text-white'
                : step.accent
                ? 'bg-gold-500/10 border-gold-500/30 text-navy-900'
                : 'bg-white border-navy-200 text-navy-800'
            }`}
          >
            {step.icon && (
              <div className={`flex justify-center mb-2 ${step.highlight ? 'text-white' : 'text-navy-500'}`}>
                {step.icon}
              </div>
            )}
            <p className={`text-sm font-semibold leading-tight ${step.highlight ? 'text-white' : 'text-navy-900'}`}>
              {step.label}
            </p>
            {step.description && (
              <p className={`text-xs mt-1 leading-relaxed ${step.highlight ? 'text-navy-200' : 'text-navy-500'}`}>
                {step.description}
              </p>
            )}
          </div>

          {/* Arrow */}
          {index < steps.length - 1 && (
            <div className="flex flex-col items-center my-1 text-navy-300">
              <div className="w-px h-3 bg-navy-200" />
              <ArrowDown className="w-4 h-4" />
              <div className="w-px h-3 bg-navy-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
