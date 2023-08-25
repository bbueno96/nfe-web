import React, { useEffect } from 'react'

import { FieldArray } from 'formik'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import DecimalInput from '../../../components/form/decimal-input'
import { Select } from '../../../components/form/select'
import { TextInput } from '../../../components/form/text-input'
import { CFOPs } from '../../../helpers/constants'
import { classNames } from '../../../helpers/misc'

export const ProductsTaxForm = ({ form, entity }) => {
  const { modal, saToken } = useApp()
  useEffect(() => {
    if (entity.products.length > 0 && entity.selected >= 0) {
      form.setFieldValue('productstax', [
        {
          cfop: entity.products[entity.selected].cfop,
          uf: entity.products[entity.selected].uf || '',
          cst: entity.products[entity.selected].st,
          aliquotaIcms: entity.products[entity.selected].aliquotaICMS || 0.0,
          baseIcms: entity.products[entity.selected].baseICMS || 0.0,
          aliquotaIcmsSt: entity.products[entity.selected].aliquotaIcmsSt || 0.0,
          baseIcmsSt: entity.products[entity.selected].baseIcmsSt || 0.0,
          ipi: entity.products[entity.selected].ipi || 0.0,
          mva: entity.products[entity.selected].mva || 0.0,
          alqPis: entity.products[entity.selected].alqPis || 0.0,
          alqCofins: entity.products[entity.selected].alqCofins || 0.0,
          cstPis: entity.products[entity.selected].cstPis || '',
          cstCofins: entity.products[entity.selected].cstCofins || '',
          product: entity.products[entity.selected].produto,
          id: '',
        },
      ])
    }
  }, [entity.selected])
  function addProductTax(i: number) {
    modal?.confirm(
      'Deseja salvar os dados fiscais do Produto?',
      confirmed =>
        confirmed &&
        axios
          .post(
            `producttax.add`,
            {
              id: entity.productstax[i].id,
              product: entity.productstax[i].product,
              uf: entity.productstax[i].uf,
              aliquotaIcms: entity.productstax[i].aliquotaIcms,
              cst: entity.productstax[i].cst,
              baseIcms: entity.productstax[i].baseIcms,
              aliquotaIcmsSt: entity.productstax[i].aliquotaIcmsSt,
              baseIcmsSt: entity.productstax[i].baseIcmsSt,
              mva: entity.productstax[i].mva,
              cfop: entity.productstax[i].cfop,
              cstPis: entity.productstax[i].cstPis,
              alqPis: entity.productstax[i].alqPis,
              cstCofins: entity.productstax[i].cstCofins,
              alqCofins: entity.productstax[i].alqCofins,
              ipi: entity.productstax[i].ipi,
            },
            { headers: { Authorization: `Bearer ${saToken}` } },
          )
          .catch(err => modal?.alert(err.message))
          .finally(),
    )
  }
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
              <table className="kt-datatable__table kt-align-right" style={{ borderCollapse: 'separate' }}>
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
                  {entity.productstax
                    .filter(prod => prod.product === entity.products[entity.selected].produto)
                    .map((p, i) => (
                      <tr key={i} className="datatable-row">
                        <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '60px' }}>
                          <TextInput
                            placeholder=""
                            name={`productstax.${i}.uf`}
                            disabled={false}
                            value={`productstax.${i}.uf`}
                          />
                        </td>
                        <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '40px' }}>
                          <Select
                            getId={({ id }) => id}
                            getDisplay={({ id }) => id}
                            items={
                              entity.tipo === 'SAIDA'
                                ? entity.Customer.state === entity.emitState
                                  ? CFOPs.filter(c => c.id[0] === '5')
                                  : CFOPs.filter(c => c.id[0] === '6' || c.id[0] === '7')
                                : entity.Customer.state === entity.emitState
                                ? CFOPs.filter(c => c.id[0] === '1')
                                : CFOPs.filter(c => c.id[0] === '2')
                            }
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
                            id={`productstax.${i}.cst`}
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
                            disabled={false}
                          />
                        </td>
                        <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '80px' }}>
                          <DecimalInput
                            name={`productstax.${i}.baseIcms`}
                            id={`productstax.${i}.baseIcms`}
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
                            disabled={false}
                          />
                        </td>
                        <td className="kt-datatable__cell" style={{ border: 'solid 3px white', width: '100px' }}>
                          <DecimalInput
                            name={`productstax.${i}.baseIcmsSt`}
                            id={`productstax.${i}.baseIcmsSt`}
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
                            id={`productstax.${i}.ipi`}
                            icon={undefined}
                            acceptEnter={undefined}
                            noSelect={undefined}
                            disabled={false}
                          />
                        </td>
                        <td className="kt-datatable__cell " style={{ border: 'solid 3px white', width: '70px' }}>
                          <DecimalInput
                            name={`productstax.${i}.cstPis`}
                            id={`productstax.${i}.cstPis`}
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
                            disabled={false}
                          />
                        </td>
                        <td className="kt-datatable__cell " style={{ border: 'solid 3px white', width: '90px' }}>
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
                            disabled={false}
                          />
                        </td>
                        {entity.productstax[i].uf !== undefined && entity.productstax[i].uf !== '' && (
                          <td className="kt-datatable__cell">
                            <button
                              type="button"
                              className="btn btn-icon btn-success"
                              onClick={() => {
                                form.setFieldValue(`products.${entity.selected}.uf`, entity.productstax[i].uf)
                                form.setFieldValue(`products.${entity.selected}.cfop`, entity.productstax[i].cfop)
                                form.setFieldValue(`products.${entity.selected}.st`, entity.productstax[i].cst)
                                form.setFieldValue(
                                  `products.${entity.selected}.aliquotaICMS`,
                                  entity.productstax[i].aliquotaIcms || 0.0,
                                )
                                form.setFieldValue(
                                  `products.${entity.selected}.baseICMS`,
                                  entity.productstax[i].baseIcms || 0.0,
                                )
                                form.setFieldValue(
                                  `products.${entity.selected}.aliquotaIcmsSt`,
                                  entity.productstax[i].aliquotaIcmsSt || 0.0,
                                )
                                form.setFieldValue(
                                  `products.${entity.selected}.baseIcmsSt`,
                                  entity.productstax[i].baseIcmsSt || 0.0,
                                )
                                form.setFieldValue(`products.${entity.selected}.mva`, entity.productstax[i].mva || 0.0)
                                form.setFieldValue(`products.${entity.selected}.ipi`, entity.productstax[i].ipi || 0.0)
                                form.setFieldValue(`products.${entity.selected}.cstPis`, entity.productstax[i].cstPis)
                                form.setFieldValue(
                                  `products.${entity.selected}.alqPis`,
                                  entity.productstax[i].alqPis || 0.0,
                                )
                                form.setFieldValue(
                                  `products.${entity.selected}.cstCofins`,
                                  entity.productstax[i].cstCofins,
                                )
                                form.setFieldValue(
                                  `products.${entity.selected}.alqCofins`,
                                  entity.productstax[i].alqCofins || 0.0,
                                )
                                form.setFieldValue(`products.${entity.selected}.ipi`, entity.productstax[i].ipi || 0.0)
                                addProductTax(i)
                                form.setFieldValue('modalShow', false)
                              }}
                            >
                              <i className="fas fa-check" aria-hidden="true" />
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
