import React from 'react'
import { Transition } from 'react-transition-group'

import { FieldArray } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { Button } from '../../../components/button'
import DecimalInput from '../../../components/form/decimal-input'
import { TextInput } from '../../../components/form/text-input'
import { ModalPortal } from '../../../components/modal-portal'
import { classNames } from '../../../helpers/misc'
import { ProductsTaxForm } from './productsTax'

export const ProductsForm = ({ form, entity }) => {
  const { modal, saToken } = useApp()

  return (
    <>
      <FieldArray
        name="productsList"
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
                    <th className="kt-datatable__cell " style={{ borderLeft: 'solid 5px white' }}>
                      <span>Qtde</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Unidade</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Unitario</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 5px white' }}>
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
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white' }}>
                        <TextInput
                          placeholder=""
                          name={`products.${i}.descricao`}
                          disabled
                          value={`products.${i}.descricao`}
                        />
                      </td>

                      <td className="kt-datatable__cell " style={{ border: 'solid 5px white', width: '70px' }}>
                        <DecimalInput
                          id={`products.${i}.quantidade`}
                          name={`products.${i}.quantidade`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled
                          precision={0}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '70px' }}>
                        <TextInput
                          placeholder=""
                          name={`products.${i}.unidade`}
                          disabled
                          value={`products.${i}.unidade`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          id={`products.${i}.unitario`}
                          name={`products.${i}.unitario`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          name={`products.${i}.descontoProd`}
                          id={`products.${i}.descontoProd`}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          name={`products.${i}.total`}
                          id={`products.${i}.total`}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white' }}>
                        <button
                          type="button"
                          className="btn btn-icon btn-success"
                          onClick={() => {
                            if (entity.products[i].cfop === '') {
                              axios
                                .post(
                                  `producttax.list`,
                                  { product: entity.products[i].produto, uf: entity.Customer.state },
                                  { headers: { Authorization: `Bearer ${saToken}` } },
                                )
                                .then(({ data }) => {
                                  if (data?.items.length > 0) form.setFieldValue('productstax', data.items)
                                })
                                .catch(err => modal?.alert(err.message))
                                .finally()
                            }
                            form.setValues(prev => ({
                              ...prev,
                              selected: i,
                              modalShow: true,
                            }))
                          }}
                        >
                          <i className="fas fa-pen" aria-hidden="true" />
                        </button>
                      </td>
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
                      <div role="document" className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Dados Fiscais</h5>

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
                            <div className="kt-portlet__body kt-portlet__body--fit kt-align-center">
                              <ProductsTaxForm form={form} entity={entity} />
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
        )}
      />
    </>
  )
}
