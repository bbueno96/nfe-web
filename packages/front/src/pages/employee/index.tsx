import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import useFilters from '../..//hooks/filter'
import { useApp } from '../../App'
import { Button } from '../../components/button'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import { RequiredMessage } from '../../helpers/constants'
import { onlyNumbers } from '../../helpers/format'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface SellerListValues {
  id: number
  login: string
  name: string
  password: string
  passwordCheck: string
  companyId?: string
}
interface EmployeeFormValues {
  id: number
  login: string
  name: string
  password: string
  passwordCheck: string
  companyId?: string
}

export const SellerList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    name: '',
    cpfCnpj: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<SellerListValues>({ initialQuery: { sort: [{ name: 'id' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('admin.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
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
              <i className="kt-font-brand fas fa-city" />
            </span>
            <h3 className="kt-portlet__head-title">Usuários</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Usuário
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Nome">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="name"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.name}
                    />
                  </div>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="CPF/CNPJ">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="cpfCnpj"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={onlyNumbers(filter.values.cpfCnpj)}
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
                      .post('admin.list', filter.values, {
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
            actions={[{ icon: 'fas fa-edit', title: 'Editar', action: '/usuario/:id' }]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<SellerListValues>[] = [{ path: 'name', title: 'Nome' }]

export const SellerForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const form = useFormik<EmployeeFormValues>({
    initialValues: {
      id: 0,
      login: '',
      name: '',
      password: '',
      passwordCheck: '',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: EmployeeFormValues) {
    if (id) {
      axios
        .post(`admin.update`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/usuario'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`admin.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/usuario'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`admin.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('login', data.login)
          form.setFieldValue('name', data.name)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.name}` : 'Novo Usuário'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg">
                <Field label="Nome">
                  <TextInput
                    id="name"
                    autoComplete="username"
                    placeholder="Nome"
                    customClassName="form-control"
                    value={entity.name}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Login">
                  <TextInput
                    id="login"
                    autoComplete="login"
                    placeholder="login"
                    customClassName="form-control"
                    value={entity.login}
                    disabled={!!id}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Senha">
                  <TextInput
                    type="password"
                    id="password"
                    autoComplete="senha"
                    placeholder="Senha"
                    customClassName="form-control"
                    value={entity.password}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Repitir a Senha">
                  <TextInput
                    type="password"
                    id="passwordCheck"
                    autoComplete="repitir Senha"
                    placeholder="Repitir Senha"
                    customClassName="form-control"
                    value={entity.passwordCheck}
                  />
                </Field>
              </div>
            </div>
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
                    onClick={() => pushTo('/usuario')}
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
function validateForm(values: EmployeeFormValues) {
  const errors: FormikErrors<EmployeeFormValues> = {}

  if (!values.name) {
    errors.name = RequiredMessage
  }
  if (!values.login) {
    errors.login = RequiredMessage
  }
  if (!values.password && values.id === 0) errors.password = RequiredMessage
  if (!values.passwordCheck && values.id === 0) errors.passwordCheck = RequiredMessage
  else if (values.password !== values.passwordCheck) {
    errors.passwordCheck = 'Senhas não coincidem'
  }
  return errors
}
