import { useCallback, useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

export const useSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const checkMobile = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobile)

      // Fecha a sidebar automaticamente quando mudar para mobile
      if (mobile) {
        setIsSidebarOpen(false)
      } else {
        // Abre automaticamente em desktop
        setIsSidebarOpen(true)
      }
    }

    // Verifica no mount
    checkMobile()

    // Adiciona listener para resize
    window.addEventListener('resize', checkMobile, { passive: true })

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const closeSidebar = useCallback(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [isMobile])

  return {
    isSidebarOpen,
    isMobile,
    toggleSidebar,
    closeSidebar,
  }
}
