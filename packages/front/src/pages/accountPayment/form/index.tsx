/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { Transition } from 'react-transition-group'

import { endOfDay, startOfDay } from 'date-fns'
import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import useFilters from '../../..//hooks/filter'
import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DateInput from '../../../components/date-input'
import DecimalInput from '../../../components/form/decimal-input'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { ModalPortal } from '../../../components/modal-portal'
import { RequiredMessage, PaymentMean } from '../../../helpers/constants'
import { toLocaleDate } from '../../../helpers/date'
import { tableMaskMoney } from '../../../helpers/mask'
import { classNames } from '../../../helpers/misc'

interface AccountPaymentFormValues {
  id?: string
  createdAt: Date
  bankAccountId: string
  paymentMeanId: number
  value: number
  accounts: any[]
  accountsSelected: any[]
  modalShow: boolean
  total: number
}

export const AccountPaymentForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const [accountPayment, setAccountPayment] = useState<AccountPaymentFormValues>()
  const [bankAccount, setBanckAccount] = useState([])
  const [provider, setProvider] = useState([])

  const filter = useFilters({
    minDueDate: null,
    maxDueDate: null,
    providerId: '',
    document: '',
    createdAt: new Date(),
  })
  const form = useFormik<AccountPaymentFormValues>({
    initialValues: {
      createdAt: new Date(),
      bankAccountId: '',
      paymentMeanId: 0,
      accounts: [],
      accountsSelected: [],
      value: 0,
      modalShow: false,
      total: 0,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: AccountPaymentFormValues) {
    if (id) {
      axios
        .post(`accountpayment.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/pagamento-contas'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`accountpayment.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/pagamento-contas'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`accountpayment.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setAccountPayment(data)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (accountPayment) {
      setValues(accountPayment)
    }
  }, [accountPayment, setAccountPayment])

  useEffect(() => {
    axios
      .post(`bankaccount.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBanckAccount(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()

    axios
      .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProvider(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [])

  useEffect(() => {
    if (filter) {
      axios
        .post(`accountPayable.list`, filter.values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setValues(prev => ({
            ...prev,
            accounts: data.items.map(account => ({
              ...account,
              selected: false,
              invisible: false,
            })),
            accountsSelected: [],
            value: 0,
          }))
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [filter.values])
  useEffect(() => {
    form.setFieldValue(
      'value',
      entity.accountsSelected.reduce(
        (acc, curr) => acc + parseFloat(curr.value) - parseFloat(curr.discount) + parseFloat(curr.addition),
        0,
      ),
    )
  }, [entity.accountsSelected])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.id}` : 'Novo Pagamento'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg">
                <Field label="Meio de Pamento">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={entity.paymentMeanId}
                    items={PaymentMean}
                    onChange={paymentMean => form.setFieldValue('paymentMeanId', paymentMean?.id)}
                  />
                </Field>
              </div>
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
            </div>
            <div className="row">
              <div className="col-lg kt-align-right">
                <Field>
                  <Button
                    icon="fas fa-search"
                    customClassName="btn-info btn-icon-sm"
                    title="Selecionar Contas"
                    onClick={() => {
                      form.setValues(prev => ({
                        ...prev,
                        modalShow: true,
                      }))
                    }}
                  />
                </Field>
              </div>
            </div>
            <ModalPortal>
              <Transition in={entity.modalShow} timeout={300}>
                {status => (
                  <>
                    <div
                      className={classNames('modal fade', {
                        show: status === 'entered',
                      })}
                      style={{
                        display: status === 'exited' ? 'none' : 'block',
                      }}
                      tabIndex={-1}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div role="document" className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Contas</h5>

                            <Button
                              type="button"
                              className="close"
                              aria-label="close"
                              data-dismiss="modal"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  accounts: entity.accounts.map(account => ({
                                    ...account,
                                    selected: account.invisible,
                                  })),
                                  modalShow: false,
                                }))
                              }}
                            />
                          </div>
                          <div className="modal-body">
                            <div className="kt-portlet__body kt-portlet__body--fit">
                              <div className="row">
                                {' '}
                                <div className="col-lg">
                                  <Field label="Data Inicial do Vencimento">
                                    <DateInput
                                      disabled={false}
                                      onChange={minDueDate => filter.setValues(prev => ({ ...prev, minDueDate }))}
                                      value={
                                        filter.values.minDueDate
                                          ? startOfDay(filter.values.minDueDate)
                                          : filter.values.minDueDate
                                      }
                                    />
                                  </Field>
                                </div>
                                <div className="col-lg">
                                  <Field label="Data Final do Vencimento">
                                    <DateInput
                                      disabled={false}
                                      onChange={maxDueDate => filter.setValues(prev => ({ ...prev, maxDueDate }))}
                                      value={
                                        filter.values.maxDueDate
                                          ? endOfDay(filter.values.maxDueDate)
                                          : filter.values.maxDueDate
                                      }
                                    />
                                  </Field>
                                </div>
                                <div className="col-lg">
                                  <Field label="Fornecedor">
                                    <Select
                                      getId={({ id }) => id}
                                      getDisplay={({ name }) => name}
                                      selected={filter.values.providerId}
                                      items={provider}
                                      onChange={providerId => filter.setValues(prev => ({ ...prev, providerId }))}
                                    />
                                  </Field>
                                </div>
                                <div className="col-lg">
                                  <Field label="Nº Documento">
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
                              </div>
                              <div className="row">
                                <div className="col-lg kt-align-right">
                                  <Field>
                                    <Button
                                      customClassName="btn-info btn-icon-sm"
                                      icon="fas fa-search"
                                      onClick={() => {
                                        axios
                                          .post(`accountPayable.list`, filter.values, {
                                            headers: { Authorization: `Bearer ${saToken}` },
                                          })
                                          .then(({ data }) => {
                                            form.setValues(prev => ({
                                              ...prev,
                                              accounts: data.items.map(account => ({
                                                ...account,
                                                selected: false,
                                                invisible: false,
                                              })),
                                              accountsSelected: [],
                                              value: 0,
                                            }))
                                          })
                                          .catch(err => modal?.alert(err.message))
                                          .finally()
                                      }}
                                      title="Consultar"
                                    />
                                  </Field>
                                </div>
                              </div>
                              <div
                                className={classNames(
                                  'report-irregular kt-datatable kt-datatable--default kt-datatable--brand',
                                  {
                                    'kt-datatable--loaded': entity.accounts.length > 0,
                                  },
                                )}
                              >
                                <table className="kt-datatable__table">
                                  <thead className="kt-datatable__head">
                                    <tr className="kt-datatable__row">
                                      <th className="kt-datatable__cell">
                                        <span>Descrição</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Vencimento</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Fornecedor</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Nº Nota</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Valor</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Desconto</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Acréscimo</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Total</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span />
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="kt-datatable__body">
                                    {entity.accounts.map(
                                      i =>
                                        !i.invisible && (
                                          <tr key={i.id} className="kt-datatable__row">
                                            <td className="kt-datatable__cell">
                                              <div>{i.description}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{toLocaleDate(i.dueDate)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{i.providerName}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{i.number || ''}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(i.value)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(i.discount)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(i.addition)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>
                                                {tableMaskMoney(
                                                  parseFloat(i.value) - parseFloat(i.discount) + parseFloat(i.addition),
                                                )}
                                              </div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <Button
                                                icon={i.selected ? 'fas fa-minus' : 'fas fa-plus'}
                                                customClassName={`${
                                                  i.selected ? 'btn-danger' : 'btn-success'
                                                } btn-icon-sm`}
                                                title=""
                                                onClick={() => {
                                                  form.setValues(prev => ({
                                                    ...prev,
                                                    accounts: entity.accounts.map(account =>
                                                      account.id === i.id
                                                        ? {
                                                            ...account,
                                                            selected: !i.selected,
                                                          }
                                                        : account,
                                                    ),
                                                  }))
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        ),
                                    )}
                                  </tbody>
                                </table>
                                {entity.accounts.length === 0 && (
                                  <div className="kt-datatable--error">Nenhum item foi encontrado.</div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <Button
                              type="button"
                              customClassName="btn-secondary"
                              icon="fas fa-arrow-left"
                              title="Voltar"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  accounts: entity.accounts.map(account => ({
                                    ...account,
                                    selected: account.invisible,
                                  })),
                                  modalShow: false,
                                }))
                              }}
                            />
                            <Button
                              customClassName="btn-primary"
                              title="Ir para Pagamento"
                              icon="fas fa-hand-holding-usd"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  accounts: entity.accounts.map(account => ({
                                    ...account,
                                    invisible: account.selected,
                                  })),
                                  accountsSelected: entity.accounts.filter(account => account.selected === true),
                                  modalShow: false,
                                }))
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {status !== 'exited' && (
                      <div
                        className={classNames('modal-backdrop fade', {
                          show: status === 'entered',
                        })}
                      />
                    )}
                  </>
                )}
              </Transition>
            </ModalPortal>
            <div className="row">
              <div className="col-lg">
                <p className="table-label">Contas selecionadas:</p>
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
                        <span>Descrição</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Vencimento</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Fornecedor</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Nº Nota</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Valor</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Desconto</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Acréscimo</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Total</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="kt-datatable__body">
                    {entity.accountsSelected.map(i => (
                      <tr key={i.id} className="kt-datatable__row">
                        <td className="kt-datatable__cell">
                          <div>{i.description}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{toLocaleDate(i.dueDate)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{i.providerName}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{i.document || ''}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(i.value)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(i.discount)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(i.addition)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>
                            {tableMaskMoney(parseFloat(i.value) - parseFloat(i.discount) + parseFloat(i.addition))}
                          </div>
                        </td>
                        <td className="kt-datatable__cell">
                          <Button
                            icon="fas fa-minus"
                            customClassName="btn-danger btn-icon-sm"
                            title=""
                            onClick={() => {
                              form.setValues(prev => ({
                                ...prev,
                                accounts: entity.accounts.map(account =>
                                  account.id === i.id
                                    ? {
                                        ...account,
                                        selected: false,
                                        invisible: false,
                                      }
                                    : account,
                                ),
                                accountsSelected: entity.accountsSelected.filter(account => account.id !== i.id),
                              }))
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {entity.accountsSelected.length === 0 && (
                  <div className="kt-datatable--error">Nenhum item foi selecionado.</div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-9" />
              <div className="col-lg">
                <Field label="Total Pagamento">
                  <DecimalInput id="value" name="value" disabled={true} />
                </Field>
              </div>
            </div>
            <br />
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
                    onClick={() => pushTo('/pagamento-contas')}
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
function validateForm(values: AccountPaymentFormValues) {
  const errors: FormikErrors<AccountPaymentFormValues> = {}

  if (!values.bankAccountId) errors.bankAccountId = RequiredMessage
  if (!values.paymentMeanId) errors.paymentMeanId = RequiredMessage
  if (values.accountsSelected.length === 0) errors.bankAccountId = 'Selecione pelo menos uma conta para pagar.'
  return errors
}
