/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import { FieldArray, FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../App'
import { Button } from '../../components/button'
import DateInput from '../../components/form/date-input'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import { TextInput } from '../../components/form/text-input'
import { TextAreaInput } from '../../components/form/textarea-input'
import { List, ListColumn } from '../../components/list'
import { getCustomers } from '../../helpers'
import { CFOPs, RequiredMessage, TipoFrete } from '../../helpers/constants'
import { onlyNumbers } from '../../helpers/format'
import { maskCellPhone, maskCpfCnpj, maskMoney } from '../../helpers/mask'
import { classNames, iframeDownload } from '../../helpers/misc'
import useFilters from '../../hooks/filter'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

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
  nfeRef?: number
  companyId?: string
}

interface NfeFormValues {
  id?: string
  cliente: string
  data: Date
  numeroNota: number
  status: string
  tipo: string
  transpNome?: string
  placaTransp?: string
  ufTransp?: string
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
  nfeRef?: number
  companyId?: string
  view: string
  products: any[]
  chave?: string
  ultNota?: number
  Customer?: any
  transpCpfCnpj?: string
  transpEndereco?: string
  transpEstado?: string
  tranpCidade?: string
  newCustoner?: boolean
  especie?: string
  volumes?: number
  reciboLote?: number
  cartaCorrecao?: string
  erros?: string[]
  statuscartaCorrecao?: string
  authNfe: boolean
  paymentMethodId: string
}

