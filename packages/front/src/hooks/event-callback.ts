import { useRef, useLayoutEffect, useCallback } from 'react'

export function useEventCallback<T extends (...args: never[]) => unknown>(fn: T) {
  const ref = useRef(fn)

  useLayoutEffect(() => {
    ref.current = fn
  })

  return useCallback((...args) => ref.current.apply(undefined, args), [])
}
