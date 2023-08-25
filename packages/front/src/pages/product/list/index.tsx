/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import { Field } from '../../../components/form/field'
import { List, ListColumn } from '../../../components/list'
import { onlyAlphaNumeric } from '../../../helpers/format'
import { maskMoney } from '../../../helpers/mask'
import { iframeDownload } from '../../../helpers/misc'
import useFilters from '../../../hooks/filter'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface ProductListValues {
  id: string
  group?: string | null
  description: string
  stock: number
  stockMinium: number
  value: number
  valueOld: number
  purchaseValue: number
  lastPurchase?: Date | null
  lastSale?: Date | null
  createAt: Date
  und: string
  barCode: string
  disableAt?: Date | null
  ncm: string
  weight: number
  height: number
  width: number
  length: number
  color: string
  size: number
  conpanyId: string
  cod?: string | null
}

export const ProductList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    description: '',
    barCode: '',
    cod: '',
    geraPdf: false,
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<ProductListValues>({ initialQuery: {} })
  useEffect(() => {
    setFetching(true)
    axios
      .post(
        'product.list',
        {
          ...query,
          description: filter.values.description,
          barCode: filter.values.barCode,
          cod: filter.values.cod,
          geraPdf: filter.values.geraPdf,
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
              <i className="kt-font-brand fas fa-boxes" />
            </span>
            <h3 className="kt-portlet__head-title">Produtos</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Novo Produto
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
              <div className="col-lg">
                <Field label="Código de Barras">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="barCode"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={filter.values.barCode}
                    />
                  </div>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Código Interno">
                  <div className="input-icon">
                    <input
                      type="search"
                      name="cod"
                      placeholder="Pesquisar..."
                      className="form-control"
                      onChange={filter.handleChange}
                      value={onlyAlphaNumeric(filter.values.cod)}
                    />
                  </div>
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg kt-align-right">
                <Button
                  icon="fas fa-file-pdf"
                  customClassName="btn-primary margin-right-10"
                  title="Baixar PDF"
                  onClick={() => {
                    setFetching(true)
                    axios
                      .post(
                        'product.list',
                        { ...filter.values, geraPdf: true, perPage: false },
                        {
                          responseType: 'blob',
                          headers: { Authorization: `Bearer ${saToken}` },
                        },
                      )
                      .then(response => {
                        iframeDownload(response.data, `Produtos.pdf`)
                      })
                      .catch(err => modal?.alert(err.message))
                      .finally(() => setFetching(false))
                  }}
                />
                <Button
                  icon="input-icon"
                  customClassName="btn-primary"
                  title="Consultar"
                  onClick={() => {
                    setFetching(true)
                    axios
                      .post('product.list', filter.values, {
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
              { icon: 'fas fa-edit', title: 'Editar', action: '/produto/:id' },
              {
                icon: 'fas fa-unlock',
                title: 'Ativar',
                hideWhen: ent => !!ent.createAt,
                action: ent =>
                  modal?.confirm(
                    `Deseja Ativar o produto: ${ent.description}?`,
                    confirmed =>
                      confirmed &&
                      axios
                        .delete(`product.delete/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
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

const listColumns: ListColumn<ProductListValues>[] = [
  { path: 'description', title: 'Descrição' },
  { path: 'cod', title: 'Cód Interno' },
  { path: 'barCode', title: 'Cód. Barras' },
  {
    path: 'stock',
    title: 'Estoque',
    style: { width: '80px', textAlign: 'right' },
  },
  {
    path: 'value',
    title: 'Valor',
    format: f => maskMoney(parseFloat('' + f).toFixed(2)),
    style: { width: '90px', textAlign: 'right' },
  },
]
