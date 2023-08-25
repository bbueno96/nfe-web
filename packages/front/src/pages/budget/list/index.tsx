import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import { Field } from '../../../components/form/field'
import { List, ListColumn } from '../../../components/list'
import { PaymentMean } from '../../../helpers/constants'
import { toLocaleDate } from '../../../helpers/date'
import { onlyNumbers } from '../../../helpers/format'
import { maskCpfCnpj, maskMoney } from '../../../helpers/mask'
import { iframeDownload } from '../../../helpers/misc'
import useFilters from '../../../hooks/filter'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface BudgetListValues {
  id?: string
  numberBudget?: number
  customerId?: string | null
  cpfCnpj?: string
  customerName?: string
  createdAt: Date
  status: string
  shipping: number
  discount: number
  deliveryForecast?: Date
  total: number
  obs?: string
  auth?: boolean
  payMethodName?: string
  installments?: string
  paymentMean?: number
  customerApoioProperty?: string
}

export const BudgetList = () => {
  const [, setPrintFetching] = useState(false)
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    name: '',
    customerApoioProperty: '',
    cpfCnpj: '',
  })

  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<BudgetListValues>({ initialQuery: { sort: [{ name: 'id' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post(
        'budget.list',
        {
          ...query,
          name: filter.values.name,
          cpfCnpj: filter.values.cpfCnpj,
          customerApoioProperty: filter.values.customerApoioProperty,
        },
        { headers: { Authorization: `Bearer ${saToken}` } },
      )
      .then(({ data }) => updateData(data))
      .catch(err => modal?.alert(err.message))
      .finally(() => setFetching(false))
  }, [query, refresh.ref])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-users" />
            </span>
            <h3 className="kt-portlet__head-title">Orçamentos</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Orçamento
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
                <Field label="Propriedade">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="customerApoioProperty"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.customerApoioProperty}
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
                      .post('budget.list', filter.values, {
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
              {
                icon: 'fas fa-edit',
                title: 'Editar',
                action: '/orcamento/:id',
                // hideWhen: ent => ent.auth,
              },
              {
                icon: `fas fa-print`,
                title: 'Imprimir Orçamento',
                action: ent => {
                  setPrintFetching(true)
                  axios
                    .get(`budget.report/${ent.id}`, {
                      responseType: 'blob',
                      headers: { Authorization: `Bearer ${saToken}` },
                    })
                    .then(response => {
                      iframeDownload(response.data, `Orçamento.pdf`)
                    })
                    .catch(err => modal?.alert(err.message))
                    .finally(() => setPrintFetching(false))
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<BudgetListValues>[] = [
  { path: 'numberBudget', title: 'Orçamento', style: { width: '50px', textAlign: 'right' } },
  { path: 'customerName', title: 'Cliente' },
  { path: 'customerApoioProperty', title: 'Propriedade' },
  {
    path: 'cpfCnpj',
    title: 'CPF/CNPJ',
    format: c => maskCpfCnpj(c),
    style: { width: '160px', textAlign: 'left' },
  },
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  {
    path: 'deliveryForecast',
    title: 'Previsão Entrega',
    format: f => toLocaleDate(f),
  },
  {
    path: 'auth',
    title: 'Autorizado',
    format: f => (f ? 'Sim' : 'Pendente'),
  },
  {
    path: 'paymentMean',
    title: 'Meio de Pagamento',
    format: f =>
      PaymentMean.filter(function (obj) {
        return obj.id === f
      })[0].description,
  },
  {
    path: 'installments',
    title: 'Parcelas',
    style: { textAlign: 'right' },
  },
  {
    path: 'total',
    title: 'Total',
    format: f => maskMoney(parseFloat('' + f).toFixed(2)),
    style: { width: '100px', textAlign: 'right' },
  },
]
