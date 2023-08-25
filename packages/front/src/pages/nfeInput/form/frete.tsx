import React, { useEffect } from 'react'

import DecimalInput from '../../../components/form/decimal-input'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { TipoFrete } from '../../../helpers/constants'

export const FreteForm = ({ entity, form, providers }) => {
  useEffect(() => {
    form.setFieldValue('volumes', entity.products?.length)
  }, [entity.products])
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Transportadora">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.fornecedor}
              items={providers}
              onChange={company => {
                form.setFieldValue('cliente', company?.id)
                form.setFieldValue('Customer', company)
                form.setFieldValue('newCustoner', false)
              }}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              isClearable={true}
              styles={undefined}
            ></Select>
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Tipo do Frete">
            <Select
              getId={({ id }) => id}
              getDisplay={({ descricao, id }) => `${id}-${descricao}`}
              selected={entity.tipoFrete}
              items={TipoFrete}
              onChange={frete => {
                form.setFieldValue('tipoFrete', frete?.id)
              }}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              isClearable={true}
              styles={undefined}
            ></Select>
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Placa Veiculo">
            <TextInput placeholder="" name={`placaTransp`} disabled={false} value={`placaTransp`} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="UF">
            <TextInput placeholder="" name={`ufTransp`} disabled={false} value={`ufTransp`} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="RNTRC (ANTT)">
            <TextInput placeholder="" name={`rntrcTransp`} disabled={false} value={`rntrcTransp`} />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Volume">
            <DecimalInput
              name={`volumes`}
              id={'volumes'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Espécie dos Volumes">
            <TextInput placeholder="" name={`especie`} disabled={false} value={`especie`} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Peso Líquido (Kg)">
            <DecimalInput
              name={`pesoLiquido`}
              id={'pesoLiquido'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Peso Bruto (Kg)">
            <DecimalInput
              name={`pesoBruto`}
              id={'pesoBruto'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Valor do Frete">
            <DecimalInput
              name={`frete`}
              id={'frete'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Valor do Seguro">
            <DecimalInput
              name={`seguro`}
              id={'seguro'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Outras Despesas">
            <DecimalInput
              name={`outrasDespesas`}
              id={'outrasDespesas'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
    </>
  )
}
