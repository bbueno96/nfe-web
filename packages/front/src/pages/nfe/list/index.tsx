import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

import { addMonths, endOfDay, startOfDay } from 'date-fns'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DateInputFilter from '../../../components/date-input'
import { Field } from '../../../components/form/field'
import { List, ListColumn } from '../../../components/list'
import { toLocaleDate } from '../../../helpers/date'
import { onlyNumbers } from '../../../helpers/format'
import { maskCpfCnpj, maskMoney } from '../../../helpers/mask'
import { forceDownload, iframeDownload } from '../../../helpers/misc'
import useFilters from '../../../hooks/filter'
import { usePostList } from '../../../hooks/post-list'
import { useRefresh } from '../../../hooks/refresh'

interface NfeListValues {
  id: string
  cliente: string
  chave?: string
  cpfCnpj?: string
  razaoSocial?: string
  data: Date
  numeroNota: number
  status: string
  tipo: string
  transpNome?: string
  frete: number
  seguro: number
  outrasDespesas: number
  freteOutros: number
  desconto: number
  totalCheque: number
  totalDinheiro: number
  totalCartaoCredito: number
  totalBoleto: number
  totalOutros: number
  totalCartaoDebito: number
  totalNota: number
  totalProduto: number
  serie?: number
  dataSaida?: Date
  dataOrigem?: Date
  naturezaOp: string
  tipoFrete: number
  observacoes?: string
  informacoesFisco?: string
  nfeRef?: string
  companyId?: string
  installments?: string
  paymentMean?: number
  placaTransp?: string
  ufTransp?: string
  rntrcTransp?: string
  customerApoioProperty?: string
  pesoLiquido?: number
  pesoBruto?: number
}

export const NfeList = () => {
  const [, setPrintFetching] = useState(false)
  const { modal, saToken } = useApp()
  const refresh = useRefresh()
  const pushTo = useNavigate()
  const filter = useFilters({
    name: '',
    cpfCnpj: '',
    customerApoioProperty: '',
    tipo: 'SAIDA',
    minDate: startOfDay(addMonths(new Date(), -1)),
    maxDate: endOfDay(new Date()),
  })

  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<NfeListValues>({ initialQuery: filter.values })
  useEffect(() => {
    setFetching(true)
    axios
      .post(
        'nfe.list',
        {
          ...query,
          maxDate: filter.values.maxDate,
          minDate: filter.values.minDate,
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
            <h3 className="kt-portlet__head-title">Notas</h3>
          </div>
          <div className="kt-portlet__head-toolbar">
            <div className="kt-portlet__head-wrapper">
              <div className="dropdown dropdown-inline">
                <Link className="btn btn-success btn-icon-sm" to="cadastro">
                  <i className="fas fa-plus" /> Nova Nota
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
              <div className="col-lg">
                <Field label="Data Inicial">
                  <DateInputFilter
                    disabled={false}
                    onChange={minDate => filter.setValues(prev => ({ ...prev, minDate }))}
                    value={startOfDay(filter.values.minDate)}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data Final">
                  <DateInputFilter
                    disabled={false}
                    onChange={maxDate => filter.setValues(prev => ({ ...prev, maxDate }))}
                    value={endOfDay(filter.values.maxDate)}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg kt-align-right">
                <Button
                  icon="fas fa-download"
                  customClassName="btn-primary margin-right-10"
                  title="Baixar Xml"
                  onClick={() => {
                    setFetching(true)
                    axios
                      .post('nfe.listxml', filter.values, {
                        responseType: 'blob',
                        headers: { Authorization: `Bearer ${saToken}` },
                      })
                      .then(response => {
                        forceDownload(response.data, `xmls.zip`)
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
                      .post('nfe.list', filter.values, {
                        headers: { Authorization: `Bearer ${saToken}` },
                      })
                      .then(({ data }) => updateData(data))
                      .catch(err => modal?.alert(err?.message ? err?.message : 'Erro conexão'))
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
                action: '/nota/:id',
                hideWhen: ent => ent.status === 'Inutilizado',
              },
              {
                icon: `fas fa-print`,
                title: 'Imprimir Nota',
                hideWhen: ent => ent.status !== 'Autorizado' && ent.status !== 'Cancelado',
                action: ent => {
                  setPrintFetching(true)
                  axios
                    .get(`nfe.report/${ent.id}`, {
                      responseType: 'blob',
                      headers: { Authorization: `Bearer ${saToken}` },
                    })
                    .then(response => {
                      iframeDownload(response.data, `${ent.chave}.pdf`)
                    })
                    .catch(err => modal?.alert(err.message))
                    .finally(() => setPrintFetching(false))
                },
              },
              {
                icon: `fas fa-download`,
                title: 'Xml Nota',
                hideWhen: ent => ent.status !== 'Autorizado' && ent.status !== 'Cancelado' && ent.status !== 'Erro',
                action: ent => {
                  setPrintFetching(true)
                  axios
                    .get(`nfe.xml/${ent.id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
                    .then(response => {
                      forceDownload(response.data, `${ent.chave}.xml`)
                    })
                    .catch(err => modal?.alert(err.message))
                    .finally(() => setPrintFetching(false))
                },
              },
              {
                icon: `fas fa-lock`,
                title: 'Inutilizar',
                hideWhen: ent => ent.status !== 'Erro' && ent.status !== 'Validado' && ent.status !== 'Envio Pendente',
                action: ent => {
                  modal?.confirm(`Deseja inutilizar a nota: ${ent.numeroNota}?`, confirmed => {
                    if (confirmed) {
                      setFetching(true)
                      axios
                        .get(`nfe.inutil/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                        .then(response => {
                          modal?.alert(response.data.inutil)
                          pushTo('/nota')
                        })
                        .catch(err => modal?.alert(err.message))
                        .finally(() => setFetching(false))
                    }
                  })
                },
              },
              {
                icon: `fas fa-print`,
                title: 'Imprimir Boletos',
                hideWhen: ent => ent.status === 'Inutilizado',
                action: ent => {
                  setPrintFetching(true)
                  axios
                    .get(`boletoNfe.report/${ent.id}`, {
                      responseType: 'blob',
                      headers: { Authorization: `Bearer ${saToken}` },
                    })
                    .then(response => {
                      iframeDownload(response.data, `${ent.numeroNota}.pdf`)
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

const listColumns: ListColumn<NfeListValues>[] = [
  { path: 'numeroNota', title: 'Nota', style: { width: '80px', textAlign: 'right' } },
  { path: 'serie', title: 'Serie', style: { width: '50px', textAlign: 'right' } },
  { path: 'data', title: 'Data', format: f => toLocaleDate(f) },
  { path: 'razaoSocial', title: 'Cliente' },
  { path: 'customerApoioProperty', title: 'Propriedade' },
  {
    path: 'cpfCnpj',
    title: 'CPF/CNPJ',
    format: c => maskCpfCnpj(c),
    style: { width: '160px', textAlign: 'left' },
  },
  {
    path: 'totalNota',
    title: 'Total',
    format: f => maskMoney(parseFloat('' + f).toFixed(2)),
    style: { width: '150px', textAlign: 'right' },
  },
  {
    path: 'status',
    title: 'Status',
    style: { width: '100px', textAlign: 'right' },
  },
]
