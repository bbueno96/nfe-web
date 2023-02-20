import React, { useEffect } from 'react'
import { Transition } from 'react-transition-group'

import classNames from 'classnames'
import { useFormikContext } from 'formik'

import Loading from '../loading'
import { ModalPortal } from '../modal-portal'

export default function ModalForm({
  children,
  show,
  title,
  fetching,
  submitText = 'Salvar',
  submitIcon = 'fas fa-save',
  isLarge,
  isExtraLarge,
  closeAction,
  error,
}) {
  const formik = useFormikContext()
  let content = children

  useEffect(() => {
    if (!show) setTimeout(formik.resetForm, 300)
  }, [show, formik.resetForm])

  if (error) {
    content = (
      <div className="mb-0 alert alert-custom alert-light-danger alert-dismissible">
        <div className="alert-text">{error.message}</div>
      </div>
    )
  } else if (fetching) {
    content = <Loading />
  }

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
              <div
                role="document"
                className={classNames('modal-dialog modal-dialog-centered', {
                  'modal-lg': isLarge,
                  'modal-xl': isExtraLarge,
                })}
              >
                <div className="modal-content">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="modal-header">
                      <h5 className="modal-title">{title}</h5>

                      <button
                        type="button"
                        className="close"
                        aria-label="close"
                        data-dismiss="modal"
                        onClick={closeAction}
                      />
                    </div>
                    <div className="modal-body">{content}</div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={formik.isSubmitting}
                        onClick={closeAction}
                      >
                        <i className="fas fa-arrow-left" aria-hidden="true" />
                        <span>Voltar</span>
                      </button>

                      {!fetching && (
                        <button type="submit" className="btn btn-primary ml-3" disabled={formik.isSubmitting}>
                          <i className={submitIcon} aria-hidden="true" />
                          <span>{submitText}</span>

                          {formik.isSubmitting && (
                            <span className="ml-3 spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
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
