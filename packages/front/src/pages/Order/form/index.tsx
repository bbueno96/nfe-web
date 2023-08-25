import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'
import { Transition } from 'react-transition-group'

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
import { ModalPortal } from '../../../components/modal-portal'
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
  customerApoioProperty?: string | null
}

interface OrderProducts {
  id?: string
  orderId?: string | null
  productId?: string | null
  amount?: number | null
  unitary?: number | null
  total?: number | null
  companyId?: string | null
}
interface OrderFormValues {
  Customer?: Customer
  id?: string
  numberOrder?: number
  customerId: string
  propertyId?: string
  customerApoioName?: string
  createdAt: Date
  status: string
  shipping: number
  discount: number
  total: number
  obs?: string
  view: string
  OrderProducts: OrderProducts[]
  budGetid?: string
  payMethodId?: string
  customerApoioId?: string
  stateInscriptionApoio?: string
  emailApoio?: string
  phoneApoio?: string
  addressApoio?: string
  addressNumberApoio?: string
  complementApoio?: string
  provinceApoio?: string
  postalCodeApoio?: string
  cityIdApoio?: number
  stateApoio?: string
  cpfCnpjApoio?: string
  installments?: string
  paymentMean?: number
  modalShow: boolean
  bankAccountId: string
  wallet?: number | null
  customerApoioProperty?: string
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

export const OrderForm = () => {
  const [printFetching, setPrintFetching] = useState(false)
  const { parameter } = useApp()
  const [customer, setCustomer] = useState([])
  const [bankAccount, setBankaccount] = useState([])
  const [order, setOrder] = useState<OrderFormValues>()
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()

  function genereteNfe(entity, modal, form, customer) {
    const customerAux = customer?.filter(e => e.uuid === entity.customerApoioId)[0]
    const properties = customerAux.properties?.filter(p => p.id === entity.propertyId)[0]
    const emailList = customerAux.emails?.filter(e => e.type === 3)[0]
    const values = {
      authNfe: false,
      Customer: {
        cpfCnpj: properties.cpfCnpj,
        name: properties.name,
        customerApoioProperty: properties.tabName,
        email: emailList ? emailList.email?.toLowerCase() : '',
        mobilePhone: properties.phone,
        dateCreated: new Date(),
        additionalEmails: properties.additionalEmails,
        address: properties.streetName,
        addressNumber: properties.streetNumber,
        complement: properties.complement,
        province: properties.district,
        postalCode: properties.postalCode,
        stateInscription: properties.rgIeIp,
        state: properties.state,
        city: properties.city,
        cityId: properties.city,
        documentType: properties.documentType,
        taxpayerType: properties.taxpayerType,
      },
      products: entity.OrderProducts.map(p => {
        return {
          id: p.productId,
          quantidade: parseFloat(p.amount),
          unitario: parseFloat(p.unitary).toFixed(4),
          total: p.total.toFixed(4),
          cfop: p.Product.cfop,
          peso: p.peso,
        }
      }),
      cliente: parameter?.getApoio ? entity.customerApoioId : entity.customerId,
      orderId: entity.id,
      payMethodId: entity.payMethodId,
      propertyId: entity.propertyId,
      frete: entity.shipping,
      seguro: 0,
      status: 'Envio Pendente',
      total: parseFloat(entity.total),
      data: new Date(),
      desconto: entity.discount,
      observacoes: entity.obs,
      tipo: 'SAIDA',
      totalNota: parseFloat(entity.total),
      totalProduto: parseFloat(entity.total),
      totalCheque: 0,
      totalDinheiro: parseFloat(entity.total),
      totalCartaoCredito: 0,
      totalBoleto: 0,
      totalOutros: 0,
      totalCartaoDebito: 0,
      naturezaOp: 'Venda',
      numeroNota: null,
      outrasDespesas: 0,
      freteOutros: 0,
      paymentMethodId: entity.payMethodId,
      installments: entity.installments,
      paymentMean: entity.paymentMean,
      bankAccountId: entity.bankAccountId,
      wallet: entity.wallet,
    }
    modal?.confirm(`Deseja Faturar?`, confirmed => {
      if (confirmed) {
        axios
          .post(`nfe.add`, { ...values }, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(v => pushTo(`/nota/${v.data.id}`))
          .catch(err => setGlobalError(err.response.data.message))
          .finally(() => {
            form.setSubmitting(false)
          })
      }
    })
  }

  const form = useFormik<OrderFormValues>({
    initialValues: {
      id: '0',
      customerId: '',
      createdAt: new Date(),
      status: '',
      shipping: 0.0,
      discount: 0.0,
      total: 0.0,
      view: 'Product',
      OrderProducts: [],
      numberOrder: 0,
      Customer: {
        cpfCnpj: '',
        customerApoioProperty: null,
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
      modalShow: false,
      bankAccountId: '',
      wallet: undefined,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  function handleSubmit(values: OrderFormValues) {
    if (id) {
      axios
        .post(`order.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/pedido'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`order.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/pedido'))
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
        .get(`order.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setOrder(data)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  const { setValues } = form
  useEffect(() => {
    if (order) {
      setValues(order)
      form.setFieldValue('view', 'Product')
    }
  }, [order])

  useEffect(() => {
    if (!id) {
      axios
        .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('numberOrder', data.ultOrder + 1 || 1)
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
        .post(`customer.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomer(data.items)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }

    axios
      .post(`bankaccount.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBankaccount(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [id])

  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Pedido: ${entity.numberOrder}` : 'Novo Pedido'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg-2">
                <Field label="Pedido">
                  <TextInput
                    id="numberOrder"
                    autoComplete="Pedido"
                    placeholder="Pedido"
                    customClassName="form-control kt-align-right"
                    value={'' + entity.numberOrder}
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
                    onChange={undefined}
                    disabled
                    isMulti={undefined}
                    isLoading={false || undefined}
                    isClearable={true}
                    styles={undefined}
                  ></Select>
                </Field>
              </div>
              <div className="col-lg">
                <Field label="Propriedade">
                  <TextInput
                    id="customerApoioProperty"
                    disabled
                    customClassName="form-control"
                    value={entity?.customerApoioProperty || ''}
                  />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3">
                <Field label="Meio de Pagamento">
                  <Select
                    getDisplay={({ description }) => description}
                    getId={({ id }) => id}
                    selected={entity.paymentMean}
                    items={PaymentMean}
                    disabled
                    onChange={paymentMean => form.setFieldValue('paymentMean', paymentMean?.id)}
                  />
                </Field>
              </div>
              <div className="col-lg-3">
                <Field label="Parcelas">
                  <TextInput
                    id="installments"
                    disabled
                    placeholder="Qtde ou prazo (ex: 0/30/60)"
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
              {entity.view === 'Product' && <ProductsForm entity={entity} />}

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
                  title="Faturar"
                  disabled={form.isSubmitting || !!entity.status}
                  onClick={() => {
                    entity.paymentMean === 1 &&
                      form.setValues(prev => ({
                        ...prev,
                        modalShow: true,
                      }))
                    entity.paymentMean !== 1 && genereteNfe(entity, modal, form, customer)
                  }}
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
                      .get(`order.report/${entity.id}`, {
                        responseType: 'blob',
                        headers: { Authorization: `Bearer ${saToken}` },
                      })
                      .then(response => {
                        iframeDownload(response.data, `Pedido.pdf`)
                      })
                      .catch(err => modal?.alert(err.message))
                      .finally(() => setPrintFetching(false))
                  }}
                />
              </div>

              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Status">
                    <h3 className="kt-portlet__head-title">{entity.status === '1' ? 'Faturado' : 'Pendente'}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Qtde Itens">
                    <h3 className="kt-portlet__head-title kt-align-right">{entity.OrderProducts.length}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                  <Field label="Total Desconto">
                    <h3 className="kt-portlet__head-title kt-align-right">{maskMoney(entity.discount || 0)}</h3>
                  </Field>
                </div>
              </div>

              <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                  <Field label="Total do Pedido">
                    <h3 className="kt-portlet__head-title kt-align-right">{maskMoney(entity.total || 0)}</h3>
                  </Field>
                </div>
              </div>
            </div>
            <ModalPortal>
              <Transition in={entity.modalShow} timeout={300}>
                {status => (
                  <>
                    <div
                      className={classNames('modal fade', {
                        show: status === 'entered',
                      })}
                      style={{
                        display: status === 'exited' ? 'none' : 'block',
                      }}
                      tabIndex={-1}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div role="document" className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Dados Boleto</h5>

                            <Button
                              type="button"
                              className="close"
                              aria-label="close"
                              data-dismiss="modal"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  wallet: null,
                                  bankAccountId: '',
                                  modalShow: false,
                                }))
                              }}
                            />
                          </div>
                          <div className="modal-body">
                            <div className="kt-portlet__body kt-portlet__body--fit">
                              <div className="row">
                                <div className="col-lg">
                                  <Field label="Conta">
                                    <Select
                                      isClearable
                                      getId={({ id }) => id}
                                      getDisplay={({ description }) => description}
                                      items={bankAccount}
                                      selected={entity.bankAccountId}
                                      onChange={bankAccount => form.setFieldValue('bankAccountId', bankAccount?.id)}
                                      disabled={false}
                                      isMulti={undefined}
                                      isLoading={false || undefined}
                                      styles={undefined}
                                    />
                                  </Field>
                                </div>
                                <div className="col-lg-3">
                                  <Field label="Carteira">
                                    <DecimalInput
                                      id="wallet"
                                      name="wallet"
                                      icon={undefined}
                                      acceptEnter={true}
                                      noSelect={undefined}
                                      disabled={false}
                                      precision={0}
                                    />
                                  </Field>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <Button
                              type="button"
                              customClassName="btn-secondary"
                              icon="fas fa-arrow-left"
                              title="Voltar"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  wallet: null,
                                  bankAccountId: '',
                                  modalShow: false,
                                }))
                              }}
                            />
                            <Button
                              customClassName="btn-primary"
                              title="Confirmar"
                              icon="fas fa-hand-holding-usd"
                              onClick={() => {
                                form.setValues(prev => ({
                                  ...prev,
                                  wallet: entity.wallet,
                                  bankAccountId: entity.bankAccountId,
                                  modalShow: false,
                                }))
                                if (!entity.wallet || entity.wallet === 0)
                                  modal?.alert('Informe a carteira para o Boleto ')
                                if (!entity.bankAccountId || entity.bankAccountId === '')
                                  modal?.alert('Informe a Conta para o Boleto ')

                                entity.wallet &&
                                  entity.wallet > 0 &&
                                  entity.bankAccountId !== '' &&
                                  genereteNfe(entity, modal, form, customer)
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {status !== 'exited' && (
                      <div
                        className={classNames('modal-backdrop fade', {
                          show: status === 'entered',
                        })}
                      />
                    )}
                  </>
                )}
              </Transition>
            </ModalPortal>
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
                      onClick={() => pushTo('/pedido')}
                    />
                    <Button
                      icon="fas fa-save"
                      customClassName="btn-primary"
                      title="Salvar"
                      loading={form.isSubmitting}
                      disabled={form.isSubmitting || !!entity.status}
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

function validateForm(values: OrderFormValues) {
  const errors: FormikErrors<OrderFormValues> = {}
  if (!values.paymentMean) errors.paymentMean = RequiredMessage
  if (!values.installments) errors.installments = RequiredMessage
  if (values.discount > values.total) {
    errors.discount = 'Total deve menor ou igual ao Total do pedido '
  }
  if (values.paymentMean === 1) {
    if (values.wallet || values.wallet === 0) errors.discount = 'Informe a carteira pra o Boleto '
    if (values.bankAccountId === '') errors.discount = 'Informe o Banco pra o Boleto '
  }

  return errors
}
