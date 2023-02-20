import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import useFilters from '../..//hooks/filter'
import { useApp } from '../../App'
import { Button } from '../../components/button'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import SwitchInput from '../../components/form/switch'
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import { CFOPs, CSOSN, CST } from '../../helpers/constants'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface TaxListValues {
  id: number
  aliquotaIcms: number
  description: string
  cst?: number
  companyId: string
}
interface TaxFormValues {
  id: number
  aliquotaIcms: number
  description: string
  cst?: number
  simplesNacional: boolean
  companyId: string
  baseIcms: number
  cfopState?: string
  cfopInter?: string
  cfopStatePf?: string
  cfopInterPf?: string
}

export const TaxSituationList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    description: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<TaxListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('taxsituation.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
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
              <i className="kt-font-brand fas fa-hand-holding-usd" />
            </span>
            <h3 className="kt-portlet__head-title">Situação Tributaria</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Tributação
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
                      .post('taxsituation.list', filter.values, {
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
            actions={[{ icon: 'fas fa-edit', title: 'Editar', action: '/tributacao/:id' }]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<TaxListValues>[] = [
  { path: 'description', title: 'Descrição' },
  { path: 'cst', title: 'CST' },
  { path: 'aliquotaIcms', title: 'Aliquota' },
]

export const TaxSituationForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const form = useFormik<TaxFormValues>({
    initialValues: {
      id: 0,
      aliquotaIcms: 0,
      description: '',
      cst: null,
      simplesNacional: false,
      baseIcms: 100,
      companyId: ' ',
      cfopState: '',
      cfopInter: '',
      cfopStatePf: '',
      cfopInterPf: '',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: TaxFormValues) {
    if (id) {
      axios
        .post(`taxsituation.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/tributacao'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`taxsituation.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/tributacao'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`taxsituation.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('aliquotaIcms', data.aliquotaIcms)
          form.setFieldValue('description', data.description)
          form.setFieldValue('cst', data.cst)
          form.setFieldValue('simplesNacional', data.simplesNacional)
          form.setFieldValue('baseIcms', data.baseIcms)
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
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.description}` : 'Nova Tributação'}</h3>
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
                <Field label="Aliquota">
                  <DecimalInput id="aliquotaIcms" name="aliquotaIcms" noSelect={undefined} disabled={false} />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Simples Nacional">
                  <SwitchInput id="simplesNacional" name="simplesNacional" />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="CST">
                  <Select
                    getDisplay={({ id, name }) => `${id}-${name}`}
                    getId={({ id }) => id}
                    selected={entity.cst}
                    items={entity.simplesNacional ? CSOSN : CST}
                    onChange={cst => form.setFieldValue('cst', cst.id)}
                    disabled={false}
                    isMulti={undefined}
                    isLoading={undefined}
                    isClearable={true}
                    styles={undefined}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <Field label="CFOP Venda Estadual">
                  <Select
                    isClearable
                    getId={({ id }) => id}
                    getDisplay={({ description, id }) => `${id.substr(0, 1)}.${id.substr(1)} - ${description}`}
                    items={CFOPs.filter(c => c.id[0] === '5')}
                    selected={entity.cfopState.replace('.', '')}
                    onChange={cfop =>
                      form.setFieldValue('cfopState', cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null)
                    }
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    styles={undefined}
                  />
                </Field>
              </div>
              <div className="col-lg-3">
                <Field label="CFOP Venda Inter-Estadual">
                  <Select
                    isClearable
                    getId={({ id }) => id}
                    getDisplay={({ description, id }) => `${id.substr(0, 1)}.${id.substr(1)} - ${description}`}
                    items={CFOPs.filter(c => c.id[0] === '6')}
                    selected={entity.cfopInter.replace('.', '')}
                    onChange={cfop =>
                      form.setFieldValue('cfopInter', cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null)
                    }
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    styles={undefined}
                  />
                </Field>
              </div>
              <div className="col-lg-3">
                <Field label="CFOP Venda Estadual PF">
                  <Select
                    isClearable
                    getId={({ id }) => id}
                    getDisplay={({ description, id }) => `${id.substr(0, 1)}.${id.substr(1)} - ${description}`}
                    items={CFOPs.filter(c => c.id[0] === '5')}
                    selected={entity.cfopStatePf.replace('.', '')}
                    onChange={cfop =>
                      form.setFieldValue('cfopStatePf', cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null)
                    }
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    styles={undefined}
                  />
                </Field>
              </div>
              <div className="col-lg-3">
                <Field label="CFOP Venda Inter-Estadual PF">
                  <Select
                    isClearable
                    getId={({ id }) => id}
                    getDisplay={({ description, id }) => `${id.substr(0, 1)}.${id.substr(1)} - ${description}`}
                    items={CFOPs.filter(c => c.id[0] === '6')}
                    selected={entity.cfopInterPf.replace('.', '')}
                    onChange={cfop =>
                      form.setFieldValue('cfopInterPf', cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null)
                    }
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    styles={undefined}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              {entity.cst === 20 && (
                <div className="col-lg-3">
                  <Field label="Redução da base de calculo">
                    <DecimalInput id="baseIcms" name="baseIcms" disabled={false} />
                  </Field>
                </div>
              )}
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
                    onClick={() => pushTo('/tributacao')}
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
function validateForm(values: TaxFormValues) {
  const errors: FormikErrors<TaxFormValues> = {}

  if (values.cst < 0) {
    errors.cst = 'Informe um CST'
  }
  return errors
}
