import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import axios from '@nfe-web/axios-config'

import useFilters from '../../..//hooks/filter'
import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import { Field } from '../../../components/form/field'
import { List, ListColumn } from '../../../components/list'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface PayMethodListValues {
  id: number
  description: string
  fine: number
  interest: number
  dueDay: number
  numberInstallments: number
  bankAccountId: string
  bankSlip: boolean
  wallet?: number
  ourNumber?: number
  companyId?: string
  view: string
}

export const PayMethodList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    description: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<PayMethodListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('paymethod.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
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
              <i className="kt-font-brand fas fa-hand-holding-usd" />
            </span>
            <h3 className="kt-portlet__head-title">Formas de Pagamento</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Forma de Pagamento
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
                      .post('paymethod.list', filter.values, {
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
            actions={[{ icon: 'fas fa-edit', title: 'Editar', action: '/forma-pagamento/:id' }]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<PayMethodListValues>[] = [
  { path: 'description', title: 'Descrição' },
  { path: 'numberInstallments', title: 'Numero de Parcelas' },
  { path: 'dueDay', title: 'Dia do vencimento' },
]
