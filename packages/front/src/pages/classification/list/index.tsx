import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useLocation } from 'react-router-dom'

import axios from '@nfe-web/axios-config'

import { useApp } from '../../../App'
import { ErrorMessage } from '../../../components/form/error-message'
import { Field } from '../../../components/form/field'
import Tree from '../../../components/tree'
import { groupBy } from '../../../helpers/format'
import { useRefresh } from '../../../hooks/refresh'
import { ClassificationForm } from '../form'

type LocationState = { parent: { id: string; code: string } }

function getClassificationed(items, groups) {
  if (!items) return items
  return items.map(p => ({
    ...p,
    children: getClassificationed(groups.get(p.id), groups),
  }))
}

export const ClassificationList = () => {
  const [classifications, setClassifications] = useState([])
  const [globalError, setGlobalError] = useState<string | null>(null)
  const { modal, saToken } = useApp()
  const refresh = useRefresh()
  const pushTo = useNavigate()
  const location = useLocation()
  const { parent } = (location.state as LocationState) || ({ id: null, code: '' } as unknown as LocationState)

  useEffect(() => {
    axios
      .post('classification.list', {}, { headers: { Authorization: `Bearer ${saToken}` } })
      .then(({ data }) => {
        const groups = groupBy(data.items, 'parentId')
        const rootItems = groups.get(null)
        const grouped = getClassificationed(rootItems, groups)
        setClassifications(grouped)
      })
      .catch(err => setGlobalError(err))
      .finally()
  }, [])

  return (
    <>
      <div className="kt-portlet kt-portlet--mobile">
        <div className="kt-portlet__head kt-portlet__head--lg">
          <div className="kt-portlet__head-label">
            <span className="kt-portlet__head-icon">
              <i className="kt-font-brand fas fa-dollar-sign" />
            </span>
            <h3 className="kt-portlet__head-title">Classificações</h3>
          </div>
        </div>
        <div className="kt-portlet__body kt-portlet__body--fit">
          <div className="card-body">
            <div className="row">
              <div className="col-lg">
                <Field label="">
                  <Tree
                    nodes={classifications}
                    onAdd={item => {
                      pushTo('/classificacoes/cadastro', { state: { parent: item } })
                    }}
                    onEdit={itemId => pushTo(`/classificacoes/${itemId}`)}
                    onDisable={item => {
                      modal?.confirm(
                        `Deseja ${!item.disabledAt ? 'desativar' : 'ativar'} ${item.description}?`,
                        confirmed =>
                          confirmed &&
                          axios
                            .delete(`classification.delete/${item.id}`, {
                              headers: { Authorization: `Bearer ${saToken}` },
                            })
                            .then(refresh.force)
                            .catch(err => setGlobalError(err.message)),
                      )
                    }}
                    disabled={undefined}
                  />
                </Field>
              </div>
            </div>
          </div>

          <ErrorMessage error={globalError} />
        </div>
      </div>

      <ClassificationForm
        parent={parent}
        refresh={async () => {
          await global.refresh(true)
          refresh.force()
        }}
      />
    </>
  )
}
