import React, { useEffect } from 'react'

import { FieldArray } from 'formik'

import DecimalInput from '../../../components/form/decimal-input'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { classNames } from '../../../helpers/misc'

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
        prods.unidade = prods.Product ? prods.Product?.und : prods.unidade
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

                    <th className="kt-datatable__cell kt-align-center" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Qtde</span>
                    </th>
                    <th className="kt-datatable__cell kt-align-center" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Unidade</span>
                    </th>
                    <th className="kt-datatable__cell kt-align-center" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Unitário</span>
                    </th>
                    <th className="kt-datatable__cell kt-align-center" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Desconto</span>
                    </th>
                    <th className="kt-datatable__cell kt-align-center" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Total</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="datatable-body">
                  {entity.BudgetProducts.map((p, i) => (
                    <tr key={i} className="datatable-row">
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white' }}>
                        <Select
                          getId={({ id }) => id}
                          getDisplay={({ description }) => description}
                          selected={p.produto ? p.produto : p.productId}
                          items={products}
                          onChange={prod => {
                            form.setFieldValue(`BudgetProducts.${i}.descricao`, prod.description)
                            form.setFieldValue(`BudgetProducts.${i}.unidade`, prod.und)
                            form.setFieldValue(`BudgetProducts.${i}.productId`, prod.id)
                            form.setFieldValue(`BudgetProducts.${i}.unitary`, prod.value)
                            form.setFieldValue(`BudgetProducts.${i}.amount`, 1.0)
                          }}
                          disabled={false}
                          isMulti={undefined}
                          isLoading={false || undefined}
                          isClearable={true}
                          styles={undefined}
                        />
                      </td>

                      <td className="kt-datatable__cell " style={{ border: 'solid 5px white', width: '70px' }}>
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
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '70px' }}>
                        <TextInput
                          placeholder=""
                          name={`BudgetProducts.${i}.unidade`}
                          disabled
                          value={`BudgetProducts.${i}.unidade`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          id={`BudgetProducts.${i}.unitary`}
                          name={`BudgetProducts.${i}.unitary`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                          precision={2}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          name={`BudgetProducts.${i}.descontoProd`}
                          id={'BudgetProducts.[i].descontoProd '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          name={`BudgetProducts.${i}.total`}
                          id={'BudgetProducts.[i].total '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                      {i < entity.BudgetProducts.length - 1 && (
                        <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '20px' }}>
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
                      )}
                      {i === entity.BudgetProducts.length - 1 && (
                        <td className="kt-datatable__cell" style={{ width: '20px' }}>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={ev => {
                              if (entity.BudgetProducts[i].amount > 0) handleAddProduct(ev)
                            }}
                          >
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
