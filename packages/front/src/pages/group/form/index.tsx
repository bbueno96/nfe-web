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

interface GroupFormValues {
  id: string
  description: string
  companyId: string
}

export const GroupForm = ({ updateData }) => {
  const location = useLocation()
  const { modal, saToken } = useApp()
  const [group, setGroup] = useState<GroupFormValues>()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const show = location.pathname.includes('/cadastro') || id
  const pushTo = useNavigate()
  const form = useFormik<GroupFormValues>({
    initialValues: {
      id: '',
      description: '',
      companyId: ' ',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: GroupFormValues) {
    if (id) {
      axios
        .post(`group.update/${id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/grupo'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`group.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/grupo'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }
  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`group.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setGroup(data)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (group) {
      setValues(group)
    }
  }, [group, setGroup])
  useEffect(() => {
    axios
      .post(
        'group.list',
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
        title={entity.id ? `Editar: ${entity.description}` : 'Novo Grupo '}
        fetching={id && !entity.description}
        isLarge={undefined}
        isExtraLarge={undefined}
        closeAction={() => pushTo('/grupo')}
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
function validateForm(values: GroupFormValues) {
  const errors: FormikErrors<GroupFormValues> = {}

  if (!values.description) {
    errors.description = RequiredMessage
  }

  return errors
}
