import { useEffect, useRef } from 'react'

export function useInterval(callback: VoidFunction, delay: number) {
  const callbacRef = useRef<VoidFunction>()

  useEffect(() => {
    callbacRef.current = callback
  })

  useEffect(() => {
    if (!delay) {
      return () => {
        /* */
      }
    }

    const interval = setInterval(() => {
      callbacRef?.current()
    }, delay)

    return () => clearInterval(interval)
  }, [delay])
}
