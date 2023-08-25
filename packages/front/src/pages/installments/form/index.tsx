/* eslint-disable @typescript-eslint/no-explicit-any */
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
import SwitchInput from '../../../components/form/switch'
import { TextInput } from '../../../components/form/text-input'
import { getCustomers } from '../../../helpers'
import { RequiredMessage } from '../../../helpers/constants'
import { classNames } from '../../../helpers/misc'

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
  bankAccountId?: string | null
  bankSlip?: boolean
  customerApoioId?: string
  installments?: number
  subAccounts: SubAccounts[]
  Customer?: any
}

export const InstallmentForm = () => {
  const { modal, saToken, parameter } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [bankAccount, setBanckAccount] = useState([])
  const { id } = useParams()
  const pushTo = useNavigate()
  const [installment, setInstallment] = useState<InstallmentFormValues>()

  const [customer, setCustomer] = useState([])
  const form = useFormik<InstallmentFormValues>({
    initialValues: {
      createdAt: new Date(),
      numeroDoc: '',
      customerId: '',
      numberInstallment: 1,
      dueDate: new Date(),
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
        .catch(err => modal?.alert(err.message))
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
      .catch(err => modal?.alert(err.message))
      .finally()
    if (parameter?.getApoio) {
      getCustomers().then(resp => {
        setCustomer(resp)
      })
    } else {
      axios
        .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomer(data.items)
        })
        .catch(err => modal?.alert(err.message))
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
            value: entity.value / (entity.installments || 0),
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
                    getId={({ id, uuid }) => (parameter?.getApoio ? uuid : id)}
                    getDisplay={({ name }) => name}
                    selected={parameter?.getApoio ? entity.customerApoioId : entity.customerId}
                    items={customer}
                    onChange={company => {
                      if (parameter?.getApoio) {
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
                    isLoading={false || undefined}
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
