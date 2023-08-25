import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import { addMonths } from 'date-fns'
import { FieldArray, FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DateInputForm from '../../../components/form/date-input'
import DecimalInput from '../../../components/form/decimal-input'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { RequiredMessage } from '../../../helpers/constants'
import { classNames } from '../../../helpers/misc'

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
  document?: string | null
  classificationId?: string | null
  value: number
  accountPaymentId?: string | null
  discount?: number
  addition?: number
  numberInstallment?: number
  installments?: number
  subAccounts: SubAccounts[]
  providerName?: string | null
  global?: string
  companyId?: string | null
  classificationDescription?: string | null
}

export const AccountPayableForm = () => {
  const { modal, saToken } = useApp()

  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const [accountPayable, setAccountPayable] = useState<AccountPayableFormValues>()
  const [classifications, setClassifications] = useState([])
  const [providers, setProviders] = useState([])
  const form = useFormik<AccountPayableFormValues>({
    initialValues: {
      createdAt: new Date(),
      description: '',
      dueDate: new Date(),
      document: '',
      classificationId: null,
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
        .catch(err => modal?.alert(err.message))
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
      .catch(err => modal?.alert(err.message))
      .finally()

    axios
      .post(`provider.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProviders(data.items)
      })
      .catch(err => modal?.alert(err.message))
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
            value: entity.value / (entity?.installments ?? 0),
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
                    value={entity.document ?? ''}
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

  if (values.subAccounts) {
    if (values.subAccounts.some(a => !a.dueDate)) errors.global = 'Todas as parcelas devem ter data de vencimento.'
    if (values.subAccounts.some(a => !a.value)) errors.global = 'Todas as parcelas devem ter valor.'
    if (values.subAccounts.reduce((acc, curr) => acc + curr.value, 0) !== values.value)
      errors.global = 'A soma das parcelas deve ser igual ao valor da conta.'
  }
  return errors
}
