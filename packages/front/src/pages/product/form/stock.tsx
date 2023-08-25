import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Transition } from 'react-transition-group'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DecimalInput from '../../../components/form/decimal-input'
import { Field } from '../../../components/form/field'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { ModalPortal } from '../../../components/modal-portal'
import { StockType, TypeGenerate } from '../../../helpers/constants'
import { toLocaleDate } from '../../../helpers/date'
import { classNames } from '../../../helpers/misc'

export const StockForm = ({ entity, form, id }) => {
  const { modal, saToken } = useApp()
  const [fetching, setFetching] = useState(true)
  const pushTo = useNavigate()
  function genereteStock(entity, modal) {
    const values = {
      type: entity.stockType,
      createdAt: new Date(),
      productId: entity.id,
      numeroDoc: entity.numeroDoc,
      amount: entity.amount,
      typeGenerate: 3,
    }
    modal?.confirm(`Confirma a movimentação no estoque?`, confirmed => {
      if (confirmed) {
        setFetching(true)
        axios
          .post(`stockproduct.add`, { ...values }, { headers: { Authorization: `Bearer ${saToken}` } })
          .then(() => pushTo('/produto'))
          .catch(err => err.response.data.message)
          .finally(() => {
            setFetching(false)
          })
      }
    })
  }

  useEffect(() => {
    if (id !== undefined) {
      setFetching(true)
      axios
        .post(`productstock.list`, { product: id }, { headers: { Authorization: `Bearer ${saToken}` } })
        .then(({ data }) => {
          if (data.length > 0) {
            form.setFieldValue(
              'entrada',
              data.filter(reg => reg.type === 'E'),
            )
            form.setFieldValue(
              'venda',
              data.filter(reg => reg.type === 'S'),
            )
          }
        })
        .catch(err => modal?.alert(err.message))
        .finally(() => setFetching(false))
    }
  }, [entity.view])
  return (
    <>
      <div className="kt-portlet__head kt-portlet__head--lg">
        <div className="kt-portlet__head-label">
          <h3 className="kt-portlet__head-title">Saldo em Estoque: {entity.stock}</h3>
        </div>
        <div className="kt-portlet__head-toolbar">
          <div className="kt-portlet__head-wrapper">
            <div className="dropdown dropdown-inline">
              <Button
                type="button"
                icon="fas fa-plus"
                customClassName="btn-primary margin-right-10 margin-bottom-10 widthButton"
                title="Novo Lançamento"
                disabled={!id}
                onClick={() => {
                  form.setValues(prev => ({
                    ...prev,
                    stockType: '',
                    numeroDoc: '',
                    amount: 0,
                    modalShow: true,
                  }))
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="kt-heading kt-heading--sm kt-heading--space-sm">Entradas</div>
      <div className="kt-portlet__body kt-portlet__body--fit">
        <div
          className={classNames(
            'kt-datatable kt-datatable--default kt-datatable--brand kt-font-sm table-tam table-scroll',
            {
              'kt-datatable--loaded': !fetching || entity.entrada?.length > 0,
              'table-loading': fetching,
            },
          )}
        >
          <table className="kt-datatable__table">
            <thead className="kt-datatable__head">
              <tr className="kt-datatable__row">
                <th className="kt-datatable__cell">
                  <span>N. Documento</span>
                </th>
                <th className="kt-datatable__cell">
                  <span>Data</span>
                </th>
                <th className="kt-datatable__cell">
                  <span>Tipo</span>
                </th>
                <th className="kt-datatable__cell kt-align-right">
                  <span>Qtd</span>
                </th>
                <th className="kt-datatable__cell">
                  <span></span>
                </th>
              </tr>
            </thead>
            <tbody className="kt-datatable__body">
              {entity.entrada.map(i => (
                <tr key={i.id} className="kt-datatable__row">
                  <td className="kt-datatable__cell">
                    <div>{i.numeroDoc}</div>
                  </td>
                  <td className="kt-datatable__cell">
                    <div>{toLocaleDate(i.createdAt)}</div>
                  </td>
                  <td className="kt-datatable__cell">
                    <div>{i.typeGenerate ? TypeGenerate[i.typeGenerate - 1].description : ''}</div>
                  </td>
                  <td className="kt-datatable__cell kt-align-right">
                    <div>{i.amount}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {entity.entrada?.length === 0 && <div className="kt-datatable--error">Nenhum item foi encontrado.</div>}
        </div>
        {entity.entrada?.length > 0 && (
          <div className="kt-heading kt-heading--sm kt-heading--space-sm kt-align-right">
            Total {entity.entrada.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}
          </div>
        )}
      </div>

      <div className="kt-heading kt-heading--sm kt-heading--space-sm">Saídas</div>
      <div className="kt-portlet__body kt-portlet__body--fit">
        <div
          className={classNames(
            'kt-datatable kt-datatable--default kt-datatable--brand kt-font-sm table-tam table-scroll',
            {
              'kt-datatable--loaded': !fetching || entity.venda?.length > 0,
              'table-loading': fetching,
            },
          )}
        >
          <table className="kt-datatable__table">
            <thead className="kt-datatable__head">
              <tr className="kt-datatable__row">
                <th className="kt-datatable__cell">
                  <span>N. Documento</span>
                </th>
                <th className="kt-datatable__cell">
                  <span>Data</span>
                </th>
                <th className="kt-datatable__cell">
                  <span>Tipo</span>
                </th>
                <th className="kt-datatable__cell kt-align-right">
                  <span>Qtd</span>
                </th>
                <th className="kt-datatable__cell">
                  <span></span>
                </th>
              </tr>
            </thead>
            <tbody className="kt-datatable__body">
              {entity.venda.map(i => (
                <tr key={i.id} className="kt-datatable__row">
                  <td className="kt-datatable__cell">
                    <div>{i.numeroDoc}</div>
                  </td>
                  <td className="kt-datatable__cell">
                    <div>{toLocaleDate(i.createdAt)}</div>
                  </td>
                  <td className="kt-datatable__cell">
                    <div>{i.typeGenerate === 2 ? 'Nota Fiscal' : 'Acerto Estoque'}</div>
                  </td>
                  <td className="kt-datatable__cell kt-align-right">
                    <div>{i.amount}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {entity.venda?.length === 0 && <div className="kt-datatable--error">Nenhum item foi encontrado.</div>}
        </div>
        {entity.venda?.length > 0 && (
          <div className="kt-heading kt-heading--sm kt-heading--space-sm kt-align-right">
            Total {entity.venda.reduce((acc, curr) => acc + parseFloat(curr.amount), 0)}
          </div>
        )}
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
                      <h5 className="modal-title">Movimentação do Estoque</h5>

                      <Button
                        type="button"
                        className="close"
                        aria-label="close"
                        data-dismiss="modal"
                        onClick={() => {
                          form.setValues(prev => ({
                            ...prev,
                            modalShow: false,
                          }))
                        }}
                      />
                    </div>
                    <div className="modal-body">
                      <div className="kt-portlet__body kt-portlet__body--fit">
                        <div className="row">
                          <div className="col-lg-3">
                            <Field label="N Documento">
                              <TextInput
                                id="numeroDoc"
                                autoComplete="Documento"
                                placeholder="Documento"
                                customClassName="form-control"
                                value={entity.description}
                              />
                            </Field>
                          </div>
                          <div className="col-lg">
                            <Field label="Tipo">
                              <Select
                                isClearable
                                getId={({ id }) => id}
                                getDisplay={({ description }) => description}
                                items={StockType}
                                selected={entity.stockType}
                                onChange={StockType => form.setFieldValue('stockType', StockType?.id)}
                                disabled={false}
                                isMulti={undefined}
                                isLoading={false || undefined}
                                styles={undefined}
                              />
                            </Field>
                          </div>
                          <div className="col-lg-3">
                            <Field label="Quantidade">
                              <DecimalInput
                                id="amount"
                                name="amount"
                                icon={undefined}
                                acceptEnter={true}
                                noSelect={undefined}
                                disabled={false}
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
                            modalShow: false,
                          }))
                        }}
                      />
                      <Button
                        customClassName="btn-primary"
                        title="Confirmar"
                        icon="fas fa-check"
                        onClick={() => {
                          form.setValues(prev => ({
                            ...prev,
                            modalShow: false,
                          }))
                          if (!entity.amount && entity.amount > 0) modal?.alert('Informe a quantidade')
                          if (!entity.stockType) modal?.alert('Informe o tipo ')

                          entity.amount && entity.amount > 0 && entity.stockType !== '' && genereteStock(entity, modal)
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
    </>
  )
}
