import React, { useCallback } from 'react'

import classNames from 'classnames'

interface ColumnHeaderProps {
  title: string
  path: string
  sortItems: SortingItem[]
  canSort?: boolean
  changeSort: (path: string, remove: boolean) => void
}

export function ColumnHeader({ title, path, sortItems, canSort, changeSort }: ColumnHeaderProps) {
  const sortItem = sortItems.find(({ name }) => name === path)

  const handleClick = useCallback(() => changeSort(path, false), [changeSort])
  const handleRemoveSort = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      ev.stopPropagation()
      changeSort(path, true)
    },
    [changeSort],
  )

  return (
    <th
      onClick={handleClick}
      className={classNames('kt-datatable__cell', {
        'kt-datatable__cell--sort': canSort,
        'kt-datatable__cell--sorted': sortItem,
      })}
    >
      <span>
        {title}
        {sortItem && <i className={sortItem.order === 'DESC' ? 'fas fa-arrow-down' : 'fas fa-arrow-up'} />}
        {sortItem && <button aria-label="Remover ordenação" type="button" onClick={handleRemoveSort} />}
      </span>
    </th>
  )
}
