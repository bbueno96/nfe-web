import React, { useEffect, useState } from 'react'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../App'
import { Button } from '../../components/button'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import SwitchInput from '../../components/form/switch'
import { TextInput } from '../../components/form/text-input'
import { Cities, RequiredMessage } from '../../helpers/constants'
import { getAddress, onlyNumbers } from '../../helpers/format'
import { classNames, getCnpj } from '../../helpers/misc'
import { useRefresh } from '../../hooks/refresh'

interface ParameterFormValues {
  id?: string
  nfeHomologation?: boolean
  pfx?: Blob
  passwordCert?: string
  nfeRazao: string
  nfeFantasia: string
  nfeCnpj: string
  nfeIe: string
  nfeLagradouro: string
  nfeNumero: string
  nfeBairro: string
  nfeUf: string
  nfeUfCod: number
  nfeCidade: string
  nfeCidadeCod: number
  nfeCep: string
  nfeFone: string
  nfeCsc: string
  nfeIndPresenca: number
  nfeIm: string
  nfeCnae: string
  nfeCrt: number
  emailHost: string
  emailPort: number
  emailUsername: string
  emailPassword: string
  emailCopyEmail: string
  serie: number
  ultNota: number
  view: string
  getApoio: boolean
  classificationId: boolean
}

