import { createPortal } from 'react-dom'

import { usePortal } from '../../hooks/portal'

export function ModalPortal({ children }) {
  const target = usePortal('modal')
  return createPortal(children, target)
}
