/* eslint-disable react/react-in-jsx-scope */
import { Field } from '../form/field'
import { TextInput } from '../form/text-input'

export function Prompt({ message, title, value, setValue, closeModal }) {
  return (
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">{title}</h5>

        <button
          type="button"
          className="close"
          aria-label="close"
          data-dismiss="modal"
          onClick={() => closeModal('close')}
        />
      </div>
      <div className="modal-body">
        <Field label={message}>
          <TextInput placeholder="Digite..." value={value} onChange={setValue} />
        </Field>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => closeModal('close')}>
          <i className="fas fa-arrow-left" aria-hidden="true" />
          <span>Voltar</span>
        </button>

        <button type="button" className="btn btn-primary" onClick={() => closeModal('submit')}>
          <i className="fas fa-check" aria-hidden="true" />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  )
}
