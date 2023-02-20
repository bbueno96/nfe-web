/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import { endOfDay, startOfDay, addMonths } from 'date-fns'
import { FieldArray, FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import useFilters from '../..//hooks/filter'
import { useApp } from '../../App'
import { Button } from '../../components/button'
import DateInput from '../../components/date-input'
import DateInputForm from '../../components/form/date-input'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import SwitchInput from '../../components/form/switch'
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import { getCustomers } from '../../helpers'
import { RequiredMessage } from '../../helpers/constants'
import { toLocaleDate } from '../../helpers/date'
import { maskMoney } from '../../helpers/mask'
import { classNames, iframeDownload } from '../../helpers/misc'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'
interface InstallmentsListValues {
  id?: string
  createdAt: Date
  dueDate: Date
  numeroDoc: string
  customerName: string
  nfe?: number
  paymentMethodName: string
  value: number
  accountPaymentId: string
  fine: number
  interest: number
  paid: boolean
  numberInstallment: number
  ourNumber?: string
}
interface SubAccounts {
  numberInstallment: number
  dueDate: Date
  value: number
}

interface InstallmentFormValues {
  id?: string
  numeroDoc: string
  customerId?: string
  numberInstallment: number
  dueDate: Date
  paid: boolean
  value: number
  createdAt?: Date
  discount?: number
  addition?: number
  bankAccountId?: string
  bankSlip?: boolean
  customerApoioId?: string
  installments?: number
  subAccounts: SubAccounts[]
  Customer?: any
}

export const InstallmentsList = () => {
  const { modal, saToken, parameter } = useApp()
  const refresh = useRefresh()
  const [providers, setCustomers] = useState([])
  const filter = useFilters({
    minCreatedAtDate: startOfDay(new Date()),
    maxCreatedAtDate: endOfDay(new Date()),
    minDueDate: null,
    maxDueDate: null,
    customer: '',
    numeroDoc: '',
    isPaid: null,
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<InstallmentsListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('installment.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal.alert(err.message))
      .finally(() => setFetching(false))
    if (parameter.getApoio) {
      getCustomers().then(resp => {
        setCustomers(resp.filter(e => e.type === 1 || e.type === 2))
      })
    } else {
      axios
        .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomers(data.items)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-hand-holding-usd" />
            </span>
            <h3 className="kt-portlet__head-title">Contas a Receber</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Contas a Receber
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Data Inicial Cadastro">
                  <DateInput
                    disabled={false}
                    onChange={minCreatedAtDate => filter.setValues(prev => ({ ...prev, minCreatedAtDate }))}
                    value={filter.values.minCreatedAtDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Cadastro">
                  <DateInput
                    disabled={false}
                    onChange={maxCreatedAtDate => filter.setValues(prev => ({ ...prev, maxCreatedAtDate }))}
                    value={filter.values.maxCreatedAtDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Inicial Vencimento">
                  <DateInput
                    disabled={false}
                    onChange={minDueDate => filter.setValues(prev => ({ ...prev, minDueDate }))}
                    value={filter.values.minDueDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Vencimento">
                  <DateInput
                    disabled={false}
                    onChange={maxDueDate => filter.setValues(prev => ({ ...prev, maxDueDate }))}
                    value={filter.values.maxDueDate}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Cliente">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={parameter.getApoio ? ({ uuid }) => uuid : ({ id }) => id}
                    selected={filter.values.customer}
                    items={providers}
                    onChange={customer =>
                      parameter.getApoio
                        ? filter.setValues(prev => ({ ...prev, customer: customer?.uuid }))
                        : filter.setValues(prev => ({ ...prev, customer: customer?.id }))
                    }
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Documento">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="numeroDoc"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.numeroDoc}
                    />
                  </div>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Paga">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={({ value }) => value}
                    selected={filter.values.isPaid}
                    items={[
                      { value: null, name: 'Todos' },
                      { value: true, name: 'Sim' },
                      { value: false, name: 'Não' },
                    ]}
                    onChange={i => filter.setValues(prev => ({ ...prev, isPaid: i?.value }))}
                  />
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
                      .post('installment.list', filter.values, {
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
            actions={[
              { icon: 'fas fa-edit', title: 'Editar', action: '/receber/:id' },
              {
                icon: `fas fa-print`,
                title: 'Imprimir Boletos',
                action: ent => {
                  axios
                    .get(`boletoInstallment.report/${ent.id}`, {
                      responseType: 'blob',
                      headers: { Authorization: `Bearer ${saToken}` },
                    })
                    .then(response => {
                      iframeDownload(response.data, `${ent.numeroDoc}.pdf`)
                    })
                    .catch(err => modal.alert(err.message))
                    .finally()
                },
                hideWhen: ent => !ent.ourNumber,
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<InstallmentsListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'customerName', title: 'Cliente' },
  { path: 'numeroDoc', title: 'numero Doc.' },
  { path: 'numberInstallment', title: 'Parcela' },
  { path: 'dueDate', title: 'Vencimento', format: f => toLocaleDate(f) },
  { path: 'value', title: 'Valor', format: f => maskMoney(f) },
  { path: 'paid', title: 'Paga', format: (f: boolean) => (f ? 'Sim' : 'Não') },
]

export const InstallmentForm = () => {
  const { modal, saToken, parameter } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [bankAccount, setBanckAccount] = useState([])
  const { id } = useParams()
  const pushTo = useNavigate()
  const [installment, setInstallment] = useState<InstallmentFormValues>(null)

  const [customer, setCustomer] = useState([])
  const form = useFormik<InstallmentFormValues>({
    initialValues: {
      createdAt: new Date(),
      numeroDoc: '',
      customerId: '',
      numberInstallment: 1,
      dueDate: null,
      paid: false,
      value: 0,
      bankAccountId: null,
      bankSlip: false,
      subAccounts: [],
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: InstallmentFormValues) {
    if (id) {
      axios
        .post(`installment.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/receber'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`installment.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/receber'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form

  useEffect(() => {
    if (id) {
      axios
        .get(`installment.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setInstallment(data)
          form.setFieldValue('subAccounts', [])
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (installment) {
      setValues(installment)
      form.setFieldValue('subAccounts', [])
    }
  }, [installment, setInstallment])

  useEffect(() => {
    axios
      .post(`bankaccount.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBanckAccount(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
    if (parameter.getApoio) {
      getCustomers().then(resp => {
        setCustomer(resp)
      })
    } else {
      axios
        .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomer(data.items)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [])
  useEffect(() => {
    if (entity.value && entity.dueDate && !id) {
      form.setFieldValue(
        'subAccounts',
        Array(entity.installments)
          .fill('')
          .map((_, i) => ({
            numberInstallment: i + 1,
            dueDate: new Date(addMonths(entity.dueDate, i)),
            value: entity.value / entity.installments,
          })),
      )
    }
  }, [entity.installments])

  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.numeroDoc}` : 'Nova Conta a Receber'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg">
                <Field label="Cliente">
                  <Select
                    getId={({ id, uuid }) => (parameter.getApoio ? uuid : id)}
                    getDisplay={({ name }) => name}
                    selected={parameter.getApoio ? entity.customerApoioId : entity.customerId}
                    items={customer}
                    onChange={company => {
                      if (parameter.getApoio) {
                        const properties = company.properties[0]
                        form.setFieldValue('Customer.customerApoioId', company?.uuid)
                        form.setFieldValue('Customer.cpfCnpj', properties.cpfCnpj)
                        form.setFieldValue('Customer.name', properties.name)
                        form.setFieldValue('Customer.email', properties.email)
                        form.setFieldValue('Customer.phone', properties.phone)
                        form.setFieldValue('Customer.mobilePhone', properties.phone)
                        form.setFieldValue('Customer.dateCreated', new Date())
                        form.setFieldValue('Customer.additionalEmails', properties.additionalEmails)
                        form.setFieldValue('Customer.address', properties.streetName)
                        form.setFieldValue('Customer.addressNumber', properties.streetNumber)
                        form.setFieldValue('Customer.complement', properties.complement)
                        form.setFieldValue('Customer.province', properties.district)
                        form.setFieldValue('Customer.postalCode', properties.postalCode)
                        form.setFieldValue('Customer.stateInscription', properties.rgIeIp)
                        form.setFieldValue('Customer.state', properties.state)
                        form.setFieldValue('Customer.city', properties.city)
                        form.setFieldValue('Customer.cityId', properties.city)
                      } else {
                        form.setFieldValue('customerId', company?.id)
                        form.setFieldValue('Customer', company)
                      }
                    }}
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    isClearable={true}
                    styles={undefined}
                  ></Select>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Vencimento">
                  <DateInputForm id="dueDate" name="dueDate" />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Valor">
                  <DecimalInput id="value" name="value" disabled={false} icon="fas fa-dollar-sign" />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Desconto">
                  <DecimalInput id="discount" name="discount" disabled={entity.discount} icon="fas fa-dollar-sign" />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Acréscimo">
                  <DecimalInput id="addition" name="addition" disabled={entity.addition} icon="fas fa-dollar-sign" />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Conta">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={entity.bankAccountId}
                    items={bankAccount}
                    onChange={bankAccount => form.setFieldValue('bankAccountId', bankAccount?.id)}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Documento">
                  <TextInput
                    id="numeroDoc"
                    autoComplete="numeroDoc"
                    placeholder="numeroDoco"
                    customClassName="form-control"
                    value={entity.numeroDoc}
                  />
                </Field>
              </div>
              <div className="col-lg-2">
                <Field label="Gerar Boleto">
                  <SwitchInput id={'bankSlip'} name={'bankSlip'} />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Parcela N°">
                  <DecimalInput id="numberInstallment" name="numberInstallment" disabled={false} precision={0} />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Total Parcelas">
                  <DecimalInput id="installments" name="installments" disabled={false} precision={0} />
                </Field>
              </div>
            </div>

            {entity.subAccounts.length > 0 && (
              <FieldArray
                name="subAccounts"
                render={() => (
                  <>
                    <div className="row">
                      <div className="col-lg">
                        <p className="table-label">Parcelas:</p>
                      </div>
                    </div>
                    <div className="kt-portlet__body kt-portlet__body--fit">
                      <div
                        className={classNames(
                          'report-irregular kt-datatable kt-datatable--default kt-datatable--brand kt-datatable--loaded',
                        )}
                      >
                        <table className="kt-datatable__table">
                          <thead className="kt-datatable__head">
                            <tr className="kt-datatable__row">
                              <th className="kt-datatable__cell">
                                <span>Nº da Parcela</span>
                              </th>
                              <th className="kt-datatable__cell">
                                <span>Data de Vencimento</span>
                              </th>
                              <th className="kt-datatable__cell">
                                <span>Valor</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="kt-datatable__body">
                            {entity.subAccounts.map((account, i) => (
                              <tr key={i} className="kt-datatable__row">
                                <td className="kt-datatable__cell">
                                  <div>
                                    {`00${account.numberInstallment}`.slice(-2)}/{`00${entity.installments}`.slice(-2)}
                                  </div>
                                </td>
                                <td className="kt-datatable__cell">
                                  <DateInputForm id={`subAccounts.${i}.dueDate`} name={`subAccounts.${i}.dueDate`} />
                                </td>
                                <td className="kt-datatable__cell">
                                  <DecimalInput
                                    id={`subAccounts.${i}.value`}
                                    name={`subAccounts.${i}.value`}
                                    disabled={false}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              />
            )}
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
          </div>
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
                    onClick={() => pushTo('/receber')}
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
        </form>
      </div>
    </FormikProvider>
  )
}
function validateForm(values: InstallmentFormValues) {
  const errors: FormikErrors<InstallmentFormValues> = {}

  if (!values.Customer) errors.customerId = RequiredMessage

  return errors
}
