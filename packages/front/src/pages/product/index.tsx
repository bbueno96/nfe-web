import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'

import { FormikErrors, FormikProvider, useFormik } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../App'
import { Button } from '../../components/button'
import DecimalInput from '../../components/form/decimal-input'
import { ErrorMessage } from '../../components/form/error-message'
import { Field } from '../../components/form/field'
import { Select } from '../../components/form/select'
import SwitchInput from '../../components/form/switch'
import { TextInput } from '../../components/form/text-input'
import { List, ListColumn } from '../../components/list'
import { CFOPs, CSTPISCOFINS, RequiredMessage } from '../../helpers/constants'
import { maskMoney } from '../../helpers/mask'
import { classNames } from '../../helpers/misc'
import useFilters from '../../hooks/filter'
import { usePostList } from '../../hooks/post-list'
import { useRefresh } from '../../hooks/refresh'

interface ProductListValues {
  id: string
  group: string
  description: string
  stock: number
  stockMinium: number
  value: number
  valueOld: number
  purchaseValue: number
  lastPurchase: Date
  lastSale: Date
  createAt: Date
  st: string
  und: string
  barCode: string
  ipi: number
  disableAt: Date
  ncm: string
  cfop: string
  pisCofins: boolean
  weight: number
  height: number
  width: number
  length: number
  color: string
  size: number
  conpanyId: string
}
interface ProductFormValues {
  id: string
  brand: string
  group: string
  description: string
  stock: number
  stockMinium: number
  value: number
  valueOld: number
  purchaseValue: number
  lastPurchase: Date
  lastSale: Date
  createAt: Date
  st: string
  und: string
  barCode: string
  ipi: number
  disableAt: Date
  ncm: string
  cfop: string
  pisCofins: boolean
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
}

