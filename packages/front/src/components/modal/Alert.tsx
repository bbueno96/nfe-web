/* eslint-disable react/react-in-jsx-scope */
export function Alert({ message, closeModal }) {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Alerta</h5>

        <button
          type="button"
          className="close"
          aria-label="close"
          data-dismiss="modal"
          onClick={() => closeModal('close')}
        />
      </div>
      <div className="modal-body">
        <p>{message}</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-primary" onClick={() => closeModal('submit')}>
          Ok
        </button>
      </div>
    </div>
  )
}
