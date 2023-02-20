import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams, useLocation } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import useFilters from '../..//hooks/filter'
import { useApp } from '../../App'
import { Button } from '../../components/button'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import ModalForm from '../../components/modal-form'
import { RequiredMessage } from '../../helpers/constants'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface GroupListValues {
  id: string
  description: string
  companyId: string
}
interface GroupFormValues {
  id: string
  description: string
  companyId: string
}

export const GroupList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    description: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<GroupListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('group.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal.alert(err.message))
      .finally(() => setFetching(false))
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-layer-group" />
            </span>
            <h3 className="kt-portlet__head-title">Grupos</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Grupo
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Descrição">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="description"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.description}
                    />
                  </div>
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
                      .post('group.list', filter.values, {
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
            actions={[{ icon: 'fas fa-edit', title: 'Editar', action: '/grupo/:id' }]}
          />
        </div>
        <GroupForm updateData={updateData} />
      </div>
    </>
  )
}

const listColumns: ListColumn<GroupListValues>[] = [{ path: 'description', title: 'Descrição' }]

export const GroupForm = ({ updateData }) => {
  const location = useLocation()
  const { modal, saToken } = useApp()
  const [group, setGroup] = useState<GroupFormValues>(null)
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
        .post(`group.update${id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
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
        .catch(err => modal.alert(err.message))
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
      .catch(err => modal.alert(err.message))
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
