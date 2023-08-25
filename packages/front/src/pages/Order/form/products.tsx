import React, { useEffect } from 'react'

import { FieldArray } from 'formik'

import DecimalInput from '../../../components/form/decimal-input'
import { TextInput } from '../../../components/form/text-input'
import { classNames } from '../../../helpers/misc'

export const ProductsForm = ({ entity }) => {
  useEffect(() => {
    if (entity.OrderProducts.length > 0) {
      entity.OrderProducts.forEach(prods => {
        const total = prods.amount * parseFloat(prods.unitary)
        if (total - prods.descontoProd >= 0) {
          prods.total = total - prods.descontoProd
        } else {
          prods.descontoProd = 0
          prods.total = total
        }

        if (prods.amount > 0) {
          prods.peso = parseFloat(prods.amount) * parseFloat(prods.weight || 0)
        }
        prods.unidade = prods.Product ? prods.Product?.und : prods.unidade
      })
    }
  }, [entity.OrderProducts])

  return (
    <>
      <FieldArray
        name="OrderProducts"
        render={() => (
          <>
            <div
              className={classNames('kt-datatable kt-datatable--default kt-datatable--brand', {
                'kt-datatable--loaded': entity.OrderProducts.length > 0,
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
                      <span>Unitario</span>
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
                  {entity.OrderProducts.map((p, i) => (
                    <tr key={i} className="datatable-row">
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white' }}>
                        <TextInput
                          placeholder=""
                          name={`OrderProducts.${i}.Product.description`}
                          disabled
                          value={`OrderProducts.${i}.Product.description`}
                        />
                      </td>

                      <td className="kt-datatable__cell " style={{ border: 'solid 5px white', width: '70px' }}>
                        <DecimalInput
                          id={`OrderProducts.${i}.amount`}
                          name={`OrderProducts.${i}.amount`}
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
                          name={`OrderProducts.${i}.unidade`}
                          disabled
                          value={`OrderProducts.${i}.unidade`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          id={`OrderProducts.${i}.unitary`}
                          name={`OrderProducts.${i}.unitary`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          name={`OrderProducts.${i}.descontoProd`}
                          id={'OrderProducts.[i].descontoProd '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '100px' }}>
                        <DecimalInput
                          name={`OrderProducts.${i}.total`}
                          id={'OrderProducts.[i].total '}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled
                        />
                      </td>
                    </tr>
                  ))}

                  {entity.OrderProducts.length === 0 && (
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
