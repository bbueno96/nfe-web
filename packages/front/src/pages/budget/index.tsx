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
import { toLocaleDate } from '../../helpers/date'
import { onlyNumbers } from '../../helpers/format'
import { maskCellPhone, maskCpfCnpj, maskMoney } from '../../helpers/mask'
import { classNames, iframeDownload } from '../../helpers/misc'
import useFilters from '../../hooks/filter'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface BudgetListValues {
  id?: string
  numberBudget?: number
  customerId: string
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
}

interface BudgetFormValues {
  Customer?: any
  id?: string
  numberBudget?: number
  customerId: string
  cpfCnpj?: string
  createdAt: Date
  status: string
  shipping: number
  discount: number
  total: number
  deliveryForecast?: Date
  obs?: string
  view: string
  BudgetProducts: any[]
  auth: boolean
  payMethodId?: string
  customerApoioId?: string
}

export const BudgetList = () => {
  const [, setPrintFetching] = useState(false)
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    name: '',
    cpfCnpj: '',
  })

  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<BudgetListValues>({ initialQuery: { sort: [{ name: 'id' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('budget.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
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
                action: '/orcamento/:id',
                // hideWhen: ent => ent.status === 'Autorizado',
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

const listColumns: ListColumn<BudgetListValues>[] = [
  { path: 'numberBudget', title: 'Orçamento', style: { width: '50px', textAlign: 'right' } },
  { path: 'customerName', title: 'Cliente' },
  {
    path: 'cpfCnpj',
    title: 'CPF/CNPJ',
    format: c => maskCpfCnpj(c),
    style: { width: '100px', textAlign: 'right' },
  },
  { path: 'createdAt', title: 'Data', format: f => toLocaleDate(f) },

  {
    path: 'status',
    title: 'Status',
    style: { width: '100px', textAlign: 'right' },
  },
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
    path: 'payMethodName',
    title: 'Forma de Pagamento',
  },
  {
    path: 'total',
    title: 'Total',
    format: f => maskMoney(parseFloat('' + f).toFixed(2)),
    style: { width: '150px', textAlign: 'right' },
  },
]

export const ProductsForm = ({ form, entity, products }) => {
  function handleAddProduct(ev) {
    ev.preventDefault()
    form.setFieldValue('BudgetProducts', [...entity.BudgetProducts, { amount: 0, unitary: 0 }])
  }
  useEffect(() => {
    if (entity.BudgetProducts.length > 0) {
      entity.BudgetProducts.forEach(prods => {
        const total = prods.amount * parseFloat(prods.unitary)
        if (total - prods.descontoProd >= 0) {
          prods.total = total - prods.descontoProd
        } else {
          prods.descontoProd = 0
          prods.total = total
        }
        if (prods.amount > 0) {
          prods.peso = prods.amount * prods.weight

          prods.unidade = prods.Product?.und
        }
      })
    }
  }, [entity.BudgetProducts])

  return (
    <>
      <FieldArray
        name="BudgetProducts"
        render={() => (
          <>
            <div
              className={classNames('kt-datatable kt-datatable--default kt-datatable--brand', {
                'kt-datatable--loaded': entity.BudgetProducts.length > 0,
                'table-loading': true,
              })}
            >
              <table className="kt-datatable__table" style={{ borderCollapse: 'separate' }}>
                <thead className="datatable-head">
                  <tr className="kt-datatable__row">
                    <th className="kt-datatable__cell">
                      <span>Produto</span>
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
                  {entity.BudgetProducts.map((p, i) => (
                    <tr key={i} className="datatable-row">
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '350px' }}>
                        <Select
                          getId={({ id }) => id}
                          getDisplay={({ description }) => description.slice(0, 50)}
                          selected={p.produto ? p.produto : p.productId}
                          items={products}
                          onChange={prod => {
                            form.setFieldValue(`BudgetProducts.${i}.descricao`, prod.description)
                            form.setFieldValue(`BudgetProducts.${i}.unidade`, prod.und)
                            form.setFieldValue(`BudgetProducts.${i}.productId`, prod.id)
                            form.setFieldValue(`BudgetProducts.${i}.unitary`, prod.value)
                            form.setFieldValue(`BudgetProducts.${i}.amount`, 1.0)
                            form.setFieldValue(`BudgetProducts.${i}.weight`, prod.weight)
                          }}
                          disabled={false}
                          isMulti={undefined}
                          isLoading={false}
                          isClearable={true}
                          styles={undefined}
                        />
                      </td>

                      <td className="kt-datatable__cell " style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          id={`BudgetProducts.${i}.amount`}
                          name={`BudgetProducts.${i}.amount`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                          precision={0}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '90px' }}>
                        <TextInput
                          placeholder=""
                          name={`BudgetProducts.${i}.unidade`}
                          disabled
                          value={`BudgetProducts.${i}.unidade`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          id={`BudgetProducts.${i}.unitary`}
                          name={`BudgetProducts.${i}.unitary`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          name={`BudgetProducts.${i}.descontoProd`}
                          id={'BudgetProducts.[i].descontoProd '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 15px white', width: '200px' }}>
                        <DecimalInput
                          name={`BudgetProducts.${i}.total`}
                          id={'BudgetProducts.[i].total '}
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
                              'BudgetProducts',
                              entity.BudgetProducts.filter((_, n) => n !== i),
                            )
                          }
                        >
                          <i className="fas fa-trash" aria-hidden="true" />
                        </button>
                      </td>
                      {i === entity.BudgetProducts.length - 1 && (
                        <td className="kt-datatable__cell">
                          <button type="button" className="btn btn-success" onClick={ev => handleAddProduct(ev)}>
                            <i className="fas fa-plus" aria-hidden="true" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {entity.BudgetProducts.length === 0 && (
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

export const ObsForm = ({ entity, form }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Observações ">
            <TextAreaInput
              refEl={undefined}
              value={entity.obs}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={obs => form.setFieldValue('obs', obs)}
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

export const BudgetForm = () => {
  const [printFetching, setPrintFetching] = useState(false)
  const { parameter } = useApp()
  const [customer, setCustomer] = useState([])
  const [products, setproduct] = useState([])
  const [payMethod, setPayMethod] = useState([])
  const [budget, setBudget] = useState<BudgetFormValues>(null)
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()

  function genereteOrder(entity, modal, form) {
    const OrderProducts = entity.BudgetProducts
    const values = {
      numberOrder: null,
      Customer: entity.Customer,
      OrderProducts,
      customerId: entity.customerId,
      budgetId: entity.id,
      payMethodId: entity.payMethodId,
      shipping: entity.shipping,
      status: entity.status,
      total: entity.total,
      createdAt: new Date(),
      discount: entity.discount,
      obs: entity.obs,
      customerApoioId: entity.customerApoioId,
      customerApoioName: entity.customerApoioName,
      cpfCnpjApoio: entity.cpfCnpjApoio,
      stateInscriptionApoio: entity.stateInscriptionApoio,
      emailApoio: entity.emailApoio,
      phoneApoio: entity.phoneApoio,
      addressApoio: entity.addressApoio,
      addressNumberApoio: entity.addressNumberApoio,
      complementApoio: entity.complementApoio,
      provinceApoio: entity.provinceApoio,
      postalCodeApoio: entity.postalCodeApoio,
      cityApoio: entity.cityApoio || null,
      stateApoio: entity.stateApoio,
    }
    modal.confirm(`Deseja Gerar Pedido?`, confirmed => {
      if (confirmed) {
        axios
          .post(
            `budget.update/${entity.id}`,
            { ...entity, auth: true },
            { headers: { Authorization: `Bearer ${saToken}` } },
          )
          .then()
          .catch(err => setGlobalError(err.response.data.message))
          .finally(() => form.setSubmitting(false))
        axios
          .post(`order.add`, { ...values }, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(v => pushTo(`/pedido/${v.data.id}`))
          .catch(err => setGlobalError(err.response.data.message))
          .finally(() => {
            form.setSubmitting(false)
          })
      }
    })
  }

  const form = useFormik<BudgetFormValues>({
    initialValues: {
      id: '0',
      customerId: null,
      createdAt: new Date(),
      status: null,
      shipping: 0.0,
      discount: 0.0,
      total: 0.0,
      view: 'Product',
      BudgetProducts: [],
      numberBudget: 0,
      auth: false,
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
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  function handleSubmit(values: BudgetFormValues) {
    if (id) {
      axios
        .post(`budget.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/orcamento'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`budget.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/orcamento'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => {
          form.setSubmitting(false)
        })
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`budget.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setBudget(data)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (budget) {
      setValues(budget)
      form.setFieldValue('view', 'Product')
    }
  }, [budget])

  useEffect(() => {
    if (!id) {
      axios
        .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('numberBudget', data.ultBudget + 1 || 1)
        })
        .catch(err => modal.alert(err.message))
        .finally()
    }
  }, [id])

  useEffect(() => {
    if (parameter.getApoio) {
      getCustomers().then(resp => {
        setCustomer(resp)
      })
    } else {
      axios
        .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
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

    axios
      .post(`paymethod.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setPayMethod(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
  }, [id])
  useEffect(() => {
    const total =
      entity.BudgetProducts.reduce((acc, curr) => acc + parseFloat(curr.total), 0) +
      parseFloat('' + entity.shipping) -
      parseFloat('' + entity.discount)
    form.setFieldValue('total', total)
  }, [entity.BudgetProducts, entity.discount, entity.shipping])
  useEffect(() => {
    if ((entity.customerId || entity.customerApoioId) && entity.BudgetProducts.length === 0) {
      form.setFieldValue('BudgetProducts', [...entity.BudgetProducts, { amount: 0, unitary: 0 }])
    }
    if (
      (entity.customerId === undefined || entity.customerApoioId === undefined) &&
      entity.BudgetProducts.length === 1
    ) {
      form.setFieldValue('BudgetProducts', [])
    }
  }, [entity.customerId, entity.customerApoioId])

  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">
              {id ? `Editar Orçamento: ${entity.numberBudget}` : 'Novo Orçamento'}
            </h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg-2">
                <Field label="Orçamento">
                  <TextInput
                    id="numberBudget"
                    autoComplete="Orçamento"
                    placeholder="orcamento"
                    customClassName="form-control"
                    value={'' + entity.numberBudget}
                    disabled
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Data">
                  <DateInput
                    id="createdAt"
                    placeholder="Data"
                    disabled={!!id}
                    name={'createdAt'} // mask={'99.999.999/9999-99'}
                  />
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Previsão de Entrega">
                  <DateInput
                    id="deliveryForecast"
                    placeholder="Previsão de Entrega"
                    disabled={false}
                    name="deliveryForecast" // mask={'99.999.999/9999-99'}
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
                    selected={parameter.getApoio ? entity.customerApoioId : entity.customerId}
                    items={customer}
                    onChange={company => {
                      if (parameter.getApoio) {
                        const properties = company.properties[0]
                        form.setFieldValue('customerApoioId', company?.uuid)
                        form.setFieldValue('customerApoioName', properties.name)
                        form.setFieldValue('cpfCnpjApoio', properties.cpfCnpj)
                        form.setFieldValue('emailApoio', properties.email)
                        form.setFieldValue('phoneApoio', properties.phone)
                        form.setFieldValue('addressApoio', properties.streetName)
                        form.setFieldValue('addressNumberApoio', properties.streetNumber)
                        form.setFieldValue('complementApoio', properties.complement)
                        form.setFieldValue('provinceApoio', properties.district)
                        form.setFieldValue('postalCodeApoio', properties.postalCode)
                        form.setFieldValue('stateInscriptionApoio', properties.rgIeIp)
                        form.setFieldValue('stateApoio', properties.state)
                        form.setFieldValue('cityApoio', properties.city)
                      } else {
                        form.setFieldValue('customerId', company?.id)
                        form.setFieldValue('Customer', company)
                      }
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
                    selected={entity.payMethodId}
                    items={payMethod}
                    onChange={PayMethod => {
                      form.setFieldValue('payMethodId', PayMethod?.id)
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
            {entity.customerId && (
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
                    active: entity.view === 'Product',
                  })}
                  onClick={() => form.setFieldValue('view', 'Product')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Produtos</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Obs',
                  })}
                  onClick={() => form.setFieldValue('view', 'Obs')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Observações</span>
                </button>
              </li>
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Product' && <ProductsForm form={form} entity={entity} products={products} />}

              {entity.view === 'Obs' && <ObsForm entity={entity} form={form} />}
            </div>
            <br />
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
            <div className="row">
              <div className="col-lg" style={{ marginTop: '22px' }}>
                <Button
                  type="button"
                  icon="fas fa-check"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Autorizar"
                  disabled={form.isSubmitting}
                  onClick={() => genereteOrder(entity, modal, form)}
                />
                <Button
                  type="button"
                  icon="fas fa-print"
                  customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
                  title="Imprimir"
                  disabled={printFetching}
                  onClick={() => {
                    setPrintFetching(true)
                    axios
                      .get(`budget.report/${entity.id}`, {
                        responseType: 'blob',
                        headers: { Authorization: `Bearer ${saToken}` },
                      })
                      .then(response => {
                        iframeDownload(response.data, `Orçamento.pdf`)
                      })
                      .catch(err => modal.alert(err.message))
                      .finally(() => setPrintFetching(false))
                  }}
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
                    <h3 className="kt-portlet__head-title">{entity.BudgetProducts.length}</h3>
                  </Field>
                </div>
              </div>

              <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                  <Field label="Total da Orçamento">
                    <h3 className="kt-portlet__head-title">{maskMoney(entity.total)}</h3>
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
                      onClick={() => pushTo('/orcamento')}
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
function validateForm(values: BudgetFormValues) {
  const errors: FormikErrors<BudgetFormValues> = {}

  // if (!values.customerId || (!values.Customer && values.customerId)) {
  //   errors.customerId = RequiredMessage
  // }
  if (values.discount > values.total) {
    errors.discount = 'Total deve menor ou igual ao Total da orcamento '
  }
  values.BudgetProducts.forEach(prod => {
    if (prod.descontoProd > prod.total) {
      errors.total = 'Total deve menor ou igual ao Total da orcamento '
    }
  })

  return errors
}