export const RenderInitial = ({ form, entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Razão Social">
            <TextInput
              id="nfeRazao"
              autoComplete="Razão"
              placeholder="Razão"
              customClassName="form-control"
              value={entity.nfeRazao}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Nome Fanstasia">
            <TextInput
              id="nfeFantasia"
              autoComplete="Fanstasia"
              placeholder="Fanstasia"
              customClassName="form-control"
              value={entity.nfeFantasia}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="CPF/CNPJ">
            <TextInput
              id="nfeCnpj"
              autoComplete="cpfCnpj"
              placeholder="CNPJ"
              customClassName="form-control"
              value={entity.nfeCnpj}

              // mask={'99.999.999/9999-99'}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="RG/Inscrição Estadual">
            <TextInput
              id="nfeIe"
              autoComplete="nfeIe"
              placeholder="RG/Inscrição estadual"
              customClassName="form-control"
              value={entity.nfeIe}

              // mask={'99.999.999/9999-99'}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Email">
            <TextInput
              id="email"
              autoComplete="email"
              placeholder="E-Mail"
              customClassName="form-control"
              value={entity.email}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Telefone">
            <TextInput
              id="nfeFone"
              autoComplete="nfeFone"
              placeholder="Telefone"
              customClassName="form-control"
              value={entity.phone}
              mask={'(99) 99999-9999'}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Inscrição Municipal">
            <TextInput
              id="nfeIm"
              autoComplete="nfeIm"
              placeholder="IM"
              customClassName="form-control"
              value={entity.nfeIm}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
      <div className="row">
        <div className="col-lg">
          <Field label="CEP">
            <TextInput id={'nfeCep'} name={'nfeCep'} value={entity.nfeCep} acceptEnter={true} mask="99999-999" />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Endereço">
            <TextInput id={'nfeLagradouro'} name={'nfeLagradouro'} value={entity.nfeLagradouro} />
          </Field>
        </div>
        <div className="col-lg-1">
          <Field label="Numero">
            <TextInput id={'nfeNumero'} name={'nfeNumero'} value={entity.nfeNumero} acceptEnter={true} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Complemento">
            <TextInput id={'nfeComplemento'} name={'nfeComplemento'} value={entity.nfeComplemento} />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Bairro">
            <TextInput id={'nfeBairro'} name={'nfeBairro'} value={entity.nfeBairro} acceptEnter={true} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Cidade">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.nfeCidadeCod}
              items={Cities}
              onChange={city => {
                form.setFieldValue('nfeCidadeCod', city.id)
                form.setFieldValue('nfeCidade', city.name)
                form.setFieldValue('nfeUfCod', city.state)
              }}
              disabled={false}
              isMulti={undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Estado">
            <TextInput id={'nfeUf'} name={'nfeUf'} value={entity.nfeUf} acceptEnter={true} />
          </Field>
        </div>
      </div>
    </>
  )
}

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
export const ParameterForm = () => {
  const [file, setCardFile] = useState()
  const handleUploadFile = e => setCardFile(e.target.files[0])
  const refresh = useRefresh()
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const form = useFormik<ParameterFormValues>({
    initialValues: {
      nfeHomologation: false,
      pfx: undefined,
      passwordCert: '',
      nfeRazao: '',
      nfeFantasia: '',
      nfeCnpj: '',
      nfeIe: '',
      nfeLagradouro: '',
      nfeNumero: '',
      nfeBairro: '',
      nfeUf: '',
      nfeUfCod: null,
      nfeCidade: '',
      nfeCidadeCod: null,
      nfeCep: '',
      nfeFone: '',
      nfeCsc: '',
      nfeIndPresenca: 2,
      nfeIm: '',
      nfeCnae: '',
      nfeCrt: 0,
      emailHost: '',
      emailPort: 0,
      emailUsername: '',
      emailPassword: '',
      emailCopyEmail: '',
      serie: 0,
      ultNota: 0,
      view: 'Initial',
      getApoio: false,
      classificationId: null,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: ParameterFormValues) {
    const data = new FormData()
    data.append('file', values.pfx)
    data.append('passwordCert', '' + btoa(values.passwordCert))
    data.append('nfeHomologation', '' + values.nfeHomologation)
    data.append('nfeRazao', values.nfeRazao)
    data.append('nfeFantasia', values.nfeFantasia)
    data.append('nfeCnpj', values.nfeCnpj)
    data.append('nfeIe', values.nfeIe)
    data.append('nfeLagradouro', values.nfeLagradouro)
    data.append('nfeNumero', values.nfeNumero)
    data.append('nfeBairro', values.nfeBairro)
    data.append('nfeUf', values.nfeUf)
    data.append('nfeUfCod', '' + values.nfeUfCod)
    data.append('nfeCidade', values.nfeCidade)
    data.append('nfeCidadeCod', '' + values.nfeCidadeCod)
    data.append('nfeCep', values.nfeCep)
    data.append('nfeFone', values.nfeFone)
    data.append('nfeCsc', values.nfeCsc)
    data.append('nfeIndPresenca', '' + values.nfeIndPresenca)
    data.append('nfeIm', values.nfeIm)
    data.append('nfeCnae', values.nfeCnae)
    data.append('nfeCrt', '' + values.nfeCrt)
    data.append('emailHost', '' + values.emailHost)
    data.append('emailPort', '' + values.emailPort)
    data.append('emailUsername', values.emailUsername)
    data.append('emailPassword', values.emailPassword)
    data.append('emailCopyEmail', values.emailCopyEmail)
    data.append('serie', '' + values.serie)
    data.append('getApoio', '' + values.getApoio)
    data.append('classificationId', '' + values.classificationId)

    axios
      .post(`parameter.update`, data, {
        headers: { Authorization: `Bearer ${saToken}`, 'Content-Type': 'multipart/form-data' },
      })
      .then(() =>
        modal.alert('Salvo com sucesso!', () => {
          refresh.force()
        }),
      )
      .catch(err => setGlobalError(err.response.data.message))
      .finally(() => form.setSubmitting(false))
  }

  const { values: entity } = form
  useEffect(() => {
    axios
      .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        form.setFieldValue('id', data.id)
        form.setFieldValue('file', data.pfx)
        form.setFieldValue('passwordCert', atob(data.passwordCert))
        form.setFieldValue('nfeHomologation', data.nfeHomologation)
        form.setFieldValue('nfeRazao', data.nfeRazao)
        form.setFieldValue('nfeFantasia', data.nfeFantasia)
        form.setFieldValue('nfeCnpj', data.nfeCnpj)
        form.setFieldValue('nfeIe', data.nfeIe)
        form.setFieldValue('nfeLagradouro', data.nfeLagradouro)
        form.setFieldValue('nfeNumero', data.nfeNumero)
        form.setFieldValue('nfeBairro', data.nfeBairro)
        form.setFieldValue('nfeUf', data.nfeUf)
        form.setFieldValue('nfeUfCod', data.nfeUfCod)
        form.setFieldValue('nfeCidade', data.nfeCidade)
        form.setFieldValue('nfeCidadeCod', data.nfeCidadeCod)
        form.setFieldValue('nfeCep', data.nfeCep)
        form.setFieldValue('nfeFone', data.nfeFone)
        form.setFieldValue('nfeCsc', data.nfeCsc)
        form.setFieldValue('nfeIndPresenca', data.nfeIndPresenca)
        form.setFieldValue('nfeIm', data.nfeIm)
        form.setFieldValue('nfeCnae', data.nfeCnae)
        form.setFieldValue('nfeCrt', data.nfeCrt)
        form.setFieldValue('emailHost', data.emailHost)
        form.setFieldValue('emailPort', data.emailPort)
        form.setFieldValue('emailUsername', data.emailUsername)
        form.setFieldValue('emailPassword', data.emailPassword)
        form.setFieldValue('emailCopyEmail', data.emailCopyEmail)
        form.setFieldValue('serie', data.serie)
        form.setFieldValue('ultNota', data.ultNota)
        form.setFieldValue('getApoio', data.getApoio)
        form.setFieldValue('classificationId', data.classificationId)
      })
      .catch(err => modal.alert(err.message))
      .finally()
  }, [refresh.ref])
  useEffect(() => {
    form.setFieldValue('pfx', file)
  }, [file])

  useEffect(() => {
    if (onlyNumbers(entity.nfeCep).length === 8) {
      getAddress(entity.nfeCep).then(resp => {
        if (!resp.erro) {
          form.setFieldValue('nfeLagradouro', resp.logradouro)
          form.setFieldValue('nfeComplemento', resp.complemento)
          form.setFieldValue('nfeBairro', resp.bairro)
          form.setFieldValue('nfeUf', resp.uf)
          form.setFieldValue('nfeCidadeCod', parseInt(resp.ibge))
        }
      })
    }
  }, [entity.nfeCep])

  useEffect(() => {
    if (onlyNumbers(entity.nfeCnpj).length === 14 && !entity.nfeRazao) {
      getCnpj(entity.nfeCnpj).then(resp => {
        const { estabelecimento } = resp
        if (!resp.erro) {
          form.setFieldValue('nfeRazao', resp.razao_social)
          form.setFieldValue('nfeFantasia', estabelecimento.nome_fantasia)
          form.setFieldValue('nfeCep', estabelecimento.cep)
          form.setFieldValue('email', estabelecimento.email)
          form.setFieldValue('nfeCidadeCod', parseInt(estabelecimento.ibge))
          form.setFieldValue('phone', `${estabelecimento.ddd1}${estabelecimento.telefone1}`)
          form.setFieldValue('nfeNumero', estabelecimento.numero)
        }
      })
    }
  }, [entity.nfeCnpj])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{'Parâmetros'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <ul className="nav nav-tabs kt-mb-0" role="tablist">
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Initial',
                  })}
                  onClick={() => form.setFieldValue('view', 'Initial')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Dados da Empresa</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Fiscal',
                  })}
                  onClick={() => form.setFieldValue('view', 'Fiscal')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Fiscal</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Other',
                  })}
                  onClick={() => form.setFieldValue('view', 'Other')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Outros</span>
                </button>
              </li>
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Initial' && <RenderInitial form={form} entity={entity} />}
              {entity.view === 'Fiscal' && (
                <RenderFiscal entity={entity} form={form} handleUploadFile={handleUploadFile} />
              )}
              {entity.view === 'Other' && <RenderOther form={form} entity={entity} />}
            </div>
            <br />
          </div>
          <ErrorMessage error={globalError} />
          <div className="kt-portlet__foot">
            <div className="kt-form__actions">
              <div className="row">
                <div className="col-lg kt-align-right">
                  <Button
                    icon="fas fa-save"
                    customClassName="btn-primary"
                    title="Salvar"
                    loading={form.isSubmitting}
                    disabled={form.isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </FormikProvider>
  )
}
function validateForm(values: ParameterFormValues) {
  const errors: FormikErrors<ParameterFormValues> = {}
  if (!values.pfx) {
    errors.pfx = RequiredMessage
  }
  return errors
}
