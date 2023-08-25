import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DateInput from '../../../components/form/date-input'
import DecimalInput from '../../../components/form/decimal-input'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { TextAreaInput } from '../../../components/form/textarea-input'
import { getCustomers } from '../../../helpers'
import { RequiredMessage, PaymentMean } from '../../../helpers/constants'
import { maskCellPhone, maskCpfCnpj, maskMoney } from '../../../helpers/mask'
import { classNames, iframeDownload } from '../../../helpers/misc'
import { ProductsForm } from './products'

interface Customer {
  id?: string
  cpfCnpj: string
  stateInscription?: string | null
  name: string
  company?: string | null
  email: string
  phone: string
  mobilePhone: string
  dateCreated: Date
  additionalEmails?: string | null
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  cityId?: number | null
  state: string
  disableAt?: Date | null
  observations?: string | null
  companyId?: string | null
  deliveryAddress?: string | null
  informarGTIN: boolean
}

interface BudgetProducts {
  id?: string
  budgetId?: string | null
  productId?: string | null
  amount?: number | null
  unitary?: number | null
  total?: number | null
  companyId?: string | null
  descontoProd?: number | null
}

interface BudgetFormValues {
  Customer?: Customer
  id?: string
  numberBudget?: number | null
  customerId?: string | null
  propertyId: string
  cpfCnpj?: string
  createdAt: Date
  status?: number | null
  shipping: number
  discount: number
  total: number
  deliveryForecast?: Date
  obs?: string | null
  view: string
  BudgetProducts: BudgetProducts[]
  auth: boolean
  payMethodId?: string | null
  customerApoioId?: string
  installments?: string
  paymentMean?: number | null
  customerIdApoio?: number | null
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
  const [properties, setProperties] = useState([])
  const [products, setproduct] = useState([])
  const [budget, setBudget] = useState<BudgetFormValues>()
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()

  function genereteOrder(entity, modal, form) {
    const OrderProducts = entity.BudgetProducts
    const values = {
      numberOrder: null,
      propertyId: entity.propertyId,
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
      customerApoioProperty: entity.customerApoioProperty,
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
      paymentMean: entity.paymentMean,
      installments: entity.installments,
    }
    modal?.confirm(`Deseja Gerar Pedido?`, confirmed => {
      if (confirmed) {
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
      payMethodId: null,
      obs: null,
      propertyId: '',
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
        informarGTIN: false,
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
          if (data.customerIdApoio) {
            fetch(
              `https://apoiogenetica.sistemaexpert.com.br/api/customer.properties.public.key/${data.customerIdApoio}`,
            )
              .then(r => r.json())
              .then(resp => {
                setProperties(resp)
              })
              .catch(err => modal?.alert(err.message))
              .finally()
          }
        })
        .catch(err => modal?.alert(err.message))
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
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])

