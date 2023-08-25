import React, { useEffect } from 'react'

import { FieldArray } from 'formik'

import DecimalInput from '../../../components/form/decimal-input'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { CFOPs } from '../../../helpers/constants'
import { classNames } from '../../../helpers/misc'

export const ProductsTaxForm = ({ form, entity }) => {
  function handleAddProduct(ev) {
    ev.preventDefault()
    form.setFieldValue('productstax', [...entity.productstax, { cfop: '5102' }])
  }
  useEffect(() => {
    if (entity.view === 'Fiscal' && entity.productstax.length === 0) {
      form.setFieldValue('productstax', [...entity.productstax, { cfop: '5102' }])
    }
  }, [entity.view])
  return (
    <>
      <FieldArray
        name="productstax"
        render={() => (
          <>
            <div
              className={classNames('kt-datatable kt-datatable--default kt-datatable--brand', {
                'kt-datatable--loaded': entity.productstax.length > 0,
                'table-loading': true,
              })}
            >
              <table className="kt-datatable__table" style={{ borderCollapse: 'separate' }}>
                <thead className="datatable-head">
                  <tr className="kt-datatable__row">
                    <th className="kt-datatable__cell">
                      <span>UF</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>CFOP</span>
                    </th>
                    <th className="kt-datatable__cell " style={{ borderLeft: 'solid 3px white' }}>
                      <span>CST</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>% ICMS</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>Base ICMS</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>% ICMS ST</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>Base ICMS ST</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>MVA</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>% IPI</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>CST Pis</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>Alíq Pis</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>CST Cofins</span>
                    </th>
                    <th className="kt-datatable__cell" style={{ borderLeft: 'solid 3px white' }}>
                      <span>Alíq Cofins</span>
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="datatable-body">
                  {entity.productstax.map((p, i) => (
                    <tr key={i} className="datatable-row">
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '60px' }}>
                        <TextInput
                          placeholder=""
                          name={`productstax.${i}.uf`}
                          disabled={false}
                          value={`productstax.${i}.uf`}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white' }}>
                        <Select
                          getId={({ id }) => id}
                          getDisplay={({ id }) => id}
                          items={CFOPs}
                          selected={p?.cfop?.replace('.', '')}
                          onChange={cfop =>
                            form.setFieldValue(
                              `productstax.${i}.cfop`,
                              cfop.id ? `${cfop.id.substr(0, 1)}.${cfop.id.substr(1)}` : null,
                            )
                          }
                          disabled={false}
                          isMulti={undefined}
                          isLoading={false || undefined}
                          styles={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell " style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          name={`productstax.${i}.cst`}
                          id={'productstax.[i].cst'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                          precision={0}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          id={`productstax.${i}.aliquotaIcms`}
                          name={`productstax.${i}.aliquotaIcms`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '80px' }}>
                        <DecimalInput
                          name={`productstax.${i}.baseIcms`}
                          id={'productstax.[i].baseIcms'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '90px' }}>
                        <DecimalInput
                          id={`productstax.${i}.aliquotaIcmsSt`}
                          name={`productstax.${i}.aliquotaIcmsSt`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '80px' }}>
                        <DecimalInput
                          name={`productstax.${i}.baseIcmsSt`}
                          id={'productstax.[i].baseIcmsSt'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell " style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          name={`productstax.${i}.mva`}
                          id={'productstax.[i].mva'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          name={`productstax.${i}.ipi`}
                          id={'productstax.[i].ipi'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                        />
                      </td>
                      <td className="kt-datatable__cell " style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          name={`productstax.${i}.cstPis`}
                          id={'productstax.[i].cstPis'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                          precision={0}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          id={`productstax.${i}.alqPis`}
                          name={`productstax.${i}.alqPis`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell " style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          name={`productstax.${i}.cstCofins`}
                          id={'productstax.[i].cstCofins'}
                          icon={undefined}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          disabled={false}
                          precision={0}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '70px' }}>
                        <DecimalInput
                          id={`productstax.${i}.alqCofins`}
                          name={`productstax.${i}.alqCofins`}
                          acceptEnter={undefined}
                          noSelect={undefined}
                          icon={undefined}
                          disabled={undefined}
                        />
                      </td>
                      <td className="kt-datatable__cell" style={{ border: 'solid 5px white', width: '20px' }}>
                        <button
                          type="button"
                          className="btn btn-icon btn-danger"
                          onClick={() =>
                            form.setFieldValue(
                              'productstax',
                              entity.productstax.filter((_, n) => n !== i),
                            )
                          }
                        >
                          <i className="fas fa-trash" aria-hidden="true" />
                        </button>
                      </td>
                      {i === entity.productstax.length - 1 && (
                        <td className="kt-datatable__cell">
                          <button type="button" className="btn btn-success" onClick={ev => handleAddProduct(ev)}>
                            <i className="fas fa-plus" aria-hidden="true" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}

                  {entity.productstax.length === 0 && (
                    <tr>
                      <td className="datatable-error">Nenhum item cadastrado.</td>
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
