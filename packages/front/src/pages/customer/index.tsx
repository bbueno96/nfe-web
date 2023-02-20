import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../App'
import { Button } from '../../components/button'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import { getCustomers } from '../../helpers'
import { Cities, RequiredMessage, customerTypes } from '../../helpers/constants'
import { onlyNumbers, getAddress } from '../../helpers/format'
import { maskCpfCnpj } from '../../helpers/mask'
import { classNames, getCnpj } from '../../helpers/misc'
import useFilters from '../../hooks/filter'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface CustomerListValues {
  id: number
  cpfCnpj: string
  name: string
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
  disableAt: Date
  type: number
}
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
interface CustomerFormValues {
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
  disableAt: Date
  view: string
  deliveryAddress: AddressForm
  type: number
}

export const CustomerList = () => {
  const { modal, saToken, parameter } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    name: '',
    cpfCnpj: '',
  })

  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<CustomerListValues>({ initialQuery: { sort: [{ name: 'id' }] } })
  useEffect(() => {
    setFetching(true)
    if (parameter.getApoio) {
      getCustomers()
        .then(resp => {
          updateData({ items: resp, pager: { records: resp.length, page: 1, perPage: 10, pages: resp.length / 10 } })
        })
        .catch(err => modal.alert(err.message))
        .finally(() => setFetching(false))
    } else {
      axios
        .post('customer.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => updateData(data))
        .catch(err => modal.alert(err.message))
        .finally(() => setFetching(false))
    }
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-users" />
            </span>
            <h3 className="kt-portlet__head-title">Clientes</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            {!parameter.getApoio && (
              <div className="kt-portlet__head-wrapper">
                <div className="dropdown dropdown-inline">
                  <Link className="btn btn-success btn-icon-sm" to="cadastro">
                    <i className="fas fa-plus" /> Novo Cliente
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Nome">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="name"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.name}
                    />
                  </div>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="CPF/CNPJ">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="cpfCnpj"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={onlyNumbers(filter.values.cpfCnpj)}
                    />
                  </div>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg kt-align-right">
                <Button
                  icon="input-icon"
                  customClassName="btn-primary"
                  title="Consultar"
                  onClick={() => {
                    setFetching(true)
                    axios
                      .post('customer.list', filter.values, {
                        headers: { Authorization: `Bearer ${saToken}` },
                      })
                      .then(({ data }) => updateData(data))
                      .catch(err => modal.alert(err.message))
                      .finally(() => setFetching(false))
                  }}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="kt-portlet__body kt-portlet__body--fit">
          <List
            primaryKey="id"
            fetching={fetching}
            items={items}
            pager={pager}
            changePage={updatePage}
            changePerPage={updatePerPage}
            changeSort={updateSort}
            sortItems={query.sort}
            columns={listColumns}
            actions={
              !parameter.getApoio
                ? [
                    { icon: 'fas fa-edit', title: 'Editar', action: '/cliente/:id' },
                    {
                      icon: 'fas fa-lock',
                      title: 'Desativar',
                      hideWhen: ent => !!ent.disableAt,
                      action: ent =>
                        modal.confirm(
                          `Deseja remover o cliente: ${ent.name}?`,
                          confirmed =>
                            confirmed &&
                            axios
                              .delete(`customer.delete/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                              .then(refresh.force)
                              .catch(err => modal.alert(err.message)),
                        ),
                    },
                    {
                      icon: 'fas fa-unlock',
                      title: 'Ativar',
                      hideWhen: ent => !ent.disableAt,
                      action: ent =>
                        modal.confirm(
                          `Deseja Ativar o cliente: ${ent.name}?`,
                          confirmed =>
                            confirmed &&
                            axios
                              .delete(`customer.delete/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                              .then(refresh.force)
                              .catch(err => modal.alert(err.message)),
                        ),
                    },
                  ]
                : []
            }
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<CustomerListValues>[] = [
  { path: 'name', title: 'Nome' },
  {
    path: 'cpfCnpj',
    title: 'CPF/CNPJ',
    format: c => maskCpfCnpj(c),
  },
]

export const RenderInitial = ({ form, entity, id }) => {
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
              disabled={!!id}
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
              disabled={!!id}
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
              isLoading={false}
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
              isLoading={false}
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
export const AddressForm = ({ entity, form }) => {
  return (
    <>
      <div className="kt-heading kt-heading--sm"> Endereço De entrega</div>
      <div className="row">
        <div className="col-lg">
          <Field label="CEP">
            <TextInput
              id={'deliveryAddress.postalCode'}
              name={'deliveryAddress.postalCode'}
              value={entity.deliveryAddress.postalCode}
              acceptEnter={true}
              mask="99999-999"
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Endereço">
            <TextInput
              id={'deliveryAddress.address'}
              name={'deliveryAddress.address'}
              value={entity.deliveryAddress.address}
            />
          </Field>
        </div>
        <div className="col-lg-1">
          <Field label="Numero">
            <TextInput
              id={'deliveryAddress.addressNumber'}
              name={'deliveryAddress.addressNumber'}
              value={entity.deliveryAddress.addressNumber}
              acceptEnter={true}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Complemento">
            <TextInput
              id={'deliveryAddress.complement'}
              name={'deliveryAddress.complement'}
              value={entity.deliveryAddress.complement}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Bairro">
            <TextInput
              id={'deliveryAddress.province'}
              name={'deliveryAddress.province'}
              value={entity.deliveryAddress.province}
              acceptEnter={true}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Cidade">
            <Select
              getId={({ id }) => id}
              getDisplay={({ name }) => name}
              selected={entity.deliveryAddress.cityId}
              items={Cities}
              onChange={city => form.setFieldValue('deliveryAddress.cityId', city.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false}
              isClearable={true}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Estado">
            <TextInput
              id={'deliveryAddress.state'}
              name={'deliveryAddress.state'}
              value={entity.deliveryAddress.state}
              acceptEnter={true}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}

export const CustomerForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()

  const pushTo = useNavigate()
  const form = useFormik<CustomerFormValues>({
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
      cityId: null,
      state: '',
      disableAt: null,
      view: 'Geral',
      deliveryAddress: {
        id: 0,
        address: '',
        addressNumber: '',
        complement: '',
        postalCode: '',
        cityId: null,
        state: '',
        province: '',
      },
      type: 0,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: CustomerListValues) {
    if (id) {
      axios
        .post(`customer.update`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/cliente'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`customer.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/cliente'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`customer.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('cpfCnpj', data.cpfCnpj)
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
        .catch(err => modal.alert(err.message))
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
  }, [entity.cpfCnpj])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.name}` : 'Novo Cliente'}</h3>
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
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Outros',
                  })}
                  onClick={() => form.setFieldValue('view', 'Outros')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Outros Dados</span>
                </button>
              </li>
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Geral' && <RenderInitial form={form} entity={entity} id={id} />}
              {entity.view === 'Outros' && <AddressForm entity={entity} form={form} />}
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
                      onClick={() => pushTo('/cliente')}
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
function validateForm(values: CustomerFormValues) {
  const errors: FormikErrors<CustomerFormValues> = {}

  if (!values.name) {
    errors.name = RequiredMessage
  }
  if (!values.cpfCnpj) {
    errors.cpfCnpj = RequiredMessage
  }
  return errors
}
