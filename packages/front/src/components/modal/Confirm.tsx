/* eslint-disable react/react-in-jsx-scope */
export function Confirm({ message, closeModal }) {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Atenção</h5>

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
          <i className="fas fa-check" aria-hidden="true" />
          <span>Sim</span>
        </button>

        <button type="button" className="btn btn-danger" onClick={() => closeModal('cancel')}>
          <i className="fas fa-times" aria-hidden="true" />
          <span>Não</span>
        </button>
      </div>
    </div>
  )
}
