/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'
import { Transition } from 'react-transition-group'

import { format } from 'date-fns'
import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import useFilters from '../..//hooks/filter'
import { useApp } from '../../App'
import { Button } from '../../components/button'
import DateInput from '../../components/date-input'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import { List, ListColumn } from '../../components/list'
import { ModalPortal } from '../../components/modal-portal'
import { getCustomers } from '../../helpers'
import { RequiredMessage } from '../../helpers/constants'
import { toLocaleDate } from '../../helpers/date'
import { tableMaskMoney } from '../../helpers/mask'
import { classNames, forceDownload } from '../../helpers/misc'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface BankRemittanceListValues {
  id?: string
  createdAt: Date
  bankAccountDescription: string
  numberLot: number
  wallet: number
}

interface BankRemittanceFormValues {
  id?: string
  createdAt: Date
  bankAccountId: string
  bankAccountInstitution: number
  value: number
  installments: any[]
  installmentsSelected: any[]
  modalShow: boolean
  total: number
  wallet: number
}

export const BankRemittanceList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()
  const [bankAccount, setBanckAccount] = useState([])
  const filter = useFilters({
    minDueDate: null,
    maxDueDate: null,
    paymentMeanId: '',
    bankAccountId: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<BankRemittanceListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('bankremittance.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal.alert(err.message))
      .finally(() => setFetching(false))
    axios
      .post(`bankaccount.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBanckAccount(data.items)
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
            <h3 className="kt-portlet__head-title">Registro de Boletos</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Registro
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Data Inicial">
                  <DateInput
                    disabled={false}
                    onChange={minDueDate => filter.setValues(prev => ({ ...prev, minDueDate }))}
                    value={filter.values.minDueDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final">
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
                <Field label="Conta">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={filter.values.customerId}
                    items={bankAccount}
                    onChange={Account => filter.setValues(prev => ({ ...prev, bankAccountId: Account?.id }))}
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
            actions={[]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<BankRemittanceListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'numberLot', title: 'Numero do Lote' },
  { path: 'bankAccountDescription', title: 'Conta' },
  { path: 'wallet', title: 'Carteira' },
]

export const BankRemittanceForm = () => {
  const { modal, saToken, parameter } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const [bankRemittance, setBankRemittance] = useState<BankRemittanceFormValues>(null)
  const [bankAccount, setBanckAccount] = useState([])
  const [provider, setProvider] = useState([])
  function getCodMes(mes) {
    if (mes > 9) {
      return mes === 10 ? 'O' : mes === 11 ? 'N' : 'D'
    } else {
      return mes
    }
  }
  const form = useFormik<BankRemittanceFormValues>({
    initialValues: {
      createdAt: new Date(),
      bankAccountId: '',
      bankAccountInstitution: null,
      installments: [],
      installmentsSelected: [],
      value: 0,
      modalShow: false,
      total: 0,
      wallet: null,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  const filter = useFilters({
    customerApoioName: '',
    minDueDate: null,
    maxDueDate: null,
    customer: '',
    document: '',
    isPaid: false,
    createdAt: new Date(),
    bankRemittanceId: null,
    ourNumer: null,
    perPage: false,
    bankAccountId: '',
    wallet: null,
    bankRemittance: true,
  })

  function handleSubmit(values: BankRemittanceFormValues) {
    if (id) {
      axios
        .post(`accountpayment.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/registro'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(
          `${
            entity.bankAccountInstitution === 237
              ? 'installment.remittance.bradesco'
              : entity.bankAccountInstitution === 748
              ? 'installment.remittance.sicredi'
              : ''
          }`,
          values,
          {
            responseType: 'blob',
            headers: { Authorization: `Bearer ${saToken}` },
          },
        )
        .then(response => {
          forceDownload(
            response.data,
            `${
              entity.bankAccountInstitution === 237
                ? `CB${format(new Date(), 'ddMM')}${Math.random().toString(36).slice(2).slice(0, 2)}`
                : entity.bankAccountInstitution === 748
                ? `34269${getCodMes(entity.createdAt.getMonth() + 1)}${format(new Date(), 'dd')}`
                : ''
            }${
              entity.bankAccountInstitution === 237 ? '.REM' : entity.bankAccountInstitution === 748 ? '.CRM' : '.REM'
            }`,
          )
          pushTo('/registro')
        })
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
          setBankRemittance(data)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (bankRemittance) {
      setValues(bankRemittance)
    }
  }, [bankRemittance, setBankRemittance])

  useEffect(() => {
    axios
      .post(`bankaccount.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBanckAccount(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()

    if (parameter.getApoio) {
      getCustomers().then(resp => {
        setProvider(resp)
      })
    } else {
      axios
        .post(`customer.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setProvider(data.items)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [])

  useEffect(() => {
    if (filter) {
      axios
        .post(`installment.list`, filter.values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setValues(prev => ({
            ...prev,
            installments: data.items.map(account => ({
              ...account,
              selected: false,
              invisible: false,
            })),
            installmentsSelected: [],
          }))
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [filter.values])

  useEffect(() => {
    if (entity.bankAccountId) {
      filter.setValues(prev => ({ ...prev, bankAccountId: entity.bankAccountId }))
    }
  }, [entity.bankAccountId])

  useEffect(() => {
    if (entity.wallet) {
      filter.setValues(prev => ({ ...prev, wallet: entity.wallet }))
    }
  }, [entity.wallet])

  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.id}` : 'Novo Registro'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg">
                <Field label="Conta">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={entity.bankAccountId}
                    items={bankAccount}
                    onChange={bankAccount => {
                      form.setFieldValue('bankAccountId', bankAccount?.id)
                      form.setFieldValue('bankAccountInstitution', bankAccount?.institution)
                      form.setFieldValue('wallet', bankAccount?.wallet)
                    }}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Carteira">
                  <DecimalInput id="wallet" name="wallet" disabled={false} precision={0} />
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
                                  installments: entity.installments.map(account => ({
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
                                      value={filter.values.minDueDate}
                                    />
                                  </Field>
                                </div>
                                <div className="col-lg">
                                  <Field label="Data Final do Vencimento">
                                    <DateInput
                                      disabled={false}
                                      onChange={maxDueDate => filter.setValues(prev => ({ ...prev, maxDueDate }))}
                                      value={filter.values.maxDueDate}
                                    />
                                  </Field>
                                </div>
                                {parameter.getApoio ? (
                                  <div className="col-lg">
                                    <Field label="Cliente">
                                      <Select
                                        getId={({ id }) => id}
                                        getDisplay={({ name }) => name}
                                        selected={filter.values.customerApoioName}
                                        items={provider}
                                        onChange={customer =>
                                          filter.setValues(prev => ({ ...prev, customerApoioName: customer?.name }))
                                        }
                                      />
                                    </Field>
                                  </div>
                                ) : (
                                  <div className="col-lg">
                                    <Field label="Cliente">
                                      <Select
                                        getId={({ id }) => id}
                                        getDisplay={({ name }) => name}
                                        selected={filter.values.customerId}
                                        items={provider}
                                        onChange={customer =>
                                          filter.setValues(prev => ({ ...prev, customer: customer?.id }))
                                        }
                                      />
                                    </Field>
                                  </div>
                                )}
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
                                <div className="col-lg">
                                  <Field label="Conta">
                                    <Select
                                      getDisplay={({ description }) => description}
                                      getId={({ id }) => id}
                                      selected={filter.values.bankAccountId}
                                      items={bankAccount}
                                      onChange={bankAccount =>
                                        filter.setValues(prev => ({ ...prev, bankAccountId: bankAccount?.id }))
                                      }
                                    />
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
                                          .post(`installment.list`, filter.values, {
                                            headers: { Authorization: `Bearer ${saToken}` },
                                          })
                                          .then(({ data }) => {
                                            form.setValues(prev => ({
                                              ...prev,
                                              installments: data.items.map(account => ({
                                                ...account,
                                                selected: false,
                                                invisible: false,
                                              })),
                                              installmentsSelected: [],
                                              value: 0,
                                            }))
                                          })
                                          .catch(err => modal.alert(err.message))
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
                                    'kt-datatable--loaded': entity.installments.length > 0,
                                  },
                                )}
                              >
                                <table className="kt-datatable__table">
                                  <thead className="kt-datatable__head">
                                    <tr className="kt-datatable__row">
                                      <th className="kt-datatable__cell">
                                        <span>Vencimento</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Cliente</span>
                                      </th>
                                      <th className="kt-datatable__cell">
                                        <span>Nosso Número</span>
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
                                    {entity.installments.map(
                                      i =>
                                        !i.invisible && (
                                          <tr key={i.id} className="kt-datatable__row">
                                            <td className="kt-datatable__cell">
                                              <div>{toLocaleDate(i.dueDate)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{i.customerName}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{i.ourNumber}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{i.nfe || ''}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(i.value)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(0.0)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(0.0)}</div>
                                            </td>
                                            <td className="kt-datatable__cell">
                                              <div>{tableMaskMoney(parseFloat(i.value) - 0 + 0)}</div>
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
                                                    installments: entity.installments.map(account =>
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
                                {entity.installments.length === 0 && (
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
                                  installments: entity.installments.map(account => ({
                                    ...account,
                                    selected: account.invisible,
                                  })),
                                  modalShow: false,
                                }))
                              }}
                            />
                            <Button
                              customClassName="btn-primary"
                              title="Ir para Registro"
                              icon="fas fa-hand-holding-usd"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  installments: entity.installments.map(account => ({
                                    ...account,
                                    invisible: account.selected,
                                  })),
                                  installmentsSelected: entity.installments.filter(
                                    account => account.selected === true,
                                  ),
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
                        <span>Vencimento</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Cliente</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Nº Nota</span>
                      </th>
                      <th className="kt-datatable__cell">
                        <span>Nosso Numero</span>
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
                    {entity.installmentsSelected.map(i => (
                      <tr key={i.id} className="kt-datatable__row">
                        <td className="kt-datatable__cell">
                          <div>{toLocaleDate(i.dueDate)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{i.customerName}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{i.nfe || ''}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{i.ourNumber || ''}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(i.value)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(0)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(0)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <div>{tableMaskMoney(parseFloat(i.value) - 0 + 0)}</div>
                        </td>
                        <td className="kt-datatable__cell">
                          <Button
                            icon="fas fa-minus"
                            customClassName="btn-danger btn-icon-sm"
                            title=""
                            onClick={() => {
                              form.setValues(prev => ({
                                ...prev,
                                installments: entity.installments.map(account =>
                                  account.id === i.id
                                    ? {
                                        ...account,
                                        selected: false,
                                        invisible: false,
                                      }
                                    : account,
                                ),
                                installmentsSelected: entity.installmentsSelected.filter(
                                  account => account.id !== i.id,
                                ),
                              }))
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {entity.installmentsSelected.length === 0 && (
                  <div className="kt-datatable--error">Nenhum item foi selecionado.</div>
                )}
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
                    onClick={() => pushTo('/registro')}
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
function validateForm(values: BankRemittanceFormValues) {
  const errors: FormikErrors<BankRemittanceFormValues> = {}

  if (!values.bankAccountId) errors.bankAccountId = RequiredMessage
  if (values.wallet <= 0) errors.wallet = RequiredMessage
  if (values.installmentsSelected.length === 0) errors.bankAccountId = 'Selecione pelo menos uma conta para pagar.'
  return errors
}
