import React, { useEffect, useState } from 'react'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../App'
import DecimalInput from '../../components/form/decimal-input'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import SwitchInput from '../../components/form/switch'

export const RenderOther = ({ form, entity }) => {
  const { modal, saToken } = useApp()
  const [classifications, setClassifications] = useState([])

  useEffect(() => {
    axios
      .post(`classification.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setClassifications(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [])
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Classificação Financeira Nota de entrada">
            <Select
              getDisplay={({ description }) => description}
              getId={({ id }) => id}
              selected={entity.classificationId}
              items={classifications}
              onChange={classification => form.setFieldValue('classificationId', classification?.id)}
            />
          </Field>
        </div>
        <div className="col-lg-2">
          <Field label="Pega Clientes Apoio">
            <SwitchInput id={'getApoio'} name={'getApoio'} />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Multa">
            <DecimalInput
              id="fine"
              name="fine"
              icon={'fas fa-percentage'}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Juros">
            <DecimalInput
              id="interest"
              name="interest"
              icon={'fas fa-percentage'}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
    </>
  )
}
