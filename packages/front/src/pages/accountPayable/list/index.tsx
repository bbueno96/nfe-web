import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { endOfDay, startOfDay } from 'date-fns'

import axios from '@nfe-web/axios-config'

import useFilters from '../../..//hooks/filter'
import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DateInput from '../../../components/date-input'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { List, ListColumn } from '../../../components/list'
import { toLocaleDate } from '../../../helpers/date'
import { maskMoney } from '../../../helpers/mask'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface AccountPayableListValues {
  id?: string
  createdAt: Date
  dueDate: Date
  description: string
  providerName: string
  document?: string
  classificationDescription: string
  value: number
  accountPaymentId: string
}

export const AccountPayableList = () => {
  const { modal, saToken } = useApp()

  const refresh = useRefresh()
  const [providers, setProviders] = useState([])
  const filter = useFilters({
    minCreatedAtDate: startOfDay(new Date()),
    maxCreatedAtDate: endOfDay(new Date()),
    minDueDate: null,
    maxDueDate: null,
    providerId: '',
    document: '',
    isPaid: null,
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<AccountPayableListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('accountpayable.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal?.alert(err.message))
      .finally(() => setFetching(false))

    axios
      .post(`provider.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProviders(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-hand-holding-usd" />
            </span>
            <h3 className="kt-portlet__head-title">Contas a Pagar</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Contas a Pagar
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Data Inicial Cadastro">
                  <DateInput
                    disabled={false}
                    onChange={minCreatedAtDate => filter.setValues(prev => ({ ...prev, minCreatedAtDate }))}
                    value={filter.values.minCreatedAtDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Cadastro">
                  <DateInput
                    disabled={false}
                    onChange={maxCreatedAtDate => filter.setValues(prev => ({ ...prev, maxCreatedAtDate }))}
                    value={filter.values.maxCreatedAtDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Inicial Vencimento">
                  <DateInput
                    disabled={false}
                    onChange={minDueDate => filter.setValues(prev => ({ ...prev, minDueDate }))}
                    value={filter.values.minDueDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Vencimento">
                  <DateInput
                    disabled={false}
                    onChange={maxDueDate => filter.setValues(prev => ({ ...prev, maxDueDate }))}
                    value={filter.values.maxDueDate}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Fornecedor">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={({ id }) => id}
                    selected={filter.values.providerId}
                    items={providers}
                    onChange={provider => filter.setValues(prev => ({ ...prev, providerId: provider.id }))}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Documento">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="document"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.document}
                    />
                  </div>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Paga">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={({ value }) => value}
                    selected={filter.values.isPaid}
                    items={[
                      { value: null, name: 'Todos' },
                      { value: true, name: 'Sim' },
                      { value: false, name: 'Não' },
                    ]}
                    onChange={i => filter.setValues(prev => ({ ...prev, isPaid: i.value }))}
                  />
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
                      .post('accountpayable.list', filter.values, {
                        headers: { Authorization: `Bearer ${saToken}` },
                      })
                      .then(({ data }) => updateData(data))
                      .catch(err => modal?.alert(err.message))
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
            actions={[{ icon: 'fas fa-edit', title: 'Editar', action: '/conta-pagar/:id' }]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<AccountPayableListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'description', title: 'Descrição' },
  { path: 'dueDate', title: 'Vencimento', format: f => toLocaleDate(f) },
  { path: 'providerName', title: 'Fornecedor' },
  { path: 'document', title: 'Documento' },
  { path: 'classificationDescription', title: 'Classificação' },
  { path: 'value', title: 'Valor', format: f => maskMoney(f) },
  { path: 'accountPaymentId', title: 'Paga', format: (f: string) => (f ? 'Sim' : 'Não') },
]
