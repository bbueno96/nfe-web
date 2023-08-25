import React, { CSSProperties, useCallback } from 'react'

import classNames from 'classnames'

import { ActionListItem, ActionsList } from './ActionList'
import { ColumnHeader } from './ColumnHeader'
import { Pagination } from './Pagination'

export interface ListColumn<T> {
  path: keyof T
  title: string
  sortable?: boolean
  hideWhen?: boolean
  fixedWidth?: boolean
  style?: CSSProperties
  format?: (value: unknown) => string | JSX.Element
}

export interface ListPager {
  page: number
  pages: number
  perPage: number
  records: number
  usePager: boolean
}

interface ListProps<T> {
  columns: ListColumn<T>[]
  primaryKey: keyof T
  fetching: boolean
  actions?: ActionListItem<T>[]
  emptyMessage?: string
  sortItems?: SortingItem[]
  pager: ListPager
  changePage: (page: number) => void
  changePerPage: (perPage: number) => void
  changeSort: (path: string, remove: boolean) => void
  items: T[]
}

export function List<T>({
  columns,
  primaryKey: pk,
  pager,
  sortItems = [],
  changePage,
  changePerPage,
  changeSort,
  actions = [],
  emptyMessage,
  fetching,
  items,
}: ListProps<T>) {
  const cols = columns.filter(c => !c.hideWhen)
  const handlePerPageSelect = useCallback(({ target }) => changePerPage(Number(target.value)), [changePerPage])

  return (
    <>
      <div
        className={classNames('kt-datatable kt-datatable--default kt-datatable--brand', {
          'kt-datatable--loaded': !fetching || items.length > 0,
          'table-loading': fetching,
        })}
      >
        <table className="kt-datatable__table">
          <thead className="kt-datatable__head">
            <tr className="kt-datatable__row">
              {cols.map(col => (
                <ColumnHeader
                  key={col.title}
                  title={col.title}
                  path={String(col.path)}
                  canSort={col.sortable ?? true}
                  sortItems={sortItems}
                  changeSort={changeSort}
                />
              ))}

              {actions.length > 0 && <th aria-label="Ações" />}
            </tr>
          </thead>
          <tbody className="kt-datatable__body">
            {items.map(entity => (
              <tr key={`${entity[pk]}`} className="kt-datatable__row">
                {cols.map(col => {
                  const className = classNames('kt-datatable__cell', {
                    'no-wrap no-width': col.fixedWidth,
                  })

                  return (
                    <td key={`${col.title}-${String(col.path)}`} style={col.style} className={className}>
                      <div>{col.format ? col.format(entity[col.path]) : entity[col.path]}</div>
                    </td>
                  )
                })}

                {actions.length > 0 && (
                  <td className="kt-datatable__cell no-wrap no-width">
                    <ActionsList actions={actions} entity={entity} primaryKey={pk} />
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="kt-datatable--error">{emptyMessage || 'Nenhum item foi encontrado.'}</div>
        )}

        <div className="kt-datatable__pager kt-datatable--paging-loaded">
          {fetching && (
            <div className="blockui-overlay">
              <div className="blockui">
                <span>Carregando...</span>
                <span>
                  <div className="kt-spinner kt-spinner--loader kt-spinner--brand" />
                </span>
              </div>
            </div>
          )}
          <Pagination current={pager.page} total={pager.pages} changePage={changePage} />

          <div className="kt-datatable__pager-info">
            <div className="dropdown bootstrap-select kt-datatable__pager-size">
              <select value={pager.perPage} className="custom-select form-control" onChange={handlePerPageSelect}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="kt-datatable__pager-detail">{itemCountMessage(pager)}</span>
          </div>
        </div>
      </div>
    </>
  )
}

const itemCountMessage = ({ pages, page, perPage, records }: ListPager) =>
  pages > 1
    ? `Exibindo ${1 + (page - 1) * perPage} - ${Math.min(page * perPage, records)} de ${records} registros.`
    : `Exibindo ${records} registro${records > 1 ? 's' : ''}.`
