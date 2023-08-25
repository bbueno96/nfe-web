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
import { TextInput } from '../../../components/form/text-input'
import { TextAreaInput } from '../../../components/form/textarea-input'
import { RequiredMessage } from '../../../helpers/constants'
import { maskCellPhone, maskCpfCnpj, maskMoney } from '../../../helpers/mask'
import { classNames } from '../../../helpers/misc'
import { FreteForm } from './frete'
import { ObsForm } from './obs'
import { ProductsForm } from './products'

interface NfeInputFormValues {
  id?: string
  fornecedor: string
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
  view: string
  products: any[]
  chave?: string
  ultNota?: number
  Provider?: any
  newCustoner?: boolean
  especie?: string
  volumes?: number
  reciboLote?: number
  cartaCorrecao?: string
  erros?: string[]
  statuscartaCorrecao?: string
  authNfe: boolean
  xml?: Buffer
  vIpi?: number
  vST?: number
  installments?: any[]
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

export const NfeInputForm = () => {
  const [providers, setProvider] = useState([])
  const [products, setproduct] = useState([])
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()

  const form = useFormik<NfeInputFormValues>({
    initialValues: {
      id: '',
      numeroNota: 0,
      fornecedor: '',
      data: new Date(),
      status: 'Entrada',
      tipo: 'ENTRADA',
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
      totalCartaoDebito: 0,
      tipoFrete: 0,
      observacoes: '',
      totalProduto: 0,
      totalNota: 0,
      naturezaOp: 'Entrada',
      especie: 'Vol',
      volumes: 0,
      view: 'produtos',
      products: [],
      erros: undefined,
      Provider: {
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
      vIpi: 0,
      vST: 0,
      newCustoner: false,
      authNfe: false,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })
  function handleSubmit(values: NfeInputFormValues) {
    if (!id) {
      axios
        .post(`nfeinput.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo(`/nfe-entrada`))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => {
          form.setSubmitting(false)
        })
    }
  }
  const [file, setCardFile] = useState()
  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`nfe.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('numeroNota', data.numeroNota)
          form.setFieldValue('fornecedor', data.fornecedor)
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
          form.setFieldValue('naturezaOp', data.naturezaOp)
          form.setFieldValue('vIpi', parseFloat(data.vIpi))
          form.setFieldValue('vST', parseFloat(data.vST))
          form.setFieldValue('installments', data.installments)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [entity.status])

  useEffect(() => {
    axios
      .post(`provider.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setProvider(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [entity.fornecedor])
  useEffect(() => {
    const total =
      entity.products.reduce((acc, curr) => acc + parseFloat(curr.total), 0) +
      parseFloat('' + entity.frete) +
      parseFloat('' + entity.outrasDespesas) +
      parseFloat('' + entity.vIpi) +
      parseFloat('' + entity.vST) +
      parseFloat('' + entity.seguro) -
      parseFloat('' + entity.desconto)
    form.setFieldValue('totalNota', total)
  }, [entity.products, entity.desconto, entity.frete, entity.seguro, entity.outrasDespesas, entity.vIpi, entity.vST])
  useEffect(() => {
    if (entity.fornecedor && entity.products?.length === 0) {
      form.setFieldValue('products', [...entity.products, { cfop: '5102', quantidade: 0, unitario: 0 }])
    }
    if (entity.fornecedor === undefined && entity.products?.length === 1) {
      form.setFieldValue('products', [])
    }
  }, [entity.fornecedor])

  useEffect(() => {
    axios
      .post(`product.list`, { perPage: false }, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setproduct(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [entity.products])

  useEffect(() => {
    if (file !== undefined) {
      const data = new FormData()
      data.append('file', file)
      axios
        .post(`readXml`, data, {
          headers: { Authorization: `Bearer ${saToken}`, 'Content-Type': 'multipart/form-data' },
        })
        .then(({ data }) => {
          if (data === 'Existe') modal?.alert('Nfe Entrada já registrada. Verifique.')
          else {
            if (data) {
              form.setFieldValue('id', data.id)
              form.setFieldValue('numeroNota', data.numeroNota)
              form.setFieldValue('Provider', data.provider)
              form.setFieldValue('fornecedor', data.fornecedor)
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
              form.setFieldValue('naturezaOp', data.naturezaOp)
              form.setFieldValue('vIpi', data.vIpi)
              form.setFieldValue('vST', data.vST)
              form.setFieldValue('installments', data.installments)
            }
          }
        })
        .catch(err => modal?.alert(err.message))
    }
  }, [file])

  const handleUploadFile = e => setCardFile(e.target.files[0])

  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Nota: ${entity.numeroNota}` : 'Nova Nota'}</h3>
          </div>
          <div className="kt-portlet__head-label"></div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <div className="row">
              <div className="col-lg" />
              <div className="col-lg-4 ">
                <Field label="Importar XMl">
                  <input type="file" onChange={handleUploadFile} accept="text/xml" id="xml" className="form-control" />
                </Field>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-1">
                <Field label="Nota">
                  <TextInput
                    id="numeroNota"
                    autoComplete="Nota"
                    placeholder="nota"
                    customClassName="form-control"
                    value={'' + entity.ultNota}
                    disabled={false}
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
              <div className="col-lg-4">
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
              <div className="col-lg">
                <Field label="Chave de Acesso">
                  <TextInput
                    id="chave"
                    autoComplete="chave"
                    placeholder="Chave de Acesso"
                    customClassName="form-control"
                    value={entity.chave ?? ''}
                  />
                </Field>
              </div>
            </div>

            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />

            <div className="row">
              <div className="col-lg">
                <Field label="Fornecedor">
                  <Select
                    getId={({ id }) => id}
                    getDisplay={({ name }) => name}
                    selected={entity.fornecedor}
                    items={providers}
                    onChange={company => {
                      form.setFieldValue('fornecedor', company?.id)
                      form.setFieldValue('Provider', company)
                    }}
                    disabled={false}
                    isMulti={undefined}
                    isLoading={false || undefined}
                    isClearable={true}
                    styles={undefined}
                  ></Select>
                </Field>
              </div>
              <div className="col-lg align-right">
                <Field label=".">
                  <br />
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      pushTo('/fornecedor/cadastro')
                    }}
                  >
                    <i className="fas fa-plus" aria-hidden="true" />
                    <span>Novo Fornecedor</span>
                  </button>
                </Field>
              </div>
            </div>
            {entity.fornecedor && (
              <>
                <div className="row">
                  <div className="col-lg">
                    <div className="kt-portlet__head-label">
                      <h3 className="kt-portlet__head-title">{`CPF/CNPJ: ${maskCpfCnpj(
                        entity.Provider.cpfCnpj,
                      )} | RG/IE: ${entity.Provider.stateInscription || ''} | ${
                        entity.Provider.adrress ||
                        '' + ' Nº ' + entity.Provider.addressNumber ||
                        '' + ' ' + entity.Provider.province ||
                        '' + ' Telefone: ' + maskCellPhone(entity.Provider.phone)
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
              {entity.view === 'freteOutrasDespesas' && <FreteForm entity={entity} form={form} providers={providers} />}

              {entity.view === 'obs' && <ObsForm entity={entity} form={form} />}
              {entity.view === 'erros' && <ErrosForm entity={entity} />}
            </div>
            <br />
            <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
            <div className="row">
              <div className="col-lg" style={{ marginTop: '22px' }}></div>

              <div className="kt-portlet__head" style={{ marginRight: '30px' }}>
                <div className="kt-portlet__head-label">
                  <Field label="Qtde Itens">
                    <h3 className="kt-portlet__head-title kt-align-right">{entity.products?.length}</h3>
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
                      onClick={() => pushTo('/nfe-entrada')}
                    />
                    <Button
                      icon="fas fa-save"
                      customClassName="btn-primary"
                      title="Salvar"
                      loading={form.isSubmitting}
                      disabled={form.isSubmitting || !!id}
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
function validateForm(values: NfeInputFormValues) {
  const errors: FormikErrors<NfeInputFormValues> = {}

  if (!values.fornecedor) {
    errors.fornecedor = RequiredMessage
  }
  return errors
}
