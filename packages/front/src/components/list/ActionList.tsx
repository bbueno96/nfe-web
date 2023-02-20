import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { useOnClickOutside } from '../../hooks/click-outside'

export interface ActionListItem<T> {
  title: string
  icon: string
  action: string | ((entity: T) => void)
  loading?: boolean
  hideWhen?: (entity: T) => boolean
}

interface ActionListProps<T> {
  entity: T
  primaryKey: keyof T
  actions: ActionListItem<T>[]
}

interface ActionListButton<T> {
  id: string
  entity: T
  title: string
  icon: string
  action: string | ((entity: T) => void)
  toggleMenu: VoidFunction
  loading?: boolean
}

export function ActionsList<T>({ actions, entity, primaryKey }: ActionListProps<T>) {
  const ref = useRef(null)
  const [opened, setOpened] = useState(false)

  useOnClickOutside(ref, () => setOpened(false))

  function toggleMenu() {
    setOpened(prev => !prev)
  }

  return (
    <div ref={ref} className={classNames('dropdown table-drop', { show: opened })}>
      <button
        type="button"
        data-toggle="dropdown"
        className="btn btn-sm btn-clean btn-icon btn-icon-sm"
        title="Ações"
        onClick={toggleMenu}
      >
        <i className="fas fa-cog" />
      </button>
      <div className={classNames('dropdown-menu dropdown-menu-right', { show: opened })}>
        {actions
          .filter(({ hideWhen }) => !hideWhen || (hideWhen && !hideWhen(entity)))
          .map(({ action, loading, icon, title }) => (
            <ActionButton
              key={`${icon}-${title}`}
              icon={icon}
              title={title}
              loading={loading}
              action={action}
              entity={entity}
              id={`${entity[primaryKey]}`}
              toggleMenu={toggleMenu}
            />
          ))}
      </div>
    </div>
  )
}

function ActionButton<T>({ id, action, icon, title, loading, entity, toggleMenu }: ActionListButton<T>) {
  const navigate = useNavigate()

  function handleClick() {
    toggleMenu()

    if (typeof action === 'string') {
      navigate(action.replace(':id', id))
      return
    }

    action(entity)
  }

  return (
    <button type="button" className="dropdown-item" onClick={handleClick}>
      {loading && (
        <>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          <span className="sr-only">Carregando...</span>
        </>
      )}
      {icon && <i className={icon} aria-hidden="true" />}
      {title && <span>{title}</span>}
    </button>
  )
}
