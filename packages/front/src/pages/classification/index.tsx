import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useParams, useLocation } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useApp } from '../../App'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import { TextInput } from '../../components/form/text-input'
import ModalForm from '../../components/modal-form'
import Tree from '../../components/tree'
import { RequiredMessage } from '../../helpers/constants'
import { groupBy } from '../../helpers/format'
import { useRefresh } from '../../hooks/refresh'

interface ClassificationFormValues {
  id: string
  partialCode: number
  code: string
  description: string
  isGroup: boolean
  parentId: string
}
type LocationState = { parent: { id: string; code: string } }

function getClassificationed(items, groups) {
  if (!items) return items
  return items.map(p => ({
    ...p,
    children: getClassificationed(groups.get(p.id), groups),
  }))
}

export const ClassificationList = () => {
  const [classifications, setClassifications] = useState([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { modal, saToken } = useApp()
  const refresh = useRefresh()
  const pushTo = useNavigate()
  const location = useLocation()
  const { parent } = (location.state as LocationState) || ({ id: null, code: '' } as unknown as LocationState)

  useEffect(() => {
    axios
      .post('classification.list', {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        const groups = groupBy(data.items, 'parentId')
        const rootItems = groups.get(null)
        const grouped = getClassificationed(rootItems, groups)
        setClassifications(grouped)
      })
      .catch(err => setGlobalError(err))
      .finally()
  }, [])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-dollar-sign" />
            </span>
            <h3 className="kt-portlet__head-title">Classificações</h3>
          </div>
        </div>
        <div className="kt-portlet__body kt-portlet__body--fit">
          <div className="card-body">
            <div className="row">
              <div className="col-lg">
                <Field label="">
                  <Tree
                    nodes={classifications}
                    onAdd={item => {
                      pushTo('/classificacoes/cadastro', { state: { parent: item } })
                    }}
                    onEdit={itemId => pushTo(`/classificacoes/${itemId}`)}
                    onDisable={item => {
                      modal.confirm(
                        `Deseja ${!item.disabledAt ? 'desativar' : 'ativar'} ${item.description}?`,
                        confirmed =>
                          confirmed &&
                          axios
                            .delete(`classification.delete/${item.id}`, {
                              headers: { Authorization: `Bearer ${saToken}` },
                            })
                            .then(refresh.force)
                            .catch(err => setGlobalError(err.message)),
                      )
                    }}
                    disabled={undefined}
                  />
                </Field>
              </div>
            </div>
          </div>

          <ErrorMessage error={globalError} />
        </div>
      </div>

      <ClassificationForm
        parent={parent}
        refresh={async () => {
          await global.refresh(true)
          refresh.force()
        }}
      />
    </>
  )
}
export const ClassificationForm = ({ refresh, parent }) => {
  const location = useLocation()
  const { id } = useParams()
  const { modal, saToken } = useApp()
  const [classification, setClassification] = useState<ClassificationFormValues>(null)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const show = location.pathname.includes('/cadastro') || id
  const pushTo = useNavigate()
  const form = useFormik<ClassificationFormValues>({
    initialValues: {
      id: '',
      description: '',
      partialCode: 1,
      code: '',
      isGroup: false,
      parentId: parent?.id || null,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: ClassificationFormValues) {
    if (id) {
      axios
        .post(`classification.update`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/classificacoes'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => {
          form.setSubmitting(false)
          refresh()
        })
    } else {
      axios
        .post(`classification.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/classificacoes'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => {
          form.setSubmitting(false)
          refresh()
          window.location.reload()
        })
    }
  }
  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`classification.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setClassification(data)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (classification) {
      setValues(classification)
    }
  }, [classification, setClassification])
  useEffect(() => {
    if (parent) {
      const nextCode = parent.children?.length + 1 || 1
      form.setValues(prev => ({
        ...prev,
        parentId: parent.id,
        partialCode: nextCode,
        code: `${parent.code}.${nextCode}`,
      }))
    }
  }, [parent])
  useEffect(() => {
    if (entity.partialCode) {
      form.setFieldValue(
        'code',
        `${entity.code.includes('.') ? entity.code.split('.').slice(0, -1).join('.') : entity.code}${
          entity.partialCode ? `.${entity.partialCode}` : ''
        }`,
      )
    }
  }, [entity.partialCode])
  return (
    <FormikProvider value={form}>
      <ModalForm
        isLarge
        show={show}
        title={entity.id ? `Editar: ${entity.description}` : 'Nova Classificação '}
        fetching={id && !entity.description}
        isExtraLarge={undefined}
        closeAction={() => pushTo('/classificacoes')}
        error={globalError}
      >
        <div className="kt-portlet__body">
          <div className="row">
            <div className="col-lg">
              <div className="col-lg">
                <TextInput
                  id="code"
                  autoComplete="Codigo"
                  placeholder="Codigo"
                  customClassName="form-control"
                  value={entity.code}
                  disabled
                />
              </div>
              {!form.isSubmitting && (
                <div className="col-lg">
                  <Field label="Código Parcial">
                    <DecimalInput
                      id="partialCode"
                      name="partialCode"
                      icon={undefined}
                      acceptEnter={undefined}
                      noSelect={undefined}
                      disabled={undefined}
                      precision={0}
                    />
                  </Field>
                </div>
              )}
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
                <Field label="Grupo">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={({ value }) => value}
                    selected={entity.isGroup}
                    items={[
                      { value: true, name: 'Sim' },
                      { value: false, name: 'Não' },
                    ]}
                    onChange={i => form.setFieldValue('isGroup', i?.value)}
                    disabled={undefined}
                    isMulti={false}
                    isLoading={false}
                    isClearable={true}
                    styles={undefined}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>
        <ErrorMessage error={globalError} />
      </ModalForm>
    </FormikProvider>
  )
}
function validateForm(values: ClassificationFormValues) {
  const errors: FormikErrors<ClassificationFormValues> = {}

  if (!values.description) errors.description = RequiredMessage
  else if (values.description.length > 80) errors.description = 'A descrição deve ter no máximo 80 caracteres.'
  if (!values.partialCode) errors.partialCode = RequiredMessage

  return errors
}