export const ProductList = () => {
  const { modal, saToken } = useApp()
  const refresh = useRefresh()

  const filter = useFilters({
    description: '',
    group: '',
  })
  const { fetching, items, pager, setFetching, query, updateData, updatePage, updatePerPage, updateSort } =
    usePostList<ProductListValues>({ initialQuery: { sort: [{ name: 'id' }] } })
  useEffect(() => {
    setFetching(true)
    axios
      .post('product.list', query, { headers: { Authorization: `Bearer ${saToken}` } })
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
                <Field label="Nome">
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
                      .post('product.list', filter.values, {
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
              { icon: 'fas fa-edit', title: 'Editar', action: '/produto/:id' },
              {
                icon: 'fas fa-lock',
                title: 'Desativar',
                hideWhen: ent => !!ent.createAt,
                action: ent =>
                  modal.confirm(
                    `Deseja remover o produto: ${ent.description}?`,
                    confirmed =>
                      confirmed &&
                      axios
                        .delete(`product.delete/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                        .then(refresh.force)
                        .catch(err => modal.alert(err.message)),
                  ),
              },
              {
                icon: 'fas fa-unlock',
                title: 'Ativar',
                hideWhen: ent => !ent.createAt,
                action: ent =>
                  modal.confirm(
                    `Deseja Ativar o produto: ${ent.description}?`,
                    confirmed =>
                      confirmed &&
                      axios
                        .delete(`product.delete/${ent.id}`, { headers: { Authorization: `Bearer ${saToken}` } })
                        .then(refresh.force)
                        .catch(err => modal.alert(err.message)),
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
  {
    path: 'stock',
    title: 'Estoque',
  },
  { path: 'value', title: 'Valor', format: f => maskMoney(f) },
]

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
      .catch(err => modal.alert(err.message))
      .finally()
    axios
      .post(`group.list`, {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setGroup(data.items)
      })
      .catch(err => modal.alert(err.message))
      .finally()
  }, [id])
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Cod. Alternativo">
            <TextInput
              id="cod"
              autoComplete="Cod. Alternativo"
              placeholder="Cod. Alternativo"
              customClassName="form-control"
              value={entity.cod}
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
              isLoading={false}
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
              isLoading={false}
              styles={undefined}
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
              placeholder="stock"
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
      <div className="row">
        <div className="col-lg">
          <Field label="Codigo de barras">
            <TextInput
              id="barCode"
              autoComplete="barCode"
              placeholder="codigo de barras"
              customClassName="form-control"
              value={entity.barCode}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
export const FeaturesForm = ({ entity }) => {
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="cor">
            <TextInput
              id="color"
              autoComplete="color"
              placeholder="color"
              customClassName="form-control"
              value={entity.color}
            />
          </Field>
        </div>

        <div className="col-lg">
          <Field label="Altura">
            <DecimalInput
              id="height"
              name="height"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Largura">
            <DecimalInput
              id="width"
              name="width"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg">
          <Field label="Comprimento">
            <DecimalInput
              id="length"
              name="length"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Tamanho">
            <DecimalInput
              id="size"
              name="size"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="Peso">
            <DecimalInput
              id="weight"
              name="weight"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={false}
            />
          </Field>
        </div>
      </div>
      <div className="kt-separator kt-separator--border-dashed kt-separator--space-lg" />
    </>
  )
}
export const TaxDataForm = ({ entity, form, id }) => {
  const { modal, saToken } = useApp()
  const [st, setSt] = useState([])
  useEffect(() => {
    axios
      .get(`taxsituation.list`, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        setSt(data)
      })
      .catch(err => modal.alert(err.message))
      .finally()
  }, [id])
  return (
    <>
      <div className="row">
        <div className="col-lg">
          <Field label="Situação Tributaria">
            <Select
              isClearable
              getId={({ id }) => id}
              getDisplay={({ description }) => description}
              items={st}
              selected={entity.st}
              onChange={st => form.setFieldValue('st', st?.id)}
              disabled={false}
              isMulti={undefined}
              isLoading={false}
              styles={undefined}
            />
          </Field>
        </div>
        <div className="col-lg">
          <Field label="NMC">
            <TextInput
              id="ncm"
              autoComplete="color"
              placeholder="00000000"
              customClassName="form-control"
              value={entity.ncm}
            />
          </Field>
        </div>
        <div className="col-lg-3">
          <Field label="CFOP">
            <Select
              isClearable
              getId={({ id }) => id}
              getDisplay={({ description, id }) => `${id.substr(0, 1)}.${id.substr(1)} - ${description}`}
              items={CFOPs}
              selected={entity.cfop.replace('.', '')}
              onChange={cfop =>
                form.setFieldValue('cfop', cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null)
              }
              disabled={false}
              isMulti={undefined}
              isLoading={false}
              styles={undefined}
            />
          </Field>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-3">
          <Field label="Origem do Produto">
            <DecimalInput id={'cf'} name={'cf'} disabled={false} precision={0} />
          </Field>
        </div>
        <div className="col-lg-2">
          <Field label="PisCofins">
            <SwitchInput id="pisCofins" name="pisCofins" />
          </Field>
        </div>
      </div>
      {entity.pisCofins && (
        <div className="row">
          <div className="col-lg-3">
            <Field label="CST Pis">
              <Select
                getDisplay={({ id, name }) => `${id}-${name}`}
                getId={({ id }) => id}
                selected={entity.cstPis}
                items={CSTPISCOFINS}
                onChange={cstPis => form.setFieldValue('cstPis', cstPis?.id)}
                disabled={false}
                isMulti={undefined}
                isLoading={undefined}
                isClearable={true}
                styles={undefined}
              />
            </Field>
          </div>
          <div className="col-lg-">
            <Field label="Alíquota Pis">
              <DecimalInput
                id="alqPis"
                name="alqPis"
                icon={undefined}
                acceptEnter={true}
                noSelect={undefined}
                disabled={undefined}
              />
            </Field>
          </div>
          <div className="col-lg-3">
            <Field label="CST Cofins">
              <Select
                getDisplay={({ id, name }) => `${id}-${name}`}
                getId={({ id }) => id}
                selected={entity.cstCofins}
                items={CSTPISCOFINS}
                onChange={cst => form.setFieldValue('cstCofins', cst?.id)}
                disabled={false}
                isMulti={undefined}
                isLoading={undefined}
                isClearable={true}
                styles={undefined}
              />
            </Field>
          </div>
          <div className="col-lg-">
            <Field label="Alíquota Cofins">
              <DecimalInput
                id="alqCofins"
                name="alqCofins"
                icon={undefined}
                acceptEnter={true}
                noSelect={undefined}
                disabled={undefined}
              />
            </Field>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-lg">
          <Field label="IPI">
            <DecimalInput
              id="ipi"
              name="ipi"
              icon={undefined}
              acceptEnter={true}
              noSelect={undefined}
              disabled={undefined}
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
      st: '',
      und: 'UND',
      barCode: '',
      ipi: 0,
      disableAt: null,
      ncm: '',
      cfop: '',
      pisCofins: false,
      weight: 0,
      height: 0,
      width: 0,
      length: 0,
      color: '',
      size: 0,
      conpanyId: ' ',
      view: 'Geral',
      cf: 0,
      cod: null,
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  function handleSubmit(values: ProductListValues) {
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
        .catch(err => modal.alert(err.message))
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
            </ul>
            <div className="border border-top-0 rounded-bottom p-3">
              {entity.view === 'Geral' && <RenderInitial form={form} entity={entity} id={id} />}
              {entity.view === 'Outros' && <FeaturesForm entity={entity} />}
              {entity.view === 'Fiscal' && <TaxDataForm entity={entity} form={form} id={id} />}
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
