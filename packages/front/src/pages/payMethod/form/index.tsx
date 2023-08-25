import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DecimalInput from '../../../components/form/decimal-input'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import SwitchInput from '../../../components/form/switch'
import { TextInput } from '../../../components/form/text-input'
import { classNames } from '../../../helpers/misc'
import { BankSlip } from './bankslip'

interface PayMethodFormValues {
  id: number
  description: string
  fine: number
  interest: number
  dueDay: number
  numberInstallments: number
  bankAccountId: string
  bankSlip: boolean
  wallet?: number
  companyId?: string
  view: string
  generateInstallmens: boolean
}

export const RenderInitial = ({ form, entity, id }) => {
  const { modal, saToken } = useApp()
  const [bankAccount, setBankaccount] = useState([])
  useEffect(() => {
    axios
      .post(`bankaccount.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBankaccount(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [id])
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Descrição">
            <TextInput
              id="description"
              autoComplete="descrição"
              placeholder="Descrição"
              customClassName="form-control"
              value={entity.description}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Dia do vencimento">
            <DecimalInput
              id="dueDay"
              name="dueDay"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
              precision={0}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Nº de Parcelas">
            <DecimalInput
              id="numberInstallments"
              name="numberInstallments"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
              precision={0}
            />
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
        <div className="col-lg">
          <div className="col-lg">
            <Field label="Banco">
              <Select
                isClearable
                getId={({ id }) => id}
                getDisplay={({ description }) => description}
                items={bankAccount}
                selected={entity.bankAccountId}
                onChange={bankAccount => form.setFieldValue('bankAccountId', bankAccount?.id)}
                disabled={false}
                isMulti={undefined}
                isLoading={false || undefined}
                styles={undefined}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-2">
          <Field label="Gera Financeiro">
            <SwitchInput id="generateInstallmens" name="generateInstallmens" />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Gera Boleto Bancario">
            <SwitchInput id="bankSlip" name="bankSlip" />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}

export const PayMethodForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [payMethod, setPayMethod] = useState<PayMethodFormValues>()
  const { id } = useParams()
  const pushTo = useNavigate()
  const form = useFormik<PayMethodFormValues>({
    initialValues: {
      id: 0,
      fine: 0,
      interest: 0,
      description: '',
      dueDay: 0,
      numberInstallments: 0,
      bankAccountId: '',
      bankSlip: false,
      view: 'Geral',
      generateInstallmens: true,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: PayMethodFormValues) {
    if (id) {
      axios
        .post(`paymethod.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/forma-pagamento'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`paymethod.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/forma-pagamento'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`paymethod.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setPayMethod(data)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (payMethod) {
      setValues(payMethod)
      form.setFieldValue('view', 'Geral')
    }
  }, [payMethod])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">
              {id ? `Editar: ${entity.description}` : 'Nova Forma de Pagamento'}
            </h3>
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
                    active: entity.view === 'DadosBoleto',
                  })}
                  onClick={() => form.setFieldValue('view', 'DadosBoleto')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Dados Boleto</span>
                </button>
              </li>
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Geral' && <RenderInitial form={form} entity={entity} id={id} />}
              {entity.view === 'DadosBoleto' && <BankSlip />}
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
                      onClick={() => pushTo('/forma-pagamento')}
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

function validateForm(values: PayMethodFormValues) {
  const errors: FormikErrors<PayMethodFormValues> = {}

  if (values.dueDay < 0) {
    errors.dueDay = 'Informe o dia do vencimento'
  }
  return errors
}
