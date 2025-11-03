import { useEffect, useRef } from 'react'
import { initToolbar } from '@21st-extension/toolbar'

const TOOLBAR_FLAG = '__toolbarInitialized'

export const useToolbar = () => {
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!import.meta.env.DEV || initializedRef.current) {
      return
    }

    if (typeof window !== 'undefined' && window[TOOLBAR_FLAG]) {
      return
    }

    const stagewiseConfig = {
      plugins: [],
    }

    initToolbar(stagewiseConfig)
    initializedRef.current = true

    if (typeof window !== 'undefined') {
      window[TOOLBAR_FLAG] = true
    }
  }, [])
}
