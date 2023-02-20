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
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import { RequiredMessage } from '../../helpers/constants'
import { toLocaleDate } from '../../helpers/date'
import { maskMoney } from '../../helpers/mask'
import { classNames } from '../../helpers/misc'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface AccountPayableListValues {
  id?: string
  createdAt: Date
  dueDate: Date
  description: string
  providerName: string
  document?: string
  classificationDescription: string
  value: number
  accountPaymentId: string
}
interface SubAccounts {
  numberInstallment: number
  dueDate: Date
  value: number
}
interface AccountPayableFormValues {
  id?: string
  createdAt: Date
  dueDate: Date
  description: string
  providerId?: string
  document?: string
  classificationId?: string
  value: number
  accountPaymentId?: string
  discount?: number
  addition?: number
  numberInstallment?: number
  installments?: number
  subAccounts: SubAccounts[]
  providerName?: string
  global?: string
}

export const AccountPayableList = () => {
  const { modal, saToken } = useApp()

  const refresh = useRefresh()
  const [providers, setProviders] = useState([])
  const filter = useFilters({
    minCreatedAtDate: startOfDay(new Date()),
    maxCreatedAtDate: endOfDay(new Date()),
    minDueDate: null,
    maxDueDate: null,
    providerId: '',
    document: '',
    isPaid: null,
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<AccountPayableListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('accountpayable.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal.alert(err.message))
      .finally(() => setFetching(false))

    axios
      .post(`provider.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProviders(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-hand-holding-usd" />
            </span>
            <h3 className="kt-portlet__head-title">Contas a Pagar</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Contas a Pagar
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
                <Field label="Fornecedor">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={({ id }) => id}
                    selected={filter.values.providerId}
                    items={providers}
                    onChange={provider => filter.setValues(prev => ({ ...prev, providerId: provider.id }))}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Documento">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="document"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.document}
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
                    onChange={i => filter.setValues(prev => ({ ...prev, isPaid: i.value }))}
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
                      .post('accountpayable.list', filter.values, {
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
            actions={[{ icon: 'fas fa-edit', title: 'Editar', action: '/conta-pagar/:id' }]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<AccountPayableListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'description', title: 'Descrição' },
  { path: 'dueDate', title: 'Vencimento', format: f => toLocaleDate(f) },
  { path: 'providerName', title: 'Fornecedor' },
  { path: 'document', title: 'Documento' },
  { path: 'classificationDescription', title: 'Classificação' },
  { path: 'value', title: 'Valor', format: f => maskMoney(f) },
  { path: 'accountPaymentId', title: 'Paga', format: (f: string) => (f ? 'Sim' : 'Não') },
]

export const AccountPayableForm = () => {
  const { modal, saToken } = useApp()

  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const [accountPayable, setAccountPayable] = useState<AccountPayableFormValues>(null)
  const [classifications, setClassifications] = useState([])
  const [providers, setProviders] = useState([])
  const form = useFormik<AccountPayableFormValues>({
    initialValues: {
      createdAt: new Date(),
      description: '',
      dueDate: new Date(),
      document: '',
      classificationId: '',
      value: 0,
      providerId: '',
      discount: 0,
      addition: 0,
      numberInstallment: 1,
      installments: 1,
      providerName: '',
      subAccounts: [],
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: AccountPayableFormValues) {
    if (id) {
      axios
        .post(`accountpayable.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/conta-pagar'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`accountpayable.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/conta-pagar'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`accountpayable.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setAccountPayable(data)
          form.setFieldValue('subAccounts', [])
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (accountPayable) {
      setValues(accountPayable)
      form.setFieldValue('subAccounts', [])
    }
  }, [accountPayable, setAccountPayable])

  useEffect(() => {
    axios
      .post(`classification.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setClassifications(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()

    axios
      .post(`provider.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProviders(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
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
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.description}` : 'Nova Conta a Pagar'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg">
                <Field label="Descrição">
                  <TextInput
                    id="description"
                    autoComplete="descrição"
                    placeholder="descrição"
                    customClassName="form-control"
                    value={entity.description}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Vencimento">
                  <DateInputForm id="dueDate" name="dueDate" />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Classificação">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={entity.classificationId}
                    items={classifications}
                    onChange={classification => form.setFieldValue('classificationId', classification?.id)}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Valor">
                  <DecimalInput id="value" name="value" disabled={entity.accountPaymentId} icon="fas fa-dollar-sign" />
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
                <Field label="Fornecedor">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={({ id }) => id}
                    selected={entity.providerId}
                    items={providers}
                    onChange={provider => {
                      form.setFieldValue('providerId', provider?.id)
                      form.setFieldValue('providerName', provider?.name)
                    }}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Documento">
                  <TextInput
                    id="document"
                    autoComplete="document"
                    placeholder="Documento"
                    customClassName="form-control"
                    value={entity.document}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Parcela N°">
                  <DecimalInput
                    id="numberInstallment"
                    name="numberInstallment"
                    disabled={entity.accountPaymentId || entity.id}
                    precision={0}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Total Parcelas">
                  <DecimalInput
                    id="installments"
                    name="installments"
                    disabled={entity.accountPaymentId || entity.id}
                    precision={0}
                  />
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
                    onClick={() => pushTo('/conta-pagar')}
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
function validateForm(values: AccountPayableFormValues) {
  const errors: FormikErrors<AccountPayableFormValues> = {}

  if (!values.description) errors.description = RequiredMessage
  else if (values.description.length > 80) errors.description = 'O nome deve ter no máximo 80 caracteres.'

  if (!values.dueDate) errors.dueDate = RequiredMessage

  if (!values.value) errors.value = RequiredMessage

  if (values.subAccounts.length > 0) {
    if (values.subAccounts.some(a => !a.dueDate)) errors.global = 'Todas as parcelas devem ter data de vencimento.'
    if (values.subAccounts.some(a => !a.value)) errors.global = 'Todas as parcelas devem ter valor.'
    if (values.subAccounts.reduce((acc, curr) => acc + curr.value, 0) !== values.value)
      errors.global = 'A soma das parcelas deve ser igual ao valor da conta.'
  }
  return errors
}
