import React from 'react'

/* The onActivate callback of this hook is called whenever the app regains 
focus. This is usefull to refetch data just when the users comes back.
- When the tab is switched back to the app
- The app has been inactive on the screen for a long time (@todo needs implementation)
- The native app was in the background and is getting activated again. */
const useReactivate = (onActivate: () => void) => {
  React.useEffect(() => {
    const listener = () => {
      if (document.visibilityState === 'visible') {
        onActivate()
      }
    }
    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [onActivate])
}

export default useReactivate
