import React, { useCallback } from 'react'
import { Transition } from 'react-transition-group'

import classNames from 'classnames'

import { ModalState } from '../../App'
import { ModalPortal } from '../modal-portal'
import { Alert } from './Alert'
import { Confirm } from './Confirm'
import { Prompt } from './Prompt'

interface ModalProps {
  type?: 'alert' | 'confirm' | 'prompt'
  title?: string
  message?: string
  value?: string
  show: boolean
  setModal: React.Dispatch<React.SetStateAction<ModalState>>
}

export function Modal({ message, title, type, show, value, setModal }: ModalProps) {
  const closeModal = useCallback(
    action =>
      setModal(prev => {
        const { callback, ...state } = prev

        if (prev.type === 'prompt' && action !== 'close' && callback) {
          callback(prev.value)
        } else if (['confirm', 'alert'].includes(prev.type) && callback) {
          const hasSubmitted = action === 'submit'
          callback(hasSubmitted)
        }

        return { ...state, show: false }
      }),
    [setModal],
  )

  const setValue = useCallback(newValue => setModal(prev => ({ ...prev, value: newValue })), [setModal])

  return (
    <ModalPortal>
      <Transition in={show} timeout={300}>
        {status => (
          <>
            <div
              className={classNames('modal fade', { show: status === 'entered' })}
              style={{ display: status === 'exited' ? 'none' : 'block' }}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog modal-dialog-centered" role="document">
                {type === 'alert' && <Alert message={message} closeModal={closeModal} />}
                {type === 'confirm' && <Confirm message={message} closeModal={closeModal} />}
                {type === 'prompt' && (
                  <Prompt message={message} title={title} value={value} setValue={setValue} closeModal={closeModal} />
                )}
              </div>
            </div>

            {status !== 'exited' && (
              <div className={classNames('modal-backdrop fade', { show: status === 'entered' })} />
            )}
          </>
        )}
      </Transition>
    </ModalPortal>
  )
}
