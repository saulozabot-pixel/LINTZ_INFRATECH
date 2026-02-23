import { useState, useEffect } from 'react'
import { Menu, X, Shield } from 'lucide-react'

const navLinks = [
  { label: 'Sumário', href: '#sumario' },
  { label: 'Arquitetura', href: '#arquitetura' },
  { label: 'Autenticação', href: '#autenticacao' },
  { label: 'Hierarquia', href: '#hierarquia' },
  { label: 'Segurança', href: '#seguranca' },
  { label: 'Infraestrutura', href: '#infraestrutura' },
  { label: 'Governança', href: '#governanca' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      const offset = 72
      const top = target.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-soft border-b border-navy-100'
          : 'bg-white border-b border-navy-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-navy-900 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-navy-900 leading-tight">Arquitetura de Solução</p>
              <p className="text-xs text-navy-400 leading-tight">Gestão Hierárquica de Informações</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2 text-xs font-medium text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Version Badge */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs text-navy-400 font-mono">v1.0.0</span>
            <span className="badge bg-navy-900 text-white">Confidencial</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md text-navy-600 hover:bg-navy-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-navy-100 shadow-soft">
          <nav className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-2.5 text-sm font-medium text-navy-700 hover:text-navy-900 hover:bg-navy-50 rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 pb-1 border-t border-navy-100 mt-1">
              <span className="badge bg-navy-900 text-white">Confidencial</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
