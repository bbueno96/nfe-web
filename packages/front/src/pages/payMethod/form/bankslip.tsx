import React from 'react'

import DecimalInput from '../../../components/form/decimal-input'
import { Field } from '../../../components/form/field'

export const BankSlip = () => {
  return (
    <>
      <div className="row">
        <div className="col-lg-3">
          <Field label="Carteira">
            <DecimalInput
              id="wallet"
              name="wallet"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
              precision={0}
            />
          </Field>
        </div>
      </div>

      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
