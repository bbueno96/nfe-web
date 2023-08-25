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
import { PaymentMean } from '../../../helpers/constants'
import { toLocaleDate } from '../../../helpers/date'
import { maskMoney } from '../../../helpers/mask'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface AccountPaymentListValues {
  id?: string
  createdAt: Date
  bankAccountDescription: string
  paymentMeanId: number
  value: number
}

export const AccountPaymentList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()
  const [bankAccount, setBanckAccount] = useState([])
  const filter = useFilters({
    minDueDate: null,
    maxDueDate: null,
    paymentMeanId: '',
    bankAccountId: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<AccountPaymentListValues>({ initialQuery: { sort: [{ name: 'cst' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('accountpayment.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal?.alert(err.message))
      .finally(() => setFetching(false))
    axios
      .post(`bankaccount.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBanckAccount(data.items)
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
            <h3 className="kt-portlet__head-title">Pagamento de Contas</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Pagamento
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Data Inicial Pagamento">
                  <DateInput
                    disabled={false}
                    onChange={minDueDate => filter.setValues(prev => ({ ...prev, minDueDate }))}
                    value={filter.values.minDueDate ? startOfDay(filter.values.minDueDate) : filter.values.minDueDate}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final Pagamento">
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
                <Field label="Conta">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={filter.values.providerId}
                    items={bankAccount}
                    onChange={Account => filter.setValues(prev => ({ ...prev, bankAccountId: Account?.id }))}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Meio de Pagamento">
                  <div className="input-icon">
                    <Select
                      getDisplay={({ description }) => description}
                      getId={({ id }) => id}
                      selected={filter.values.paymentMeanId}
                      items={PaymentMean}
                      onChange={paymentMean => filter.setValues(prev => ({ ...prev, paymentMeanId: paymentMean?.id }))}
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
                      .post('accountpayment.list', filter.values, {
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
            // actions={[{ icon: 'fas fa-money-check-alt', title: 'Detalhes', action: '/pagamento-contas/detalhes/:id' }]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<AccountPaymentListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  {
    path: 'paymentMeanId',
    title: 'Meio de Pagamento',
    format: f =>
      PaymentMean.filter(function (obj) {
        return obj.id === f
      })[0].description,
  },
  { path: 'bankAccountDescription', title: 'Conta' },
  { path: 'value', title: 'Valor', format: f => maskMoney(f) },
]
