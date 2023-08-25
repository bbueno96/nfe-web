/* eslint-disable @typescript-eslint/no-explicit-any */
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
import SwitchInput from '../../../components/form/switch'
import { TextInput } from '../../../components/form/text-input'
import { TextAreaInput } from '../../../components/form/textarea-input'
import { getCustomers } from '../../../helpers'
import { RequiredMessage, PaymentMean } from '../../../helpers/constants'
import { onlyAlphaNumericSpace } from '../../../helpers/format'
import { maskCellPhone, maskCpfCnpj, maskMoney } from '../../../helpers/mask'
import { classNames, forceDownload, iframeDownload } from '../../../helpers/misc'
import { CartaForm } from './cartacorrecao'
import { DevolForm } from './devolution'
import { FreteForm } from './frete'
import { ProductsForm } from './products'
import { ProductsAddForm } from './productsAdd'

interface ProductTax {
  id?: string
  product: string
  uf: string
  aliquotaIcms?: number | null
  cst?: number | null
  baseIcms?: number | null
  simplesNacional: boolean
  aliquotaIcmsSt?: number | null
  baseIcmsSt?: number | null
  mva?: number | null
  cfop: string
  cstPis?: string | null
  alqPis?: number | null
  cstCofins?: string | null
  alqCofins?: number | null
  ipi: number
}

interface NfeProducts {
  id?: string
  nota?: string | null
  produto?: string | null
  descricao: string
  cfop: string
  ncm: string
  quantidade?: number | null
  unitario?: number | null
  total?: number | null
  st: number
  stNfe?: string | null
  cf?: number | null
  baseICMS?: number | null
  valorICMS?: number | null
  aliquotaICMS?: number | null
  baseTributo?: number | null
  refProduto?: string | null
  cest?: string | null
  baseIcmsSt?: number | null
  valorIcmsSt?: number | null
  aliquotaIcmsSt?: number | null
  mva?: number | null
  unidade: string
  companyId?: string | null
  pisCofins: boolean
  cstPis?: string | null
  alqPis?: number | null
  cstCofins?: string | null
  alqCofins?: number | null
  cod?: string | null
  producttax?: string | null
  uf?: string | null
  ipi: number
  valorBaseIcms?: number | null
  valorBaseIcmsSt?: number | null
}

interface NfeFormValues {
  id?: string
  cliente: string
  fornecedor: string
  customerApoioName?: string
  data: Date
  numeroNota: number
  status: string
  tipo: string
  transpNome?: string
  placaTransp?: string
  ufTransp?: string
  rntrcTransp?: string
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
  view: string
  products: NfeProducts[]
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
  installments?: string
  paymentMean?: number
  modalShow: boolean
  productstax: ProductTax[]
  nomeLote?: string
  customerApoioProperty?: string
  emailEnviado?: boolean
  orderId?: string | null
  propertyId?: string
  optionCliente: boolean
  pesoLiquido?: number
  pesoBruto?: number
}

