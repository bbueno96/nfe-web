import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { endOfDay, startOfDay, addMonths } from 'date-fns'

import axios from '@nfe-web/axios-config'

import useFilters from '../../..//hooks/filter'
import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DateInput from '../../../components/date-input'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { List, ListColumn } from '../../../components/list'
import { getCustomers } from '../../../helpers'
import { toLocaleDate } from '../../../helpers/date'
import { maskMoney } from '../../../helpers/mask'
import { iframeDownload } from '../../../helpers/misc'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'
interface InstallmentsListValues {
  id?: string
  createdAt: Date
  dueDate: Date
  numeroDoc: string
  customerName: string
  nfe?: number
  paymentMethodName: string
  value: number
  accountPaymentId: string
  fine: number
  interest: number
  paid: boolean
  numberInstallment: number
  ourNumber?: string
}

export const InstallmentsList = () => {
  const { modal, saToken, parameter } = useApp()
  const refresh = useRefresh()
  const [providers, setCustomers] = useState([])
  const filter = useFilters({
    minCreatedAtDate: startOfDay(addMonths(new Date(), -1)),
    maxCreatedAtDate: endOfDay(new Date()),
    minDueDate: null,
    maxDueDate: null,
    customer: '',
    numeroDoc: '',
    isPaid: null,
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<InstallmentsListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('installment.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal?.alert(err.message))
      .finally(() => setFetching(false))
    if (parameter?.getApoio) {
      getCustomers().then(resp => {
        setCustomers(resp.filter(e => e.type === 1 || e.type === 2))
      })
    } else {
      axios
        .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomers(data.items)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-hand-holding-usd" />
            </span>
            <h3 className="kt-portlet__head-title">Contas a Receber</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Contas a Receber
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
                    value={
                      filter.values.minCreatedAtDate
                        ? startOfDay(filter.values.minCreatedAtDate)
                        : filter.values.minCreatedAtDate
                    }
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Cadastro">
                  <DateInput
                    disabled={false}
                    onChange={maxCreatedAtDate => filter.setValues(prev => ({ ...prev, maxCreatedAtDate }))}
                    value={
                      filter.values.maxCreatedAtDate
                        ? endOfDay(filter.values.maxCreatedAtDate)
                        : filter.values.maxCreatedAtDate
                    }
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Inicial Vencimento">
                  <DateInput
                    disabled={false}
                    onChange={minDueDate => filter.setValues(prev => ({ ...prev, minDueDate }))}
                    value={filter.values.minDueDate ? startOfDay(filter.values.minDueDate) : filter.values.minDueDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Vencimento">
                  <DateInput
                    disabled={false}
                    onChange={maxDueDate => filter.setValues(prev => ({ ...prev, maxDueDate }))}
                    value={filter.values.maxDueDate ? endOfDay(filter.values.maxDueDate) : filter.values.maxDueDate}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Cliente">
                  <Select
                    getDisplay={({ name }) => name}
                    getId={parameter?.getApoio ? ({ uuid }) => uuid : ({ id }) => id}
                    selected={filter.values.customer}
                    items={providers}
                    onChange={customer =>
                      parameter?.getApoio
                        ? filter.setValues(prev => ({ ...prev, customer: customer?.uuid }))
                        : filter.setValues(prev => ({ ...prev, customer: customer?.id }))
                    }
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Documento">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="numeroDoc"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.numeroDoc}
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
                    onChange={i => filter.setValues(prev => ({ ...prev, isPaid: i?.value }))}
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
                      .post('installment.list', filter.values, {
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
            actions={[
              { icon: 'fas fa-edit', title: 'Editar', action: '/receber/:id' },
              {
                icon: `fas fa-print`,
                title: 'Imprimir Boletos',
                action: ent => {
                  axios
                    .get(`boletoInstallment.report/${ent.id}`, {
                      responseType: 'blob',
                      headers: { Authorization: `Bearer ${saToken}` },
                    })
                    .then(response => {
                      iframeDownload(response.data, `${ent.numeroDoc}.pdf`)
                    })
                    .catch(err => modal?.alert(err.message))
                    .finally()
                },
                hideWhen: ent => !ent.ourNumber,
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<InstallmentsListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'customerName', title: 'Cliente' },
  { path: 'numeroDoc', title: 'numero Doc.' },
  { path: 'numberInstallment', title: 'Parcela' },
  { path: 'dueDate', title: 'Vencimento', format: f => toLocaleDate(f) },
  { path: 'value', title: 'Valor', format: f => maskMoney(f) },
  { path: 'paid', title: 'Paga', format: (f: boolean) => (f ? 'Sim' : 'Não') },
]
