import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { Cities, RequiredMessage, customerTypes } from '../../../helpers/constants'
import { onlyNumbers, getAddress } from '../../../helpers/format'
import { classNames, getCnpj } from '../../../helpers/misc'

interface AddressForm {
  id: number
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  cityId: number
  state: string
}
interface ProviderFormValues {
  id: number
  cpfCnpj: string
  stateInscription: string
  name: string
  company: string
  email: string
  phone: string
  mobilePhone: string
  dateCreated: Date
  additionalEmails?: string
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  cityId: number
  state: string
  disableAt?: Date
  view: string
  deliveryAddress: AddressForm
  type: number
}

export const RenderInitial = ({ form, entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Nome">
            <TextInput
              id="name"
              autoComplete="username"
              placeholder="Nome"
              customClassName="form-control"
              value={entity.name}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Razão Social">
            <TextInput
              id="company"
              autoComplete="company"
              placeholder="Razão Social"
              customClassName="form-control"
              value={entity.company}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="CPF/CNPJ">
            <TextInput
              id="cpfCnpj"
              autoComplete="cpfCnpj"
              placeholder="CNPJ"
              customClassName="form-control"
              value={entity.cpfCnpj}
              disabled={false}
              // mask={'99.999.999/9999-99'}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Inscrição Estadual">
            <TextInput
              id="stateInscription"
              autoComplete="stateInscription"
              placeholder="Inscrição estadual"
              customClassName="form-control"
              value={entity.stateInscription}
              disabled={false}
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
              id="phone"
              autoComplete="phone"
              placeholder="Telefone"
              customClassName="form-control"
              value={entity.phone}
              mask={'(99) 9999-9999'}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Celular">
            <TextInput
              id="mobilePhone"
              autoComplete="mobilePhone"
              placeholder="Whatsapp"
              customClassName="form-control"
              value={entity.mobilePhone}
              mask={'(99) 99999-9999'}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Tipo">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.type}
              items={customerTypes}
              onChange={t => form.setFieldValue('type', t?.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
      <div className="row">
        <div className="col-lg">
          <Field label="CEP">
            <TextInput
              id={'postalCode'}
              name={'postalCode'}
              value={entity.postalCode}
              acceptEnter={true}
              mask="99999-999"
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Endereço">
            <TextInput id={'address'} name={'address'} value={entity.address} />
          </Field>
        </div>
        <div className="col-lg-1">
          <Field label="Numero">
            <TextInput id={'addressNumber'} name={'addressNumber'} value={entity.addressNumber} acceptEnter={true} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Complemento">
            <TextInput id={'complement'} name={'complement'} value={entity.complement} />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Bairro">
            <TextInput id={'province'} name={'province'} value={entity.province} acceptEnter={true} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Cidade">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.cityId}
              items={Cities}
              onChange={city => form.setFieldValue('cityId', city.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Estado">
            <TextInput id={'state'} name={'state'} value={entity.state} acceptEnter={true} />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}

export const ProviderForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()

  const pushTo = useNavigate()
  const form = useFormik<ProviderFormValues>({
    initialValues: {
      id: 0,
      cpfCnpj: '',
      stateInscription: '',
      name: '',
      company: '',
      email: '',
      phone: '',
      mobilePhone: '',
      dateCreated: new Date(),
      additionalEmails: '',
      address: '',
      addressNumber: '',
      complement: '',
      province: '',
      postalCode: '',
      cityId: 0,
      state: '',
      disableAt: undefined,
      view: 'Geral',
      deliveryAddress: {
        id: 0,
        address: '',
        addressNumber: '',
        complement: '',
        postalCode: '',
        cityId: 0,
        state: '',
        province: '',
      },
      type: 0,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: ProviderFormValues) {
    if (id) {
      axios
        .post(`provider.update`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/fornecedor'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`provider.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/fornecedor'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`provider.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('cpfCnpj', data.cpfCnpj)
          form.setFieldValue('stateInscription', data.stateInscription)
          form.setFieldValue('name', data.name)
          form.setFieldValue('email', data.email)
          form.setFieldValue('phone', data.phone)
          form.setFieldValue('mobilePhone', data.mobilePhone)
          form.setFieldValue('dateCreated', data.dateCreated)
          form.setFieldValue('additionalEmails', data.additionalEmails)
          form.setFieldValue('address', data.address)
          form.setFieldValue('addressNumber', data.addressNumber)
          form.setFieldValue('complement', data.complement)
          form.setFieldValue('province', data.province)
          form.setFieldValue('postalCode', data.postalCode)
          form.setFieldValue('value', data.value)
          form.setFieldValue('nextDueDate', data.nextDueDate)
          form.setFieldValue('licenceExpiration', data.licenceExpiration)
          form.setFieldValue('asaasId', data.asaasId)
          form.setFieldValue('company', data.company)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  useEffect(() => {
    if (onlyNumbers(entity.postalCode).length === 8) {
      getAddress(entity.postalCode).then(resp => {
        if (!resp.erro) {
          form.setFieldValue('address', resp.logradouro)
          form.setFieldValue('complement', resp.complemento)
          form.setFieldValue('province', resp.bairro)
          form.setFieldValue('state', resp.uf)
          form.setFieldValue('cityId', parseInt(resp.ibge))
        }
      })
    }
  }, [entity.postalCode])
  useEffect(() => {
    if (onlyNumbers(entity.deliveryAddress.postalCode).length === 8) {
      getAddress(entity.deliveryAddress.postalCode).then(resp => {
        if (!resp.erro) {
          form.setFieldValue('deliveryAddress.address', resp.logradouro)
          form.setFieldValue('deliveryAddress.complement', resp.complemento)
          form.setFieldValue('deliveryAddress.province', resp.bairro)
          form.setFieldValue('deliveryAddress.state', resp.uf)
          form.setFieldValue('deliveryAddress.cityId', parseInt(resp.ibge))
        }
      })
    }
  }, [entity.deliveryAddress.postalCode])

  useEffect(() => {
    if (!id) {
      if (onlyNumbers(entity.cpfCnpj).length === 14) {
        getCnpj(entity.cpfCnpj).then(resp => {
          const { estabelecimento } = resp
          if (!resp.erro) {
            form.setFieldValue('company', resp.razao_social)
            form.setFieldValue('name', estabelecimento.nome_fantasia)
            form.setFieldValue('postalCode', estabelecimento.cep)
            form.setFieldValue('email', estabelecimento.email)
            form.setFieldValue('deliveryAddress.cityId', parseInt(estabelecimento.ibge))
            form.setFieldValue('phone', `${estabelecimento.ddd1}${estabelecimento.telefone1}`)
            form.setFieldValue('addressNumber', estabelecimento.numero)
          }
        })
      }
    }
  }, [entity.cpfCnpj, id])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.name}` : 'Novo Fornecedor'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <ul className="nav nav-tabs kt-mb-0" role="tablist">
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Geral',
                  })}
                  onClick={() => form.setFieldValue('view', 'Geral')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Geral</span>
                </button>
              </li>
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Geral' && <RenderInitial form={form} entity={entity} />}
            </div>
            <br />
            <ErrorMessage error={globalError} />
            <div className="kt-portlet__foot">
              <div className="kt-form__actions">
                <div className="row">
                  <div className="col-lg kt-align-right">
                    <Button
                      type="button"
                      icon="fas fa-arrow-left"
                      customClassName="btn-secondary margin-right-10"
                      title="Voltar"
                      disabled={form.isSubmitting}
                      onClick={() => pushTo('/fornecedor')}
                    />
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
          </div>
        </form>
      </div>
    </FormikProvider>
  )
}
function validateForm(values: ProviderFormValues) {
  const errors: FormikErrors<ProviderFormValues> = {}

  if (!values.name) {
    errors.name = RequiredMessage
  }
  if (!values.cpfCnpj) {
    errors.cpfCnpj = RequiredMessage
  }
  return errors
}