export const AddForm = ({ entity, form }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Dados Adicionais para a Nota Fiscal">
            <TextAreaInput
              refEl={undefined}
              value={onlyAlphaNumericSpace(entity.observacoes)}
              placeholder={undefined}
              disabled={undefined}
              label={undefined}
              onChange={obs => form.setFieldValue('observacoes', obs)}
              rows={5}
              readOnly={false}
              maxLenght={5000}
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

export const NfeForm = () => {
  const { parameter } = useApp()
  const [, setPrintFetching] = useState(false)
  const [providers, setProvider] = useState([])
  const [customer, setCustomer] = useState([])
  const [products, setproduct] = useState([])
  const [properties, setProperties] = useState([])
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const form = useFormik<NfeFormValues>({
    initialValues: {
      id: '',
      numeroNota: 0,
      cliente: '',
      fornecedor: '',
      transpNome: '',
      data: new Date(),
      status: 'Envio Pendente',
      tipo: 'SAIDA',
      frete: 0,
      seguro: 0,
      outrasDespesas: 0,
      freteOutros: 0,
      desconto: 0.0,
      totalCheque: 0,
      totalDinheiro: 0,
      totalCartaoCredito: 0,
      totalBoleto: 0,
      totalOutros: 0,
      totalCartaoDebito: 0,
      tipoFrete: 0,
      observacoes: '',
      totalProduto: 0,
      totalNota: 0,
      naturezaOp: 'Venda',
      especie: 'Vol',
      volumes: 0,
      view: 'produtos',
      products: [],
      erros: undefined,
      orderId: null,
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
        documentType: null,
        taxpayerType: null,
      },
      newCustoner: false,
      authNfe: false,
      paymentMethodId: '',
      paymentMean: 0,
      installments: '',
      placaTransp: '',
      ufTransp: '',
      rntrcTransp: '',
      modalShow: false,
      productstax: [],
      propertyId: '',
      optionCliente: true,
      pesoLiquido: 0,
      pesoBruto: 0,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  function handleSubmit(values: NfeFormValues) {
    if (id) {
      if (entity.status !== 'Autorizado' && entity.status !== 'Cancelado') {
        axios
          .post(`nfe.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(() => pushTo('/nota'))
          .catch(err => setGlobalError(err.response.data.message))
          .finally(() => form.setSubmitting(false))
      } else form.setSubmitting(false)
    } else {
      axios
        .post(`nfe.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/nota'))
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
          const auxFornec = data.fornecedor
          form.setFieldValue('id', data.id)
          form.setFieldValue('numeroNota', data.numeroNota)
          form.setFieldValue('cliente', data.cliente)
          form.setFieldValue('fornecedor', data.fornecedor)
          form.setFieldValue('naturezaOp', data.naturezaOp)
          form.setFieldValue('orderId', data.orderId)
          form.setFieldValue('status', data.status)
          form.setFieldValue('data', data.data)
          form.setFieldValue('frete', data.frete)
          form.setFieldValue('tipo', data.tipo)
          form.setFieldValue('seguro', data.seguro)
          form.setFieldValue('outrasDespesas', data.outrasDespesas)
          form.setFieldValue('freteOutros', data.freteOutros)
          form.setFieldValue('desconto', data.desconto || 0.0)
          form.setFieldValue('totalNota', data.totalNota || 0.0)
          form.setFieldValue('totalDinheiro', data.totalDinheiro)
          form.setFieldValue('observacoes', data.observacoes)
          form.setFieldValue('tipoFrete', data.tipoFrete)
          form.setFieldValue('erros', data.erros || '')
          form.setFieldValue('pesoLiquido', data.pesoLiquido)
          form.setFieldValue('pesoBruto', data.pesoBruto)
          form.setFieldValue('optionCliente', !!data.propertyId)
          form.setFieldValue(
            'products',
            data.NfeProduto.sort(p => p.productId),
          )
          form.setFieldValue('chave', data.chave)
          form.setFieldValue('reciboLote', data.reciboLote)
          form.setFieldValue('serie', data.serie)
          form.setFieldValue('cartaCorrecao', data.cartaCorrecao)
          form.setFieldValue('statuscartaCorrecao', data.statuscartaCorrecao)
          form.setFieldValue('paymentMethodId', data.paymentMethodId)
          form.setFieldValue('paymentMean', data.paymentMean)
          form.setFieldValue('installments', data.installments)
          form.setFieldValue('customerApoioProperty', data.customerApoioProperty)
          form.setFieldValue('placaTransp', data.placaTransp)
          form.setFieldValue('ufTransp', data.ufTransp)
          form.setFieldValue('rntrcTransp', data.rntrcTransp)
          form.setFieldValue('emailEnviado', data.emailEnviado)
          form.setFieldValue('propertyId', data.propertyId)
          if (parameter?.getApoio) {
            if (data.status === 'Validado' || data.status === 'Erro' || data.status === 'Envio Pendente') {
              if (data.fornecedor) {
                axios
                  .post(`provider.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
                  .then(({ data }) => {
                    setProvider(data.items)
                    const fornec = data.items.filter(e => e.id === auxFornec)[0]
                    form.setFieldValue('Customer.cpfCnpj', fornec.cpfCnpj)
                    form.setFieldValue('Customer.name', fornec.name)
                    form.setFieldValue('Customer.phone', fornec.phone)
                    form.setFieldValue('Customer.mobilePhone', fornec.phone)
                    form.setFieldValue('Customer.dateCreated', fornec.dateCreated)
                    form.setFieldValue('Customer.additionalEmails', fornec.additionalEmails)
                    form.setFieldValue('Customer.address', fornec.address)
                    form.setFieldValue('Customer.addressNumber', fornec.addressNumber)
                    form.setFieldValue('Customer.complement', fornec.complement)
                    form.setFieldValue('Customer.province', fornec.province)
                    form.setFieldValue('Customer.postalCode', fornec.postalCode)
                    form.setFieldValue('Customer.stateInscription', fornec.stateInscription)
                    form.setFieldValue('Customer.state', fornec.state)
                    form.setFieldValue('Customer.cityId', fornec.cityId)
                  })
                  .catch(err => modal?.alert(err.message))
                  .finally()
              } else {
                getCustomers().then(resp => {
                  setCustomer(resp)

                  if (resp?.length > 0) {
                    const cliente = resp.filter(e => e.uuid === data.cliente)[0]
                    const properties = cliente.properties.filter(p => p.id === data.propertyId)[0]
                    const emailList = cliente?.emails.filter(e => e.type === 1)[0]
                    form.setFieldValue('Customer.customerApoioProperty', properties.tabName)
                    form.setFieldValue('Customer.cpfCnpj', properties.cpfCnpj)
                    form.setFieldValue('Customer.name', properties.name)
                    form.setFieldValue('Customer.email', emailList ? emailList.email?.toLowerCase() : '')
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
                    form.setFieldValue('Customer.taxpayerType', properties.taxpayerType)
                    form.setFieldValue('Customer.documentType', properties.documentType)
                  }
                })
              }
            } else {
              form.setFieldValue('Customer.customerApoioProperty', data.customerApoioProperty)
              form.setFieldValue('Customer.cpfCnpj', data.cpfCnpj)
              form.setFieldValue('Customer.name', data.razaoSocial)
              form.setFieldValue('Customer.email', data.email)
              form.setFieldValue('Customer.phone', data.fone)
              form.setFieldValue('Customer.address', data.endereco)
              form.setFieldValue('Customer.addressNumber', data.numero)
              form.setFieldValue('Customer.complement', data.complemento)
              form.setFieldValue('Customer.province', data.bairro)
              form.setFieldValue('Customer.postalCode', data.cep)
              form.setFieldValue('Customer.stateInscription', data.rgIe)
              form.setFieldValue('Customer.state', data.estado)
              form.setFieldValue('Customer.city', data.cidade)
            }
          }
        })
        .catch(err => modal?.alert(err.message))
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
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [entity.serie])
  useEffect(() => {
    if (entity.authNfe && entity.status === 'Validado') {
      axios
        .get(`nfe.authorize/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          if (data.retNota) {
            modal?.alert(
              `Situação: ${data.retNota.xMotivo}, ${
                data.retNota.xMotivo === 'Lote em processamento'
                  ? 'Espere alguns segundos e consulte novamente a nfe'
                  : ''
              }`,
            )
            form.setFieldValue('status', data.retNota.xMotivo)
          }
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [entity.authNfe])

  useEffect(() => {
    if (!parameter?.getApoio) {
      axios
        .post(`customer.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          setCustomer(data.items)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    } else {
      getCustomers().then(resp => {
        setCustomer(resp)
      })
    }
    axios
      .post(`provider.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProvider(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
    axios
      .post(`product.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setproduct(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
    if (!id) {
      axios
        .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('serie', data.serie)
          form.setFieldValue('emitState', data.nfeUf)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
    axios
      .post(`parameter.get`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        form.setFieldValue('emitState', data.nfeUf)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [id])

  useEffect(() => {
    if (entity.orderId) {
      const total =
        entity.products.reduce((acc, curr) => acc + parseFloat((curr.total || 0).toString()), 0) +
        parseFloat('' + entity.frete) +
        parseFloat('' + entity.outrasDespesas) +
        parseFloat('' + entity.seguro) -
        parseFloat('' + entity.desconto)
      form.setFieldValue('totalNota', total)
    } else {
      const total =
        entity.products.reduce((acc, curr) => acc + parseFloat((curr.total || 0).toString()), 0) +
        parseFloat('' + entity.frete) +
        parseFloat('' + entity.outrasDespesas) +
        parseFloat('' + entity.seguro) -
        parseFloat('' + entity.desconto)
      form.setFieldValue('totalNota', total)
      form.setFieldValue('desconto', entity.desconto)
    }
  }, [entity.products, entity.frete, entity.seguro, entity.outrasDespesas])

  useEffect(() => {
    if ((entity.propertyId || entity.fornecedor) && entity.products.length === 0) {
      form.setFieldValue('products', [...entity.products, { quantidade: 0, unitario: 0 }])
    }
    if ((entity.propertyId === undefined || entity.fornecedor === undefined) && entity.products.length === 1) {
      form.setFieldValue('products', [])
    }
  }, [entity.propertyId, entity.fornecedor])
  function authNfe() {
    if (entity.status === 'Validado') {
      form.setFieldValue('authNfe', true)
      form.handleSubmit()
    } else {
      if (entity.status === 'Autorizado') {
        modal?.alert('Nfe já autorizada.')
      } else if (entity.status === 'Cancelado') {
        modal?.alert('Nfe está Cancelada.')
      } else if (entity.status === 'Lote em Processamento') {
        checkNfe()
      } else {
        modal?.alert('Nfe ainda não validada')
      }
    }
  }
  function preNfe() {
    if (id) {
      if (entity.status === 'Autorizado' || entity.status === 'Cancelado') checkNfe()
      else {
        if (entity.status === 'Validado') {
          axios
            .get(`nfe.predanfe/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
            .then(() => {
              setPrintFetching(true)
              axios
                .get(`nfe.report/${id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
                .then(response => {
                  iframeDownload(response.data, `${entity.chave}.pdf`)
                })
                .catch(err => modal?.alert(err.message))
                .finally(() => setPrintFetching(false))
            })
            .catch(err => modal?.alert(err.message))
            .finally()
        } else {
          modal?.alert('Nfe ainda não validada')
        }
      }
    }
  }
  function validationNfe() {
    if (id) {
      if (
        entity.status !== 'Autorizado' &&
        entity.status !== 'Denegado' &&
        entity.status !== 'Aguardando' &&
        entity.status !== 'Cancelado'
      ) {
        modal?.alert('Caso tenha alterado dados nota deve primeiro salvar Nfe e depois validar novamente.')
        axios
          .get(`nfe.validation/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(() => {
            form.setFieldValue('status', 'Validado')
          })
          .catch(err => modal?.alert(err.message))
          .finally()

        setPrintFetching(true)
      }
    }
  }
  function checkNfe() {
    if (id) {
      if (
        entity.status !== 'Autorizado' &&
        entity.status !== 'Validado' &&
        entity.status !== 'Erro' &&
        entity.status !== 'Cancelado'
      ) {
        axios
          .get(`nfe.check/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(({ data }) => {
            form.setFieldValue('status', data.check.xMotivo)
          })
          .catch(err => modal?.alert(err.message))
          .finally()

        setPrintFetching(true)
        // const x = await axios.get(`nfe.report/${id}`, {
        //   headers: { Authorization: `Bearer ${saToken}`, 'content-type': 'application/pdf' },
        // })
        axios
          .get(`nfe.report/${id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
          .then(response => {
            if (entity.status === 'Autorizado' || entity.status === 'Cancelado') {
              iframeDownload(response.data, `${entity.chave}.pdf`)
            } else {
              modal?.alert('Nfe ainda não autorizada')
            }
          })
          .catch(err => modal?.alert(err.message))
          .finally(() => setPrintFetching(false))
      } else {
        if (entity.status === 'Autorizado' || entity.status === 'Cancelado') {
          setPrintFetching(true)
          // const x = await axios.get(`nfe.report/${id}`, {
          //   headers: { Authorization: `Bearer ${saToken}`, 'content-type': 'application/pdf' },
          // })
          axios
            .get(`nfe.report/${id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
            .then(response => {
              if (entity.status === 'Autorizado' || entity.status === 'Cancelado') {
                iframeDownload(response.data, `${entity.chave}.pdf`)
              } else {
                modal?.alert('Nfe ainda não autorizada')
              }
            })
            .catch(err => modal?.alert(err.message))
            .finally(() => setPrintFetching(false))
        }
      }
    }
  }
  function xmlNfe() {
    if (id) {
      if (entity.status === 'Autorizado' || entity.status === 'Cancelado') {
        setPrintFetching(true)
        axios
          .get(`nfe.xml/${id}`, { responseType: 'blob', headers: { Authorization: `Bearer ${saToken}` } })
          .then(response => {
            if (entity.status === 'Autorizado' || entity.status === 'Cancelado') {
              forceDownload(response.data, `${entity.chave}.xml`)
            } else {
              modal?.alert('Nfe ainda não autorizada')
            }
          })
          .catch(err => modal?.alert(err.message))
          .finally(() => setPrintFetching(false))
      }
    }
  }
  function emailNfe() {
    if (id) {
      if (entity.status === 'Autorizado' || entity.status === 'Cancelado') {
        if (entity.Customer.email) {
          setPrintFetching(true)
          modal?.confirm(
            `Deseja enviar o email da NFe ${entity.numeroNota} Serie ${entity.serie}? `,
            confirmed =>
              confirmed &&
              axios
                .get(`nfe.email/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                .then(() => pushTo('/nota'))
                .catch(err => modal?.alert(err.message))
                .finally(() => setPrintFetching(false)),
          )
        } else {
          modal?.alert('Email de Faturamento não informado no cadastro do cliente.')
        }
      } else {
        modal?.alert('Nfe ainda não autorizada')
      }
    } else modal?.alert('Para Enviar a Nota Salve-a Primeiro')
  }
  function cancelNfe() {
    if (id) {
      if (entity.status === 'Autorizado') {
        setPrintFetching(true)
        modal?.confirm(
          `Deseja cancelar a NFe ${entity.numeroNota} Serie ${entity.serie}? `,
          confirmed =>
            confirmed &&
            axios
              .get(`nfe.cancel/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
              .then(() => pushTo('/nota'))
              .catch(err => modal?.alert(err.message))
              .finally(() => setPrintFetching(false)),
        )
      } else {
        modal?.alert('Nfe ainda não autorizada')
      }
    } else modal?.alert('Para Enviar a Nota Salve-a Primeiro')
  }
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Nota: ${entity.numeroNota}` : ''}</h3>
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
                    customClassName="form-control kt-align-right"
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
                    disabled={!!entity.orderId}
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
                    value={entity.chave || ''}
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

            <div className="kt-separator kt-separator--border-dashed kt-separator--space-xp" />
            {!entity.orderId && entity.optionCliente && (
              <div className="row">
                <div className="col-lg-2">
                  <Field label="Fornec./Cliente">
                    <SwitchInput id="optionCliente" name="optionCliente" />
                  </Field>
                </div>
                <div className="col-lg">
                  <Field label="Cliente">
                    <Select
                      getId={({ id, uuid }) => (parameter?.getApoio ? uuid : id)}
                      getDisplay={({ name }) => name}
                      selected={entity.cliente}
                      items={customer}
                      onChange={company => {
                        form.setFieldValue('propertyId', null)
                        setProperties([])
                        if (!parameter?.getApoio) {
                          form.setFieldValue('customerId', company?.id)
                          form.setFieldValue('Customer', company)
                        } else {
                          const emailList = company?.emails.filter(e => e.type === 1)[0]
                          form.setFieldValue('cliente', company?.uuid)
                          form.setFieldValue('Customer.email', emailList ? emailList.email?.toLowerCase() : '')
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
                          form.setFieldValue('propertyId', properties.id)
                          form.setFieldValue('Customer.customerApoioProperty', properties.tabName)
                          form.setFieldValue('Customer.cpfCnpj', properties.cpfCnpj)
                          form.setFieldValue('Customer.name', properties.name)
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
                          form.setFieldValue('Customer.taxpayerType', properties.taxpayerType)
                          form.setFieldValue('Customer.documentType', properties.documentType)
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
            )}
            {!entity.orderId && !entity.optionCliente && (
              <div className="row">
                <div className="col-lg-2">
                  <Field label="Fornec./Cliente">
                    <SwitchInput id="optionCliente" name="optionCliente" />
                  </Field>
                </div>
                <div className="col-lg">
                  <Field label="Fornecedor">
                    <Select
                      getId={({ id }) => id}
                      getDisplay={({ name }) => name}
                      selected={entity.fornecedor}
                      items={providers}
                      onChange={company => {
                        form.setFieldValue('fornecedor', company?.id)
                        form.setFieldValue('Customer.cpfCnpj', company.cpfCnpj)
                        form.setFieldValue('Customer.name', company.name)
                        form.setFieldValue('Customer.phone', company.phone)
                        form.setFieldValue('Customer.mobilePhone', company.phone)
                        form.setFieldValue('Customer.dateCreated', company.dateCreated)
                        form.setFieldValue('Customer.additionalEmails', company.additionalEmails)
                        form.setFieldValue('Customer.address', company.address)
                        form.setFieldValue('Customer.addressNumber', company.addressNumber)
                        form.setFieldValue('Customer.complement', company.complement)
                        form.setFieldValue('Customer.province', company.province)
                        form.setFieldValue('Customer.postalCode', company.postalCode)
                        form.setFieldValue('Customer.stateInscription', company.stateInscription)
                        form.setFieldValue('Customer.state', company.state)
                        form.setFieldValue('Customer.cityId', company.cityId)
                      }}
                      disabled={false}
                      isMulti={undefined}
                      isLoading={false || undefined}
                      isClearable={true}
                      styles={undefined}
                    ></Select>
                  </Field>
                </div>
              </div>
            )}
            {entity.orderId && (
              <div className="row">
                <div className="col-lg">
                  <Field label="Cliente">
                    <Select
                      getId={({ id, uuid }) => (parameter?.getApoio ? uuid : id)}
                      getDisplay={({ name }) => name}
                      selected={entity.cliente}
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
                      value={entity.customerApoioProperty || ''}
                    />
                  </Field>
                </div>
              </div>
            )}
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
                    placeholder="Qtde ou prazo (ex: 0/30/60)"
                    customClassName="form-control"
                    value={entity.installments || ''}
                    disabled
                  />
                </Field>
              </div>
              {entity.Customer.cpfCnpj && (
                <>
                  <div className="col-lg">
                    <div className="kt-portlet__head-title">
                      <h3 className="kt-portlet__head-title">{`CPF/CNPJ: ${maskCpfCnpj(
                        entity.Customer.cpfCnpj,
                      )} | RG/IE: ${entity.Customer.stateInscription || ''}`}</h3>
                    </div>
                    <div className="kt-portlet__head-title">
                      <h3 className="kt-portlet__head-title">{`Telefone:  ${maskCellPhone(entity.Customer.phone) || ''}
                      | Email: ${entity.Customer.email || ''}
                      `}</h3>
                    </div>
                    <div className="kt-portlet__head-title">
                      <h3 className="kt-portlet__head-title">{`Endereço: ${entity.Customer.address || ''}  Nº ${
                        entity.Customer.addressNumber || ''
                      }`}</h3>
                    </div>
                    <div className="kt-portlet__head-title">
                      <h3 className="kt-portlet__head-title">{`Bairro: ${entity.Customer.province || ''} Cidade: ${
                        entity.Customer.city || ''
                      } / ${entity.Customer.state || ''}`}</h3>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-xp" />
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
              {entity.naturezaOp.includes('DEVOL') ||
                (entity.naturezaOp.includes('Devol') && (
                  <li className="nav-item">
                    <button
                      className={classNames('nav-link', {
                        active: entity.view === 'refNfe',
                      })}
                      onClick={() => form.setFieldValue('view', 'refNfe')}
                      type="button"
                    >
                      <span className="btn kt-padding-0">Chave Referência</span>
                    </button>
                  </li>
                ))}
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
              {entity.view === 'produtos' && entity.orderId && <ProductsForm form={form} entity={entity} />}
              {entity.view === 'produtos' && !entity.orderId && (
                <ProductsAddForm form={form} entity={entity} products={products} />
              )}
              {entity.view === 'freteOutrasDespesas' && <FreteForm entity={entity} form={form} customers={customer} />}
              {entity.view === 'dadosAdd' && <AddForm entity={entity} form={form} />}
              {entity.view === 'erros' && <ErrosForm entity={entity} />}
              {entity.view === 'cartaCorrecao' && <CartaForm entity={entity} />}
              {entity.view === 'refNfe' && <DevolForm />}
            </div>
            <br />
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-xp" />
            <div className="row">
              <div className="col-lg" style={{ marginTop: '22px' }}>
                <Button
                  type="button"
                  icon="fas fa-clipboard-check"
                  customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
                  title="Validar Nota"
                  //  loading={form.isSubmitting}
                  // disabled={!id && entity.status === 'Validado'}
                  onClick={() => validationNfe()}
                />
                <Button
                  type="button"
                  icon="fas fa-search"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Pré-visualizar"
                  disabled={!id}
                  onClick={() => preNfe()}
                />
                <br />
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
                  icon="fas fa-print"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Enviar Email"
                  disabled={!id && !entity.reciboLote}
                  onClick={() => emailNfe()}
                />
                <Button
                  type="button"
                  icon="fas fa-download"
                  customClassName="btn-secondary margin-right-10 margin-bottom-10 widthButton"
                  title="Xml Nota"
                  disabled={!id && !entity.reciboLote}
                  onClick={() => xmlNfe()}
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

              <div className="kt-portlet__head" style={{ marginRight: '-10px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Status">
                    <h3 className="kt-portlet__head-title">{entity.status}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head" style={{ marginRight: '-10px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Email">
                    <h3 className="kt-portlet__head-title">{entity.emailEnviado ? 'Enviado' : 'Não Enviado'}</h3>
                  </Field>
                </div>
              </div>

              <div className="kt-portlet__head" style={{ marginRight: '-10px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Qtde Itens">
                    <h3 className="kt-portlet__head-title kt-align-right">{entity.products.length}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head" style={{ marginRight: '-10px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Desconto">
                    <h3 className="kt-portlet__head-title kt-align-right">{maskMoney(entity.desconto || 0.0)}</h3>
                  </Field>
                </div>
              </div>
              <div className="kt-portlet__head">
                <div className="kt-portlet__head-label">
                  <Field label="Total da Nota">
                    <h3 className="kt-portlet__head-title kt-align-right">{maskMoney(entity.totalNota || 0)}</h3>
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
                      disabled={!!entity.nomeLote && entity.status !== 'Erro'}
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

  if (!values.paymentMean && values.orderId) errors.paymentMean = RequiredMessage
  if (!values.installments && values.orderId) errors.installments = RequiredMessage
  if ((!values.cliente && values.optionCliente) || (!values.Customer && values.newCustoner)) {
    errors.cliente = RequiredMessage
  }
  if (!values.fornecedor && !values.optionCliente) {
    errors.fornecedor = RequiredMessage
  }
  if (values.desconto > values.totalNota) {
    errors.desconto = 'Total deve menor ou igual ao Total da nota '
  }

  return errors
}