export const NfeList = () => {
  const [, setPrintFetching] = useState(false)
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    name: '',
    cpfCnpj: '',
    tipo: 'SAIDA',
  })

  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<NfeListValues>({ initialQuery: { sort: [{ name: 'id' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('nfe.list', filter.values, { headers: { Authorization: `Bearer ${saToken}` } })
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
                      .post('nfe.list', filter.values, {
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
            actions={[
              {
                icon: 'fas fa-edit',
                title: 'Editar',
                action: '/nota/:id',
                // hideWhen: ent => ent.status === 'Autorizado',
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
                    .catch(err => modal.alert(err.message))
                    .finally(() => setPrintFetching(false))
                },
              },
              {
                icon: `fas fa-print`,
                title: 'Imprimir Boletos',
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
                    .catch(err => modal.alert(err.message))
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
  { path: 'razaoSocial', title: 'Cliente' },
  {
    path: 'cpfCnpj',
    title: 'CPF/CNPJ',
    format: c => maskCpfCnpj(c),
    style: { width: '100px', textAlign: 'right' },
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

export const ProductsForm = ({ form, entity, products }) => {
  function handleAddProduct(ev) {
    ev.preventDefault()
    form.setFieldValue('products', [...entity.products, { quantidade: 0, unitario: 0 }])
  }
  useEffect(() => {
    if (entity.products.length > 0) {
      entity.products.forEach(prods => {
        const total = prods.quantidade * parseFloat(prods.unitario)
        if (total - prods.descontoProd >= 0) {
          prods.total = total - prods.descontoProd
        } else {
          prods.descontoProd = 0
          prods.total = total
        }
        if (prods.amount > 0) {
          prods.peso = prods.quantidade * prods.weight
        }
      })
    }
  }, [entity.products])

  return (
    <>
      <FieldArray
        name="products"
        render={() => (
          <>
            <div
              className={classNames('kt-datatable kt-datatable--default kt-datatable--brand', {
                'kt-datatable--loaded': entity.products.length > 0,
                'table-loading': true,
              })}
            >
              <table className="kt-datatable__table" style={{ borderCollapse: 'separate' }}>
                <thead className="datatable-head">
                  <tr className="kt-datatable__row">
                    <th className="kt-datatable__cell">
                      <span>Produto</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 15px white' }}>
                      <span>CFOP</span>
                    </th>
                    <th className="kt-datatable__cell " style={{ borderLeft: 'solid 15px white' }}>
                      <span>Quantidade</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 15px white' }}>
                      <span>Unidade</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 15px white' }}>
                      <span>Unitario</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 15px white' }}>
                      <span>Desconto</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 15px white' }}>
                      <span>Total</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="datatable-body">
                  {entity.products.map((p, i) => (
                    <tr key={i} className="datatable-row">
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '350px' }}>
                        <Select
                          getId={({ id }) => id}
                          getDisplay={({ description }) => description.slice(0, 20)}
                          selected={p.produto ? p.produto : p.id}
                          items={products}
                          onChange={prod => {
                            form.setFieldValue(`products.${i}.descricao`, prod?.description)
                            form.setFieldValue(`products.${i}.unidade`, prod?.und)
                            form.setFieldValue(`products.${i}.id`, prod?.id)
                            form.setFieldValue(`products.${i}.unitario`, prod?.value)
                            form.setFieldValue(`products.${i}.quantidade`, 1.0)
                            form.setFieldValue(`products.${i}.weight`, prod?.weight)
                            form.setFieldValue(`products.${i}.PisCofins`, prod.PisCofins)
                            form.setFieldValue(`products.${i}.cstPis`, prod.cstPis)
                            form.setFieldValue(`products.${i}.alqPis`, prod.alqPis)
                            form.setFieldValue(`products.${i}.cstCofins`, prod.cstCofins)
                            form.setFieldValue(`products.${i}.alqCofins`, prod.alqCofins)
                            if (entity.Customer.state === entity.emitState) {
                              if (entity.Customer.cpfCnpj.length === 14) {
                                form.setFieldValue(`products.${i}.cfop`, prod.TaxSituation?.cfopState)
                              } else {
                                form.setFieldValue(`products.${i}.cfop`, prod.TaxSituation?.cfopStatePf)
                              }
                            } else if (entity.Customer.cpfCnpj.length < 14) {
                              form.setFieldValue(`products.${i}.cfop`, prod.TaxSituation?.cfopInterPf)
                            } else {
                              form.setFieldValue(`products.${i}.cfop`, prod.TaxSituation?.cfopInter)
                            }
                          }}
                          disabled={false}
                          isMulti={undefined}
                          isLoading={false}
                          isClearable={true}
                          styles={undefined}
                        />
                      </td>

                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '100px' }}>
                        <Select
                          isClearable
                          getId={({ id }) => id}
                          getDisplay={({ description, id }) =>
                            `${id.substr(0, 1)}.${id.substr(1)} - ${description.slice(0, 20)}`
                          }
                          items={
                            entity.Customer.state === entity.emitState
                              ? CFOPs.filter(c => c.id[0] === '5')
                              : CFOPs.filter(c => c.id[0] === '6')
                          }
                          selected={p?.cfop?.replace('.', '')}
                          onChange={cfop =>
                            form.setFieldValue(
                              `products.${i}.cfop`,
                              cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null,
                            )
                          }
                          disabled={false}
                          isMulti={undefined}
                          isLoading={false}
                          styles={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell " style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          id={`products.${i}.quantidade`}
                          name={`products.${i}.quantidade`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '90px' }}>
                        <TextInput
                          placeholder=""
                          name={`products.${i}.unidade`}
                          disabled
                          value={`products.${i}.unidade`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          id={`products.${i}.unitario`}
                          name={`products.${i}.unitario`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          name={`products.${i}.descontoProd`}
                          id={'products.[i].descontoProd '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          name={`products.${i}.total`}
                          id={'products.[i].total '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white' }}>
                        <button
                          type="button"
                          className="btn btn-icon btn-danger"
                          onClick={() =>
                            form.setFieldValue(
                              'products',
                              entity.products.filter((_, n) => n !== i),
                            )
                          }
                        >
                          <i className="fas fa-trash" aria-hidden="true" />
                        </button>
                      </td>
                      {i === entity.products.length - 1 && (
                        <td className="kt-datatable__cell">
                          <button type="button" className="btn btn-success" onClick={ev => handleAddProduct(ev)}>
                            <i className="fas fa-plus" aria-hidden="true" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {entity.products.length === 0 && (
                    <tr>
                      <td className="datatable-error">Nenhum produto lançado cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      />
    </>
  )
}

export const FreteForm = ({ entity, form, customers }) => {
  useEffect(() => {
    form.setFieldValue('volumes', entity.products.length)
  }, [entity.products])
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Transportadora">
            <Select
              getId={({ uuid }) => uuid}
              getDisplay={({ name }) => name}
              selected={entity.transpId}
              items={customers}
              onChange={company => {
                // if (parameter.getApoio) {
                const properties = company.properties[0]
                form.setFieldValue('transpId', company?.uuid)
                form.setFieldValue('transpNome', properties.name)
                form.setFieldValue('transpCpfCnpj', properties.cpfCnpj)
                form.setFieldValue('transpEndereco', properties.streetName)
                form.setFieldValue('transpEstado', properties.state)
                form.setFieldValue('tranpCidade', properties.city)
                form.setFieldValue('newCustoner', false)
              }}
              disabled={false}
              isMulti={undefined}
              isLoading={false}
              isClearable={true}
              styles={undefined}
            ></Select>
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Tipo do Frete">
            <Select
              getId={({ id }) => id}
              getDisplay={({ descricao, id }) => `${id}-${descricao}`}
              selected={entity.tipoFrete}
              items={TipoFrete}
              onChange={frete => {
                form.setFieldValue('tipoFrete', frete?.id)
              }}
              disabled={false}
              isMulti={undefined}
              isLoading={false}
              isClearable={true}
              styles={undefined}
            ></Select>
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Placa Veiculo">
            <TextInput placeholder="" name={`placaTransp`} disabled={false} value={`placaTransp`} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="UF">
            <TextInput placeholder="" name={`ufTransp`} disabled={false} value={`ufTransp`} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="RNTRC (ANTT)">
            <TextInput placeholder="" name={`rntrcTransp`} disabled={false} value={`rntrcTransp`} />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Volume">
            <DecimalInput
              name={`volumes`}
              id={'volumes'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Espécie dos Volumes">
            <TextInput placeholder="" name={`especie`} disabled={false} value={`especie`} />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Peso Líquido (Kg)">
            <DecimalInput
              name={`pesoLiquido`}
              id={'pesoLiquido'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Peso Bruto (Kg)">
            <DecimalInput
              name={`pesoBruto`}
              id={'pesoBruto'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Valor do Frete">
            <DecimalInput
              name={`frete`}
              id={'frete'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Valor do Seguro">
            <DecimalInput
              name={`seguro`}
              id={'seguro'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Outras Despesas">
            <DecimalInput
              name={`outrasDespesas`}
              id={'outrasDespesas'}
              icon={undefined}
              acceptEnter={undefined}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
    </>
  )
}
export const AddForm = ({ entity, form }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Dados Adicionais para a Nota Fiscal">
            <TextAreaInput
              refEl={undefined}
              value={entity.observacoes}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={obs => form.setFieldValue('observacoes', obs)}
              rows={5}
              readOnly={false}
              maxLenght={150}
            ></TextAreaInput>
          </Field>
        </div>
      </div>
    </>
  )
}
export const ObsForm = ({ entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Preencha aqui as observações desta venda (elas não serão exibidas na Nota Fiscal)">
            <TextAreaInput
              refEl={undefined}
              value={entity.observacoes}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={undefined}
              rows={5}
              readOnly={false}
              maxLenght={150}
            ></TextAreaInput>
          </Field>
        </div>
      </div>
    </>
  )
}
export const ErrosForm = ({ entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Preencha aqui as observações desta venda (elas não serão exibidas na Nota Fiscal)">
            <TextAreaInput
              refEl={undefined}
              value={entity.erros}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={undefined}
              rows={5}
              readOnly={true}
              maxLenght={150}
            ></TextAreaInput>
          </Field>
        </div>
      </div>
    </>
  )
}
export const CartaForm = ({ entity, form }) => {
  const [carta, setCarta] = useState([])
  const { modal, saToken } = useApp()
  function EnvCarta() {
    modal.confirm(
      'Deseja enviar Carta de Correção?',
      confirmed =>
        confirmed &&
        axios
          .post(
            `nfe.carta`,
            { nota: entity, cartaCorrecao: carta },
            { headers: { Authorization: `Bearer ${saToken}` } },
          )
          .then(() => {
            modal.alert('carta de correção Vinculada a NFe')
          })
          .catch(err => modal.alert(err.message))
          .finally(),
    )
  }
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.">
            <TextAreaInput
              refEl={undefined}
              value={entity.cartaCorrecao}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={carta => setCarta(carta)}
              rows={5}
              readOnly={false}
              maxLenght={150}
            ></TextAreaInput>
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg" />

        <Button
          type="button"
          icon="fas fa-envelope-open-text"
          customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
          title="Enviar Carta"
          disabled={form.isSubmitting}
          onClick={() => EnvCarta()}
        />
      </div>
    </>
  )
}

export const NfeForm = () => {
  const { parameter } = useApp()
  const [, setPrintFetching] = useState(false)
  const [customer, setCustomer] = useState([])
  const [products, setproduct] = useState([])
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [payMethod, setPayMethod] = useState([])
  const { id } = useParams()
  const pushTo = useNavigate()
  const form = useFormik<NfeFormValues>({
    initialValues: {
      id: '',
      numeroNota: 0,
      cliente: null,
      transpNome: '',
      data: new Date(),
      status: 'Envio Pendente',
      tipo: 'SAIDA',
      frete: 0,
      seguro: 0,
      outrasDespesas: 0,
      freteOutros: 0,
      desconto: 0,
      totalCheque: 0,
      totalDinheiro: 0,
      totalCartaoCredito: 0,
      totalBoleto: 0,
      totalOutros: 0,
      totalCartaoDebito: null,
      tipoFrete: 0,
      observacoes: '',
      totalProduto: 0,
      totalNota: 0,
      naturezaOp: 'Venda',
      especie: 'Vol',
      volumes: 0,
      view: 'produtos',
      products: [],
      erros: null,
      Customer: {
        cpfCnpj: '',
        stateInscription: '',
        name: '',
        company: '',
        email: '',
        phone: '',
        mobilePhone: '',
        dateCreated: new Date(),
        additionalEmails: '',
        address: '',
        addressNumber: '',
        complement: '',
        province: '',
        postalCode: '',
        cityId: null,
        state: '',
        disableAt: null,
      },
      newCustoner: false,
      authNfe: false,
      paymentMethodId: '',
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  function handleSubmit(values: NfeFormValues) {
    if (id) {
      axios
        .post(`nfe.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/nota'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`nfe.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(nfe => {
          form.setFieldValue('id', nfe.data.id)
          pushTo(`/nota/${nfe.data.id}`)
        })
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => {
          form.setSubmitting(false)
          form.setFieldValue('status', 'Aguarde')
        })
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`nfe.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('numeroNota', data.numeroNota)
          form.setFieldValue('cliente', data.cliente)
          form.setFieldValue('status', data.status)
          form.setFieldValue('data', data.data)
          form.setFieldValue('frete', data.frete)
          form.setFieldValue('tipo', data.tipo)
          form.setFieldValue('seguro', data.seguro)
          form.setFieldValue('outrasDespesas', data.outrasDespesas)
          form.setFieldValue('freteOutros', data.freteOutros)
          form.setFieldValue('desconto', data.desconto)
          form.setFieldValue('totalDinheiro', data.totalDinheiro)
          form.setFieldValue('observacoes', data.observacoes)
          form.setFieldValue('erros', data.erros || '')
          form.setFieldValue('pesoLiquido', data.pesoLiquido)
          form.setFieldValue('pesoBruto', data.pesoBruto)
          form.setFieldValue('products', data.NfeProduto)
          form.setFieldValue('chave', data.chave)
          form.setFieldValue('reciboLote', data.reciboLote)
          form.setFieldValue('serie', data.serie)
          form.setFieldValue('cartaCorrecao', data.cartaCorrecao)
          form.setFieldValue('paymentMethodId', data.paymentMethodId)
          form.setFieldValue('Customer.state', data.estado)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [entity.status])
  useEffect(() => {
    if (!id) {
      axios
        .post(`parameter.get`, { serie: entity.serie }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('numeroNota', data.ultNota + 1 || 1)
          form.setFieldValue('emitState', data.nfeUf)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [entity.serie])
  useEffect(() => {
    if (entity.authNfe && entity.status === 'Validado') {
      axios
        .get(`nfe.authorize/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          modal.alert(
            `Situação: ${data.retNota.xMotivo}, ${
              data.retNota.xMotivo === 'Lote em processamento'
                ? 'Espere alguns segundos e consulte novamente a nfe'
                : ''
            }`,
          )
          form.setFieldValue('status', data.retNota.xMotivo)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [entity.authNfe])

  useEffect(() => {
    if (parameter.getApoio) {
      getCustomers().then(resp => {
        setCustomer(resp)
      })
    } else {
      axios
        .post(`customer.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomer(data.items)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
    axios
      .post(`product.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setproduct(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
    if (!id) {
      axios
        .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('serie', data.serie)
          form.setFieldValue('emitState', data.nfeUf)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
    axios
      .post(`paymethod.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setPayMethod(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
    axios
      .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        form.setFieldValue('emitState', data.nfeUf)
      })
      .catch(err => modal.alert(err.message))
      .finally()
  }, [id])

  useEffect(() => {
    const total =
      entity.products.reduce((acc, curr) => acc + parseFloat(curr.total), 0) +
      parseFloat('' + entity.frete) +
      parseFloat('' + entity.outrasDespesas) +
      parseFloat('' + entity.seguro) -
      parseFloat('' + entity.desconto)
    form.setFieldValue('totalNota', total)
  }, [entity.products, entity.desconto, entity.frete, entity.seguro, entity.outrasDespesas])
  useEffect(() => {
    if (entity.cliente && entity.products.length === 0) {
      form.setFieldValue('products', [...entity.products, { cfop: '5102', quantidade: 0, unitario: 0 }])
    }
    if (entity.cliente === undefined && entity.products.length === 1) {
      form.setFieldValue('products', [])
    }
  }, [entity.cliente])
  function authNfe() {
    if (entity.status !== 'Autorizado' && entity.status !== 'Denegado' && entity.status !== 'Cancelado') {
      form.setFieldValue('authNfe', true)
    }
    form.handleSubmit()
  }

  function checkNfe() {
    if (id) {
      if (entity.status !== 'Autorizado') {
        axios
          .get(`nfe.check/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(({ data }) => {
            form.setFieldValue('status', data.check.xMotivo)
          })
          .catch(err => modal.alert(err.message))
          .finally()

        setPrintFetching(true)
        // const x = await axios.get(`nfe.report/${id}`, {
        //   headers: { Authorization: `Bearer ${saToken}`, 'content-type': 'application/pdf' },
        // })
        axios
          .get(`nfe.report/${id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
          .then(response => {
            if (entity.status === 'Autorizado') {
              iframeDownload(response.data, `${entity.chave}.pdf`)
            } else {
              modal.alert('Nfe ainda não autorizada')
            }
          })
          .catch(err => modal.alert(err.message))
          .finally(() => setPrintFetching(false))
      } else {
        setPrintFetching(true)
        // const x = await axios.get(`nfe.report/${id}`, {
        //   headers: { Authorization: `Bearer ${saToken}`, 'content-type': 'application/pdf' },
        // })
        axios
          .get(`nfe.report/${id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
          .then(response => {
            if (entity.status === 'Autorizado') {
              iframeDownload(response.data, `${entity.chave}.pdf`)
            } else {
              modal.alert('Nfe ainda não autorizada')
            }
          })
          .catch(err => modal.alert(err.message))
          .finally(() => setPrintFetching(false))
      }
    }
  }
  function cancelNfe() {
    if (id) {
      modal.confirm(
        `Deseja cancelar a NFe ${entity.numeroNota} Serie ${entity.serie}? `,
        confirmed =>
          confirmed &&
          axios
            .get(`nfe.cancel/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
            .then(() => pushTo('/nota'))
            .catch(err => modal.alert(err.message))
            .finally(),
      )
    } else modal.alert('Para Enviar a Nota Salve-a Primeiro')
  }
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar Nota: ${entity.numeroNota}` : 'Nova Nota'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg-1">
                <Field label="Nota">
                  <TextInput
                    id="numeroNota"
                    autoComplete="Nota"
                    placeholder="nota"
                    customClassName="form-control"
                    value={'' + entity.ultNota}
                    disabled={!!id}
                  />
                </Field>
              </div>
              <div className="col-lg-1">
                <Field label="Serie">
                  <DecimalInput
                    id="serie"
                    name="serie"
                    icon={undefined}
                    acceptEnter={undefined}
                    noSelect={undefined}
                    disabled={undefined}
                    precision={0}
                  />
                </Field>
              </div>
              <div className="col-lg-3">
                <Field label="Natureza de Operação">
                  <TextInput
                    id="naturezaOp"
                    autoComplete="naturezaOp"
                    placeholder="Natureza de operação"
                    customClassName="form-control"
                    value={entity.naturezaOp}
                  />
                </Field>
              </div>
              <div className="col-lg-1">
                <Field label="Tipo">
                  <TextInput
                    id="tipo"
                    autoComplete="tipo"
                    placeholder="Tipo (ENTRADA/SAIDA)"
                    customClassName="form-control"
                    value={entity.tipo}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Chave de Acesso">
                  <TextInput
                    id="chave"
                    autoComplete="chave"
                    placeholder="Chave de Acesso"
                    customClassName="form-control"
                    value={entity.chave}
                  />
                </Field>
              </div>
              <div className="col-lg-2">
                <Field label="Data">
                  <DateInput
                    id="data"
                    placeholder="Data"
                    disabled={!!id}
                    name={'data'} // mask={'99.999.999/9999-99'}
                  />
                </Field>
              </div>
            </div>
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />

            <div className="row">
              <div className="col-lg">
                <Field label="Cliente">
                  <Select
                    getId={({ id, uuid }) => (parameter.getApoio ? uuid : id)}
                    getDisplay={({ name }) => name}
                    selected={entity.cliente}
                    items={customer}
                    onChange={company => {
                      if (parameter.getApoio) {
                        const properties = company.properties[0]
                        form.setFieldValue('cliente', company?.uuid)

                        form.setFieldValue('Customer.cpfCnpj', properties.cpfCnpj)
                        form.setFieldValue('Customer.name', properties.name)
                        form.setFieldValue('Customer.email', properties.email)
                        form.setFieldValue('Customer.phone', properties.phone)
                        form.setFieldValue('Customer.mobilePhone', properties.phone)
                        form.setFieldValue('Customer.dateCreated', new Date())
                        form.setFieldValue('Customer.additionalEmails', properties.additionalEmails)
                        form.setFieldValue('Customer.address', properties.streetName)
                        form.setFieldValue('Customer.addressNumber', properties.streetNumber)
                        form.setFieldValue('Customer.complement', properties.complement)
                        form.setFieldValue('Customer.province', properties.district)
                        form.setFieldValue('Customer.postalCode', properties.postalCode)
                        form.setFieldValue('Customer.stateInscription', properties.rgIeIp)
                        form.setFieldValue('Customer.state', properties.state)
                        form.setFieldValue('Customer.city', properties.city)
                        form.setFieldValue('Customer.cityId', properties.city)
                      } else {
                        form.setFieldValue('cliente', company?.id)
                        form.setFieldValue('Customer', company)
                      }

                      form.setFieldValue('newCustoner', false)
                    }}
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    isClearable={true}
                    styles={undefined}
                  ></Select>
                </Field>
              </div>
              {!parameter.getApoio && (
                <div className="col-lg align-right">
                  <Field label=".">
                    <br />
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        pushTo('/cliente/cadastro')
                      }}
                    >
                      <i className="fas fa-plus" aria-hidden="true" />
                      <span>Novo Cliente</span>
                    </button>
                  </Field>
                </div>
              )}
              <div className="col-lg">
                <Field label="Forma de Pagamento">
                  <Select
                    getId={({ id }) => id}
                    getDisplay={({ description }) => description}
                    selected={entity.paymentMethodId}
                    items={payMethod}
                    onChange={PayMethod => {
                      form.setFieldValue('paymentMethodId', PayMethod?.id)
                    }}
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false}
                    isClearable={true}
                    styles={undefined}
                  ></Select>
                </Field>
              </div>
            </div>
            {entity.cliente && (
              <>
                <div className="row">
                  <div className="col-lg">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">{`CPF/CNPJ: ${maskCpfCnpj(
                        entity.Customer.cpfCnpj,
                      )} | RG/IE: ${entity.Customer.stateInscription || ''} | ${
                        entity.Customer.adrress +
                        ' Nº ' +
                        entity.Customer.addressNumber +
                        ' ' +
                        entity.Customer.province +
                        ' Telefone: ' +
                        maskCellPhone(entity.Customer.phone)
                      }`}</h3>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
            <ul className="nav nav-tabs kt-mb-0" role="tablist">
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'produtos',
                  })}
                  onClick={() => form.setFieldValue('view', 'produtos')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Produtos</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'freteOutrasDespesas',
                  })}
                  onClick={() => form.setFieldValue('view', 'freteOutrasDespesas')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Frete e Outras Despesas</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'dadosAdd',
                  })}
                  onClick={() => form.setFieldValue('view', 'dadosAdd')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Dados Adicionais</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'obs',
                  })}
                  onClick={() => form.setFieldValue('view', 'obs')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Observações</span>
                </button>
              </li>

              {entity.erros && (
                <li className="nav-item">
                  <button
                    className={classNames('nav-link', {
                      active: entity.view === 'erros',
                    })}
                    onClick={() => form.setFieldValue('view', 'erros')}
                    type="button"
                  >
                    <span className="btn kt-padding-0">Erros</span>
                  </button>
                </li>
              )}
              {entity.view === 'cartaCorrecao' && (
                <li className="nav-item">
                  <button
                    className={classNames('nav-link', {
                      active: entity.view === 'cartaCorrecao',
                    })}
                    onClick={() => form.setFieldValue('view', 'erros')}
                    type="button"
                  >
                    <span className="btn kt-padding-0">Carta De Correção</span>
                  </button>
                </li>
              )}
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'produtos' && <ProductsForm form={form} entity={entity} products={products} />}
              {entity.view === 'freteOutrasDespesas' && <FreteForm entity={entity} form={form} customers={customer} />}

              {entity.view === 'dadosAdd' && <AddForm entity={entity} form={form} />}
              {entity.view === 'obs' && <ObsForm entity={entity} />}
              {entity.view === 'erros' && <ErrosForm entity={entity} />}
              {entity.view === 'cartaCorrecao' && <CartaForm entity={entity} form={form} />}
            </div>
            <br />
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
            <div className="row">
              <div className="col-lg" style={{ marginTop: '22px' }}>
                <Button
                  type="button"
                  icon="fas fa-clipboard-check"
                  customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
                  title="Autorizar Nota"
                  //  loading={form.isSubmitting}
                  //  disabled={!id && entity.status !== 'Validado'}
                  onClick={() => authNfe()}
                />
                <Button
                  type="button"
                  icon="fas fa-print"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Gerar Danfe"
                  disabled={!id && !entity.reciboLote}
                  onClick={() => checkNfe()}
                />
                <br />
                <Button
                  type="button"
                  icon="fas fa-envelope-open-text"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Carta de Correção"
                  disabled={form.isSubmitting}
                  onClick={() => form.setFieldValue('view', 'cartaCorrecao')}
                />

                <Button
                  icon="fas fa-ban"
                  customClassName="btn-danger margin-right-10 margin-bottom-10 widthButton"
                  title="Cancelar Nota"
                  loading={form.isSubmitting}
                  disabled={entity.status === 'Cancelado'}
                  onClick={() => cancelNfe()}
                />
              </div>

              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Status">
                    <h3 className="kt-portlet__head-title">{entity.status}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Qtde Itens">
                    <h3 className="kt-portlet__head-title">{entity.products.length}</h3>
                  </Field>
                </div>
              </div>
              <div className="col-lg-2" style={{ marginRight: '30px' }}>
                <Field label="Desconto">
                  <DecimalInput
                    id={'frete'}
                    name={'desconto'}
                    icon={undefined}
                    acceptEnter={undefined}
                    noSelect={undefined}
                    disabled={false}
                  />
                </Field>
              </div>
              <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                  <Field label="Total da Nota">
                    <h3 className="kt-portlet__head-title">{maskMoney(entity.totalNota)}</h3>
                  </Field>
                </div>
              </div>
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
                      onClick={() => pushTo('/nota')}
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
          </div>
        </form>
      </div>
    </FormikProvider>
  )
}
function validateForm(values: NfeFormValues) {
  const errors: FormikErrors<NfeFormValues> = {}

  if (!values.cliente || (!values.Customer && values.newCustoner)) {
    errors.cliente = RequiredMessage
  }
  if (values.desconto > values.totalNota) {
    errors.desconto = 'Total deve menor ou igual ao Total da nota '
  }
  values.products.forEach(prod => {
    if (prod.descontoProd > prod.total) {
      errors.totalNota = 'Total deve menor ou igual ao Total da nota '
    }
  })

  return errors
}
