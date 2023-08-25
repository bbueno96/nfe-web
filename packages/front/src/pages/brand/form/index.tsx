import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams, useLocation } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { TextInput } from '../../../components/form/text-input'
import ModalForm from '../../../components/modal-form'
import { RequiredMessage } from '../../../helpers/constants'

interface BrandFormValues {
  id: string
  description: string
  companyId: string
}

export const BrandForm = ({ updateData }) => {
  const location = useLocation()
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const show = location.pathname.includes('/cadastro') || id
  const pushTo = useNavigate()
  const form = useFormik<BrandFormValues>({
    initialValues: {
      id: '',
      description: '',
      companyId: ' ',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: BrandFormValues) {
    if (id) {
      axios
        .post(`brand.update/${id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/marca'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`brand.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/marca'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => {
          form.setSubmitting(false)
        })
    }
  }
  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`brand.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('description', data.description)
          form.setFieldValue('companyId', data.companyId)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  useEffect(() => {
    axios
      .post(
        'brand.list',
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
        title={entity.id ? `Editar: ${entity.description}` : 'Nova Marca '}
        fetching={id && !entity.description}
        isLarge={undefined}
        isExtraLarge={undefined}
        closeAction={() => pushTo('/marca')}
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
          </div>
        </div>
        <ErrorMessage error={globalError} />
      </ModalForm>
    </FormikProvider>
  )
}
function validateForm(values: BrandFormValues) {
  const errors: FormikErrors<BrandFormValues> = {}

  if (!values.description) {
    errors.description = RequiredMessage
  }

  return errors
}
