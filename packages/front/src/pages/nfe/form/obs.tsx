import React from 'react'

import { Field } from '../../../components/form/field'
import { TextAreaInput } from '../../../components/form/textarea-input'

export const ObsForm = ({ entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Preencha aqui as observações desta venda (elas não serão exibidas na Nota Fiscal)">
            <TextAreaInput
              refEl={undefined}
              value={entity.observacoes}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={undefined}
              rows={5}
              readOnly={false}
              maxLenght={150}
            ></TextAreaInput>
          </Field>
        </div>
      </div>
    </>
  )
}
