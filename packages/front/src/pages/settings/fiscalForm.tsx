import React from 'react'

import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import SwitchInput from '../../components/form/switch'
import { TextInput } from '../../components/form/text-input'

export const RenderFiscal = ({ form, entity, handleUploadFile }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-2">
          <Field label="Serie">
            <TextInput
              acceptEnter
              id="serie"
              type="text"
              placeholder="Serie da nota"
              value={entity.serie}
              autoComplete="serie"
            />
          </Field>
        </div>
        <div className="col-lg-2">
          <Field label="Homologação">
            <SwitchInput id={'nfeHomologation'} name={'nfeHomologation'} />
          </Field>
        </div>

        <div className="col-lg-4">
          <Field label="Certificado">
            <br />
            <input
              type="file"
              onChange={handleUploadFile}
              accept="application/x-pkcs12"
              id="pfx"
              className="form-control"
            />
          </Field>
        </div>

        <div className="col-lg">
          <Field label="Senha Certificado">
            <TextInput
              acceptEnter
              id="passwordCert"
              type="password"
              placeholder="Senha"
              icon="fas fa-lock"
              value={entity.passwordCert}
              autoComplete="current-password"
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="CSC">
            <TextInput
              acceptEnter
              id="nfeCsc"
              type="text"
              placeholder="Código de Segurança do Contribuinte"
              value={entity.nfeCsc}
              autoComplete="nfeCsc"
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="CNAE">
            <TextInput
              acceptEnter
              id="nfeCnae"
              type="text"
              placeholder="CNAE"
              value={entity.nfeCnae}
              autoComplete="nfeCnae"
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Regime Tributario">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.nfeCrt}
              items={[
                { id: 1, name: 'Simples Nacional' },
                { id: 2, name: 'Simples Nacional, excesso sublimite de receita bruta.' },
                { id: 3, name: 'Regime Normal' },
              ]}
              onChange={crt => {
                form.setFieldValue('nfeCrt', crt?.id)
              }}
              disabled={false}
              isMulti={undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Indicador de Presença">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.nfeIndPresenca}
              items={[
                { id: 0, name: 'Não se aplica' },
                { id: 2, name: 'Operação não presencial, pela Internet' },
                { id: 3, name: 'Operação não presencial, Teleatendimento' },
                { id: 4, name: 'NFC-e em operação com entrega a domicílio' },
                { id: 5, name: 'Operação presencial, fora do estabelecimento' },
                { id: 9, name: 'Operação não presencial, outros.' },
              ]}
              onChange={pres => {
                form.setFieldValue('nfeIndPresenca', pres?.id)
              }}
              disabled={false}
              isMulti={undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
