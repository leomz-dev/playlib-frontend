"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Componente de Navegación principal mejorado.
 * Detecta automáticamente la sección visible y resalta el botón correspondiente.
 */
export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  // Datos de navegación
  const navItems = [
    { name: "Inicio", sectionId: "hero" },
    { name: "Dashboard", sectionId: "dashboard" },
    { name: "Biblioteca", sectionId: "library" },
  ]

  // Efecto para detectar scroll y sección activa usando Intersection Observer
  useEffect(() => {
    const sections = ["hero", "dashboard", "library"]
    
    // Ocultar navbar en el footer
    const handleScroll = () => {
      const footer = document.querySelector("footer")
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top
        setIsVisible(footerTop >= window.innerHeight)
      }
    }

    // Configurar Intersection Observer para detectar sección activa
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px", // Detecta cuando la sección cruza el centro del viewport
      threshold: 0
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id
          console.log('Section intersecting:', sectionId)
          setActiveSection(sectionId)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observar cada sección
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    // Listener para el scroll (para ocultar navbar en footer)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Ejecutar al montar
    
    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Función para navegar a una sección
  const scrollToSection = (sectionId: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    
    const element = document.getElementById(sectionId)
    if (element) {
      // Scroll directo a la sección
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      
      // Cerrar menú móvil
      setIsMobileMenuOpen(false)
      
      // Actualizar sección activa después de un pequeño delay para que el scroll se complete
      setTimeout(() => {
        setActiveSection(sectionId)
      }, 100)
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* NAVEGACIÓN DE ESCRITORIO */}
      <nav className="fixed bottom-8 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none">
        <div className="backdrop-blur-2xl bg-black/40 border border-red-500/40 rounded-full shadow-[0_0_60px_rgba(220,38,38,0.4)] p-1.5 flex items-center space-x-1 max-w-5xl w-auto pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {navItems.map((item) => (
            <button
              key={item.sectionId}
              onClick={(e) => scrollToSection(item.sectionId, e)}
              className={cn(
                "px-8 py-3.5 rounded-full text-sm font-medium relative overflow-hidden cursor-pointer group",
                "transition-all duration-500 ease-out",
                activeSection === item.sectionId
                  ? [
                      "text-white font-bold tracking-wider",
                      "bg-gradient-to-br from-red-500 via-red-600 to-red-700",
                      "shadow-[0_0_30px_rgba(220,38,38,0.8),0_0_60px_rgba(220,38,38,0.4),inset_0_0_2px_rgba(255,255,255,0.2)]",
                      "scale-105",
                      "before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/20 before:to-transparent before:opacity-0",
                      "hover:before:opacity-100 before:transition-opacity before:duration-300",
                      "after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent",
                      "after:translate-x-[-200%] hover:after:translate-x-[200%] after:transition-transform after:duration-700",
                    ].join(" ")
                  : [
                      "text-gray-300 hover:text-white",
                      "hover:bg-white/10 hover:scale-105",
                      "hover:shadow-lg hover:shadow-white/10",
                      "active:scale-95"
                    ].join(" ")
              )}
              aria-current={activeSection === item.sectionId ? "page" : undefined}
            >
              <span className="relative z-10">{item.name}</span>
              {activeSection === item.sectionId && (
                <span className="absolute inset-0 rounded-full bg-red-500/30 blur-xl animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* NAVEGACIÓN MÓVIL */}
      <div className="fixed bottom-8 left-0 right-0 z-50 flex md:hidden justify-center pointer-events-none">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 backdrop-blur-2xl rounded-full shadow-[0_0_40px_rgba(220,38,38,0.8)] w-16 h-16 flex items-center justify-center border border-red-400/60 text-white pointer-events-auto hover:scale-110 active:scale-95 transition-all duration-300 animate-pulse"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* PANEL DEL MENÚ MÓVIL */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 flex flex-col md:hidden animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative z-10 mt-20 mx-auto w-[85%] max-w-md backdrop-blur-2xl bg-black/60 border border-red-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(220,38,38,0.5)] animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col">
              {navItems.map((item, index) => (
                <div 
                  key={item.sectionId} 
                  className="border-b border-white/10 last:border-b-0"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={(e) => scrollToSection(item.sectionId, e)}
                    className={cn(
                      "w-full py-6 px-8 text-left text-lg font-medium relative overflow-hidden cursor-pointer group",
                      "transition-all duration-500 ease-out",
                      activeSection === item.sectionId
                        ? [
                            "text-white font-bold tracking-wider",
                            "bg-gradient-to-r from-red-500/50 via-red-600/60 to-red-700/50",
                            "border-l-4 border-red-400",
                            "shadow-[inset_0_0_30px_rgba(220,38,38,0.4)]",
                            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/30 before:via-transparent before:to-red-500/30",
                            "before:animate-pulse",
                            "after:absolute after:right-4 after:top-1/2 after:-translate-y-1/2 after:w-2 after:h-2 after:bg-red-400 after:rounded-full after:shadow-[0_0_15px_rgba(220,38,38,0.9)]",
                          ].join(" ")
                        : [
                            "text-gray-300 hover:text-white",
                            "hover:bg-white/10 hover:pl-10",
                            "active:scale-95"
                          ].join(" ")
                    )}
                    aria-current={activeSection === item.sectionId ? "page" : undefined}
                  >
                    <span className="relative z-10">{item.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-linear-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-full shadow-lg shadow-black/30 w-16 h-16 flex items-center justify-center border border-white/30 text-white hover:bg-white/30 hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label="Cerrar menú"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  )
}