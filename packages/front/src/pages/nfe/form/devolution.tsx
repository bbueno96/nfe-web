import React from 'react'

import { Field } from '../../../components/form/field'
import { TextInput } from '../../../components/form/text-input'

export const DevolForm = () => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Chave de referência da NFe">
            <TextInput placeholder="" name={`nfeRef`} disabled={false} value={`nfeRef`} />
          </Field>
        </div>
      </div>
    </>
  )
}
