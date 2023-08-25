import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import { Field } from '../../../components/form/field'
import { List, ListColumn } from '../../../components/list'
import { onlyNumbers } from '../../../helpers/format'
import { maskCpfCnpj } from '../../../helpers/mask'
import useFilters from '../../../hooks/filter'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface ProviderListValues {
  id: number
  cpfCnpj: string
  name: string
  email: string
  phone: string
  mobilePhone: string
  dateCreated: Date
  additionalEmails?: string
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  disableAt?: Date
  type: number
}

export const ProviderList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    name: '',
    cpfCnpj: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<ProviderListValues>({ initialQuery: {} })
  useEffect(() => {
    setFetching(true)

    axios
      .post(
        'provider.list',
        {
          ...query,
          name: filter.values.name,
          cpfCnpj: filter.values.cpfCnpj,
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
            <h3 className="kt-portlet__head-title">Fonecedores</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Fornecedor
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
                      .post('provider.list', filter.values, {
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
              { icon: 'fas fa-edit', title: 'Editar', action: '/fornecedor/:id' },
              {
                icon: 'fas fa-unlock',
                title: 'Ativar',
                hideWhen: ent => !ent.disableAt,
                action: ent =>
                  modal?.confirm(
                    `Deseja Ativar o cliente: ${ent.name}?`,
                    confirmed =>
                      confirmed &&
                      axios
                        .delete(`provider.delete/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                        .then(refresh.force)
                        .catch(err => modal?.alert(err.message)),
                  ),
              },
            ]}
          />
        </div>
      </div>
    </>
  )
}

const listColumns: ListColumn<ProviderListValues>[] = [
  { path: 'name', title: 'Nome' },
  {
    path: 'cpfCnpj',
    title: 'CPF/CNPJ',
    format: c => maskCpfCnpj(c),
  },
]
