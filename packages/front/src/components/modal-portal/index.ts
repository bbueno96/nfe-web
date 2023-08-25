import { createPortal } from 'react-dom'

import { usePortal } from '../../hooks/portal'

export function ModalPortal({ children }) {
  const target = usePortal('modal')
  if (target) return createPortal(children, target)
  else return null
}