  useEffect(() => {
    if (parameter?.getApoio) {
      getCustomers().then(resp => {
        setCustomer(resp)
      })
    } else {
      axios
        .post(`customer.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomer(data.items)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }

    axios
      .post(`product.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setproduct(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [id])

  useEffect(() => {
    const total = entity.BudgetProducts.reduce((acc, curr) => acc + (curr.total || 0), 0)
    const discount1 = entity.BudgetProducts.reduce((acc, curr) => acc + (curr.descontoProd || 0), 0)
    if (discount1 > 0) {
      form.setFieldValue('total', total)
      form.setFieldValue('discount', discount1)
    } else {
      if (entity.discount > 0) form.setFieldValue('discount', entity.discount)
      else form.setFieldValue('discount', 0)
      form.setFieldValue('total', total - entity.discount)
    }
  }, [entity.discount, entity.BudgetProducts])

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
  }, [entity.propertyId])

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
                    customClassName="form-control kt-align-right"
                    value={'' + entity.numberBudget}
                    disabled
                  />
                </Field>
              </div>
              <div className="col-lg-2">
                <Field label="Data">
                  <DateInput
                    id="createdAt"
                    placeholder="Data"
                    disabled={!!id}
                    name={'createdAt'} // mask={'99.999.999/9999-99'}
                  />
                </Field>
              </div>
              <div className="col-lg-2">
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
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-xp" />

            <div className="row">
              <div className="col-lg">
                <Field label="Cliente">
                  <Select
                    getId={({ id, uuid }) => (parameter?.getApoio ? uuid : id)}
                    getDisplay={({ name }) => name}
                    selected={parameter?.getApoio ? entity.customerApoioId : entity.customerId}
                    items={customer}
                    onChange={company => {
                      form.setFieldValue('propertyId', null)
                      setProperties([])
                      if (!parameter?.getApoio) {
                        form.setFieldValue('customerId', company?.id)
                        form.setFieldValue('Customer', company)
                      } else {
                        const emailList = company?.emails.filter(e => e.type === 1)[0]
                        form.setFieldValue('customerApoioId', company?.uuid)
                        form.setFieldValue('customerIdApoio', company?.id)
                        form.setFieldValue('emailApoio', emailList ? emailList.email?.toLowerCase() : '')
                        fetch(
                          `https://apoiogenetica.sistemaexpert.com.br/api/customer.properties.public.key/${company.id}`,
                        )
                          .then(r => r.json())
                          .then(resp => {
                            setProperties(resp)
                          })
                          .catch(err => modal?.alert(err.message))
                          .finally()
                      }
                    }}
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false || undefined}
                    isClearable={true}
                    styles={undefined}
                  ></Select>
                </Field>
              </div>
              {!parameter?.getApoio && (
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
              {parameter?.getApoio && (
                <div className="col-lg">
                  <Field label="Propriedade">
                    <Select
                      getId={({ id }) => id}
                      getDisplay={({ tabName }) => tabName}
                      selected={entity.propertyId}
                      items={properties}
                      onChange={properties => {
                        form.setFieldValue('propertyId', properties?.id)
                        form.setFieldValue('customerApoioName', properties.name)
                        form.setFieldValue('customerApoioProperty', properties.tabName)
                        form.setFieldValue('cpfCnpjApoio', properties.cpfCnpj)
                        form.setFieldValue('phoneApoio', properties.phone)
                        form.setFieldValue('addressApoio', properties.streetName)
                        form.setFieldValue('addressNumberApoio', properties.streetNumber)
                        form.setFieldValue('complementApoio', properties.complement)
                        form.setFieldValue('provinceApoio', properties.district)
                        form.setFieldValue('postalCodeApoio', properties.postalCode)
                        form.setFieldValue('stateInscriptionApoio', properties.rgIeIp)
                        form.setFieldValue('stateApoio', properties.state)
                        form.setFieldValue('cityApoio', properties.city)
                      }}
                      disabled={false}
                      isMulti={undefined}
                      isLoading={false || undefined}
                      isClearable={true}
                      styles={undefined}
                    ></Select>
                  </Field>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-lg-3">
                <Field label="Meio de Pagamento">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={entity.paymentMean}
                    items={PaymentMean}
                    onChange={paymentMean => {
                      form.setFieldValue('paymentMean', paymentMean?.id)
                      if (paymentMean?.id === 1 || paymentMean?.id === 9) form.setFieldValue('installments', '')
                      else form.setFieldValue('installments', 'Av')
                    }}
                  />
                </Field>
              </div>
              <div className="col-lg-3">
                <Field label="Parcelas">
                  <TextInput
                    id="installments"
                    placeholder="Qt parcelas ou Prazo (ex: 0/30)"
                    customClassName="form-control"
                    value={entity?.installments ?? ''}
                  />
                </Field>
              </div>
            </div>
            {entity.customerId && (
              <>
                <div className="row">
                  <div className="col-lg">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">{`CPF/CNPJ: ${maskCpfCnpj(
                        entity.Customer?.cpfCnpj,
                      )} | RG/IE: ${entity.Customer?.stateInscription || ''} | ${
                        entity.Customer?.address ||
                        '' + ' Nº ' + entity.Customer?.addressNumber ||
                        '' + ' ' + entity.Customer?.province ||
                        '' + ' Telefone: ' + maskCellPhone(entity.Customer?.phone)
                      }`}</h3>
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-xp" />
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
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-xp" />
            <div className="row">
              <div className="col-lg" style={{ marginTop: '22px' }}>
                <Button
                  type="button"
                  icon="fas fa-check"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Autorizar"
                  disabled={form.isSubmitting || entity.auth || !id}
                  onClick={() => genereteOrder(entity, modal, form)}
                />
                <Button
                  type="button"
                  icon="fas fa-print"
                  customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
                  title="Imprimir"
                  disabled={printFetching || !id}
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
                      .catch(err => modal?.alert(err.message))
                      .finally(() => setPrintFetching(false))
                  }}
                />
              </div>
              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Status">
                    <h3 className="kt-portlet__head-title kt-align-right">{entity.auth ? 'Autorizado' : 'Pendente'}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Qtde Itens">
                    <h3 className="kt-portlet__head-title kt-align-right">{entity.BudgetProducts.length}</h3>
                  </Field>
                </div>
              </div>
              <div className="col-lg-2" style={{ marginRight: '30px', marginTop: '20px' }}>
                <Field label="Desconto">
                  <DecimalInput
                    id={'discount'}
                    name={'discount'}
                    icon={undefined}
                    acceptEnter={undefined}
                    noSelect={undefined}
                    disabled={false}
                  />
                </Field>
              </div>
              <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                  <Field label="Total do Orçamento">
                    <h3 className="kt-portlet__head-title kt-align-right">{maskMoney(entity.total)}</h3>
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
                      disabled={form.isSubmitting || entity.auth}
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

  if (!values.propertyId) {
    errors.propertyId = RequiredMessage
  }
  if (!values.paymentMean) errors.paymentMean = RequiredMessage
  if (!values.installments) errors.installments = RequiredMessage
  if (values.discount > values.total) {
    errors.discount = 'Total deve menor ou igual ao Total do orçamento '
  }

  return errors
}
