/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DecimalInput from '../../../components/form/decimal-input'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { RequiredMessage } from '../../../helpers/constants'
import { onlyAlphaNumeric } from '../../../helpers/format'
import { classNames } from '../../../helpers/misc'
import { FeaturesForm } from './feature'
import { StockForm } from './stock'
import { TaxDataForm } from './taxData'

interface ProductFormValues {
  id: string
  brand?: string | null
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
  simplesNacional: boolean
  weight: number
  height: number
  width: number
  length: number
  color: string
  size: number
  conpanyId: string
  view: string
  cf?: number
  cod?: string
  productstax: any[]
  venda: any[]
  entrada: any[]
  modalShow: boolean
  stockType: string
  numeroDoc: string
  amount: number
}

export const RenderInitial = ({ form, entity, id }) => {
  const { modal, saToken } = useApp()
  const [brand, setBrand] = useState([])
  const [group, setGroup] = useState([])
  useEffect(() => {
    axios
      .post(`brand.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setBrand(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
    axios
      .post(`group.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setGroup(data.items)
      })
      .catch(err => modal?.alert(err.message))
      .finally()
  }, [id])
  return (
    <>
      <div className="row">
        <div className="col-lg-2">
          <Field label="Cod. Alternativo">
            <TextInput
              id="cod"
              autoComplete="Cod. Alternativo"
              placeholder="Cod. Alternativo"
              customClassName="form-control"
              value={onlyAlphaNumeric(entity.cod)}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Descrição">
            <TextInput
              id="description"
              autoComplete="descrição"
              placeholder="Descrição"
              customClassName="form-control"
              value={entity.description}
            />
          </Field>
        </div>
        <div className="col-lg-1">
          <Field label="Unidade">
            <TextInput
              id="und"
              autoComplete="und"
              placeholder="und"
              customClassName="form-control"
              value={entity.und}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Marca">
            <Select
              isClearable
              getId={({ id }) => id}
              getDisplay={({ description }) => description}
              items={brand}
              selected={entity.brand}
              onChange={brand => form.setFieldValue('brand', brand?.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Grupo">
            <Select
              isClearable
              getId={({ id }) => id}
              getDisplay={({ description }) => description}
              items={group}
              selected={entity.group}
              onChange={group => form.setFieldValue('group', group?.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false || undefined}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Codigo de barras">
            <TextInput
              id="barCode"
              autoComplete="barCode"
              placeholder="Código de barras"
              customClassName="form-control"
              value={entity.barCode}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Preço de Venda">
            <DecimalInput
              id="value"
              name="value"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Preço de Compra">
            <DecimalInput
              id="purchaseValue"
              name="purchaseValue"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg-1">
          <Field label="Estoque">
            <TextInput
              id="stock"
              autoComplete="stock"
              placeholder="Estoque"
              customClassName="form-control"
              value={entity.stock}
              disabled={true}
            />
          </Field>
        </div>
        <div className="col-lg-2">
          <Field label="Estoque Minimo">
            <TextInput
              id="stockMinium"
              autoComplete="stockMinium"
              placeholder="Estoque Minimo"
              customClassName="form-control"
              value={entity.stockMinium}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
export const ProductForm = () => {
  const { modal, saToken } = useApp()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { id } = useParams()
  const pushTo = useNavigate()
  const form = useFormik<ProductFormValues>({
    initialValues: {
      id: '',
      group: null,
      brand: null,
      description: '',
      stock: 0,
      stockMinium: 0,
      value: 0,
      valueOld: 0,
      purchaseValue: 0,
      lastPurchase: null,
      lastSale: null,
      createAt: new Date(),
      und: 'UND',
      barCode: '',
      disableAt: null,
      ncm: '',
      weight: 0,
      height: 0,
      width: 0,
      length: 0,
      color: '',
      size: 0,
      conpanyId: ' ',
      view: 'Geral',
      cf: 0,
      cod: '',
      simplesNacional: false,
      productstax: [],
      venda: [],
      entrada: [],
      modalShow: false,
      stockType: '',
      numeroDoc: '',
      amount: 0,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: ProductFormValues) {
    if (id) {
      axios
        .post(`product.update/${values.id}`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/produto'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    } else {
      axios
        .post(`product.add`, values, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(() => pushTo('/produto'))
        .catch(err => setGlobalError(err.response.data.message))
        .finally(() => form.setSubmitting(false))
    }
  }

  const { values: entity } = form
  useEffect(() => {
    if (id) {
      axios
        .get(`product.key/${id}`, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          form.setFieldValue('id', data.id)
          form.setFieldValue('description', data.description)
          form.setFieldValue('group', data.group)
          form.setFieldValue('brand', data.brand)
          form.setFieldValue('stockMinium', data.stockMinium)
          form.setFieldValue('stock', data.stock)
          form.setFieldValue('value', data.value)
          form.setFieldValue('valueOld', data.valueOld)
          form.setFieldValue('purchaseValue', data.purchaseValue)
          form.setFieldValue('lastPurchase', data.lastPurchase)
          form.setFieldValue('lastSale', data.lastSale)
          form.setFieldValue('createAt', data.createAt)
          form.setFieldValue('st', data.st)
          form.setFieldValue('und', data.und)
          form.setFieldValue('barCode', data.barCode)
          form.setFieldValue('ipi', data.ipi)
          form.setFieldValue('ipi', data.mva)
          form.setFieldValue('disableAt', data.disableAt)
          form.setFieldValue('ncm', data.ncm)
          form.setFieldValue('cfop', data.cfop)
          form.setFieldValue('pisCofins', data.pisCofins)
          form.setFieldValue('weight', data.weight)
          form.setFieldValue('height', data.height)
          form.setFieldValue('width', data.width)
          form.setFieldValue('length', data.length)
          form.setFieldValue('color', data.color)
          form.setFieldValue('size', data.size)
          form.setFieldValue('conpanyId', data.conpanyId)
          form.setFieldValue('cstPis', data.cstPis)
          form.setFieldValue('alqPis', data.alqPis)
          form.setFieldValue('cstCofins', data.cstCofins)
          form.setFieldValue('alqCofins', data.alqCofins)
          form.setFieldValue('cf', data.cf)
          form.setFieldValue('cod', data.cod)
        })
        .catch(err => modal?.alert(err.message))
        .finally()
    }
  }, [id])
  return (
    <FormikProvider value={form}>
      <div className="kt-portlet">
        <div className="kt-portlet__head">
          <div className="kt-portlet__head-label">
            <h3 className="kt-portlet__head-title">{id ? `Editar: ${entity.description}` : 'Novo Produto'}</h3>
          </div>
        </div>
        <form className="login-form" onSubmit={form.handleSubmit}>
          <div className="kt-portlet__body">
            <ul className="nav nav-tabs kt-mb-0" role="tablist">
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Geral',
                  })}
                  onClick={() => form.setFieldValue('view', 'Geral')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Geral</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Outros',
                  })}
                  onClick={() => form.setFieldValue('view', 'Outros')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Características</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Fiscal',
                  })}
                  onClick={() => form.setFieldValue('view', 'Fiscal')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Fiscal</span>
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={classNames('nav-link', {
                    active: entity.view === 'Stock',
                  })}
                  onClick={() => form.setFieldValue('view', 'Stock')}
                  type="button"
                >
                  <span className="btn kt-padding-0">Movimentação Estoque</span>
                </button>
              </li>
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Geral' && <RenderInitial form={form} entity={entity} id={id} />}
              {entity.view === 'Outros' && <FeaturesForm entity={entity} />}
              {entity.view === 'Fiscal' && <TaxDataForm entity={entity} form={form} id={id} />}
              {entity.view === 'Stock' && <StockForm entity={entity} form={form} id={id} />}
            </div>
            <br />
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
                      onClick={() => pushTo('/produto')}
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
function validateForm(values: ProductFormValues) {
  const errors: FormikErrors<ProductFormValues> = {}

  if (!values.description) {
    errors.description = RequiredMessage
  }
  return errors
}
