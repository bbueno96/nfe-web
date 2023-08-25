import React, { useEffect } from 'react'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import SwitchInput from '../../../components/form/switch'
import { TextInput } from '../../../components/form/text-input'
import { CFOPs, CSTPISCOFINS, CSOSN, CST, Origem } from '../../../helpers/constants'
import { ProductsTaxForm } from './productsTax'

export const TaxDataForm = ({ entity, form, id }) => {
  const { modal, saToken } = useApp()
  useEffect(() => {
    if (id !== undefined) {
      axios
        .post(`producttax.list`, { product: id }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          if (data.items.length > 0) form.setFieldValue('productstax', data.items)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  return (
    <>
      <div className="row">
        <div className="col-lg-2">
          <Field label="NCM">
            <TextInput
              id="ncm"
              autoComplete="color"
              placeholder="00000000"
              customClassName="form-control"
              value={entity.ncm}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Origem do Produto">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              items={Origem}
              selected={entity.cf}
              onChange={cf => form.setFieldValue('cf', cf.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg-2">
          <Field label="Simples Nacional">
            <SwitchInput id="simplesNacional" name="simplesNacional" />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="CST">
            <Select
              getDisplay={({ id, name }) => `${id}-${name}`}
              getId={({ id }) => id}
              selected={undefined}
              items={entity.simplesNacional ? CSOSN : CST}
              onChange={undefined}
              disabled={false}
              isMulti={undefined}
              isLoading={undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="CFOP">
            <Select
              isClearable
              getId={({ id }) => id}
              getDisplay={({ description, id }) => `${id.substr(0, 1)}.${id.substr(1)} - ${description}`}
              items={CFOPs}
              selected={undefined}
              onChange={undefined}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="CST Pis/Cofins">
            <Select
              getDisplay={({ id, name }) => `${id}-${name}`}
              getId={({ id }) => id}
              selected={undefined}
              items={CSTPISCOFINS}
              onChange={undefined}
              disabled={false}
              isMulti={undefined}
              isLoading={undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
      </div>
      <div className="border rounded-bottom p-3">
        <ProductsTaxForm form={form} entity={entity} />
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
