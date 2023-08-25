import React, { useEffect } from 'react'

import { FieldArray } from 'formik'

import DecimalInput from '../../../components/form/decimal-input'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { classNames } from '../../../helpers/misc'

export const ProductsForm = ({ form, entity, products }) => {
  function handleAddProduct(ev) {
    ev.preventDefault()
    form.setFieldValue('products', [...entity.products, { cfop: '5102', quantidade: 0, unitario: 0 }])
  }
  useEffect(() => {
    if (entity.products?.length > 0) {
      entity.products.forEach(prods => {
        const total = prods.quantidade * parseFloat(prods.unitario)
        if (total - prods.descontoProd >= 0) {
          prods.total = total - prods.descontoProd
        } else {
          prods.descontoProd = 0
          prods.total = total
        }
        if (prods.amount > 0) {
          prods.peso = prods.quantidade * prods.weight
        }
      })
    }
  }, [entity.products])

  return (
    <>
      <FieldArray
        name="products"
        render={() => (
          <>
            <div
              className={classNames('kt-datatable kt-datatable--default kt-datatable--brand', {
                'kt-datatable--loaded': entity.products?.length > 0,
                'table-loading': true,
              })}
            >
              <table className="kt-datatable__table" style={{ borderCollapse: 'separate' }}>
                <thead className="datatable-head">
                  <tr className="kt-datatable__row">
                    <th className="kt-datatable__cell">
                      <span>Produto</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 5px white' }}>
                      <span>CFOP</span>
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
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 5px white' }}>
                      <span>Total</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="datatable-body">
                  {entity.products.map((p, i) => (
                    <tr key={i} className="datatable-row">
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white' }}>
                        <Select
                          getId={({ id }) => id}
                          getDisplay={({ description }) => description}
                          selected={entity.products[i].produto}
                          items={products}
                          onChange={prod => {
                            form.setFieldValue(`products.${i}.descricao`, prod.description)
                            form.setFieldValue(`products.${i}.unidade`, prod.und)
                            form.setFieldValue(`products.${i}.produto`, prod.id)
                            form.setFieldValue(`products.${i}.unitario`, prod.value)
                            form.setFieldValue(`products.${i}.quantidade`, 1.0)
                            form.setFieldValue(`products.${i}.weight`, prod.weight)
                          }}
                          disabled={false}
                          isMulti={undefined}
                          isLoading={false || undefined}
                          isClearable={true}
                          styles={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '70px' }}>
                        <TextInput
                          name={`products.${i}.cfop`}
                          disabled={false}
                          value={`products.${i}.cfop`}
                          mask="9.999"
                        />
                      </td>
                      <td className="kt-datatable__cell " style={{ border: 'solid 5px white', width: '90px' }}>
                        <DecimalInput
                          id={`products.${i}.quantidade`}
                          name={`products.${i}.quantidade`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '60px' }}>
                        <TextInput
                          placeholder=""
                          name={`products.${i}.unidade`}
                          disabled
                          value={`products.${i}.unidade`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '120px' }}>
                        <DecimalInput
                          id={`products.${i}.unitario`}
                          name={`products.${i}.unitario`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '90px' }}>
                        <DecimalInput
                          name={`products.${i}.descontoProd`}
                          id={'products.[i].descontoProd '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '120px' }}>
                        <DecimalInput
                          name={`products.${i}.total`}
                          id={'products.[i].total '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white' }}>
                        <button
                          type="button"
                          className="btn btn-icon btn-danger"
                          onClick={() =>
                            form.setFieldValue(
                              'products',
                              entity.products.filter((_, n) => n !== i),
                            )
                          }
                        >
                          <i className="fas fa-trash" aria-hidden="true" />
                        </button>
                      </td>
                      {i === entity.products?.length - 1 && (
                        <td className="kt-datatable__cell">
                          <button type="button" className="btn btn-success" onClick={ev => handleAddProduct(ev)}>
                            <i className="fas fa-plus" aria-hidden="true" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {entity.products?.length === 0 && (
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
