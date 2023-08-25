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
import { toLocaleDate } from '../../../helpers/date'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface BankRemittanceListValues {
  id?: string
  createdAt: Date
  bankAccountDescription: string
  numberLot: number
  wallet: number
}

export const BankRemittanceList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()
  const [bankAccount, setBanckAccount] = useState([])
  const filter = useFilters({
    minCreatedAtDate: startOfDay(addMonths(new Date(), -1)),
    maxCreatedAtDate: endOfDay(new Date()),
    paymentMeanId: '',
    bankAccountId: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<BankRemittanceListValues>({ initialQuery: {} })
  useEffect(() => {
    setFetching(true)
    axios
      .post('bankremittance.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => updateData(data))
      .catch(err => modal?.alert(err.message))
      .finally(() => setFetching(false))
    axios
      .post(`bankaccount.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
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
            <h3 className="kt-portlet__head-title">Registro de Boletos</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Registro
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={filter.handleSubmit}>
            <div className="row">
              <div className="col-lg">
                <Field label="Data Inicial">
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
                <Field label="Data Final">
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
            </div>
            <div className="row">
              <div className="col-lg">
                <Field label="Conta">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={filter.values.customerId}
                    items={bankAccount}
                    onChange={Account => filter.setValues(prev => ({ ...prev, bankAccountId: Account?.id }))}
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
                      .post('bankremittance.list', filter.values, {
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
            actions={[]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<BankRemittanceListValues>[] = [
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'numberLot', title: 'Numero do Lote' },
  { path: 'bankAccountDescription', title: 'Conta' },
  { path: 'wallet', title: 'Carteira' },
]
