import React from 'react'

import DecimalInput from '../../../components/form/decimal-input'
import { Field } from '../../../components/form/field'
import { TextInput } from '../../../components/form/text-input'

export const FeaturesForm = ({ entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="cor">
            <TextInput
              id="color"
              autoComplete="color"
              placeholder="color"
              customClassName="form-control"
              value={entity.color}
            />
          </Field>
        </div>

        <div className="col-lg">
          <Field label="Altura">
            <DecimalInput
              id="height"
              name="height"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Largura">
            <DecimalInput
              id="width"
              name="width"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Comprimento">
            <DecimalInput
              id="length"
              name="length"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Tamanho">
            <DecimalInput
              id="size"
              name="size"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Peso">
            <DecimalInput
              id="weight"
              name="weight"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
