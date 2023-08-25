import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, useLocation } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import DecimalInput from '../../../components/form/decimal-input'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import ModalForm from '../../../components/modal-form'
import { Banks, RequiredMessage } from '../../../helpers/constants'

interface BankAccountFormValues {
  id?: string
  description: string
  institution: number
  companyId?: string
  number: number
  verifyingDigit: number
  agency: number
  ourNumber?: number
  wallet?: number
}

export const BankAccountForm = ({ updateData }) => {
  const location = useLocation()

  const { modal, saToken } = useApp()
  const [bankaccount, setBankaccount] = useState<BankAccountFormValues>()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const show = location.pathname.includes('/cadastro') || id
  const pushTo = useNavigate()
  const form = useFormik<BankAccountFormValues>({
    initialValues: {
      description: '',
      institution: 0,
      number: 0,
      verifyingDigit: 0,
      agency: 0,
      ourNumber: 0,
      wallet: undefined,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  const { setValues } = form
  function handleSubmit(values: BankAccountFormValues) {
    if (id) {
      axios
        .post(`bankaccount.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/conta'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`bankaccount.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/conta'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }
  const { values: entity } = form

  useEffect(() => {
    if (id) {
      axios
        .get(`bankaccount.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setBankaccount(data)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  useEffect(() => {
    if (bankaccount) {
      setValues(bankaccount)
    }
  }, [bankaccount, setValues])
  useEffect(() => {
    axios
      .post(
        'bankaccount.list',
        {},
        {
          headers: { Authorization: `Bearer ${saToken}` },
        },
      )
      .then(({ data }) => updateData(data))
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [form.isSubmitting === false])
  return (
    <FormikProvider value={form}>
      <ModalForm
        show={show}
        title={entity.id ? `Editar: ${entity.description}` : 'Nova Conta '}
        fetching={id && !entity.description}
        isLarge
        isExtraLarge={undefined}
        closeAction={() => pushTo('/conta')}
        error={globalError}
      >
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
              <Field label="Instituição">
                <Select
                  getId={({ code }) => code}
                  getDisplay={({ bank }) => bank}
                  selected={entity.institution}
                  items={Banks}
                  onChange={banks => {
                    form.setFieldValue(`institution`, banks.code)
                  }}
                  disabled={false}
                  isMulti={undefined}
                  isLoading={false || undefined}
                  isClearable={true}
                  styles={undefined}
                />
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-lg">
              <Field label="Numero">
                <DecimalInput
                  id="number"
                  name="number"
                  icon={undefined}
                  acceptEnter={true}
                  noSelect={undefined}
                  disabled={undefined}
                  precision={0}
                />
              </Field>
            </div>
            <div className="col-lg">
              <Field label="DV">
                <DecimalInput
                  id="verifyingDigit"
                  name="verifyingDigit"
                  icon={undefined}
                  acceptEnter={true}
                  noSelect={undefined}
                  disabled={undefined}
                  precision={0}
                />
              </Field>
            </div>
            <div className="col-lg">
              <Field label="Agencia">
                <DecimalInput
                  id="agency"
                  name="agency"
                  icon={undefined}
                  acceptEnter={true}
                  noSelect={undefined}
                  disabled={undefined}
                  precision={0}
                />
              </Field>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4">
              <Field label="Cateira">
                <DecimalInput
                  id="wallet"
                  name="wallet"
                  icon={undefined}
                  acceptEnter={true}
                  noSelect={undefined}
                  disabled={undefined}
                  precision={0}
                />
              </Field>
            </div>
            <div className="col-lg">
              <Field label="Nosso numero">
                <DecimalInput
                  id="ourNumber"
                  name="ourNumber"
                  icon={undefined}
                  acceptEnter={true}
                  noSelect={undefined}
                  disabled={false}
                  precision={0}
                />
              </Field>
            </div>
          </div>
        </div>
        <ErrorMessage error={globalError} />
      </ModalForm>
    </FormikProvider>
  )
}
function validateForm(values: BankAccountFormValues) {
  const errors: FormikErrors<BankAccountFormValues> = {}

  if (!values.description) {
    errors.description = RequiredMessage
  }

  return errors
}
