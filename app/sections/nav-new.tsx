"use client"

import { useState, useEffect, useCallback } from "react"
import { Home, LayoutDashboard, Library, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

// Tipos
type NavItem = {
  name: string;
  icon: React.ReactNode;
  sectionId: string;
};

/**
 * Componente de Navegación principal.
 * Barra de navegación inferior con acceso a las secciones principales.
 */
export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Datos de navegación
  const navItems: NavItem[] = [
    { 
      name: "Inicio", 
      icon: <Home className="h-5 w-5" />,
      sectionId: "hero"
    },
    { 
      name: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" />,
      sectionId: "dashboard"
    },
    { 
      name: "Biblioteca", 
      icon: <Library className="h-5 w-5" />,
      sectionId: "biblioteca"
    },
  ]

  // Función para desplazarse a una sección
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
      setIsMobileMenuOpen(false)
    }
  }, [])

  // Efecto para manejar el scroll y la visibilidad
  useEffect(() => {
    const handleScroll = () => {
      // Actualizar visibilidad del navbar
      const footer = document.querySelector("footer")
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top
        const windowHeight = window.innerHeight
        setIsVisible(footerTop >= windowHeight)
      }

      // Detectar sección activa
      const sections = navItems.map(item => item.sectionId)
      const scrollPosition = window.scrollY + 100
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    // Ejecutar al cargar
    handleScroll()
    
    // Agregar event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Limpiar
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [navItems])

  if (!isVisible) return null

  // Renderizar item de navegación
  const renderNavItem = (item: NavItem, isMobile = false) => {
    const isActive = activeSection === item.sectionId
    const mobileClasses = isMobile 
      ? 'flex-col py-2 w-full items-center justify-center'
      : 'flex-row px-5 py-2.5 items-center space-x-2'
    
    return (
      <button
        key={item.sectionId}
        onClick={() => scrollToSection(item.sectionId)}
        className={cn(
          'flex text-sm font-medium rounded-xl transition-all duration-300',
          isMobile ? 'text-center' : 'text-left',
          isActive
            ? 'text-white bg-white/20 backdrop-blur-md shadow-lg shadow-blue-500/20'
            : 'text-gray-700 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:text-blue-300',
          mobileClasses
        )}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className={cn(
          'flex items-center justify-center',
          isMobile ? 'p-2 rounded-full' : ''
        )}>
          {item.icon}
        </span>
        <span className={cn(isMobile ? 'text-xs mt-1' : '')}>
          {item.name}
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Barra de navegación móvil */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="relative">
          {/* Fondo con efecto de vidrio líquido */}
          <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/50 backdrop-blur-xl border-t border-white/20 dark:border-gray-700/50 shadow-2xl shadow-black/10" />
          
          <div className="relative flex justify-between items-center h-16 px-4">
            {navItems.map(item => renderNavItem(item, true))}
          </div>
        </div>
      </div>

      {/* Barra de navegación de escritorio */}
      <nav className="hidden md:flex fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="relative">
          {/* Fondo con efecto de vidrio líquido */}
          <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-black/10" />
          
          <div className="relative px-6 py-3">
            <div className="flex items-center space-x-2">
              {navItems.map(item => renderNavItem(item))}
            </div>
          </div>
        </div>
      </nav>

      {/* Botón de Hamburguesa */}
      <div className="fixed bottom-6 left-0 right-0 z-50 flex md:hidden justify-center">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="bg-white/20 backdrop-blur-xl rounded-full shadow-2xl shadow-black/20 w-16 h-16 flex items-center justify-center border border-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-105"
          aria-label="Abrir menú"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Panel del Menú Desplegable */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col md:hidden">
          {/* Overlay con efecto de vidrio líquido */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Contenedor del menú con efecto de vidrio líquido */}
          <div className="relative z-10 mt-auto mx-auto w-full max-w-2xl bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-2xl border-t border-white/20 rounded-t-3xl overflow-hidden transition-transform duration-300 transform translate-y-0">
            <div className="p-6">
              <div className="flex flex-col space-y-4">
                {navItems.map(item => (
                  <button
                    key={item.sectionId}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 w-full text-left ${
                      activeSection === item.sectionId
                        ? 'bg-white/20 text-white shadow-lg shadow-blue-500/20'
                        : 'text-gray-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className={`p-2 rounded-lg ${activeSection === item.sectionId ? 'bg-white/20' : 'bg-white/5'}`}>
                      {item.icon}
                    </span>
                    <span className="text-lg font-medium">{item.name}</span>
                  </button>
                ))}
              </div>

              {/* Botón de Cierre del menú móvil */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-6 mx-auto bg-white/20 backdrop-blur-xl rounded-full shadow-2xl shadow-black/20 w-14 h-14 flex items-center justify-center border border-white/20 text-white transition-all duration-300 hover:bg-white/30 hover:scale-105"
                aria-label="Cerrar menú"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}